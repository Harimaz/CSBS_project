import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  BarChart3,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building,
  ArrowRight,
} from 'lucide-react';

const examOverview = [
  { type: 'CAT-1', scheduled: 45, completed: 38, pending: 7 },
  { type: 'CAT-2', scheduled: 45, completed: 0, pending: 45 },
  { type: 'Semester', scheduled: 120, completed: 0, pending: 120 },
  { type: 'Lab', scheduled: 30, completed: 25, pending: 5 },
];

const hallAllocation = [
  { hall: 'Hall A', capacity: 100, allocated: 95, exam: 'CS301 - Data Structures' },
  { hall: 'Hall B', capacity: 80, allocated: 78, exam: 'CS302 - DBMS' },
  { hall: 'Hall C', capacity: 120, allocated: 110, exam: 'CS303 - Networks' },
  { hall: 'Lab 1', capacity: 40, allocated: 38, exam: 'CS304L - Web Lab' },
];

const recentActivities = [
  { action: 'Hall allocation completed for CAT-1', time: '2 hours ago', type: 'success' },
  { action: 'Results published for CS201', time: '4 hours ago', type: 'success' },
  { action: 'Pending invigilation assignment', time: '6 hours ago', type: 'warning' },
  { action: 'New exam schedule uploaded', time: '1 day ago', type: 'info' },
];

const COEDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Exams"
          value={240}
          icon={Calendar}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Halls Allocated"
          value={15}
          icon={Building}
          iconColor="text-success"
          iconBg="bg-success/10"
        />
        <StatCard
          title="Invigilators"
          value={85}
          change={12}
          icon={Users}
          iconColor="text-warning"
          iconBg="bg-warning/10"
        />
        <StatCard
          title="Results Pending"
          value={12}
          icon={FileText}
          iconColor="text-accent"
          iconBg="bg-accent/10"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Exam Overview */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Exam Overview</h3>
            <Button variant="ghost" size="sm">
              Manage <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header text-left py-3 px-4">Exam Type</th>
                  <th className="table-header text-center py-3 px-4">Scheduled</th>
                  <th className="table-header text-center py-3 px-4">Completed</th>
                  <th className="table-header text-center py-3 px-4">Pending</th>
                  <th className="table-header text-center py-3 px-4">Progress</th>
                </tr>
              </thead>
              <tbody>
                {examOverview.map((exam, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-4 px-4 font-medium text-foreground">{exam.type}</td>
                    <td className="py-4 px-4 text-center text-muted-foreground">{exam.scheduled}</td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant="outline" className="badge-success">{exam.completed}</Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant="outline" className="badge-warning">{exam.pending}</Badge>
                    </td>
                    <td className="py-4 px-4 w-32">
                      <Progress value={(exam.completed / exam.scheduled) * 100} className="h-2" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {activity.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                ) : activity.type === 'warning' ? (
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                ) : (
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                )}
                <div>
                  <p className="text-sm text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hall Allocation Status */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Hall Allocation Status</h3>
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            Manage Halls
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hallAllocation.map((hall, idx) => (
            <div key={idx} className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{hall.hall}</h4>
                <Badge variant="outline" className={
                  (hall.allocated / hall.capacity) > 0.9 ? 'badge-danger' : 'badge-success'
                }>
                  {hall.allocated}/{hall.capacity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{hall.exam}</p>
              <Progress value={(hall.allocated / hall.capacity) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-5 gap-4">
        <Button variant="hero" className="h-20 flex-col gap-2">
          <Calendar className="h-6 w-6" />
          <span>Schedule Exam</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span>Allocate Halls</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Users className="h-6 w-6 text-success" />
          <span>Assign Invigilators</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <FileText className="h-6 w-6 text-warning" />
          <span>Publish Results</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Bell className="h-6 w-6 text-accent" />
          <span>Send Notifications</span>
        </Button>
      </div>

      {/* Analytics Preview */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground text-sm">
              View detailed analytics including pass percentages, subject-wise performance, and prediction reports.
            </p>
          </div>
          <Button variant="hero">
            <BarChart3 className="h-5 w-5 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default COEDashboard;
