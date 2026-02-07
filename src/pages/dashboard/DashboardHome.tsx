import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, CheckSquare, BarChart3, Users, Upload, MapPin, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { exams, results, notifications } = useData();
  const { user } = useAuth();

  const studentResults = results.filter(r => r.studentId === user?.id);
  const avgMarks = studentResults.length > 0
    ? Math.round(studentResults.reduce((a, b) => a + b.obtainedMarks, 0) / studentResults.length)
    : 0;

  const stats = [
    { label: 'Upcoming Exams', value: exams.filter(e => e.status === 'Scheduled').length.toString(), icon: Calendar, href: '/dashboard/schedule', color: 'text-blue-600' },
    { label: 'Average Marks', value: `${avgMarks}%`, icon: BarChart3, href: '/dashboard/result-analysis', color: 'text-green-600' },
    { label: 'Attendance', value: '94%', icon: CheckSquare, href: '/dashboard/attendance', color: 'text-orange-600' },
    { label: 'Notifications', value: notifications.length.toString(), icon: Bell, href: '/dashboard/notifications', color: 'text-red-600' },
  ];

  const upcomingExams = exams.filter(e => e.status === 'Scheduled').slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Exams</CardTitle>
          <CardDescription>Your next scheduled examinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingExams.length > 0 ? upcomingExams.map((exam, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{exam.subject}</p>
                  <p className="text-sm text-muted-foreground">{exam.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{exam.date}</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{exam.type}</span>
                </div>
              </div>
            )) : <p className="text-center py-4 text-muted-foreground">No upcoming exams found.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FacultyDashboard: React.FC = () => {
  const { students, notifications } = useData();

  const stats = [
    { label: 'My Students', value: students.length.toString(), icon: Users, href: '/dashboard/students', color: 'text-blue-600' },
    { label: 'Pending Marks', value: '3', icon: Upload, href: '/dashboard/mark-entry', color: 'text-orange-600' },
    { label: 'Invigilation', value: '2', icon: MapPin, href: '/dashboard/invigilation', color: 'text-green-600' },
    { label: 'Notifications', value: notifications.length.toString(), icon: Bell, href: '/dashboard/notifications', color: 'text-red-600' },
  ];

  const pendingTasks = [
    { task: 'Submit CAT-1 Marks for CS301', deadline: 'Dec 10, 2024', status: 'Urgent' },
    { task: 'Upload Question Paper for CS302', deadline: 'Dec 12, 2024', status: 'Pending' },
    { task: 'Invigilation Duty - Hall A', deadline: 'Dec 15, 2024', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Tasks</CardTitle>
          <CardDescription>Tasks that need your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingTasks.map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-muted-foreground">Due: {task.deadline}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${task.status === 'Urgent' ? 'bg-red-100 text-red-700' :
                    task.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                  }`}>{task.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { students, exams, halls, results } = useData();

  const stats = [
    { label: 'Total Students', value: students.length.toString(), icon: Users, href: '/dashboard/users', color: 'text-blue-600' },
    { label: 'Active Exams', value: exams.filter(e => e.status !== 'Completed').length.toString(), icon: Calendar, href: '/dashboard/manage-exams', color: 'text-green-600' },
    { label: 'Halls Allocated', value: halls.filter(h => h.allocated > 0).length.toString(), icon: MapPin, href: '/dashboard/hall-allocation', color: 'text-orange-600' },
    { label: 'Results Pending', value: '4', icon: BarChart3, href: '/dashboard/results', color: 'text-red-600' },
  ];

  const recentActivity = [
    { action: 'CAT-1 schedule published', time: '2 hours ago' },
    { action: 'Hall allocation completed for Dec exams', time: '5 hours ago' },
    { action: 'Results published for CS201', time: '1 day ago' },
    { action: 'New student batch registered', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <p className="font-medium">{item.action}</p>
                <p className="text-sm text-muted-foreground">{item.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'student':
      return <StudentDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <StudentDashboard />;
  }
};

export default DashboardHome;

