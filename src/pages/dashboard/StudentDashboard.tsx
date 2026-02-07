import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { ExamCard } from '@/components/dashboard/ExamCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  FileText,
  BarChart3,
  CheckSquare,
  Download,
  ArrowRight,
  BookOpen,
  Clock,
} from 'lucide-react';

const upcomingExams = [
  { subject: 'Data Structures', code: 'CS301', date: 'Dec 15, 2024', time: '10:00 AM - 1:00 PM', venue: 'Hall A', type: 'CAT' as const, status: 'upcoming' as const },
  { subject: 'Database Systems', code: 'CS302', date: 'Dec 18, 2024', time: '2:00 PM - 5:00 PM', venue: 'Hall B', type: 'Semester' as const, status: 'upcoming' as const },
  { subject: 'Web Technologies Lab', code: 'CS303L', date: 'Dec 20, 2024', time: '9:00 AM - 12:00 PM', venue: 'Lab 2', type: 'Lab' as const, status: 'upcoming' as const },
];

const recentResults = [
  { subject: 'Computer Networks', code: 'CS201', grade: 'A', marks: 85, total: 100 },
  { subject: 'Operating Systems', code: 'CS202', grade: 'A+', marks: 92, total: 100 },
  { subject: 'Software Engineering', code: 'CS203', grade: 'B+', marks: 78, total: 100 },
];

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('upcomingExams')}
          value={5}
          icon={Calendar}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Internal Average"
          value="85%"
          change={5}
          icon={BarChart3}
          iconColor="text-success"
          iconBg="bg-success/10"
        />
        <StatCard
          title={t('attendance')}
          value="92%"
          change={2}
          icon={CheckSquare}
          iconColor="text-warning"
          iconBg="bg-warning/10"
        />
        <StatCard
          title="CGPA"
          value="8.5"
          icon={FileText}
          iconColor="text-accent"
          iconBg="bg-accent/10"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Exams */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{t('upcomingExams')}</h3>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingExams.slice(0, 4).map((exam, idx) => (
              <ExamCard key={idx} {...exam} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">{t('quickActions')}</h3>
          <div className="bg-card rounded-xl border border-border/50 p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 h-12">
              <Download className="h-5 w-5 text-primary" />
              Download Hall Ticket
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12">
              <BookOpen className="h-5 w-5 text-success" />
              View Syllabus
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12">
              <BarChart3 className="h-5 w-5 text-accent" />
              Check Results
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12">
              <Calendar className="h-5 w-5 text-warning" />
              Academic Calendar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{t('recentResults')}</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentResults.map((result, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{result.subject}</p>
                  <p className="text-sm text-muted-foreground">{result.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{result.grade}</p>
                  <p className="text-sm text-muted-foreground">{result.marks}/{result.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Attendance Overview</h3>
          <div className="space-y-4">
            {[
              { subject: 'Data Structures', attendance: 95 },
              { subject: 'Database Systems', attendance: 88 },
              { subject: 'Computer Networks', attendance: 92 },
              { subject: 'Web Technologies', attendance: 90 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{item.subject}</span>
                  <span className="text-muted-foreground">{item.attendance}%</span>
                </div>
                <Progress value={item.attendance} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications/Reminders */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Upcoming Deadline</h4>
            <p className="text-muted-foreground text-sm mb-2">
              Assignment submission for CS301 - Data Structures is due in 3 days.
            </p>
            <Button variant="outline" size="sm">View Details</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
