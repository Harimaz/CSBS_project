export type Language = 'en' | 'ta' | 'hi';

export const translations = {
  en: {
    // Common
    appName: 'COE Portfolio',
    appDescription: 'Controller of Examinations Management System',
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    signIn: 'Sign In',
    dashboard: 'Dashboard',
    settings: 'Settings',
    profile: 'Profile',
    notificationsLabel: 'Notifications',
    search: 'Search...',
    
    // Roles
    student: 'Student',
    faculty: 'Faculty',
    hod: 'Head of Department',
    admin: 'Administrator',
    coe: 'COE Team',
    
    // Navigation
    home: 'Home',
    exams: 'Examinations',
    schedule: 'Schedule',
    hallTicket: 'Hall Ticket',
    syllabus: 'Syllabus',
    internalMarks: 'Internal Marks',
    attendance: 'Attendance',
    results: 'Results',
    calendar: 'Academic Calendar',
    hallAllocation: 'Hall Allocation',
    invigilation: 'Invigilation',
    analytics: 'Analytics',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    upcomingExams: 'Upcoming Exams',
    recentResults: 'Recent Results',
    quickActions: 'Quick Actions',
    pendingTasks: 'Pending Tasks',
    overallPerformance: 'Overall Performance',
    
    // Landing
    heroTitle: 'Streamline Your Examination Process',
    heroSubtitle: 'A comprehensive digital platform for managing all examination operations efficiently',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    features: 'Features',
    aboutUs: 'About Us',
    contact: 'Contact',
    
    // Features
    examManagement: 'Exam Management',
    examManagementDesc: 'Schedule and manage CAT, semester, and lab exams effortlessly',
    hallAllocationFeature: 'Hall Allocation',
    hallAllocationDesc: 'Automated seating arrangements and hall ticket generation',
    resultsAnalytics: 'Results & Analytics',
    resultsAnalyticsDesc: 'Comprehensive result processing and performance analytics',
    smartNotifications: 'Smart Notifications',
    smartNotificationsDesc: 'Automated reminders for exams, submissions, and deadlines',
  },
  ta: {
    // Common
    appName: 'COE போர்ட்ஃபோலியோ',
    appDescription: 'தேர்வு கட்டுப்பாட்டாளர் மேலாண்மை அமைப்பு',
    login: 'உள்நுழை',
    logout: 'வெளியேறு',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    signIn: 'உள்நுழைக',
    dashboard: 'டாஷ்போர்டு',
    settings: 'அமைப்புகள்',
    profile: 'சுயவிவரம்',
    notificationsLabel: 'அறிவிப்புகள்',
    search: 'தேடு...',
    
    // Roles
    student: 'மாணவர்',
    faculty: 'ஆசிரியர்',
    hod: 'துறைத் தலைவர்',
    admin: 'நிர்வாகி',
    coe: 'COE குழு',
    
    // Navigation
    home: 'முகப்பு',
    exams: 'தேர்வுகள்',
    schedule: 'அட்டவணை',
    hallTicket: 'ஹால் டிக்கெட்',
    syllabus: 'பாடத்திட்டம்',
    internalMarks: 'உள் மதிப்பெண்கள்',
    attendance: 'வருகை',
    results: 'முடிவுகள்',
    calendar: 'கல்வி நாட்காட்டி',
    hallAllocation: 'அரங்க ஒதுக்கீடு',
    invigilation: 'கண்காணிப்பு',
    analytics: 'பகுப்பாய்வு',
    
    // Dashboard
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
    upcomingExams: 'வரவிருக்கும் தேர்வுகள்',
    recentResults: 'சமீபத்திய முடிவுகள்',
    quickActions: 'விரைவு செயல்கள்',
    pendingTasks: 'நிலுவையில் உள்ள பணிகள்',
    overallPerformance: 'ஒட்டுமொத்த செயல்திறன்',
    
    // Landing
    heroTitle: 'உங்கள் தேர்வு செயல்முறையை எளிதாக்குங்கள்',
    heroSubtitle: 'அனைத்து தேர்வு நடவடிக்கைகளையும் திறமையாக நிர்வகிக்க ஒரு விரிவான டிஜிட்டல் தளம்',
    getStarted: 'தொடங்கு',
    learnMore: 'மேலும் அறிக',
    features: 'அம்சங்கள்',
    aboutUs: 'எங்களைப் பற்றி',
    contact: 'தொடர்பு',
    
    // Features
    examManagement: 'தேர்வு மேலாண்மை',
    examManagementDesc: 'CAT, செமஸ்டர் மற்றும் லேப் தேர்வுகளை எளிதாக திட்டமிடுங்கள்',
    hallAllocationFeature: 'அரங்க ஒதுக்கீடு',
    hallAllocationDesc: 'தானியங்கி இருக்கை ஏற்பாடுகள் மற்றும் ஹால் டிக்கெட் உருவாக்கம்',
    resultsAnalytics: 'முடிவுகள் & பகுப்பாய்வு',
    resultsAnalyticsDesc: 'விரிவான முடிவு செயலாக்கம் மற்றும் செயல்திறன் பகுப்பாய்வு',
    smartNotifications: 'ஸ்மார்ட் அறிவிப்புகள்',
    smartNotificationsDesc: 'தேர்வுகள், சமர்ப்பிப்புகள் மற்றும் காலக்கெடுவுக்கான தானியங்கி நினைவூட்டல்கள்',
  },
  hi: {
    // Common
    appName: 'COE पोर्टफोलियो',
    appDescription: 'परीक्षा नियंत्रक प्रबंधन प्रणाली',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    signIn: 'साइन इन करें',
    dashboard: 'डैशबोर्ड',
    settings: 'सेटिंग्स',
    profile: 'प्रोफ़ाइल',
    notificationsLabel: 'सूचनाएं',
    search: 'खोजें...',
    
    // Roles
    student: 'छात्र',
    faculty: 'प्रवक्ता',
    hod: 'विभागाध्यक्ष',
    admin: 'व्यवस्थापक',
    coe: 'COE टीम',
    
    // Navigation
    home: 'होम',
    exams: 'परीक्षाएं',
    schedule: 'अनुसूची',
    hallTicket: 'प्रवेश पत्र',
    syllabus: 'पाठ्यक्रम',
    internalMarks: 'आंतरिक अंक',
    attendance: 'उपस्थिति',
    results: 'परिणाम',
    calendar: 'शैक्षणिक कैलेंडर',
    hallAllocation: 'हॉल आवंटन',
    invigilation: 'निगरानी',
    analytics: 'विश्लेषण',
    
    // Dashboard
    welcomeBack: 'वापसी पर स्वागत है',
    upcomingExams: 'आगामी परीक्षाएं',
    recentResults: 'हाल के परिणाम',
    quickActions: 'त्वरित कार्य',
    pendingTasks: 'लंबित कार्य',
    overallPerformance: 'समग्र प्रदर्शन',
    
    // Landing
    heroTitle: 'अपनी परीक्षा प्रक्रिया को सुव्यवस्थित करें',
    heroSubtitle: 'सभी परीक्षा संचालन को कुशलतापूर्वक प्रबंधित करने के लिए एक व्यापक डिजिटल मंच',
    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    features: 'विशेषताएं',
    aboutUs: 'हमारे बारे में',
    contact: 'संपर्क',
    
    // Features
    examManagement: 'परीक्षा प्रबंधन',
    examManagementDesc: 'CAT, सेमेस्टर और लैब परीक्षाओं को आसानी से शेड्यूल करें',
    hallAllocationFeature: 'हॉल आवंटन',
    hallAllocationDesc: 'स्वचालित बैठक व्यवस्था और प्रवेश पत्र जनरेशन',
    resultsAnalytics: 'परिणाम और विश्लेषण',
    resultsAnalyticsDesc: 'व्यापक परिणाम प्रसंस्करण और प्रदर्शन विश्लेषण',
    smartNotifications: 'स्मार्ट सूचनाएं',
    smartNotificationsDesc: 'परीक्षाओं, सबमिशन और समय सीमा के लिए स्वचालित रिमाइंडर',
  },
};

export type TranslationKey = keyof typeof translations.en;

export const getTranslation = (lang: Language, key: TranslationKey): string => {
  return translations[lang][key] || translations.en[key] || key;
};
