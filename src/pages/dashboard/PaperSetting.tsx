import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Upload, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';

interface PaperSetting {
  id: string;
  exam_id: string;
  faculty_id: string;
  deadline: string;
  status: 'pending' | 'uploaded' | 'under_scrutiny' | 'approved' | 'needs_correction';
  file_url: string | null;
  uploaded_at: string | null;
  remarks: string | null;
  exams?: { subject: string; code: string; type: string };
  profiles?: { name: string; email: string };
}

interface Exam {
  id: string;
  subject: string;
  code: string;
  type: string;
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

const PaperSetting: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [paperSettings, setPaperSettings] = useState<PaperSetting[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    exam_id: '',
    faculty_id: '',
    deadline: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch paper settings with relations
    const { data: settings } = await supabase
      .from('paper_settings')
      .select(`
        *,
        exams(subject, code, type),
        profiles:faculty_id(name, email)
      `)
      .order('deadline', { ascending: true });

    if (settings) {
      setPaperSettings(settings as unknown as PaperSetting[]);
    }

    // Fetch exams
    const { data: examData } = await supabase.from('exams').select('id, subject, code, type');
    if (examData) setExams(examData);

    // Fetch faculty
    const { data: facultyData } = await supabase
      .from('profiles')
      .select('id, name, email')
      .in('id', (await supabase.from('user_roles').select('user_id').eq('role', 'faculty')).data?.map(r => r.user_id) || []);
    
    if (facultyData) setFaculty(facultyData);
  };

  const handleAssign = async () => {
    if (!formData.exam_id || !formData.faculty_id || !formData.deadline) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('paper_settings').insert({
      exam_id: formData.exam_id,
      faculty_id: formData.faculty_id,
      deadline: formData.deadline,
      status: 'pending',
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Paper setting assigned' });
      setIsDialogOpen(false);
      setFormData({ exam_id: '', faculty_id: '', deadline: '' });
      fetchData();
    }
  };

  const handleFileUpload = async (settingId: string, file: File) => {
    setUploadingId(settingId);

    try {
      const fileName = `${settingId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('question-papers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('question-papers')
        .getPublicUrl(fileName);

      await supabase
        .from('paper_settings')
        .update({
          file_url: urlData.publicUrl,
          uploaded_at: new Date().toISOString(),
          status: 'uploaded',
        })
        .eq('id', settingId);

      toast({ title: 'Success', description: 'Paper uploaded successfully' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploadingId(null);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';

  // Filter for faculty to only see their assignments
  const displaySettings = isFaculty 
    ? paperSettings.filter(s => s.faculty_id === user?.id)
    : paperSettings;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Paper Setting</h1>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Assign Paper</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Paper Setting</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Exam</Label>
                  <Select value={formData.exam_id} onValueChange={(v) => setFormData({ ...formData, exam_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
                    <SelectContent>
                      {exams.map(exam => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.code} - {exam.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Faculty</Label>
                  <Select value={formData.faculty_id} onValueChange={(v) => setFormData({ ...formData, faculty_id: v })}>
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
          <CardTitle>Paper Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                {isAdmin && <TableHead>Faculty</TableHead>}
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displaySettings.map(setting => (
                <TableRow key={setting.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{setting.exams?.subject}</p>
                      <p className="text-sm text-muted-foreground">{setting.exams?.code}</p>
                    </div>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>{setting.profiles?.name}</TableCell>
                  )}
                  <TableCell>{format(new Date(setting.deadline), 'PP')}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[setting.status]} text-white`}>
                      {setting.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {(isFaculty && setting.status === 'pending') && (
                        <>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(setting.id, file);
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingId === setting.id}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            {uploadingId === setting.id ? 'Uploading...' : 'Upload'}
                          </Button>
                        </>
                      )}
                      {setting.file_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={setting.file_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-1" /> View
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {displaySettings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} className="text-center text-muted-foreground">
                    No paper assignments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaperSetting;
