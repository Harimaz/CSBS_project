import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ExamSchedule from "./pages/dashboard/ExamSchedule";
import ExamCalendar from "./pages/dashboard/ExamCalendar";
import HallTicket from "./pages/dashboard/HallTicket";
import Syllabus from "./pages/dashboard/Syllabus";
import Timetable from "./pages/dashboard/Timetable";
import InternalMarks from "./pages/dashboard/InternalMarks";
import Attendance from "./pages/dashboard/Attendance";
import Results from "./pages/dashboard/Results";
import ResultAnalysis from "./pages/dashboard/ResultAnalysis";
import MarkEntry from "./pages/dashboard/MarkEntry";
import Students from "./pages/dashboard/Students";
import Invigilation from "./pages/dashboard/Invigilation";
import ManageUsers from "./pages/dashboard/ManageUsers";
import HallAllocation from "./pages/dashboard/HallAllocation";
import ManageExams from "./pages/dashboard/ManageExams";
import PaperSetting from "./pages/dashboard/PaperSetting";
import Scrutiny from "./pages/dashboard/Scrutiny";
import Circulars from "./pages/dashboard/Circulars";
import ParentNotifications from "./pages/dashboard/ParentNotifications";
import Notifications from "./pages/dashboard/Notifications";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="schedule" element={<ExamSchedule />} />
              <Route path="calendar" element={<ExamCalendar />} />
              <Route path="hall-ticket" element={<HallTicket />} />
              <Route path="syllabus" element={<Syllabus />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="internal-marks" element={<InternalMarks />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="results" element={<Results />} />
              <Route path="result-analysis" element={<ResultAnalysis />} />
              <Route path="mark-entry" element={<MarkEntry />} />
              <Route path="students" element={<Students />} />
              <Route path="invigilation" element={<Invigilation />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="hall-allocation" element={<HallAllocation />} />
              <Route path="manage-exams" element={<ManageExams />} />
              <Route path="paper-setting" element={<PaperSetting />} />
              <Route path="scrutiny" element={<Scrutiny />} />
              <Route path="circulars" element={<Circulars />} />
              <Route path="parent-notifications" element={<ParentNotifications />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
