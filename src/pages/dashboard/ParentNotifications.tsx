import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, Search, CheckCircle, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Student {
  id: string;
  name: string;
  roll_no: string;
  email: string;
  parent_email?: string;
}

interface ParentNotification {
  id: string;
  student_id: string;
  student_name: string;
  student_roll_no: string;
  parent_email: string;
  notification_type: string;
  content: any;
  status: string;
  sent_at?: string;
  created_at: string;
}

const ParentNotifications: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<ParentNotification[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [notificationForm, setNotificationForm] = useState({
    type: 'result',
    subject: '',
    message: '',
    include_marks: true,
    include_attendance: false,
    include_schedule: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch students (profiles)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('name');
      
      setStudents((profilesData || []).map(p => ({
        id: p.id,
        name: p.name,
        roll_no: p.roll_no || '',
        email: p.email,
        parent_email: `parent.${p.email}`, // Simulated parent email
      })));

      // Fetch sent notifications
      const { data: notifData } = await supabase
        .from('parent_notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      setNotifications(notifData || []);
    } catch (error: any) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSendNotifications = async () => {
    if (selectedStudents.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one student', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      const notificationsToSend = selectedStudents.map(studentId => {
        const student = students.find(s => s.id === studentId);
        if (!student) return null;

        return {
          student_id: studentId,
          student_name: student.name,
          student_roll_no: student.roll_no,
          parent_email: student.parent_email || `parent.${student.email}`,
          notification_type: notificationForm.type,
          content: {
            subject: notificationForm.subject,
            message: notificationForm.message,
            include_marks: notificationForm.include_marks,
            include_attendance: notificationForm.include_attendance,
            include_schedule: notificationForm.include_schedule,
          },
          status: 'sent',
          sent_at: new Date().toISOString(),
          created_by: user?.id!,
        };
      }).filter(Boolean);

      const { error } = await supabase.from('parent_notifications').insert(notificationsToSend);
      if (error) throw error;

      // Optionally send emails via edge function
      for (const notif of notificationsToSend) {
        if (!notif) continue;
        try {
          await supabase.functions.invoke('send-notification-email', {
            body: {
              to: notif.parent_email,
              subject: `Student Update: ${notif.student_name}`,
              message: (notif.content as any).message,
            },
          });
        } catch (emailError) {
          console.error('Email send error:', emailError);
        }
      }

      toast({ title: 'Success', description: `Sent ${notificationsToSend.length} notifications` });
      setIsDialogOpen(false);
      setSelectedStudents([]);
      setNotificationForm({
        type: 'result',
        subject: '',
        message: '',
        include_marks: true,
        include_attendance: false,
        include_schedule: false,
      });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.roll_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sentCount = notifications.filter(n => n.status === 'sent').length;
  const pendingCount = notifications.filter(n => n.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Parent Notifications</h2>
          <p className="text-muted-foreground">Send student updates to parents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={selectedStudents.length === 0}>
              <Send className="h-4 w-4 mr-2" />
              Send to {selectedStudents.length} Parent(s)
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Send Parent Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Notification Type</Label>
                <Select value={notificationForm.type} onValueChange={(v) => setNotificationForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="result">Result Update</SelectItem>
                    <SelectItem value="attendance">Attendance Report</SelectItem>
                    <SelectItem value="schedule">Exam Schedule</SelectItem>
                    <SelectItem value="general">General Notice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject</Label>
                <Input 
                  value={notificationForm.subject} 
                  onChange={(e) => setNotificationForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="Email subject line"
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea 
                  value={notificationForm.message} 
                  onChange={(e) => setNotificationForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Message to parents..."
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Include in Email</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={notificationForm.include_marks}
                      onCheckedChange={(c) => setNotificationForm(p => ({ ...p, include_marks: !!c }))}
                    />
                    <span className="text-sm">Marks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={notificationForm.include_attendance}
                      onCheckedChange={(c) => setNotificationForm(p => ({ ...p, include_attendance: !!c }))}
                    />
                    <span className="text-sm">Attendance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={notificationForm.include_schedule}
                      onCheckedChange={(c) => setNotificationForm(p => ({ ...p, include_schedule: !!c }))}
                    />
                    <span className="text-sm">Exam Schedule</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleSendNotifications} className="w-full" disabled={sending}>
                {sending ? 'Sending...' : `Send to ${selectedStudents.length} Parent(s)`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Selected Students</p>
            <p className="text-2xl font-bold text-primary">{selectedStudents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-muted-foreground">Sent</p>
            <p className="text-2xl font-bold text-green-600">{sentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Students</CardTitle>
          <CardDescription>Choose students to notify their parents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm">Select All</span>
              </div>
            </div>

            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 w-10"></th>
                      <th className="text-left py-3 px-4 font-medium">Roll No</th>
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Parent Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <Checkbox 
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={(c) => handleSelectStudent(student.id, !!c)}
                          />
                        </td>
                        <td className="py-3 px-4 font-medium">{student.roll_no}</td>
                        <td className="py-3 px-4">{student.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{student.email}</td>
                        <td className="py-3 px-4 text-muted-foreground">{student.parent_email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>History of sent parent notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No notifications sent yet</p>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 10).map((notif) => (
                <div key={notif.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{notif.student_name}</p>
                      <p className="text-sm text-muted-foreground">{notif.parent_email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={notif.status === 'sent' ? 'default' : 'secondary'}>
                      {notif.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(notif.created_at), 'PPp')}
                    </p>
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

export default ParentNotifications;