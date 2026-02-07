import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Calendar, FileText, BarChart3, Users, MapPin, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    { icon: Calendar, title: 'Exam Scheduling', description: 'Manage CAT, semester, and lab exam schedules' },
    { icon: FileText, title: 'Hall Tickets', description: 'Generate and download examination hall tickets' },
    { icon: BarChart3, title: 'Results & Marks', description: 'View internal marks and examination results' },
    { icon: MapPin, title: 'Hall Allocation', description: 'Automated seating arrangement system' },
    { icon: Users, title: 'User Management', description: 'Manage students, faculty, and admin users' },
    { icon: GraduationCap, title: 'Attendance Tracking', description: 'Monitor and track student attendance' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">COE Portal</span>
          </div>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Controller of Examinations Portal
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            A simple and efficient platform for managing all examination operations. 
            For students, faculty, and administrators.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">User Roles</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Student</h3>
                <p className="text-sm text-muted-foreground">
                  View schedules, download hall tickets, check marks and results
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Faculty</h3>
                <p className="text-sm text-muted-foreground">
                  Enter marks, view students, manage invigilation duties
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Admin</h3>
                <p className="text-sm text-muted-foreground">
                  Manage users, schedule exams, allocate halls, publish results
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 COE Portal. Controller of Examinations Management System.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
