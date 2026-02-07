import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { NavLink } from '@/components/NavLink';
import collegeLogo from '@/assets/college-logo.jpg';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  ClipboardList,
  CheckSquare,
  BarChart3,
  Users,
  MapPin,
  Bell,
  Settings,
  LogOut,
  Upload,
  BookOpen,
  CalendarDays,
  FileEdit,
  Search,
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: ['student', 'faculty', 'admin'] },
  { icon: CalendarDays, label: 'Exam Calendar', href: '/dashboard/calendar', roles: ['student', 'faculty', 'admin'] },
  { icon: Calendar, label: 'Exam Schedule', href: '/dashboard/schedule', roles: ['student', 'faculty', 'admin'] },
  { icon: BookOpen, label: 'Timetable', href: '/dashboard/timetable', roles: ['student', 'faculty', 'admin'] },
  { icon: FileText, label: 'Hall Ticket', href: '/dashboard/hall-ticket', roles: ['student'] },
  { icon: BookOpen, label: 'Syllabus', href: '/dashboard/syllabus', roles: ['student', 'faculty', 'admin'] },
  { icon: ClipboardList, label: 'Internal Marks', href: '/dashboard/internal-marks', roles: ['student'] },
  { icon: CheckSquare, label: 'Attendance', href: '/dashboard/attendance', roles: ['student'] },
  { icon: BarChart3, label: 'Results', href: '/dashboard/results', roles: ['student', 'admin'] },
  { icon: BarChart3, label: 'Result Analysis', href: '/dashboard/result-analysis', roles: ['student', 'faculty', 'admin'] },
  { icon: Upload, label: 'Mark Entry', href: '/dashboard/mark-entry', roles: ['faculty'] },
  { icon: Users, label: 'Students', href: '/dashboard/students', roles: ['faculty', 'admin'] },
  { icon: MapPin, label: 'Invigilation', href: '/dashboard/invigilation', roles: ['faculty', 'admin'] },
  { icon: FileEdit, label: 'Paper Setting', href: '/dashboard/paper-setting', roles: ['faculty', 'admin'] },
  { icon: Search, label: 'Scrutiny', href: '/dashboard/scrutiny', roles: ['faculty', 'admin'] },
  { icon: FileText, label: 'Circulars', href: '/dashboard/circulars', roles: ['student', 'faculty', 'admin'] },
  { icon: Users, label: 'Manage Users', href: '/dashboard/users', roles: ['admin'] },
  { icon: MapPin, label: 'Hall Allocation', href: '/dashboard/hall-allocation', roles: ['admin'] },
  { icon: Calendar, label: 'Manage Exams', href: '/dashboard/manage-exams', roles: ['admin'] },
  { icon: Bell, label: 'Parent Notifications', href: '/dashboard/parent-notifications', roles: ['admin'] },
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications', roles: ['student', 'faculty', 'admin'] },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', roles: ['student', 'faculty', 'admin'] },
];

export const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header with Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img 
            src={collegeLogo} 
            alt="TCE Logo" 
            className="w-10 h-10 rounded-lg object-contain bg-white flex-shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-semibold text-sm text-sidebar-foreground leading-tight">TCE - COE Portal</h1>
              <p className="text-[10px] text-sidebar-foreground/60 italic">where quality and ethics matter</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                    <NavLink to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-xs font-medium text-sidebar-foreground">{user.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'sm'}
          className="w-full text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
