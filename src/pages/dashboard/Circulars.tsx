import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, FileText, Download, Edit, Trash2, Check, X, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Circular {
  id: string;
  title: string;
  body: string;
  pdf_url?: string;
  created_by: string;
  creator_role: string;
  is_approved: boolean;
  show_to_students: boolean;
  created_at: string;
}

const Circulars: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { circulars, addCircular, updateCircular, deleteCircular } = useData();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    show_to_students: false,
  });

  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';
  const canCreate = isAdmin || isFaculty;

  const handleSave = async () => {
    const payload = {
      title: formData.title,
      body: formData.body,
      showToStudents: formData.show_to_students,
      createdBy: user?.name || 'Unknown',
      isApproved: isAdmin,
      date: new Date().toISOString().split('T')[0],
    };

    if (editingItem) {
      updateCircular(editingItem.id, payload);
      toast({ title: 'Success', description: 'Circular updated locally' });
    } else {
      addCircular(payload);
      toast({ title: 'Success', description: isAdmin ? 'Circular published' : 'Circular submitted for approval' });
    }

    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({ title: '', body: '', show_to_students: false });
  };

  const handleApprove = (id: string, approve: boolean) => {
    updateCircular(id, { isApproved: approve });
    toast({ title: 'Success', description: approve ? 'Circular approved' : 'Circular rejected' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this circular?')) return;
    deleteCircular(id);
    toast({ title: 'Deleted', description: 'Circular removed' });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      body: item.body,
      show_to_students: item.showToStudents,
    });
    setIsDialogOpen(true);
  };

  const filteredCirculars = circulars.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleCirculars = filteredCirculars.filter(c => {
    if (isAdmin) return true;
    if (isFaculty) return c.isApproved || c.createdBy === user?.name;
    return c.isApproved && c.showToStudents;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Circulars</h2>
          <p className="text-muted-foreground">COE notices and announcements</p>
        </div>
        {canCreate && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingItem(null);
              setFormData({ title: '', body: '', show_to_students: false });
            }
          }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Create Circular</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Circular' : 'Create New Circular'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <Label>Body</Label>
                  <Textarea
                    value={formData.body}
                    onChange={(e) => setFormData(p => ({ ...p, body: e.target.value }))}
                    rows={6}
                  />
                </div>
                {isAdmin && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.show_to_students}
                      onCheckedChange={(checked) => setFormData(p => ({ ...p, show_to_students: checked }))}
                    />
                    <Label>Show to Students</Label>
                  </div>
                )}
                <Button onClick={handleSave} className="w-full">
                  {editingItem ? 'Update' : isAdmin ? 'Publish' : 'Submit for Approval'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search circulars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <p className="text-center py-8 text-muted-foreground">Loading...</p>
      ) : visibleCirculars.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No circulars available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visibleCirculars.map((circular) => (
            <Card key={circular.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {circular.title}
                      {!circular.isApproved && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">Pending Approval</Badge>
                      )}
                      {circular.showToStudents && <Badge variant="secondary">Public</Badge>}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(circular.date), 'PPP')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {isAdmin && !circular.isApproved && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleApprove(circular.id, true)}>
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleApprove(circular.id, false)}>
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
                    {(isAdmin || circular.createdBy === user?.name) && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(circular)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(circular.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{circular.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Circulars;