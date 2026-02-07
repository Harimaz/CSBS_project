import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Download, Eye, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StudentMark {
  id?: string;
  student_id: string;
  student_roll_no: string;
  student_name: string;
  obtained_marks: number;
}

const examTypes = [
  { value: 'CAT-1', label: 'CAT-1', maxMarks: 50 },
  { value: 'CAT-2', label: 'CAT-2', maxMarks: 50 },
  { value: 'Terminal', label: 'Terminal/Semester', maxMarks: 100 },
  { value: 'Model-Lab-1', label: 'Model Lab 1', maxMarks: 50 },
  { value: 'Model-Lab-2', label: 'Model Lab 2', maxMarks: 50 },
];

// CSBS Department Subjects
const csbsSubjects = {
  1: [
    { code: 'MA101', name: 'Engineering Mathematics I' },
    { code: 'PH101', name: 'Engineering Physics' },
    { code: 'CS101', name: 'Problem Solving using C' },
    { code: 'EG101', name: 'Engineering Graphics' },
    { code: 'EN101', name: 'Technical English' },
  ],
  2: [
    { code: 'MA102', name: 'Engineering Mathematics II' },
    { code: 'CH102', name: 'Engineering Chemistry' },
    { code: 'CS102', name: 'Data Structures' },
    { code: 'CS103', name: 'Object Oriented Programming' },
    { code: 'EC102', name: 'Digital Electronics' },
  ],
  3: [
    { code: 'CS201', name: 'Database Management Systems' },
    { code: 'CS202', name: 'Computer Networks' },
    { code: 'CS203', name: 'Operating Systems' },
    { code: 'BS201', name: 'Business Analytics' },
    { code: 'MA201', name: 'Probability and Statistics' },
  ],
  4: [
    { code: 'CS301', name: 'Software Engineering' },
    { code: 'CS302', name: 'Web Technologies' },
    { code: 'BS301', name: 'Business Intelligence' },
    { code: 'CS303', name: 'Machine Learning' },
    { code: 'CS304', name: 'Cloud Computing' },
  ],
};

const MarkEntry: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { students: allStudents, results: allMarks, addResult } = useData();
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [examType, setExamType] = useState('');
  const [maxMarks, setMaxMarks] = useState(50);
  const [students, setStudents] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

  const isFaculty = user?.role === 'faculty';
  const isStudent = user?.role === 'student';
  const canEdit = isFaculty;

  const currentSubjects = year ? csbsSubjects[parseInt(year) as keyof typeof csbsSubjects] || [] : [];

  useEffect(() => {
    if (year && subject && examType) {
      fetchStudentsAndMarks();
      const selectedExamType = examTypes.find(t => t.value === examType);
      if (selectedExamType) {
        setMaxMarks(selectedExamType.maxMarks);
      }
    }
  }, [year, subject, examType]);

  // Reset subject when year changes
  useEffect(() => {
    setSubject('');
  }, [year]);

  const fetchStudentsAndMarks = async () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const yearInt = parseInt(year);
      const filteredMarks = allMarks.filter(m =>
        m.year === yearInt &&
        m.subjectCode === subject &&
        m.examType === examType
      );

      if (filteredMarks.length > 0) {
        setStudents(filteredMarks.map(m => ({
          id: m.id,
          student_id: m.studentId,
          student_roll_no: m.studentRollNo,
          student_name: m.studentName,
          obtained_marks: m.obtainedMarks,
        })));
      } else {
        // If no marks exist, show all students for entry
        const deptStudents = allStudents.filter(s => s.department === 'CSBS' && s.year === yearInt);
        setStudents(deptStudents.map(s => ({
          student_id: s.id,
          student_roll_no: s.rollNo,
          student_name: s.name,
          obtained_marks: 0,
        })));
      }
      setLoading(false);
    }, 500);
  };

  const handleMarksChange = (studentId: string, marks: string) => {
    if (!canEdit) return;
    const numMarks = parseInt(marks) || 0;
    setStudents(students.map(s =>
      s.student_id === studentId ? { ...s, obtained_marks: Math.min(maxMarks, Math.max(0, numMarks)) } : s
    ));
  };

  const handleSave = async () => {
    if (!canEdit) {
      toast({ title: 'Error', description: 'Only faculty can edit marks', variant: 'destructive' });
      return;
    }
    if (!year || !subject || !examType) {
      toast({ title: 'Error', description: 'Please select all fields', variant: 'destructive' });
      return;
    }

    setSaving(true);
    // Simulate API delay
    setTimeout(() => {
      const subjectInfo = currentSubjects.find(s => s.code === subject);
      students.forEach(s => {
        addResult({
          studentId: s.student_id,
          studentName: s.student_name,
          studentRollNo: s.student_roll_no,
          subjectCode: subject,
          subjectName: subjectInfo?.name || subject,
          examType: examType,
          obtainedMarks: s.obtained_marks,
          maxMarks: maxMarks,
          isPass: s.obtained_marks >= maxMarks * 0.4,
          year: parseInt(year),
          grade: calculateGrade(s.obtained_marks, maxMarks),
        });
      });

      toast({ title: 'Success', description: 'Marks saved successfully (to local state)!' });
      setSaving(false);
    }, 800);
  };


  const calculateGrade = (marks: number, max: number): string => {
    const percent = (marks / max) * 100;
    if (percent >= 90) return 'O';
    if (percent >= 80) return 'A+';
    if (percent >= 70) return 'A';
    if (percent >= 60) return 'B+';
    if (percent >= 50) return 'B';
    if (percent >= 40) return 'C';
    return 'F';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'O': return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
      case 'A+': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'A': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'B+': return 'bg-cyan-500/20 text-cyan-700 border-cyan-500/30';
      case 'B': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'C': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      default: return 'bg-red-500/20 text-red-700 border-red-500/30';
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    const file = e.target.files?.[0];
    if (!file || !year || !subject || !examType) {
      toast({ title: 'Error', description: 'Please select year, subject, and exam type first', variant: 'destructive' });
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split('\n').slice(1);
      const subjectInfo = currentSubjects.find(s => s.code === subject);
      const records: any[] = [];
      const failed: { row: number; reason: string }[] = [];

      lines.forEach((line, idx) => {
        const [roll_no, name, marks] = line.split(',').map(s => s.trim());
        if (!roll_no || !name) {
          failed.push({ row: idx + 2, reason: 'Missing roll number or name' });
          return;
        }
        const numMarks = parseInt(marks) || 0;
        if (numMarks < 0 || numMarks > maxMarks) {
          failed.push({ row: idx + 2, reason: `Invalid marks: ${marks}` });
          return;
        }
        records.push({
          student_id: crypto.randomUUID(),
          student_roll_no: roll_no,
          student_name: name,
          year: parseInt(year),
          semester: parseInt(year) * 2 - 1,
          subject_code: subject,
          subject_name: subjectInfo?.name || subject,
          exam_type: examType,
          max_marks: maxMarks,
          obtained_marks: numMarks,
          is_pass: numMarks >= maxMarks * 0.4,
          grade: calculateGrade(numMarks, maxMarks),
          entered_by: user?.id,
        });
      });

      if (records.length > 0) {
        records.forEach(rec => {
          addResult({
            studentId: rec.student_id,
            studentName: rec.student_name,
            studentRollNo: rec.student_roll_no,
            subjectCode: rec.subject_code,
            subjectName: rec.subject_name,
            examType: rec.exam_type,
            obtainedMarks: rec.obtained_marks,
            maxMarks: rec.max_marks,
            isPass: rec.is_pass,
            year: rec.year,
            grade: rec.grade,
          });
        });
      }

      toast({
        title: 'Upload Complete',
        description: `${records.length} records uploaded to local state.`
      });
      setIsBulkDialogOpen(false);
      fetchStudentsAndMarks();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const downloadTemplate = () => {
    const csv = 'Roll No,Name,Marks\nCSBS21001,Sample Student,45\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marks_template.csv';
    a.click();
  };

  const getSubjectName = () => {
    const subjectInfo = currentSubjects.find(s => s.code === subject);
    return subjectInfo ? subjectInfo.name : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {canEdit ? 'Mark Entry' : 'View Marks'}
            </h2>
            <p className="text-muted-foreground text-sm">
              CSBS Department • {canEdit ? 'Enter student marks' : 'View marks'}
            </p>
          </div>
        </div>
        {canEdit && (
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Upload Marks</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file with columns: Roll No, Name, Marks
                </p>
                <Button variant="outline" onClick={downloadTemplate} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleBulkUpload}
                  className="cursor-pointer"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Selection Card */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Select Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map(y => (
                    <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subject</Label>
              <Select value={subject} onValueChange={setSubject} disabled={!year}>
                <SelectTrigger>
                  <SelectValue placeholder={year ? "Select subject" : "Select year first"} />
                </SelectTrigger>
                <SelectContent>
                  {currentSubjects.map(s => (
                    <SelectItem key={s.code} value={s.code}>
                      {s.code} - {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Exam Type</Label>
              <Select value={examType} onValueChange={setExamType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Maximum Marks</Label>
              <Input
                type="number"
                value={maxMarks}
                onChange={(e) => canEdit && setMaxMarks(parseInt(e.target.value) || 50)}
                disabled={!canEdit}
                className="bg-muted/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      {year && subject && examType && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {examType}
          </Badge>
          <span className="text-sm">
            <span className="font-medium">{getSubjectName()}</span> • Year {year} • Max: {maxMarks} marks
          </span>
        </div>
      )}

      {/* Marks Table */}
      {year && subject && examType && (
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              {canEdit ? 'Student Marks' : <><Eye className="h-5 w-5" /> View Marks</>}
            </CardTitle>
            <CardDescription>
              {canEdit
                ? `Enter marks for each student (Max: ${maxMarks})`
                : isStudent ? 'Your marks' : 'Read-only view'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {isStudent ? 'No marks found for your account' : 'No students found. Add students to the CSBS department first.'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-border/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-3 px-4 font-medium">Roll No</th>
                        <th className="text-left py-3 px-4 font-medium">Student Name</th>
                        <th className="text-center py-3 px-4 font-medium">Marks</th>
                        <th className="text-center py-3 px-4 font-medium">Grade</th>
                        <th className="text-center py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => {
                        const grade = calculateGrade(student.obtained_marks, maxMarks);
                        const isPass = student.obtained_marks >= maxMarks * 0.4;
                        return (
                          <tr
                            key={student.student_id}
                            className={`border-t border-border/50 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                          >
                            <td className="py-3 px-4 font-mono text-sm">{student.student_roll_no}</td>
                            <td className="py-3 px-4 font-medium">{student.student_name}</td>
                            <td className="py-3 px-4">
                              {canEdit ? (
                                <Input
                                  type="number"
                                  min="0"
                                  max={maxMarks}
                                  value={student.obtained_marks}
                                  onChange={(e) => handleMarksChange(student.student_id, e.target.value)}
                                  className="w-20 mx-auto text-center h-9"
                                />
                              ) : (
                                <span className="flex items-center justify-center font-medium">
                                  {student.obtained_marks}
                                  <span className="text-muted-foreground ml-1">/ {maxMarks}</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className={`${getGradeColor(grade)} border font-semibold`}>
                                {grade}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge variant={isPass ? "default" : "destructive"} className="font-medium">
                                {isPass ? 'Pass' : 'Fail'}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {canEdit && (
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      {students.length} students • {students.filter(s => s.obtained_marks >= maxMarks * 0.4).length} passing
                    </p>
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Marks
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarkEntry;
