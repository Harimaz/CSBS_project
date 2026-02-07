import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Calendar, 
  MapPin, 
  BarChart3, 
  Bell, 
  FileText, 
  Users, 
  Shield, 
  Clock 
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    titleKey: 'examManagement' as const,
    descKey: 'examManagementDesc' as const,
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: MapPin,
    titleKey: 'hallAllocationFeature' as const,
    descKey: 'hallAllocationDesc' as const,
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: BarChart3,
    titleKey: 'resultsAnalytics' as const,
    descKey: 'resultsAnalyticsDesc' as const,
    color: 'bg-success/10 text-success',
  },
  {
    icon: Bell,
    titleKey: 'smartNotifications' as const,
    descKey: 'smartNotificationsDesc' as const,
    color: 'bg-warning/10 text-warning',
  },
];

const additionalFeatures = [
  { icon: FileText, title: 'Digital Syllabus', desc: 'Access course materials anytime' },
  { icon: Users, title: 'Multi-Role Support', desc: 'Students, Faculty, HoD, Admin, COE' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security' },
  { icon: Clock, title: 'Real-time Updates', desc: 'Instant notifications & alerts' },
];

export const Features: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary mb-2 block">{t('features')}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Manage Examinations
          </h2>
          <p className="text-muted-foreground">
            Comprehensive tools for exam scheduling, hall allocation, result processing, and more.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="stat-card group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {additionalFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
