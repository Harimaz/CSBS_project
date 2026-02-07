import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, Download, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataImporter from '@/components/DataImporter';

const ManageExams: React.FC = () => {
  const { exams, addExam, updateExam, deleteExam } = useData();
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<{ id: string; subject: string } | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    subject: string;
    code: string;
    date: string;
    startTime: string;
    endTime: string;
    hall: string;
    type: 'CAT-1' | 'CAT-2' | 'Semester' | 'Lab';
    department: string;
    semester: string;
  }>({
    subject: '',
    code: '',
    date: '',
    startTime: '',
    endTime: '',
    hall: '',
    type: 'CAT-1',
    department: 'CSBS',
    semester: '1'
  });

  const resetForm = () => {
    setFormData({
      subject: '',
      code: '',
      date: '',
      startTime: '',
      endTime: '',
      hall: '',
      type: 'CAT-1',
      department: 'CSBS',
      semester: '1'
    });
  };

  const handleAddExam = async () => {
    if (!formData.subject || !formData.code || !formData.date || !formData.startTime || !formData.endTime) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const payload = {
      subject: formData.subject,
      code: formData.code,
      date: formData.date,
      time: `${formData.startTime} - ${formData.endTime}`,
      venue: formData.hall || 'Exam Hall',
      type: formData.type,
      status: 'Scheduled' as const,
      department: formData.department
    };

    if (editingExam) {
      updateExam(editingExam.id, payload);
      toast({ title: 'Success', description: 'Exam updated locally' });
    } else {
      addExam(payload);
      toast({ title: 'Success', description: 'Exam scheduled locally' });
    }

    setIsAddDialogOpen(false);
    resetForm();
    setEditingExam(null);
  };

  const openEditDialog = (exam: any) => {
    setEditingExam(exam);
    const times = exam.time.split(' - ');
    setFormData({
      subject: exam.subject,
      code: exam.code,
      date: exam.date,
      startTime: times[0] || '',
      endTime: times[1] || '',
      hall: exam.venue || '',
      type: exam.type,
      department: exam.department || 'CSBS',
      semester: '1'
    });
    setIsAddDialogOpen(true);
  };

  const confirmDelete = (id: string, subject: string) => {
    setExamToDelete({ id, subject });
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (!examToDelete) return;
    deleteExam(examToDelete.id);
    toast({ title: 'Success', description: 'Exam removed' });
    setDeleteConfirmOpen(false);
    setExamToDelete(null);
  };

  const handleBulkImport = async (data: any[]) => {
    // Basic mapping
    const formattedData = data.map(item => ({
      subject: item['Subject'] || item['subject'] || 'Exam',
      code: item['Code'] || item['code'] || 'CS000',
      date: item['Date'] || item['date'] || '2024-12-25',
      time: item['Time'] || '10:00 - 13:00',
      venue: item['Venue'] || 'Main Hall',
      type: (item['Type'] || 'CAT-1') as any,
      status: 'Scheduled' as const,
      department: item['Department'] || 'CSBS'
    }));

    formattedData.forEach(addExam);
    toast({ title: 'Success', description: `${data.length} exams imported` });
    setIsImportOpen(false);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    const columns = [
      { header: 'Subject', key: 'subject' },
      { header: 'Code', key: 'code' },
      { header: 'Date', key: 'date' },
      { header: 'Time', key: 'time' },
      { header: 'Venue', key: 'venue' },
    ];

    if (format === 'pdf') {
      exportToPDF(exams, columns, 'Examination Schedule', 'exam-schedule');
    } else {
      exportToExcel(exams, columns, 'exam-schedule');
    }
    toast({ title: 'Export Complete', description: `${format.toUpperCase()} file downloaded.` });
  };

  const upcomingExams = exams.filter(e => e.status !== 'Completed');
  const completedExams = exams.filter(e => e.status === 'Completed');

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const ExamCard = ({ exam }: { exam: any }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold">{exam.subject}</h3>
            <p className="text-sm text-muted-foreground">{exam.code}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(exam.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{exam.startTime} - {exam.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{exam.hall}</span>
            </div>
            <Badge variant="outline">{exam.type}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => openEditDialog(exam)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => confirmDelete(exam.id, exam.subject)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manage Exams</h2>
          <p className="text-muted-foreground">Schedule and manage examinations</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Import Exams</DialogTitle>
                <DialogDescription>
                  CSV Columns: Subject, Code, Date (YYYY-MM-DD), Start Time, End Time, Venue
                </DialogDescription>
              </DialogHeader>
              <DataImporter
                onImport={handleBulkImport}
                requiredColumns={['Subject', 'Code', 'Date']}
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Exam
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Exams</p>
            <p className="text-3xl font-bold">{exams.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Upcoming</p>
            <p className="text-3xl font-bold text-primary">{upcomingExams.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold text-accent">{completedExams.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Exams List */}
      <Card>
        <CardHeader>
          <CardTitle>Examinations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading exams...</p>
          ) : (
            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming ({upcomingExams.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedExams.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="mt-4 space-y-4">
                {upcomingExams.length > 0 ? (
                  upcomingExams.map(exam => <ExamCard key={exam.id} exam={exam} />)
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No upcoming exams</p>
                )}
              </TabsContent>
              <TabsContent value="completed" className="mt-4 space-y-4">
                {completedExams.length > 0 ? (
                  completedExams.map(exam => <ExamCard key={exam.id} exam={exam} />)
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No completed exams</p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExam ? 'Edit Exam' : 'Schedule New Exam'}</DialogTitle>
            <DialogDescription>{editingExam ? 'Update examination details' : 'Add a new examination to the schedule'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject *</Label>
              <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="e.g., Data Structures" />
            </div>
            <div>
              <Label>Subject Code *</Label>
              <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g., CS301" />
            </div>
            <div>
              <Label>Exam Type</Label>
              <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal (CAT)</SelectItem>
                  <SelectItem value="external">External (Semester)</SelectItem>
                  <SelectItem value="practical">Practical</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date *</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Start *</Label>
                  <Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
                </div>
                <div className="flex-1">
                  <Label>End *</Label>
                  <Input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
                </div>
              </div>
            </div>
            <div>
              <Label>Venue (Hall)</Label>
              <Input value={formData.hall} onChange={(e) => setFormData({ ...formData, hall: e.target.value })} placeholder="e.g., Exam Hall 1" />
            </div>
            <div>
              <Label>Department</Label>
              <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSBS">CSBS</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="MECH">MECH</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddExam}>
              {editingExam ? 'Save Changes' : 'Schedule Exam'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {examToDelete?.subject}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageExams;
