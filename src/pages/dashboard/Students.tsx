import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { usersAPI } from '@/api/client';
import { Search, Download, Eye, Users, Plus, Upload, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import DataImporter from '@/components/DataImporter';

interface Student {
  id: string;
  name: string;
  email: string;
  roll_no?: string;
  department?: string;
  year?: number;
  section?: string;
  attendance?: number;
  average?: number;
}

const Students: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNo: '',
    department: 'CSBS',
    semester: '1',
    password: 'password123'
  });

  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';

  useEffect(() => {
    fetchStudents();
  }, [selectedYear, selectedDepartment]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getAll();

      if (response.success && response.data) {
        const studentList: Student[] = response.data
          .filter((u: any) => u.role === 'student' || !u.role)
          .map((u: any, idx: number) => ({
            id: u._id || u.id,
            name: u.name,
            email: u.email,
            roll_no: u.rollNo || u.empId || `STU${String(idx + 1).padStart(4, '0')}`,
            department: u.department || 'CSBS',
            year: u.semester ? Math.ceil(u.semester / 2) : 1,
            section: u.section || 'A',
            attendance: Math.floor(Math.random() * 30) + 70, // Simulated
            average: Math.floor(Math.random() * 40) + 50,    // Simulated
          }));

        setStudents(studentList);
      }
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast({ title: 'Error', description: 'Failed to fetch students', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newStudent,
        role: 'student' as UserRole,
        semester: parseInt(newStudent.semester)
      };

      const response = await usersAPI.create(payload);

      if (response.success) {
        toast({ title: 'Success', description: 'Student added successfully' });
        setIsAddOpen(false);
        fetchStudents();
        setNewStudent({
          name: '',
          email: '',
          rollNo: '',
          department: 'CSBS',
          semester: '1',
          password: 'password123'
        });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to add student', variant: 'destructive' });
    }
  };

  const handleBulkImport = async (data: any[]) => {
    try {
      // Map CSV columns to API expected format
      // Expected CSV headers: Name, Email, Roll No, Department, Semester
      const formattedData = data.map(item => ({
        name: item['Name'] || item['name'],
        email: item['Email'] || item['email'],
        rollNo: item['Roll No'] || item['RollNo'] || item['roll_no'],
        department: item['Department'] || item['department'] || 'CSBS',
        semester: parseInt(item['Semester'] || item['semester'] || '1'),
        role: 'student',
        password: 'password123' // Default password
      }));

      const response = await usersAPI.bulkCreate(formattedData);

      if (response.success) {
        toast({ title: 'Import Successful', description: response.message });
        setIsImportOpen(false);
        fetchStudents();
      }
    } catch (error: any) {
      toast({ title: 'Import Failed', description: error.message, variant: 'destructive' });
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.roll_no?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear = selectedYear === 'all' || student.year === parseInt(selectedYear);
    const matchesDept = selectedDepartment === 'all' || student.department === selectedDepartment;

    return matchesSearch && matchesYear && matchesDept;
  });

  const getStatusColor = (average: number) => {
    if (average >= 80) return 'bg-green-100 text-green-700';
    if (average >= 60) return 'bg-blue-100 text-blue-700';
    if (average >= 40) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const getStatus = (average: number) => {
    if (average >= 80) return 'Excellent';
    if (average >= 60) return 'Good';
    if (average >= 40) return 'Average';
    return 'At Risk';
  };

  const exportToCSV = () => {
    let csv = 'Roll No,Name,Email,Department,Year,Section,Attendance,Average\n';
    filteredStudents.forEach(s => {
      csv += `${s.roll_no},${s.name},${s.email},${s.department},${s.year},${s.section},${s.attendance}%,${s.average}%\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
  };

  // Year-wise count
  const yearCounts = [1, 2, 3, 4].map(year => ({
    year,
    count: students.filter(s => s.year === year).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">{isAdmin ? 'Student Management' : 'My Students'}</h2>
          <p className="text-muted-foreground">View and manage student details</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>Enter student details manually.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rollNo">Roll No</Label>
                        <Input id="rollNo" value={newStudent.rollNo} onChange={e => setNewStudent({ ...newStudent, rollNo: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={newStudent.department} onValueChange={v => setNewStudent({ ...newStudent, department: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CSBS">CSBS</SelectItem>
                            <SelectItem value="CSE">CSE</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="semester">Semester</Label>
                        <Select value={newStudent.semester} onValueChange={v => setNewStudent({ ...newStudent, semester: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Student</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary">
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Bulk Import Students</DialogTitle>
                    <DialogDescription>
                      Upload a CSV or Excel file with columns: Name, Email, Roll No, Department, Semester
                    </DialogDescription>
                  </DialogHeader>
                  <DataImporter
                    onImport={handleBulkImport}
                    requiredColumns={['Name', 'Email']}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
        </div>
      </div>

      {/* Year-wise Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {yearCounts.map(({ year, count }) => (
          <Card key={year} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedYear(String(year))}>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Year {year}</p>
              <p className="text-2xl font-bold">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll number, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {[1, 2, 3, 4].map(y => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="CSBS">CSBS</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="EEE">EEE</SelectItem>
                <SelectItem value="MECH">MECH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>Total: {filteredStudents.length} students</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No students found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Roll No</th>
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-center py-3 px-4 font-medium">Dept</th>
                    <th className="text-center py-3 px-4 font-medium">Year</th>
                    <th className="text-center py-3 px-4 font-medium">Section</th>
                    <th className="text-center py-3 px-4 font-medium">Attendance</th>
                    <th className="text-center py-3 px-4 font-medium">Average</th>
                    <th className="text-center py-3 px-4 font-medium">Status</th>
                    <th className="text-center py-3 px-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{student.roll_no}</td>
                      <td className="py-3 px-4">{student.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{student.email}</td>
                      <td className="py-3 px-4 text-center">{student.department}</td>
                      <td className="py-3 px-4 text-center">{student.year}</td>
                      <td className="py-3 px-4 text-center">{student.section}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={(student.attendance || 0) < 75 ? 'text-red-600 font-medium' : ''}>
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">{student.average}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(student.average || 0)}`}>
                          {getStatus(student.average || 0)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{student.name}</DialogTitle>
                              <DialogDescription>{student.roll_no}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/50 rounded-lg text-center">
                                  <p className="text-sm text-muted-foreground">Attendance</p>
                                  <p className="text-2xl font-bold">{student.attendance}%</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg text-center">
                                  <p className="text-sm text-muted-foreground">Average</p>
                                  <p className="text-2xl font-bold">{student.average}%</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Email</p>
                                  <p>{student.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Department</p>
                                  <p>{student.department}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Year / Section</p>
                                  <p>Year {student.year} - Section {student.section}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Status</p>
                                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(student.average || 0)}`}>
                                    {getStatus(student.average || 0)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;