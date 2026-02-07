import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';
import { MapPin, Users, Download, RefreshCw, Edit, Eye, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const HallAllocation: React.FC = () => {
  const { toast } = useToast();
  const { halls, exams, faculty, updateHall, autoAllocateHalls } = useData();
  const [loading, setLoading] = useState(false);

  // UI States
  const [selectedExam, setSelectedExam] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Form States
  const [editingHall, setEditingHall] = useState<any | null>(null);
  const [viewingHall, setViewingHall] = useState<any | null>(null);
  const [newHall, setNewHall] = useState({ name: '', capacity: 60 });

  const handleCreateHall = () => {
    toast({ title: 'Feature Restricted', description: 'Adding halls is restricted in this demo.' });
  };

  const handleDeleteHall = (id: string) => {
    toast({ title: 'Feature Restricted', description: 'Deleting halls is restricted.' });
  };

  const handleAutoAllocate = () => {
    if (!selectedExam) {
      toast({ title: 'Error', description: 'Please select an exam first', variant: 'destructive' });
      return;
    }
    autoAllocateHalls(selectedExam);
    toast({ title: 'Allocation Complete', description: 'Students allocated to halls locally.' });
  };

  const handleManualUpdate = () => {
    if (!editingHall) return;
    updateHall(editingHall.id, {
      invigilators: editingHall.invigilators,
      allocated: parseInt(editingHall.allocated)
    });
    toast({ title: 'Success', description: 'Hall updated locally' });
    setIsEditDialogOpen(false);
    setEditingHall(null);
  };

  // Filter exams that are scheduled
  const scheduledExams = exams.filter(e => e.status === 'Scheduled');

  // Filter halls based on selected exam (optional view filter)
  const filteredHalls = selectedExam ? halls : halls;

  const totalCapacity = halls.reduce((sum, h) => sum + (h.capacity || 0), 0);
  const totalAllocated = halls.reduce((sum, h) => sum + (h.allocated || 0), 0);

  const handleDownloadExcel = () => {
    const data = halls.map(h => ({
      name: h.name,
      capacity: h.capacity,
      allocated: h.allocated,
      exam: h.exam || 'Not Allocated',
      invigilators: h.invigilators?.join(', ') || 'None',
      students: h.students?.length || 0,
    }));
    exportToExcel(data, [
      { header: 'Hall', key: 'name' },
      { header: 'Capacity', key: 'capacity' },
      { header: 'Allocated', key: 'allocated' },
      { header: 'Exam', key: 'exam' },
      { header: 'Invigilators', key: 'invigilators' }
    ], 'hall-allocation');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Hall Allocation</h2>
          <p className="text-muted-foreground">Manage examination hall seating arrangements</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Hall
          </Button>
          <Button variant="outline" onClick={handleDownloadExcel}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button onClick={handleAutoAllocate} disabled={!selectedExam}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Auto Allocate
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Halls</p>
            <p className="text-3xl font-bold">{halls.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Capacity</p>
            <p className="text-3xl font-bold">{totalCapacity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Allocated Seats</p>
            <p className="text-3xl font-bold text-primary">{totalAllocated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Available Seats</p>
            <p className="text-3xl font-bold text-accent">{totalCapacity - totalAllocated}</p>
          </CardContent>
        </Card>
      </div>

      {/* Selection & Filtering */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <Label className="text-sm mb-2 block">Select Exam to Allocate</Label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {scheduledExams.length === 0 ? (
                    <SelectItem value="none" disabled>No scheduled exams</SelectItem>
                  ) : (
                    scheduledExams.map(exam => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.code} - {exam.subject}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Halls Grid */}
      {loading ? (
        <p className="text-center py-8">Loading halls...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHalls.map((hall) => (
            <Card key={hall.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {hall.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={hall.allocated > 0 ? 'default' : 'secondary'}>
                      {hall.allocated > 0 ? 'Allocated' : 'Available'}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteHall(hall.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{hall.exam || 'Not Allocated'}</p>

                {hall.invigilators && hall.invigilators.length > 0 && (
                  <p className="text-xs text-muted-foreground mb-4">
                    Invigilator: {hall.invigilators.join(', ')}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Seats
                    </span>
                    <span>{hall.allocated}/{hall.capacity}</span>
                  </div>
                  <Progress value={(hall.allocated / hall.capacity) * 100} className="h-2" />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setViewingHall(hall); setIsViewDialogOpen(true); }}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingHall(hall); setIsEditDialogOpen(true); }}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE HALL DIALOG */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Hall</DialogTitle>
            <DialogDescription>Add a new examination hall to the system.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Hall Name</Label>
              <Input
                value={newHall.name}
                onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
                placeholder="e.g. Hall A, LH-101"
              />
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input
                type="number"
                value={newHall.capacity}
                onChange={(e) => setNewHall({ ...newHall, capacity: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateHall}>Create Hall</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT HALL DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Hall Allocation</DialogTitle>
            <DialogDescription>Manually assign invigilators and students</DialogDescription>
          </DialogHeader>
          {editingHall && (
            <div className="space-y-4">
              <div>
                <Label>Hall: {editingHall.name}</Label>
                <p className="text-sm text-muted-foreground">Capacity: {editingHall.capacity}</p>
              </div>
              <div>
                <Label>Invigilator</Label>
                <Select
                  value={editingHall.invigilators?.[0] || ''}
                  onValueChange={(v) => setEditingHall({ ...editingHall, invigilators: [v] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select invigilator" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculty.map((f: any) => (
                      <SelectItem key={f._id || f.id} value={f.name}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Allocated Count (Manual Override)</Label>
                <Input
                  type="number"
                  value={editingHall.allocated}
                  onChange={(e) => setEditingHall({ ...editingHall, allocated: Math.min(parseInt(e.target.value) || 0, editingHall.capacity) })}
                  max={editingHall.capacity}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleManualUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW DIALOG */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingHall?.name} Details</DialogTitle>
          </DialogHeader>
          {viewingHall && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Exam</Label>
                  <p className="text-sm">{viewingHall.exam || 'Not Allocated'}</p>
                </div>
                <div>
                  <Label>Allocation</Label>
                  <p className="text-sm">{viewingHall.allocated} / {viewingHall.capacity}</p>
                </div>
              </div>
              <div>
                <Label>Invigilators</Label>
                <p className="text-sm">{viewingHall.invigilators?.join(', ') || 'None assigned'}</p>
              </div>
              <div>
                <Label>Allocated Students</Label>
                <div className="max-h-40 overflow-y-auto border rounded p-2 mt-1">
                  {viewingHall.students && viewingHall.students.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {viewingHall.students.map((rollNo: string, idx: number) => (
                        <span key={idx} className="bg-muted px-2 py-1 rounded">{rollNo}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No students allocated</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HallAllocation;
