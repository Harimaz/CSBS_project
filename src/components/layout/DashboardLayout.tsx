import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/schedule': 'Exam Schedule',
    '/dashboard/calendar': 'Exam Calendar',
    '/dashboard/hall-ticket': 'Hall Ticket',
    '/dashboard/syllabus': 'Syllabus',
    '/dashboard/internal-marks': 'Internal Marks',
    '/dashboard/attendance': 'Attendance',
    '/dashboard/results': 'Results',
    '/dashboard/mark-entry': 'Mark Entry',
    '/dashboard/students': 'Students',
    '/dashboard/invigilation': 'Invigilation',
    '/dashboard/users': 'Manage Users',
    '/dashboard/hall-allocation': 'Hall Allocation',
    '/dashboard/manage-exams': 'Manage Exams',
    '/dashboard/paper-setting': 'Paper Setting',
    '/dashboard/scrutiny': 'Scrutiny',
    '/dashboard/notifications': 'Notifications',
    '/dashboard/settings': 'Settings',
  };
  return routes[pathname] || 'Dashboard';
};

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle(location.pathname)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto text-sm text-muted-foreground">
            Welcome, {user?.name}
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
