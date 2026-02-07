import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Download, BarChart3, TrendingUp, PieChart, Users, User, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface StudentResult {
  student_id: string;
  student_name: string;
  student_roll_no: string;
  subject_code: string;
  subject_name: string;
  exam_type: string;
  obtained_marks: number;
  max_marks: number;
  is_pass: boolean;
  year: number;
}

interface AnalysisData {
  summary: {
    average: number;
    passPercent: number;
    totalStudents: number;
    highest: number;
    lowest: number;
  };
  bySubject: { subjectCode: string; subjectName: string; avg: number; passPercent: number }[];
  byStudent: { studentId: string; name: string; rollNo: string; avg: number }[];
  timeSeries: { period: string; avg: number }[];
}

const examTypes = [
  { value: 'CAT-1', label: 'CAT-1', color: 'hsl(220 70% 50%)' },
  { value: 'CAT-2', label: 'CAT-2', color: 'hsl(280 70% 50%)' },
  { value: 'Terminal', label: 'Terminal/Semester', color: 'hsl(142 76% 36%)' },
  { value: 'Model-Lab-1', label: 'Model Lab 1', color: 'hsl(45 93% 47%)' },
  { value: 'Model-Lab-2', label: 'Model Lab 2', color: 'hsl(0 84% 60%)' },
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

const getAllSubjects = () => {
  return Object.values(csbsSubjects).flat();
};

const ResultAnalysis: React.FC = () => {
  const { user } = useAuth();
  const { results: allMarks } = useData();
  const [year, setYear] = useState('all');
  const [examType, setExamType] = useState('all');
  const [subject, setSubject] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [allResults, setAllResults] = useState<StudentResult[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string; rollNo: string }[]>([]);

  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';

  const currentSubjects = year !== 'all' ? csbsSubjects[parseInt(year) as keyof typeof csbsSubjects] || [] : getAllSubjects();

  useEffect(() => {
    fetchAnalysis();
  }, [year, examType, subject, selectedStudent, user?.id, allMarks]);

  useEffect(() => {
    setSubject('all');
  }, [year]);

  const fetchAnalysis = async () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      let data: StudentResult[] = allMarks.map(m => ({
        student_id: m.studentId,
        student_name: m.studentName,
        student_roll_no: m.studentRollNo,
        subject_code: m.subjectCode,
        subject_name: m.subjectName,
        exam_type: m.examType,
        obtained_marks: m.obtainedMarks,
        max_marks: m.maxMarks,
        is_pass: m.isPass,
        year: m.year
      }));

      if (isStudent && user?.id) {
        data = data.filter(r => r.student_id === user.id);
      }
      if (year !== 'all') {
        data = data.filter(r => r.year === parseInt(year));
      }
      if (examType !== 'all') {
        data = data.filter(r => r.exam_type === examType);
      }
      if (subject !== 'all') {
        data = data.filter(r => r.subject_code === subject);
      }
      if (selectedStudent !== 'all' && !isStudent) {
        data = data.filter(r => r.student_id === selectedStudent);
      }

      setAllResults(data);

      if (data.length > 0 && !isStudent) {
        const uniqueStudents = Array.from(
          new Map(data.map(r => [r.student_id, { id: r.student_id, name: r.student_name, rollNo: r.student_roll_no }])).values()
        );
        setStudents(uniqueStudents);
      }

      if (data.length === 0) {
        setAnalysisData(null);
        setLoading(false);
        return;
      }

      const totalMarks = data.reduce((sum, r) => sum + r.obtained_marks, 0);
      const passCount = data.filter(r => r.is_pass).length;
      const marks = data.map(r => r.obtained_marks);

      const summary = {
        average: Math.round((totalMarks / data.length) * 100) / 100,
        passPercent: Math.round((passCount / data.length) * 100 * 100) / 100,
        totalStudents: new Set(data.map(r => r.student_id)).size,
        highest: Math.max(...marks),
        lowest: Math.min(...marks),
      };

      const subjectGroups = data.reduce((acc, r) => {
        if (!acc[r.subject_code]) {
          acc[r.subject_code] = { name: r.subject_name, marks: [], pass: 0, total: 0 };
        }
        acc[r.subject_code].marks.push(r.obtained_marks);
        acc[r.subject_code].total++;
        if (r.is_pass) acc[r.subject_code].pass++;
        return acc;
      }, {} as Record<string, { name: string; marks: number[]; pass: number; total: number }>);

      const bySubject = Object.entries(subjectGroups).map(([code, data]) => ({
        subjectCode: code,
        subjectName: data.name,
        avg: Math.round((data.marks.reduce((a, b) => a + b, 0) / data.marks.length) * 100) / 100,
        passPercent: Math.round((data.pass / data.total) * 100 * 100) / 100,
      }));

      const studentGroups = data.reduce((acc, r) => {
        if (!acc[r.student_id]) {
          acc[r.student_id] = { name: r.student_name, rollNo: r.student_roll_no, marks: [] };
        }
        acc[r.student_id].marks.push(r.obtained_marks);
        return acc;
      }, {} as Record<string, { name: string; rollNo: string; marks: number[] }>);

      const byStudent = Object.entries(studentGroups).map(([id, data]) => ({
        studentId: id,
        name: data.name,
        rollNo: data.rollNo,
        avg: Math.round((data.marks.reduce((a, b) => a + b, 0) / data.marks.length) * 100) / 100,
      })).sort((a, b) => b.avg - a.avg);

      const allExamTypes = ['CAT-1', 'CAT-2', 'Terminal', 'Model-Lab-1', 'Model-Lab-2'];
      const timeSeries = allExamTypes.map(type => {
        const typeData = data.filter(r => r.exam_type === type);
        if (typeData.length === 0) return { period: type, avg: 0 };
        const avg = typeData.reduce((sum, r) => sum + r.obtained_marks, 0) / typeData.length;
        return { period: type, avg: Math.round(avg * 100) / 100 };
      });

      setAnalysisData({ summary, bySubject, byStudent, timeSeries });
      setLoading(false);
    }, 500);
  };

  const exportToCSV = () => {
    if (!analysisData) return;

    let csv = 'Category,Value\n';
    csv += `Average Marks,${analysisData.summary.average}\n`;
    csv += `Pass Percentage,${analysisData.summary.passPercent}%\n`;
    csv += `Total Students,${analysisData.summary.totalStudents}\n\n`;
    csv += 'Subject,Average,Pass %\n';
    analysisData.bySubject.forEach(s => {
      csv += `${s.subjectCode} - ${s.subjectName},${s.avg},${s.passPercent}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result_analysis_csbs.csv';
    a.click();
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(var(--border) / 0.5)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Individual student performance - bar chart by exam type
  const getStudentPerformanceData = () => {
    const studentId = selectedStudent !== 'all' ? selectedStudent : (isStudent ? user?.id : null);
    if (!studentId) return null;

    const studentResults = allResults.filter(r => r.student_id === studentId);
    if (studentResults.length === 0) return null;

    const examTypeOrder = ['CAT-1', 'CAT-2', 'Terminal', 'Model-Lab-1', 'Model-Lab-2'];
    const examTypeData: Record<string, { marks: number[]; max: number }> = {};

    studentResults.forEach(r => {
      if (!examTypeData[r.exam_type]) {
        examTypeData[r.exam_type] = { marks: [], max: r.max_marks };
      }
      examTypeData[r.exam_type].marks.push(r.obtained_marks);
    });

    const orderedTypes = examTypeOrder.filter(type => examTypeData[type]);
    const averages = orderedTypes.map(type => {
      const data = examTypeData[type];
      return Math.round((data.marks.reduce((a, b) => a + b, 0) / data.marks.length) * 100) / 100;
    });

    const colors = orderedTypes.map(type => {
      const exam = examTypes.find(e => e.value === type);
      return exam?.color || 'hsl(var(--primary))';
    });

    return {
      labels: orderedTypes.map(type => {
        const exam = examTypes.find(e => e.value === type);
        return exam?.label || type;
      }),
      datasets: [
        {
          label: 'Average Marks',
          data: averages,
          backgroundColor: colors.map(c => c.replace(')', ' / 0.7)')),
          borderColor: colors,
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  };

  const barChartData = {
    labels: analysisData?.bySubject.map(s => s.subjectCode) || [],
    datasets: [
      {
        label: 'Average Marks',
        data: analysisData?.bySubject.map(s => s.avg) || [],
        backgroundColor: 'hsl(var(--primary) / 0.7)',
        borderColor: 'hsl(var(--primary))',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const lineChartData = {
    labels: analysisData?.timeSeries.map(t => {
      const exam = examTypes.find(e => e.value === t.period);
      return exam?.label || t.period;
    }) || [],
    datasets: [
      {
        label: 'Average Performance',
        data: analysisData?.timeSeries.map(t => t.avg) || [],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'hsl(var(--primary))',
        pointBorderColor: 'hsl(var(--background))',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const pieChartData = {
    labels: ['Pass', 'Fail'],
    datasets: [
      {
        data: analysisData
          ? [analysisData.summary.passPercent, 100 - analysisData.summary.passPercent]
          : [0, 0],
        backgroundColor: ['hsl(142 76% 36% / 0.8)', 'hsl(0 84% 60% / 0.8)'],
        borderColor: ['hsl(142 76% 36%)', 'hsl(0 84% 60%)'],
        borderWidth: 2,
      },
    ],
  };

  const studentPerformanceData = getStudentPerformanceData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Result Analysis</h2>
            <p className="text-muted-foreground text-sm">
              CSBS Department • {isStudent ? 'Your performance' : 'Student performance analytics'}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={exportToCSV} disabled={!analysisData} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filter Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {[1, 2, 3, 4].map(y => (
                    <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Exam Type</Label>
              <Select value={examType} onValueChange={setExamType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {examTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {currentSubjects.map(s => (
                    <SelectItem key={s.code} value={s.code}>
                      {s.code} - {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!isStudent && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    {students.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.rollNo} - {s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !analysisData ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No results data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              {isStudent ? 'Your marks will appear here once entered by faculty' : 'Enter marks in the Mark Entry module to see analysis'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Average</p>
                <p className="text-2xl font-bold text-primary mt-1">{analysisData.summary.average}</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Pass Rate</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{analysisData.summary.passPercent}%</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Students</p>
                <p className="text-2xl font-bold mt-1">{analysisData.summary.totalStudents}</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Highest</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{analysisData.summary.highest}</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Lowest</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{analysisData.summary.lowest}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="individual" className="space-y-4">
            <TabsList className="flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="individual" className="gap-2">
                <User className="h-4 w-4" />
                Individual
              </TabsTrigger>
              <TabsTrigger value="bar" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                By Subject
              </TabsTrigger>
              <TabsTrigger value="line" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trend
              </TabsTrigger>
              <TabsTrigger value="pie" className="gap-2">
                <PieChart className="h-4 w-4" />
                Pass/Fail
              </TabsTrigger>
              {(isAdmin || isFaculty) && (
                <TabsTrigger value="students" className="gap-2">
                  <Users className="h-4 w-4" />
                  Top Students
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="individual">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Performance by Exam Type</CardTitle>
                  <CardDescription>
                    {isStudent
                      ? 'Your marks across CAT-1, CAT-2, Terminal, and Lab exams'
                      : selectedStudent !== 'all'
                        ? 'Selected student performance'
                        : 'Select a student to view individual performance'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {studentPerformanceData ? (
                    <div className="h-[400px]">
                      <Bar
                        data={studentPerformanceData}
                        options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            title: {
                              display: true,
                              text: 'Average Marks by Exam Type',
                              font: { size: 14, weight: 'bold' as const },
                            },
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">
                        {isStudent ? 'No results found' : 'Select a student from the filter'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bar">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Average Marks by Subject</CardTitle>
                  <CardDescription>Compare performance across CSBS subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <Bar data={barChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="line">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Trend</CardTitle>
                  <CardDescription>Track progress across exam types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <Line data={lineChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pie">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Pass/Fail Distribution</CardTitle>
                  <CardDescription>Overall pass rate analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="w-[300px]">
                      <Pie data={pieChartData} options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            position: 'bottom' as const,
                          },
                        },
                      }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {(isAdmin || isFaculty) && (
              <TabsContent value="students">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Top Performing Students</CardTitle>
                    <CardDescription>Students ranked by average marks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto rounded-lg border border-border/50">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left py-3 px-4 font-medium">Rank</th>
                            <th className="text-left py-3 px-4 font-medium">Roll No</th>
                            <th className="text-left py-3 px-4 font-medium">Name</th>
                            <th className="text-center py-3 px-4 font-medium">Average</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysisData.byStudent.slice(0, 10).map((student, idx) => (
                            <tr key={student.studentId} className="border-t border-border/50">
                              <td className="py-3 px-4">
                                <Badge variant={idx < 3 ? "default" : "secondary"} className="font-semibold">
                                  #{idx + 1}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 font-mono">{student.rollNo}</td>
                              <td className="py-3 px-4 font-medium">{student.name}</td>
                              <td className="py-3 px-4 text-center">
                                <span className="font-bold text-primary">{student.avg}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ResultAnalysis;
