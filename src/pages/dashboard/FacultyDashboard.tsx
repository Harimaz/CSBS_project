import React, { useState, useEffect } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  ClipboardList,
  Upload,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Edit,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { csbsSyllabus, CSBSSubject } from '@/data/csbsSyllabus';
import { useNavigate } from 'react-router-dom';

interface AssignedSubject {
  code: string;
  name: string;
  year: number;
  semester: number;
  credits: number;
  type: 'theory' | 'lab';
}

interface PendingMarkEntry {
  subject_code: string;
  subject_name: string;
  exam_type: 'CAT-1' | 'CAT-2' | 'Semester' | 'Model Lab 1' | 'Model Lab 2';
  year: number;
  semester: number;
  total_students: number;
  entered_count: number;
  deadline?: string;
}

interface InvigilationDuty {
  date: string;
  shift: string;
  venue: string;
  status: string;
}

const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignedSubjects, setAssignedSubjects] = useState<AssignedSubject[]>([]);
  const [pendingEntries, setPendingEntries] = useState<PendingMarkEntry[]>([]);
  const [invigilationDuties, setInvigilationDuties] = useState<InvigilationDuty[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingTasks: 0,
    marksSubmitted: 0,
    invigilationDays: 0,
  });

  useEffect(() => {
    if (user?.id) {
      fetchFacultyData();
    }
  }, [user?.id]);

  const fetchFacultyData = async () => {
    setLoading(true);
    try {
      // Fetch timetable entries to get assigned subjects
      const { data: timetableData } = await supabase
        .from('timetables')
        .select('subject_code, subject_name, year, semester')
        .eq('faculty_id', user?.id);

      if (timetableData) {
        const uniqueSubjects = new Map<string, AssignedSubject>();
        timetableData.forEach(entry => {
          if (!uniqueSubjects.has(entry.subject_code)) {
            const syllabusSubject = csbsSyllabus
              .flatMap(s => s.subjects)
              .find(sub => sub.code === entry.subject_code);
            
            uniqueSubjects.set(entry.subject_code, {
              code: entry.subject_code,
              name: entry.subject_name,
              year: entry.year,
              semester: entry.semester,
              credits: syllabusSubject?.credits || 3,
              type: syllabusSubject?.type === 'lab' ? 'lab' : 'theory',
            });
          }
        });
        setAssignedSubjects(Array.from(uniqueSubjects.values()));
      }

      // Fetch results to calculate pending entries
      const { data: resultsData } = await supabase
        .from('results')
        .select('subject_code, subject_name, exam_type, year, semester')
        .eq('entered_by', user?.id);

      // Generate pending entries based on assigned subjects
      const pending: PendingMarkEntry[] = [];
      const examTypes: Array<'CAT-1' | 'CAT-2' | 'Semester' | 'Model Lab 1' | 'Model Lab 2'> = [
        'CAT-1', 'CAT-2', 'Semester', 'Model Lab 1', 'Model Lab 2'
      ];

      assignedSubjects.forEach(subject => {
        examTypes.forEach(examType => {
          const enteredCount = resultsData?.filter(
            r => r.subject_code === subject.code && r.exam_type === examType
          ).length || 0;

          if (enteredCount < 60) { // Assuming 60 students per class
            pending.push({
              subject_code: subject.code,
              subject_name: subject.name,
              exam_type: examType,
              year: subject.year,
              semester: subject.semester,
              total_students: 60,
              entered_count: enteredCount,
            });
          }
        });
      });

      setPendingEntries(pending.slice(0, 10)); // Show top 10

      // Fetch invigilation duties
      const { data: dutiesData } = await supabase
        .from('invigilation_duties')
        .select('date, shift, venue, status')
        .eq('faculty_id', user?.id)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(5);

      if (dutiesData) {
        setInvigilationDuties(dutiesData);
      }

      // Calculate stats
      setStats({
        totalStudents: assignedSubjects.length * 60,
        pendingTasks: pending.length,
        marksSubmitted: Math.round((resultsData?.length || 0) / (pending.length + (resultsData?.length || 0)) * 100) || 0,
        invigilationDays: dutiesData?.length || 0,
      });

    } catch (error) {
      console.error('Error fetching faculty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (entry: PendingMarkEntry) => {
    const percentage = (entry.entered_count / entry.total_students) * 100;
    if (percentage === 0) return { variant: 'destructive' as const, label: 'Not Started' };
    if (percentage < 50) return { variant: 'outline' as const, label: 'In Progress' };
    return { variant: 'secondary' as const, label: 'Almost Done' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned Subjects"
          value={assignedSubjects.length}
          icon={BookOpen}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Pending Mark Entries"
          value={pendingEntries.length}
          icon={ClipboardList}
          iconColor="text-warning"
          iconBg="bg-warning/10"
        />
        <StatCard
          title="Marks Submitted"
          value={`${stats.marksSubmitted}%`}
          icon={Upload}
          iconColor="text-success"
          iconBg="bg-success/10"
        />
        <StatCard
          title="Upcoming Invigilation"
          value={stats.invigilationDays}
          icon={MapPin}
          iconColor="text-accent"
          iconBg="bg-accent/10"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Assigned Subjects */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">My Assigned Subjects</CardTitle>
            <Badge variant="outline">{assignedSubjects.length} subjects</Badge>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : assignedSubjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No subjects assigned yet</p>
                <p className="text-sm">Contact admin to assign subjects</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {assignedSubjects.map((subject, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          subject.type === 'lab' ? 'bg-accent/10' : 'bg-primary/10'
                        }`}>
                          {subject.type === 'lab' ? (
                            <FileText className="h-5 w-5 text-accent" />
                          ) : (
                            <BookOpen className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{subject.name}</p>
                          <p className="text-xs text-muted-foreground">{subject.code}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Year {subject.year}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Semester {subject.semester}</span>
                      <span>{subject.credits} Credits</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invigilation Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Invigilation</CardTitle>
          </CardHeader>
          <CardContent>
            {invigilationDuties.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming duties</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invigilationDuties.map((duty, idx) => (
                  <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">{duty.venue}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(duty.date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{duty.shift}</p>
                    <Badge 
                      variant="outline" 
                      className={`mt-2 ${duty.status === 'confirmed' ? 'text-success' : ''}`}
                    >
                      {duty.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Mark Entries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Pending Mark Entries</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/mark-entry')}>
            Enter Marks <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {pendingEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success opacity-70" />
              <p>All marks submitted!</p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="cat1">CAT-1</TabsTrigger>
                <TabsTrigger value="cat2">CAT-2</TabsTrigger>
                <TabsTrigger value="semester">Semester</TabsTrigger>
                <TabsTrigger value="lab">Lab</TabsTrigger>
              </TabsList>

              {['all', 'cat1', 'cat2', 'semester', 'lab'].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <div className="space-y-3">
                    {pendingEntries
                      .filter(entry => {
                        if (tab === 'all') return true;
                        if (tab === 'cat1') return entry.exam_type === 'CAT-1';
                        if (tab === 'cat2') return entry.exam_type === 'CAT-2';
                        if (tab === 'semester') return entry.exam_type === 'Semester';
                        if (tab === 'lab') return entry.exam_type.includes('Lab');
                        return true;
                      })
                      .slice(0, 5)
                      .map((entry, idx) => {
                        const priority = getPriorityBadge(entry);
                        const progress = (entry.entered_count / entry.total_students) * 100;

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                            onClick={() => navigate('/dashboard/mark-entry')}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                progress === 0 ? 'bg-destructive/10' : 
                                progress < 50 ? 'bg-warning/10' : 'bg-success/10'
                              }`}>
                                {progress === 0 ? (
                                  <AlertCircle className="h-5 w-5 text-destructive" />
                                ) : progress < 100 ? (
                                  <Clock className="h-5 w-5 text-warning" />
                                ) : (
                                  <CheckCircle className="h-5 w-5 text-success" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground">{entry.subject_name}</p>
                                  <Badge variant="outline" className="text-xs">{entry.exam_type}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {entry.subject_code} • Year {entry.year} • Sem {entry.semester}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Progress value={progress} className="h-1.5 flex-1 max-w-[200px]" />
                                  <span className="text-xs text-muted-foreground">
                                    {entry.entered_count}/{entry.total_students}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={priority.variant}>{priority.label}</Badge>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Enter
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2"
          onClick={() => navigate('/dashboard/mark-entry')}
        >
          <Upload className="h-6 w-6 text-primary" />
          <span>Enter Marks</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2"
          onClick={() => navigate('/dashboard/result-analysis')}
        >
          <ClipboardList className="h-6 w-6 text-success" />
          <span>View Results</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2"
          onClick={() => navigate('/dashboard/invigilation')}
        >
          <MapPin className="h-6 w-6 text-warning" />
          <span>My Schedule</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2"
          onClick={() => navigate('/dashboard/syllabus')}
        >
          <BookOpen className="h-6 w-6 text-accent" />
          <span>View Syllabus</span>
        </Button>
      </div>
    </div>
  );
};

export default FacultyDashboard;
