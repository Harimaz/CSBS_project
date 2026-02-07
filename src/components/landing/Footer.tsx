import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{t('appName')}</h3>
              </div>
            </div>
            <p className="text-sidebar-foreground/70 text-sm mb-4">
              {t('appDescription')}
            </p>
            <p className="text-sidebar-foreground/50 text-xs">
              © 2024 COE Portfolio. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Student Portal</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Faculty Portal</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Exam Schedule</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Results</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Downloads</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">User Guide</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t('contact')}</h4>
            <ul className="space-y-3 text-sm text-sidebar-foreground/70">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>coe@university.edu</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 44 1234 5678</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Controller of Examinations Office,<br />University Campus</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
