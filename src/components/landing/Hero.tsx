import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Shield, BarChart3 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Trusted by 50+ Institutions
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/login">
                <Button variant="hero" size="xl">
                  {t('getStarted')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="heroOutline" size="xl">
                {t('learnMore')}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-3xl font-bold text-foreground">50+</h3>
                <p className="text-sm text-muted-foreground">Institutions</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-foreground">100K+</h3>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-foreground">99.9%</h3>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative animate-slide-up">
            <div className="relative z-10 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Dashboard Mock */}
              <div className="bg-sidebar p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Student Dashboard</h3>
                  <span className="text-xs text-muted-foreground">Dec 2024</span>
                </div>
                
                {/* Mini Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-coe-blue-light p-4 rounded-xl">
                    <BookOpen className="h-5 w-5 text-primary mb-2" />
                    <p className="text-2xl font-bold text-foreground">5</p>
                    <p className="text-xs text-muted-foreground">Upcoming Exams</p>
                  </div>
                  <div className="bg-coe-red-light p-4 rounded-xl">
                    <BarChart3 className="h-5 w-5 text-accent mb-2" />
                    <p className="text-2xl font-bold text-foreground">85%</p>
                    <p className="text-xs text-muted-foreground">Average Score</p>
                  </div>
                </div>

                {/* Mini Table */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm font-medium mb-3">Recent Results</p>
                  <div className="space-y-2">
                    {[
                      { subject: 'Data Structures', grade: 'A' },
                      { subject: 'Database Systems', grade: 'A+' },
                      { subject: 'Computer Networks', grade: 'B+' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.subject}</span>
                        <span className="font-medium text-foreground">{item.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-lg border border-border animate-pulse-slow">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border border-border animate-pulse-slow">
              <Shield className="h-6 w-6 text-success" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
