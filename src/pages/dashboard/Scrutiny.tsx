import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, CheckCircle, XCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ScrutinyAssignment {
  id: string;
  paper_setting_id: string;
  scrutinizer_id: string;
  deadline: string;
  status: 'pending' | 'uploaded' | 'under_scrutiny' | 'approved' | 'needs_correction';
  remarks: string | null;
  reviewed_at: string | null;
  paper_settings?: {
    exams?: { subject: string; code: string };
    file_url: string | null;
    profiles?: { name: string };
  };
  profiles?: { name: string; email: string };
}

interface PaperSetting {
  id: string;
  exam_id: string;
  faculty_id: string;
  status: string;
  file_url: string | null;
  exams?: { subject: string; code: string };
  profiles?: { name: string };
}

interface Faculty {
  id: string;
  name: string;
  email: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  uploaded: 'bg-blue-500',
  under_scrutiny: 'bg-purple-500',
  approved: 'bg-green-500',
  needs_correction: 'bg-red-500',
};

const Scrutiny: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [assignments, setAssignments] = useState<ScrutinyAssignment[]>([]);
  const [paperSettings, setPaperSettings] = useState<PaperSetting[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewDialog, setReviewDialog] = useState<{ open: boolean; assignment: ScrutinyAssignment | null }>({ open: false, assignment: null });
  const [remarks, setRemarks] = useState('');
  
  const [formData, setFormData] = useState({
    paper_setting_id: '',
    scrutinizer_id: '',
    deadline: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch scrutiny assignments with relations
    const { data: scrutinyData } = await supabase
      .from('scrutiny_assignments')
      .select(`
        *,
        paper_settings(
          exams(subject, code),
          file_url,
          profiles:faculty_id(name)
        ),
        profiles:scrutinizer_id(name, email)
      `)
      .order('deadline', { ascending: true });

    if (scrutinyData) {
      setAssignments(scrutinyData as unknown as ScrutinyAssignment[]);
    }

    // Fetch uploaded paper settings for assignment
    const { data: papers } = await supabase
      .from('paper_settings')
      .select(`
        id, exam_id, faculty_id, status, file_url,
        exams(subject, code),
        profiles:faculty_id(name)
      `)
      .eq('status', 'uploaded');
    
    if (papers) setPaperSettings(papers as unknown as PaperSetting[]);

    // Fetch faculty
    const { data: facultyData } = await supabase
      .from('profiles')
      .select('id, name, email')
      .in('id', (await supabase.from('user_roles').select('user_id').eq('role', 'faculty')).data?.map(r => r.user_id) || []);
    
    if (facultyData) setFaculty(facultyData);
  };

  const handleAssign = async () => {
    if (!formData.paper_setting_id || !formData.scrutinizer_id || !formData.deadline) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('scrutiny_assignments').insert({
      paper_setting_id: formData.paper_setting_id,
      scrutinizer_id: formData.scrutinizer_id,
      deadline: formData.deadline,
      status: 'pending',
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      // Update paper setting status
      await supabase
        .from('paper_settings')
        .update({ status: 'under_scrutiny' })
        .eq('id', formData.paper_setting_id);

      toast({ title: 'Success', description: 'Scrutiny assigned' });
      setIsDialogOpen(false);
      setFormData({ paper_setting_id: '', scrutinizer_id: '', deadline: '' });
      fetchData();
    }
  };

  const handleReview = async (approved: boolean) => {
    if (!reviewDialog.assignment) return;

    const newStatus = approved ? 'approved' : 'needs_correction';

    await supabase
      .from('scrutiny_assignments')
      .update({
        status: newStatus,
        remarks: remarks,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', reviewDialog.assignment.id);

    // Update paper setting status
    await supabase
      .from('paper_settings')
      .update({ status: newStatus })
      .eq('id', reviewDialog.assignment.paper_setting_id);

    toast({ 
      title: 'Success', 
      description: `Paper ${approved ? 'approved' : 'marked for correction'}` 
    });
    
    setReviewDialog({ open: false, assignment: null });
    setRemarks('');
    fetchData();
  };

  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';

  // Filter for faculty to only see their assignments
  const displayAssignments = isFaculty 
    ? assignments.filter(a => a.scrutinizer_id === user?.id)
    : assignments;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Scrutiny</h1>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Assign Scrutiny</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Scrutiny Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Paper (Uploaded)</Label>
                  <Select value={formData.paper_setting_id} onValueChange={(v) => setFormData({ ...formData, paper_setting_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select paper" /></SelectTrigger>
                    <SelectContent>
                      {paperSettings.map(paper => (
                        <SelectItem key={paper.id} value={paper.id}>
                          {paper.exams?.code} - {paper.exams?.subject} (by {paper.profiles?.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Scrutinizer (Faculty)</Label>
                  <Select value={formData.scrutinizer_id} onValueChange={(v) => setFormData({ ...formData, scrutinizer_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select faculty" /></SelectTrigger>
                    <SelectContent>
                      {faculty.map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
                <Button onClick={handleAssign} className="w-full">Assign</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scrutiny Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paper</TableHead>
                <TableHead>Paper Setter</TableHead>
                {isAdmin && <TableHead>Scrutinizer</TableHead>}
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayAssignments.map(assignment => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{assignment.paper_settings?.exams?.subject}</p>
                      <p className="text-sm text-muted-foreground">{assignment.paper_settings?.exams?.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>{assignment.paper_settings?.profiles?.name}</TableCell>
                  {isAdmin && <TableCell>{assignment.profiles?.name}</TableCell>}
                  <TableCell>{format(new Date(assignment.deadline), 'PP')}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[assignment.status]} text-white`}>
                      {assignment.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {assignment.paper_settings?.file_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={assignment.paper_settings.file_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-1" /> View Paper
                          </a>
                        </Button>
                      )}
                      {(isFaculty && assignment.status === 'pending') && (
                        <Button 
                          size="sm" 
                          onClick={() => setReviewDialog({ open: true, assignment })}
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {displayAssignments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 6 : 5} className="text-center text-muted-foreground">
                    No scrutiny assignments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onOpenChange={(open) => setReviewDialog({ open, assignment: reviewDialog.assignment })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Paper</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{reviewDialog.assignment?.paper_settings?.exams?.subject}</p>
              <p className="text-sm text-muted-foreground">
                {reviewDialog.assignment?.paper_settings?.exams?.code} by {reviewDialog.assignment?.paper_settings?.profiles?.name}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add your remarks..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleReview(true)} className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" /> Approve
              </Button>
              <Button onClick={() => handleReview(false)} variant="destructive" className="flex-1">
                <XCircle className="h-4 w-4 mr-2" /> Needs Correction
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scrutiny;
