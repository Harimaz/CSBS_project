// Complete CSBS Department Syllabus - All 8 Semesters

export interface CSBSSubject {
  code: string;
  name: string;
  credits: number;
  type: 'theory' | 'lab' | 'project' | 'other';
}

export interface CSBSSemester {
  semester: number;
  year: number;
  subjects: CSBSSubject[];
}

export const csbsSyllabus: CSBSSemester[] = [
  {
    semester: 1,
    year: 1,
    subjects: [
      { code: '20CB110', name: 'Discrete Mathematics', credits: 4, type: 'theory' },
      { code: '20CB120', name: 'Introductory Topics in Statistics, Probability & Calculus', credits: 3, type: 'theory' },
      { code: '20CB130', name: 'Fundamentals of Computer Science', credits: 3, type: 'theory' },
      { code: '20CB140', name: 'Principles of Electrical Engineering', credits: 2, type: 'theory' },
      { code: '20CB150', name: 'Business Communication & Value Science – I', credits: 2, type: 'theory' },
      { code: '20CB160', name: 'Fundamentals of Physics', credits: 3, type: 'theory' },
      { code: '20CB170', name: 'Fundamentals of Computer Science Lab', credits: 2, type: 'lab' },
      { code: '20CB180', name: 'Principles of Electrical Engineering Lab', credits: 1, type: 'lab' },
    ],
  },
  {
    semester: 2,
    year: 1,
    subjects: [
      { code: '20CB210', name: 'Linear Algebra', credits: 4, type: 'theory' },
      { code: '20CB220', name: 'Statistical Methods', credits: 4, type: 'theory' },
      { code: '20CB230', name: 'Data Structures and Algorithms', credits: 4, type: 'theory' },
      { code: '20CB240', name: 'Principles of Electronics', credits: 2, type: 'theory' },
      { code: '20CB250', name: 'Fundamentals of Economics', credits: 2, type: 'theory' },
      { code: '20CB260', name: 'Business Communication & Value Science – II', credits: 2, type: 'theory' },
      { code: '20CB270', name: 'Data Structures and Algorithms Lab', credits: 2, type: 'lab' },
      { code: '20CB280', name: 'Principles of Electronics Lab', credits: 1, type: 'lab' },
      { code: '18ES290', name: 'Lateral Thinking', credits: 1, type: 'other' },
      { code: '18CHAA0', name: 'Environmental Sciences', credits: 0, type: 'other' },
    ],
  },
  {
    semester: 3,
    year: 2,
    subjects: [
      { code: '20CB310', name: 'Computer Organization & Architecture', credits: 3, type: 'theory' },
      { code: '20CB320', name: 'Object Oriented Programming', credits: 2, type: 'theory' },
      { code: '20CB330', name: 'Computational Statistics', credits: 3, type: 'theory' },
      { code: '20CB340', name: 'Software Engineering', credits: 3, type: 'theory' },
      { code: '20CB350', name: 'Formal Languages and Automata Theory', credits: 3, type: 'theory' },
      { code: '20CB360', name: 'COA Lab', credits: 2, type: 'lab' },
      { code: '20CB370', name: 'OOP Lab', credits: 2, type: 'lab' },
      { code: '20CB380', name: 'Computational Statistics Lab', credits: 1, type: 'lab' },
      { code: '20CB390', name: 'Software Engineering Lab', credits: 1, type: 'lab' },
      { code: '18CHAB0', name: 'Constitution of India', credits: 0, type: 'other' },
    ],
  },
  {
    semester: 4,
    year: 2,
    subjects: [
      { code: '20CB410', name: 'Operating Systems', credits: 3, type: 'theory' },
      { code: '20CB420', name: 'Database Management Systems', credits: 3, type: 'theory' },
      { code: '20CB430', name: 'Innovation, IP Management & Entrepreneurship', credits: 3, type: 'theory' },
      { code: '20CB440', name: 'Marketing Research & Marketing Management', credits: 2, type: 'theory' },
      { code: '20YYFX0', name: 'Foundation Elective', credits: 3, type: 'theory' },
      { code: '20CB460', name: 'Software Design with UML', credits: 3, type: 'theory' },
      { code: '20CB470', name: 'Design Thinking', credits: 3, type: 'theory' },
      { code: '20CB480', name: 'OS Lab', credits: 1, type: 'lab' },
      { code: '20CB490', name: 'DBMS Lab', credits: 1, type: 'lab' },
    ],
  },
  {
    semester: 5,
    year: 3,
    subjects: [
      { code: '20CB510', name: 'Design & Analysis of Algorithms', credits: 3, type: 'theory' },
      { code: '20CB520', name: 'Compiler Design', credits: 3, type: 'theory' },
      { code: '20CB530', name: 'Fundamentals of Management', credits: 2, type: 'theory' },
      { code: '20CB540', name: 'Business Strategy', credits: 2, type: 'theory' },
      { code: '20CB550', name: 'Business Communication & Value Science – III', credits: 2, type: 'theory' },
      { code: '20YYGX0', name: 'General Elective', credits: 3, type: 'theory' },
      { code: '20CBPX0', name: 'Program Elective', credits: 4, type: 'theory' },
      { code: '20CB570', name: 'DAA Lab', credits: 2, type: 'lab' },
      { code: '20CB580', name: 'Compiler Design Lab', credits: 1, type: 'lab' },
      { code: '20CB590', name: 'Mini Project', credits: 1, type: 'project' },
    ],
  },
  {
    semester: 6,
    year: 3,
    subjects: [
      { code: '20CB610', name: 'Computer Networks', credits: 3, type: 'theory' },
      { code: '20CB620', name: 'Information Security', credits: 3, type: 'theory' },
      { code: '20CB630', name: 'Artificial Intelligence', credits: 3, type: 'theory' },
      { code: '20CB640', name: 'Financial & Cost Accounting', credits: 2, type: 'theory' },
      { code: '20CB650', name: 'Business Communication & Value Science – IV', credits: 2, type: 'theory' },
      { code: '20CBPX1', name: 'Program Elective I', credits: 3, type: 'theory' },
      { code: '20CBPX2', name: 'Program Elective II', credits: 4, type: 'theory' },
      { code: '20CB660', name: 'CN Lab', credits: 2, type: 'lab' },
      { code: '20CB670', name: 'IS Lab', credits: 1, type: 'lab' },
      { code: '20CB680', name: 'AI Lab', credits: 1, type: 'lab' },
    ],
  },
  {
    semester: 7,
    year: 4,
    subjects: [
      { code: '20CB710', name: 'Financial Management', credits: 2, type: 'theory' },
      { code: '20CB720', name: 'Human Resource Management', credits: 2, type: 'theory' },
      { code: '20CB730', name: 'IT Workshop (Skylab / Matlab)', credits: 3, type: 'lab' },
      { code: '20CB740', name: 'Services Science & Service Operational Management', credits: 3, type: 'theory' },
      { code: '20CB750', name: 'IT Project Management', credits: 4, type: 'theory' },
      { code: '20CB760', name: 'Usability Design of Software Applications', credits: 3, type: 'theory' },
      { code: '20CBPX3', name: 'Program Elective III', credits: 3, type: 'theory' },
      { code: '20CBPX4', name: 'Program Elective IV', credits: 3, type: 'theory' },
    ],
  },
  {
    semester: 8,
    year: 4,
    subjects: [
      { code: '20CB810', name: 'Project Evaluation', credits: 12, type: 'project' },
    ],
  },
];

// Helper functions
export const getAllSubjects = (): CSBSSubject[] => {
  return csbsSyllabus.flatMap(sem => sem.subjects);
};

export const getSubjectsBySemester = (semester: number): CSBSSubject[] => {
  const sem = csbsSyllabus.find(s => s.semester === semester);
  return sem ? sem.subjects : [];
};

export const getSubjectsByYear = (year: number): CSBSSubject[] => {
  return csbsSyllabus
    .filter(sem => sem.year === year)
    .flatMap(sem => sem.subjects);
};

export const getTheorySubjects = (): CSBSSubject[] => {
  return getAllSubjects().filter(s => s.type === 'theory');
};

export const getLabSubjects = (): CSBSSubject[] => {
  return getAllSubjects().filter(s => s.type === 'lab');
};

export const getSubjectByCode = (code: string): CSBSSubject | undefined => {
  return getAllSubjects().find(s => s.code === code);
};
