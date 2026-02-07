import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Shield, 
  Users,
  ArrowRight
} from 'lucide-react';

const roles = [
  {
    id: 'student',
    icon: GraduationCap,
    titleKey: 'student' as const,
    description: 'View schedules, download hall tickets, check results',
    features: ['Exam Timetable', 'Hall Tickets', 'Internal Marks', 'Attendance', 'Results'],
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
  },
  {
    id: 'faculty',
    icon: BookOpen,
    titleKey: 'faculty' as const,
    description: 'Manage marks, upload question papers, track tasks',
    features: ['Mark Entry', 'Question Papers', 'Invigilation', 'Student Reports', 'Tasks'],
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
  },
  {
    id: 'hod',
    icon: Building2,
    titleKey: 'hod' as const,
    description: 'Oversee department operations and analytics',
    features: ['Department Stats', 'Faculty Tasks', 'Performance Analytics', 'Approvals'],
    color: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
  },
  {
    id: 'admin',
    icon: Shield,
    titleKey: 'admin' as const,
    description: 'Full system administration and configuration',
    features: ['User Management', 'System Config', 'Audit Logs', 'Reports'],
    color: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50',
  },
  {
    id: 'coe',
    icon: Users,
    titleKey: 'coe' as const,
    description: 'Complete exam operations management',
    features: ['Exam Scheduling', 'Hall Allocation', 'Result Processing', 'Notifications'],
    color: 'from-rose-500 to-rose-600',
    bgLight: 'bg-rose-50',
  },
];

export const RoleCards: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary mb-2 block">Role-Based Access</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tailored Experience for Everyone
          </h2>
          <p className="text-muted-foreground">
            Each role has a customized dashboard with relevant features and permissions.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${role.color} p-6`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <role.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t(role.titleKey)}</h3>
                    <p className="text-white/80 text-sm">Portal</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-muted-foreground text-sm mb-4">
                  {role.description}
                </p>

                {/* Features List */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {role.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-3 py-1 rounded-full ${role.bgLight} text-foreground/80`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <Link to={`/login?role=${role.id}`}>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Access Portal
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
