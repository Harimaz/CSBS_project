import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, CheckCircle, AlertTriangle, Info, Trash2, Plus, Mail, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  email_sent: boolean;
  created_at: string;
  user_id: string;
  profiles?: { name: string; email: string };
}

interface User {
  id: string;
  name: string;
  email: string;
}

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    user_id: 'all',
    send_email: false,
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchNotifications();
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchNotifications = async () => {
    let query = supabase
      .from('notifications')
      .select('*, profiles:user_id(name, email)')
      .order('created_at', { ascending: false });

    // Non-admins only see their own notifications
    if (!isAdmin && user?.id) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;
    if (!error && data) {
      setNotifications(data as unknown as Notification[]);
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('id, name, email');
    if (data) setUsers(data);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, is_read: true } : n
    ));
  };

  const markAllAsRead = async () => {
    const ids = notifications.filter(n => !n.is_read).map(n => n.id);
    await supabase.from('notifications').update({ is_read: true }).in('id', ids);
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    toast({ title: 'All notifications marked as read' });
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(notifications.filter(n => n.id !== id));
    toast({ title: 'Notification deleted' });
  };

  const sendNotification = async () => {
    if (!formData.title || !formData.message) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    setIsSending(true);

    try {
      const targetUsers = formData.user_id === 'all' 
        ? users 
        : users.filter(u => u.id === formData.user_id);

      for (const targetUser of targetUsers) {
        // Create notification in database
        const { data: notification, error } = await supabase
          .from('notifications')
          .insert({
            user_id: targetUser.id,
            title: formData.title,
            message: formData.message,
            type: formData.type,
          })
          .select()
          .single();

        if (error) throw error;

        // Send email if requested
        if (formData.send_email && targetUser.email) {
          try {
            await supabase.functions.invoke('send-notification-email', {
              body: {
                to: targetUser.email,
                subject: formData.title,
                message: formData.message,
                notificationId: notification.id,
              },
            });
          } catch (emailError) {
            console.error('Email error:', emailError);
          }
        }
      }

      toast({ 
        title: 'Success', 
        description: `Notification sent to ${targetUsers.length} user(s)${formData.send_email ? ' with email' : ''}` 
      });
      
      setIsDialogOpen(false);
      setFormData({ title: '', message: '', type: 'info', user_id: 'all', send_email: false });
      fetchNotifications();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
          <p className="text-muted-foreground">Stay updated with important announcements</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" /> Send Notification</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Notification</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Notification title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Notification message"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Recipient</Label>
                    <Select value={formData.user_id} onValueChange={(v) => setFormData({ ...formData, user_id: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        {users.map(u => (
                          <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="send-email"
                      checked={formData.send_email}
                      onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="send-email" className="flex items-center gap-2 cursor-pointer">
                      <Mail className="h-4 w-4" /> Also send email notification
                    </Label>
                  </div>
                  <Button onClick={sendNotification} className="w-full" disabled={isSending}>
                    <Send className="h-4 w-4 mr-2" />
                    {isSending ? 'Sending...' : 'Send Notification'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-bold">{notifications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Unread</p>
            <p className="text-3xl font-bold text-blue-600">{unreadCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Read</p>
            <p className="text-3xl font-bold text-green-600">{notifications.length - unreadCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    notification.is_read ? 'bg-background' : 'bg-primary/5 border-primary/20'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          {!notification.is_read && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                          {notification.email_sent && (
                            <Badge variant="outline" className="text-xs"><Mail className="h-3 w-3 mr-1" />Emailed</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(notification.created_at), 'PPp')}
                        {isAdmin && notification.profiles && (
                          <span className="ml-2">• To: {notification.profiles.name}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
