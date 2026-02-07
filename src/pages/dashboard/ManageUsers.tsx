import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData, Student, Faculty } from '@/contexts/DataContext';
import { exportToPDF, exportToExcel, importFromExcel } from '@/lib/exportUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

const ManageUsers: React.FC = () => {
  const { students, faculty, addStudent, updateStudent, deleteStudent, addFaculty, updateFaculty, deleteFaculty, importStudents, importFaculty } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string; type: 'student' | 'faculty' } | null>(null);
  const [editingUser, setEditingUser] = useState<(Student | Faculty) & { type: 'student' | 'faculty' } | null>(null);
  const [activeTab, setActiveTab] = useState('students');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    type: 'student',
    name: '',
    email: '',
    rollNo: '',
    empId: '',
    department: 'CSE',
    year: '3',
    subjects: '',
  });

  const resetForm = () => {
    setFormData({
      type: 'student',
      name: '',
      email: '',
      rollNo: '',
      empId: '',
      department: 'CSE',
      year: '3',
      subjects: '',
    });
  };

  const handleAddUser = () => {
    if (!formData.name || !formData.email) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    if (formData.type === 'student') {
      addStudent({
        name: formData.name,
        email: formData.email,
        rollNo: formData.rollNo,
        department: formData.department,
        year: parseInt(formData.year),
        status: 'Active',
      });
    } else {
      addFaculty({
        name: formData.name,
        email: formData.email,
        empId: formData.empId,
        department: formData.department,
        subjects: formData.subjects.split(',').map(s => s.trim()),
        status: 'Active',
      });
    }

    toast({ title: 'User Added', description: `${formData.name} has been added successfully.` });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditUser = () => {
    if (!editingUser) return;

    if (editingUser.type === 'student') {
      updateStudent(editingUser.id, {
        name: formData.name,
        email: formData.email,
        rollNo: formData.rollNo,
        department: formData.department,
        year: parseInt(formData.year),
      });
    } else {
      updateFaculty(editingUser.id, {
        name: formData.name,
        email: formData.email,
        empId: formData.empId,
        department: formData.department,
        subjects: formData.subjects.split(',').map(s => s.trim()),
      });
    }

    toast({ title: 'User Updated', description: `${formData.name} has been updated successfully.` });
    setIsEditDialogOpen(false);
    setEditingUser(null);
    resetForm();
  };

  const openEditDialog = (user: Student | Faculty, type: 'student' | 'faculty') => {
    setEditingUser({ ...user, type });
    if (type === 'student') {
      const s = user as Student;
      setFormData({
        type: 'student',
        name: s.name,
        email: s.email,
        rollNo: s.rollNo,
        empId: '',
        department: s.department,
        year: s.year.toString(),
        subjects: '',
      });
    } else {
      const f = user as Faculty;
      setFormData({
        type: 'faculty',
        name: f.name,
        email: f.email,
        rollNo: '',
        empId: f.empId,
        department: f.department,
        year: '1',
        subjects: f.subjects.join(', '),
      });
    }
    setIsEditDialogOpen(true);
  };

  const confirmDelete = (id: string, name: string, type: 'student' | 'faculty') => {
    setUserToDelete({ id, name, type });
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (!userToDelete) return;
    
    if (userToDelete.type === 'student') {
      deleteStudent(userToDelete.id);
    } else {
      deleteFaculty(userToDelete.id);
    }
    
    toast({ title: 'User Deleted', description: `${userToDelete.name} has been removed.` });
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    const isStudents = activeTab === 'students';
    const data = isStudents ? students : faculty;
    const columns = isStudents
      ? [
          { header: 'Name', key: 'name' },
          { header: 'Email', key: 'email' },
          { header: 'Roll No', key: 'rollNo' },
          { header: 'Department', key: 'department' },
          { header: 'Year', key: 'year' },
          { header: 'Status', key: 'status' },
        ]
      : [
          { header: 'Name', key: 'name' },
          { header: 'Email', key: 'email' },
          { header: 'Emp ID', key: 'empId' },
          { header: 'Department', key: 'department' },
          { header: 'Status', key: 'status' },
        ];

    if (format === 'pdf') {
      exportToPDF(data, columns, isStudents ? 'Students List' : 'Faculty List', isStudents ? 'students' : 'faculty');
    } else {
      exportToExcel(data, columns, isStudents ? 'students' : 'faculty');
    }
    toast({ title: 'Export Complete', description: `${format.toUpperCase()} file downloaded.` });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromExcel(file);
      if (activeTab === 'students') {
        importStudents(data);
        toast({ title: 'Import Successful', description: `${data.length} students imported.` });
      } else {
        importFaculty(data);
        toast({ title: 'Import Successful', description: `${data.length} faculty imported.` });
      }
    } catch (error) {
      toast({ title: 'Import Failed', description: 'Invalid file format.', variant: 'destructive' });
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.empId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manage Users</h2>
          <p className="text-muted-foreground">Add, edit, or remove users from the system</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
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
            Add User
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
              <TabsTrigger value="faculty">Faculty ({faculty.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="students" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Roll No</th>
                      <th className="text-left py-3 px-4 font-medium">Department</th>
                      <th className="text-center py-3 px-4 font-medium">Year</th>
                      <th className="text-center py-3 px-4 font-medium">Status</th>
                      <th className="text-center py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-muted/30">
                        <td className="py-3 px-4 font-medium">{student.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{student.email}</td>
                        <td className="py-3 px-4">{student.rollNo}</td>
                        <td className="py-3 px-4">{student.department}</td>
                        <td className="py-3 px-4 text-center">{student.year}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                            {student.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(student, 'student')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => confirmDelete(student.id, student.name, 'student')}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredStudents.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">No students found</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="faculty" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Emp ID</th>
                      <th className="text-left py-3 px-4 font-medium">Department</th>
                      <th className="text-center py-3 px-4 font-medium">Subjects</th>
                      <th className="text-center py-3 px-4 font-medium">Status</th>
                      <th className="text-center py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFaculty.map((fac) => (
                      <tr key={fac.id} className="border-b hover:bg-muted/30">
                        <td className="py-3 px-4 font-medium">{fac.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{fac.email}</td>
                        <td className="py-3 px-4">{fac.empId}</td>
                        <td className="py-3 px-4">{fac.department}</td>
                        <td className="py-3 px-4 text-center">{fac.subjects.length}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={fac.status === 'Active' ? 'default' : 'secondary'}>
                            {fac.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(fac, 'faculty')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => confirmDelete(fac.id, fac.name, 'faculty')}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredFaculty.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">No faculty found</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Name *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email" />
            </div>
            {formData.type === 'student' ? (
              <>
                <div>
                  <Label>Roll No</Label>
                  <Input value={formData.rollNo} onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })} placeholder="e.g., CS2021001" />
                </div>
                <div>
                  <Label>Year</Label>
                  <Select value={formData.year} onValueChange={(v) => setFormData({ ...formData, year: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>Employee ID</Label>
                  <Input value={formData.empId} onChange={(e) => setFormData({ ...formData, empId: e.target.value })} placeholder="e.g., FAC001" />
                </div>
                <div>
                  <Label>Subjects (comma separated)</Label>
                  <Input value={formData.subjects} onChange={(e) => setFormData({ ...formData, subjects: e.target.value })} placeholder="e.g., CS301, CS302" />
                </div>
              </>
            )}
            <div>
              <Label>Department</Label>
              <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">Computer Science</SelectItem>
                  <SelectItem value="ECE">Electronics</SelectItem>
                  <SelectItem value="MECH">Mechanical</SelectItem>
                  <SelectItem value="CIVIL">Civil</SelectItem>
                  <SelectItem value="EEE">Electrical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            {editingUser?.type === 'student' ? (
              <>
                <div>
                  <Label>Roll No</Label>
                  <Input value={formData.rollNo} onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })} />
                </div>
                <div>
                  <Label>Year</Label>
                  <Select value={formData.year} onValueChange={(v) => setFormData({ ...formData, year: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>Employee ID</Label>
                  <Input value={formData.empId} onChange={(e) => setFormData({ ...formData, empId: e.target.value })} />
                </div>
                <div>
                  <Label>Subjects</Label>
                  <Input value={formData.subjects} onChange={(e) => setFormData({ ...formData, subjects: e.target.value })} />
                </div>
              </>
            )}
            <div>
              <Label>Department</Label>
              <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">Computer Science</SelectItem>
                  <SelectItem value="ECE">Electronics</SelectItem>
                  <SelectItem value="MECH">Mechanical</SelectItem>
                  <SelectItem value="CIVIL">Civil</SelectItem>
                  <SelectItem value="EEE">Electrical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
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

export default ManageUsers;
