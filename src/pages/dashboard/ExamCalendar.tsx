import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface Exam {
  id: string;
  subject: string;
  code: string;
  date: string;
  time: string;
  venue: string | null;
  type: 'CAT-1' | 'CAT-2' | 'Semester' | 'Lab';
  department: string;
}

const examTypeColors: Record<string, string> = {
  'CAT-1': 'bg-blue-500',
  'CAT-2': 'bg-green-500',
  'Semester': 'bg-primary',
  'Lab': 'bg-accent',
};

const ExamCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('date', { ascending: true });

    if (!error && data) {
      setExams(data as Exam[]);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding for first week
  const firstDayOfWeek = monthStart.getDay();
  const paddingDays = Array(firstDayOfWeek).fill(null);

  const getExamsForDate = (date: Date) => {
    return exams.filter(exam => isSameDay(new Date(exam.date), date));
  };

  const handleDateClick = (date: Date) => {
    const dayExams = getExamsForDate(date);
    if (dayExams.length > 0) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Exam Calendar</h1>
        <div className="flex gap-2">
          {Object.entries(examTypeColors).map(([type, color]) => (
            <Badge key={type} className={`${color} text-white`}>{type}</Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(currentDate, 'MMMM yyyy')}
          </CardTitle>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {paddingDays.map((_, index) => (
              <div key={`pad-${index}`} className="min-h-[80px]" />
            ))}
            {daysInMonth.map(day => {
              const dayExams = getExamsForDate(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  className={`min-h-[80px] p-1 border rounded cursor-pointer transition-colors
                    ${isToday ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}
                    ${dayExams.length > 0 ? 'cursor-pointer' : ''}
                  `}
                >
                  <div className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1 mt-1">
                    {dayExams.slice(0, 2).map(exam => (
                      <div
                        key={exam.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedExam(exam); }}
                        className={`text-xs p-1 rounded truncate text-white cursor-pointer ${examTypeColors[exam.type]}`}
                      >
                        {exam.code}
                      </div>
                    ))}
                    {dayExams.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayExams.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Exam Details Modal */}
      <Dialog open={!!selectedExam} onOpenChange={() => setSelectedExam(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exam Details</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={`${examTypeColors[selectedExam.type]} text-white`}>
                  {selectedExam.type}
                </Badge>
                <span className="font-medium">{selectedExam.code}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Subject</p>
                  <p className="font-medium">{selectedExam.subject}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedExam.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{format(new Date(selectedExam.date), 'PPP')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedExam.time}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Venue</p>
                  <p className="font-medium">{selectedExam.venue || 'TBA'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Date Exams Modal */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Exams on {selectedDate && format(selectedDate, 'PPP')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedDate && getExamsForDate(selectedDate).map(exam => (
              <Card key={exam.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedDate(null); setSelectedExam(exam); }}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{exam.subject}</p>
                      <p className="text-sm text-muted-foreground">{exam.code} • {exam.time}</p>
                    </div>
                    <Badge className={`${examTypeColors[exam.type]} text-white`}>
                      {exam.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamCalendar;
