import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Upload, Calendar } from 'lucide-react';

interface TimetableSlot {
  id: string;
  year: number;
  semester: number;
  department: string;
  day_of_week: number;
  slot_number: number;
  subject_code: string;
  subject_name: string;
  faculty_name?: string;
  faculty_id?: string;
  room?: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOTS = ['9:00-10:00', '10:00-11:00', '11:15-12:15', '12:15-1:15', '2:00-3:00', '3:00-4:00', '4:00-5:00'];

const Timetable: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [timetableData, setTimetableData] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{ day: number; slot: number } | null>(null);
  
  const [formData, setFormData] = useState({
    subject_code: '',
    subject_name: '',
    faculty_name: '',
    faculty_id: '',
    room: '',
  });

  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';
  const isStudent = user?.role === 'student';

  useEffect(() => {
    fetchTimetable();
  }, [selectedYear, selectedSemester, user?.id]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('timetables')
        .select('*')
        .order('day_of_week')
        .order('slot_number');

      // Admin sees all timetables for selected year/semester
      if (isAdmin) {
        query = query
          .eq('year', parseInt(selectedYear))
          .eq('semester', parseInt(selectedSemester));
      } 
      // Faculty sees only their assigned classes
      else if (isFaculty && user?.id) {
        query = query.eq('faculty_id', user.id);
      }
      // Students see timetable for their year
      else if (isStudent) {
        query = query
          .eq('year', parseInt(selectedYear))
          .eq('semester', parseInt(selectedSemester));
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setTimetableData(data || []);
    } catch (error: any) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSlotData = (day: number, slot: number) => {
    return timetableData.find(t => t.day_of_week === day && t.slot_number === slot);
  };

  const handleSlotClick = (day: number, slot: number) => {
    if (!isAdmin) return;
    const existing = getSlotData(day, slot);
    if (existing) {
      setFormData({
        subject_code: existing.subject_code,
        subject_name: existing.subject_name,
        faculty_name: existing.faculty_name || '',
        faculty_id: existing.faculty_id || '',
        room: existing.room || '',
      });
    } else {
      setFormData({ subject_code: '', subject_name: '', faculty_name: '', faculty_id: '', room: '' });
    }
    setEditingSlot({ day, slot });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingSlot) return;
    try {
      const existing = getSlotData(editingSlot.day, editingSlot.slot);
      const payload = {
        year: parseInt(selectedYear),
        semester: parseInt(selectedSemester),
        department: 'CSE',
        day_of_week: editingSlot.day,
        slot_number: editingSlot.slot,
        subject_code: formData.subject_code,
        subject_name: formData.subject_name,
        faculty_name: formData.faculty_name || null,
        faculty_id: formData.faculty_id || null,
        room: formData.room || null,
      };

      if (existing) {
        const { error } = await supabase.from('timetables').update(payload).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('timetables').insert(payload);
        if (error) throw error;
      }

      toast({ title: 'Success', description: 'Timetable updated' });
      setIsDialogOpen(false);
      setEditingSlot(null);
      fetchTimetable();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!editingSlot) return;
    const existing = getSlotData(editingSlot.day, editingSlot.slot);
    if (!existing) return;
    
    try {
      const { error } = await supabase.from('timetables').delete().eq('id', existing.id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Slot cleared' });
      setIsDialogOpen(false);
      setEditingSlot(null);
      fetchTimetable();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').slice(1);
      const entries: any[] = [];

      for (const line of lines) {
        const [day, slot, subject_code, subject_name, faculty_name, faculty_id, room] = line.split(',').map(s => s.trim());
        if (day && slot && subject_code && subject_name) {
          entries.push({
            year: parseInt(selectedYear),
            semester: parseInt(selectedSemester),
            department: 'CSE',
            day_of_week: parseInt(day),
            slot_number: parseInt(slot),
            subject_code,
            subject_name,
            faculty_name: faculty_name || null,
            faculty_id: faculty_id || null,
            room: room || null,
          });
        }
      }

      if (entries.length > 0) {
        const { error } = await supabase.from('timetables').insert(entries);
        if (error) throw error;
        toast({ title: 'Success', description: `${entries.length} slots uploaded` });
        fetchTimetable();
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // Faculty view - show as a list of their classes
  if (isFaculty) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Timetable</h2>
          <p className="text-muted-foreground">Your assigned classes and timings</p>
        </div>

        <Card>
          <CardContent className="p-4">
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : timetableData.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No classes assigned to you yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {DAYS.map((day, dayIdx) => {
                  const daySlots = timetableData.filter(t => t.day_of_week === dayIdx + 1);
                  if (daySlots.length === 0) return null;
                  return (
                    <div key={day} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">{day}</h3>
                      <div className="grid gap-2">
                        {daySlots.sort((a, b) => a.slot_number - b.slot_number).map(slot => (
                          <div key={slot.id} className="flex items-center justify-between p-3 bg-primary/5 rounded-md">
                            <div>
                              <p className="font-medium">{slot.subject_code} - {slot.subject_name}</p>
                              <p className="text-sm text-muted-foreground">Year {slot.year}, Sem {slot.semester}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{SLOTS[slot.slot_number - 1]}</p>
                              <p className="text-sm text-muted-foreground">{slot.room || 'No room'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin and Student view - grid timetable
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Timetable</h2>
          <p className="text-muted-foreground">
            {isAdmin ? 'Manage class schedules' : 'View class schedule'}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map(y => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
            </SelectContent>
          </Select>
          {isAdmin && (
            <div className="relative">
              <Input type="file" accept=".csv" onChange={handleBulkUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Upload CSV</Button>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-4 overflow-x-auto">
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : (
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted/50 text-left w-24">Day / Slot</th>
                  {SLOTS.map((slot, idx) => (
                    <th key={idx} className="border p-2 bg-muted/50 text-center text-sm">{slot}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day, dayIdx) => (
                  <tr key={dayIdx}>
                    <td className="border p-2 font-medium bg-muted/30">{day}</td>
                    {SLOTS.map((_, slotIdx) => {
                      const slotData = getSlotData(dayIdx + 1, slotIdx + 1);
                      return (
                        <td
                          key={slotIdx}
                          className={`border p-2 text-center text-sm transition-colors ${
                            isAdmin ? 'cursor-pointer' : ''
                          } ${slotData ? 'bg-primary/10 hover:bg-primary/20' : 'hover:bg-muted/50'}`}
                          onClick={() => handleSlotClick(dayIdx + 1, slotIdx + 1)}
                        >
                          {slotData ? (
                            <div>
                              <p className="font-medium text-primary">{slotData.subject_code}</p>
                              <p className="text-xs text-muted-foreground">{slotData.faculty_name}</p>
                              <p className="text-xs text-muted-foreground">{slotData.room}</p>
                            </div>
                          ) : isAdmin ? (
                            <Plus className="h-4 w-4 mx-auto text-muted-foreground" />
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSlot ? `${DAYS[editingSlot.day - 1]} - ${SLOTS[editingSlot.slot - 1]}` : 'Edit Slot'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject Code</Label>
              <Input value={formData.subject_code} onChange={(e) => setFormData(p => ({ ...p, subject_code: e.target.value }))} />
            </div>
            <div>
              <Label>Subject Name</Label>
              <Input value={formData.subject_name} onChange={(e) => setFormData(p => ({ ...p, subject_name: e.target.value }))} />
            </div>
            <div>
              <Label>Faculty Name</Label>
              <Input value={formData.faculty_name} onChange={(e) => setFormData(p => ({ ...p, faculty_name: e.target.value }))} />
            </div>
            <div>
              <Label>Faculty ID (User UUID)</Label>
              <Input 
                value={formData.faculty_id} 
                onChange={(e) => setFormData(p => ({ ...p, faculty_id: e.target.value }))} 
                placeholder="Enter faculty user ID for assignment"
              />
            </div>
            <div>
              <Label>Room</Label>
              <Input value={formData.room} onChange={(e) => setFormData(p => ({ ...p, room: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">Save</Button>
              {getSlotData(editingSlot?.day || 0, editingSlot?.slot || 0) && (
                <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4" /></Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Timetable;