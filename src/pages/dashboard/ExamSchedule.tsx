import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Download } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { exportToPDF } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';

const ExamSchedule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('CAT-1');
  const { exams } = useData();
  const { toast } = useToast();

  const filteredExams = useMemo(() => {
    return exams.filter(e => e.type === activeTab);
  }, [exams, activeTab]);

  const handleDownload = () => {
    const columns = [
      { header: 'Subject', key: 'subject' },
      { header: 'Code', key: 'code' },
      { header: 'Date', key: 'date' },
      { header: 'Time', key: 'time' },
      { header: 'Venue', key: 'venue' },
    ];
    exportToPDF(filteredExams, columns, `${activeTab} Exam Schedule`, 'exam-schedule');
    toast({ title: 'Downloading', description: 'Your schedule is being prepared.' });
  };

  const ExamList = ({ examsList }: { examsList: typeof exams }) => (
    <div className="space-y-4">
      {examsList.length > 0 ? examsList.map((exam) => (
        <Card key={exam.id}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-semibold">{exam.subject}</h3>
                <p className="text-sm text-muted-foreground">{exam.code}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{exam.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{exam.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{exam.venue}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            No exams scheduled for {activeTab}
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Exam Schedule</h2>
          <p className="text-muted-foreground">View your upcoming examination schedule</p>
        </div>
        <Button variant="outline" onClick={handleDownload} disabled={filteredExams.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="CAT-1">CAT-1</TabsTrigger>
          <TabsTrigger value="CAT-2">CAT-2</TabsTrigger>
          <TabsTrigger value="Semester">Semester</TabsTrigger>
          <TabsTrigger value="Lab">Labs</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <ExamList examsList={filteredExams} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamSchedule;

