import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, BookOpen, Plus, Edit, Trash2, Upload } from 'lucide-react';

interface SyllabusUnit {
  title: string;
  topics: string[];
}

interface SyllabusItem {
  id: string;
  year: number;
  semester: number;
  subject_code: string;
  subject_name: string;
  credits: number;
  department: string;
  units: SyllabusUnit[];
  pdf_url?: string;
  is_published: boolean;
}

const Syllabus: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [syllabusData, setSyllabusData] = useState<SyllabusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SyllabusItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    year: 1,
    semester: 1,
    subject_code: '',
    subject_name: '',
    credits: 3,
    department: 'CSBS',
    units: [{ title: 'Unit 1', topics: [''] }] as SyllabusUnit[],
    is_published: false,
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchSyllabus();
  }, [selectedYear]);

  const fetchSyllabus = async () => {
    setLoading(true);
    try {
      let query = supabase.from('syllabus').select('*');
      if (selectedYear !== 'all') {
        query = query.eq('year', parseInt(selectedYear));
      }
      const { data, error } = await query.order('year').order('semester');
      if (error) throw error;
      setSyllabusData((data || []).map(item => ({
        ...item,
        units: Array.isArray(item.units) ? (item.units as unknown as SyllabusUnit[]) : []
      })));
    } catch (error: any) {
      console.error('Error fetching syllabus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        year: formData.year,
        semester: formData.semester,
        subject_code: formData.subject_code,
        subject_name: formData.subject_name,
        credits: formData.credits,
        department: formData.department,
        units: formData.units as unknown as any,
        is_published: formData.is_published,
        created_by: user?.id,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('syllabus')
          .update(payload)
          .eq('id', editingItem.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Syllabus updated successfully' });
      } else {
        const { error } = await supabase.from('syllabus').insert([payload]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Syllabus added successfully' });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchSyllabus();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this syllabus?')) return;
    try {
      const { error } = await supabase.from('syllabus').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Syllabus deleted successfully' });
      fetchSyllabus();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (item: SyllabusItem) => {
    setEditingItem(item);
    setFormData({
      year: item.year,
      semester: item.semester,
      subject_code: item.subject_code,
      subject_name: item.subject_name,
      credits: item.credits,
      department: item.department,
      units: item.units,
      is_published: item.is_published,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      year: 1,
      semester: 1,
      subject_code: '',
      subject_name: '',
      credits: 3,
      department: 'CSBS',
      units: [{ title: 'Unit 1', topics: [''] }],
      is_published: false,
    });
  };

  const addUnit = () => {
    setFormData(prev => ({
      ...prev,
      units: [...prev.units, { title: `Unit ${prev.units.length + 1}`, topics: [''] }],
    }));
  };

  const updateUnit = (idx: number, field: 'title' | 'topics', value: string | string[]) => {
    const newUnits = [...formData.units];
    if (field === 'topics' && typeof value === 'string') {
      newUnits[idx].topics = value.split('\n').filter(t => t.trim());
    } else if (field === 'title' && typeof value === 'string') {
      newUnits[idx].title = value;
    }
    setFormData(prev => ({ ...prev, units: newUnits }));
  };

  const filteredSubjects = syllabusData.filter(
    (subject) =>
      subject.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.subject_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSubject = selectedSubject
    ? syllabusData.find((s) => s.id === selectedSubject)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Syllabus</h2>
          <p className="text-muted-foreground">Course syllabus and topics</p>
        </div>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingItem(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Syllabus</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Syllabus' : 'Add New Syllabus'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Year</Label>
                    <Select value={String(formData.year)} onValueChange={(v) => setFormData(p => ({ ...p, year: parseInt(v) }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map(y => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Semester</Label>
                    <Select value={String(formData.semester)} onValueChange={(v) => setFormData(p => ({ ...p, semester: parseInt(v) }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Subject Code</Label>
                    <Input value={formData.subject_code} onChange={(e) => setFormData(p => ({ ...p, subject_code: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Subject Name</Label>
                    <Input value={formData.subject_name} onChange={(e) => setFormData(p => ({ ...p, subject_name: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Credits</Label>
                    <Input type="number" value={formData.credits} onChange={(e) => setFormData(p => ({ ...p, credits: parseInt(e.target.value) || 3 }))} />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input value={formData.department} onChange={(e) => setFormData(p => ({ ...p, department: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Units & Topics</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addUnit}><Plus className="h-3 w-3 mr-1" />Add Unit</Button>
                  </div>
                  {formData.units.map((unit, idx) => (
                    <div key={idx} className="border rounded-lg p-3 space-y-2">
                      <Input value={unit.title} onChange={(e) => updateUnit(idx, 'title', e.target.value)} placeholder="Unit title" />
                      <Textarea 
                        value={unit.topics.join('\n')} 
                        onChange={(e) => updateUnit(idx, 'topics', e.target.value)}
                        placeholder="Enter topics (one per line)"
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={formData.is_published} 
                    onCheckedChange={(checked) => setFormData(p => ({ ...p, is_published: checked }))} 
                  />
                  <Label>Publish to Students</Label>
                </div>
                <Button onClick={handleSave} className="w-full">{editingItem ? 'Update' : 'Add'} Syllabus</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter by Year" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {[1, 2, 3, 4].map(y => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : filteredSubjects.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No syllabus found</p>
          ) : (
            filteredSubjects.map((subject) => (
              <Card
                key={subject.id}
                className={`cursor-pointer transition-colors ${selectedSubject === subject.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                onClick={() => setSelectedSubject(subject.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{subject.subject_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {subject.subject_code} • Year {subject.year} • Sem {subject.semester}
                        </p>
                      </div>
                    </div>
                    {!subject.is_published && <Badge variant="secondary">Draft</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="md:col-span-2">
          {currentSubject ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{currentSubject.subject_name}</CardTitle>
                    <CardDescription>
                      {currentSubject.subject_code} • {currentSubject.credits} Credits • Year {currentSubject.year}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {currentSubject.pdf_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={currentSubject.pdf_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />Download
                        </a>
                      </Button>
                    )}
                    {isAdmin && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(currentSubject)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(currentSubject.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {currentSubject.units.map((unit, idx) => (
                    <AccordionItem key={idx} value={`unit-${idx}`}>
                      <AccordionTrigger>{unit.title}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pl-4">
                          {unit.topics.map((topic, tidx) => (
                            <li key={tidx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a subject to view syllabus</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Syllabus;