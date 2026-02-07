import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  department: string;
  year: number;
  status: 'Active' | 'Inactive';
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  empId: string;
  department: string;
  subjects: string[];
  status: 'Active' | 'Inactive';
}

export interface Exam {
  id: string;
  subject: string;
  code: string;
  date: string;
  time: string;
  venue: string;
  type: 'CAT-1' | 'CAT-2' | 'Semester' | 'Lab';
  status: 'Scheduled' | 'Ongoing' | 'Completed';
  department: string;
}

export interface Hall {
  id: string;
  name: string;
  capacity: number;
  allocated: number;
  exam: string;
  invigilators: string[];
  students: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  read: boolean;
  forRoles: ('student' | 'faculty' | 'admin')[];
}

export interface Result {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  subjectCode: string;
  subjectName: string;
  examType: string;
  obtainedMarks: number;
  maxMarks: number;
  isPass: boolean;
  year: number;
  grade: string;
}

export interface Circular {
  id: string;
  title: string;
  body: string;
  date: string;
  createdBy: string;
  isApproved: boolean;
  showToStudents: boolean;
}

export interface Syllabus {
  id: string;
  subjectCode: string;
  subjectName: string;
  year: number;
  semester: number;
  content: string;
  fileUrl?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  subjectCode: string;
  date: string;
  status: 'Present' | 'Absent';
}

export interface Invigilation {
  id: string;
  facultyId: string;
  facultyName: string;
  examId: string;
  examName: string;
  hallName: string;
  role: 'Invigilator' | 'Reliever' | 'Hall Superintendent';
}

interface DataContextType {
  students: Student[];
  faculty: Faculty[];
  exams: Exam[];
  halls: Hall[];
  notifications: Notification[];
  results: Result[];
  circulars: Circular[];
  syllabi: Syllabus[];
  attendance: Attendance[];
  invigilation: Invigilation[];

  // CRUD Methods
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
  updateFaculty: (id: string, faculty: Partial<Faculty>) => void;
  deleteFaculty: (id: string) => void;

  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  updateHall: (id: string, hall: Partial<Hall>) => void;
  autoAllocateHalls: (examId: string) => void;

  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;

  addResult: (result: Omit<Result, 'id'>) => void;
  importResults: (data: Record<string, any>[]) => void;

  addCircular: (circular: Omit<Circular, 'id'>) => void;
  updateCircular: (id: string, circular: Partial<Circular>) => void;
  deleteCircular: (id: string) => void;

  addSyllabus: (syllabus: Omit<Syllabus, 'id'>) => void;

  bulkMarkAttendance: (attendanceData: Omit<Attendance, 'id'>[]) => void;

  importStudents: (data: Record<string, any>[]) => void;
  importFaculty: (data: Record<string, any>[]) => void;
  importExams: (data: Record<string, any>[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Data
const initialStudents: Student[] = [
  { id: '1', name: 'Arun Kumar', email: 'arun@student.edu', rollNo: 'CS2021001', department: 'CSBS', year: 3, status: 'Active' },
  { id: '2', name: 'Priya Sharma', email: 'priya@student.edu', rollNo: 'CS2021002', department: 'CSBS', year: 3, status: 'Active' },
  { id: '3', name: 'Rahul Menon', email: 'rahul@student.edu', rollNo: 'CS2021003', department: 'CSBS', year: 3, status: 'Active' },
  { id: '4', name: 'Sneha Reddy', email: 'sneha@student.edu', rollNo: 'CS2021004', department: 'CSBS', year: 3, status: 'Active' },
];

const initialFaculty: Faculty[] = [
  { id: 'fac1', name: 'Dr. S. Ramesh', email: 'ramesh@faculty.edu', empId: 'FAC001', department: 'CSBS', subjects: ['CS301', 'CS302'], status: 'Active' },
  { id: 'fac2', name: 'Ms. G. Anitha', email: 'anitha@faculty.edu', empId: 'FAC002', department: 'CSBS', subjects: ['CS102'], status: 'Active' },
];

const initialExams: Exam[] = [
  { id: 'e1', subject: 'Data Structures', code: 'CS102', date: '2024-12-15', time: '10:00', venue: 'Hall A', type: 'CAT-1', status: 'Scheduled', department: 'CSBS' },
  { id: 'e2', subject: 'Database Systems', code: 'CS201', date: '2024-12-16', time: '14:00', venue: 'Hall B', type: 'CAT-1', status: 'Scheduled', department: 'CSBS' },
  { id: 'e3', subject: 'Cloud Computing', code: 'CS304', date: '2024-12-17', time: '10:00', venue: 'Hall A', type: 'CAT-1', status: 'Scheduled', department: 'CSBS' },
];

const initialResults: Result[] = [
  { id: 'r1', studentId: '1', studentName: 'Arun Kumar', studentRollNo: 'CS2021001', subjectCode: 'CS201', subjectName: 'DBMS', examType: 'CAT-1', obtainedMarks: 45, maxMarks: 50, isPass: true, year: 2, grade: 'A+' },
  { id: 'r2', studentId: '2', studentName: 'Priya Sharma', studentRollNo: 'CS2021002', subjectCode: 'CS201', subjectName: 'DBMS', examType: 'CAT-1', obtainedMarks: 42, maxMarks: 50, isPass: true, year: 2, grade: 'A' },
  { id: 'r3', studentId: '1', studentName: 'Arun Kumar', studentRollNo: 'CS2021001', subjectCode: 'CS102', subjectName: 'DS', examType: 'Semester', obtainedMarks: 85, maxMarks: 100, isPass: true, year: 1, grade: 'O' },
];

const initialCirculars: Circular[] = [
  { id: 'c1', title: 'CAT-1 Exam Instructions', body: 'All students are requested to be present 15 mins before the exam.', date: '2024-12-10', createdBy: 'Admin', isApproved: true, showToStudents: true },
  { id: 'c2', title: 'Revision Classes Schedule', body: 'Special sessions for Data Structures starting next Monday.', date: '2024-12-08', createdBy: 'Faculty', isApproved: true, showToStudents: true },
];

const initialHalls: Hall[] = [
  { id: 'h1', name: 'Hall A', capacity: 100, allocated: 0, exam: '', invigilators: [], students: [] },
  { id: 'h2', name: 'Hall B', capacity: 80, allocated: 0, exam: '', invigilators: [], students: [] },
];

const initialNotifications: Notification[] = [
  { id: 'n1', title: 'Welcome to COE Portal', message: 'You have successfully logged into the TCE COE Portal.', type: 'info', date: '2024-12-01', read: false, forRoles: ['student', 'faculty', 'admin'] },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [faculty, setFaculty] = useState<Faculty[]>(initialFaculty);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [halls, setHalls] = useState<Hall[]>(initialHalls);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [results, setResults] = useState<Result[]>(initialResults);
  const [circulars, setCirculars] = useState<Circular[]>(initialCirculars);
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [invigilation, setInvigilation] = useState<Invigilation[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // CRUD Methods
  const addStudent = (student: Omit<Student, 'id'>) => setStudents(prev => [...prev, { ...student, id: generateId() }]);
  const updateStudent = (id: string, s: Partial<Student>) => setStudents(prev => prev.map(item => item.id === id ? { ...item, ...s } : item));
  const deleteStudent = (id: string) => setStudents(prev => prev.filter(item => item.id !== id));

  const addFaculty = (fac: Omit<Faculty, 'id'>) => setFaculty(prev => [...prev, { ...fac, id: generateId() }]);
  const updateFaculty = (id: string, f: Partial<Faculty>) => setFaculty(prev => prev.map(item => item.id === id ? { ...item, ...f } : item));
  const deleteFaculty = (id: string) => setFaculty(prev => prev.filter(item => item.id !== id));

  const addExam = (exam: Omit<Exam, 'id'>) => setExams(prev => [...prev, { ...exam, id: generateId() }]);
  const updateExam = (id: string, e: Partial<Exam>) => setExams(prev => prev.map(item => item.id === id ? { ...item, ...e } : item));
  const deleteExam = (id: string) => setExams(prev => prev.filter(item => item.id !== id));

  const updateHall = (id: string, h: Partial<Hall>) => setHalls(prev => prev.map(item => item.id === id ? { ...item, ...h } : item));

  const autoAllocateHalls = (examId: string) => {
    // Basic mock implementation
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;
    const allocated = students.filter(s => s.department === exam.department).slice(0, 10).map(s => s.rollNo);
    setHalls(prev => prev.map(h => h.id === 'h1' ? { ...h, exam: exam.subject, allocated: allocated.length, students: allocated } : h));
  };

  const addNotification = (n: Omit<Notification, 'id'>) => setNotifications(prev => [{ ...n, id: generateId() }, ...prev]);
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const addResult = (res: Omit<Result, 'id'>) => setResults(prev => [...prev, { ...res, id: generateId() }]);
  const importResults = (data: Record<string, any>[]) => {
    const newResults = data.map(row => ({
      id: generateId(),
      studentId: row.studentId || 'unknown',
      studentName: row.name || 'Unknown',
      studentRollNo: row.rollNo || 'N/A',
      subjectCode: row.code || 'N/A',
      subjectName: row.subject || 'N/A',
      examType: row.type || 'Terminal',
      obtainedMarks: parseInt(row.marks || '0'),
      maxMarks: 100,
      isPass: parseInt(row.marks || '0') >= 40,
      year: 1,
      grade: 'B'
    }));
    setResults(prev => [...prev, ...newResults]);
  };

  const addCircular = (c: Omit<Circular, 'id'>) => setCirculars(prev => [...prev, { ...c, id: generateId() }]);
  const updateCircular = (id: string, c: Partial<Circular>) => setCirculars(prev => prev.map(item => item.id === id ? { ...item, ...c } : item));
  const deleteCircular = (id: string) => setCirculars(prev => prev.filter(item => item.id !== id));

  const addSyllabus = (s: Omit<Syllabus, 'id'>) => setSyllabi(prev => [...prev, { ...s, id: generateId() }]);

  const bulkMarkAttendance = (data: Omit<Attendance, 'id'>[]) => setAttendance(prev => [...prev, ...data.map(a => ({ ...a, id: generateId() }))]);

  const importStudents = (data: Record<string, any>[]) => {
    const newStudents: Student[] = data.map(row => ({
      id: generateId(),
      name: row.Name || 'New Student',
      email: row.Email || 'student@tce.edu',
      rollNo: row.RollNo || 'N/A',
      department: 'CSBS',
      year: 1,
      status: 'Active' as const
    }));
    setStudents(prev => [...prev, ...newStudents]);
  };

  const importFaculty = (data: Record<string, any>[]) => {
    const newFaculty: Faculty[] = data.map(row => ({
      id: generateId(),
      name: row.Name || 'New Faculty',
      email: row.Email || 'faculty@tce.edu',
      empId: row.EmpID || 'N/A',
      department: 'CSBS',
      subjects: [],
      status: 'Active' as const
    }));
    setFaculty(prev => [...prev, ...newFaculty]);
  };

  const importExams = (data: Record<string, any>[]) => {
    const newExams: Exam[] = data.map(row => ({
      id: generateId(),
      subject: row.Subject || 'New Exam',
      code: row.Code || 'CS000',
      date: '2024-12-25',
      time: '10:00',
      venue: 'Exam Hall',
      type: (row.Type || 'CAT-1') as Exam['type'],
      status: 'Scheduled' as const,
      department: 'CSBS'
    }));
    setExams(prev => [...prev, ...newExams]);
  };

  return (
    <DataContext.Provider value={{
      students, faculty, exams, halls, notifications, results, circulars, syllabi, attendance, invigilation,
      addStudent, updateStudent, deleteStudent,
      addFaculty, updateFaculty, deleteFaculty,
      addExam, updateExam, deleteExam,
      updateHall, autoAllocateHalls,
      addNotification, markNotificationRead,
      addResult, importResults,
      addCircular, updateCircular, deleteCircular,
      addSyllabus, bulkMarkAttendance,
      importStudents, importFaculty, importExams
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

