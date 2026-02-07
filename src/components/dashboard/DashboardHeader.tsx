import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-foreground">
              {t('welcomeBack')}, {user?.name.split(' ')[0]}!
            </h2>
            <p className="text-sm text-muted-foreground">{user?.department || 'COE Office'}</p>
          </div>
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('search')}
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
};
