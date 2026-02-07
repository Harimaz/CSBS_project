import React, { useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HallTicket: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const ticketRef = useRef<HTMLDivElement>(null);

  const examDetails = [
    { subject: 'Data Structures', code: 'CS301', date: 'Dec 15, 2024', time: '10:00 AM', venue: 'Hall A', seat: 'A-15' },
    { subject: 'Database Systems', code: 'CS302', date: 'Dec 16, 2024', time: '2:00 PM', venue: 'Hall B', seat: 'B-22' },
    { subject: 'Computer Networks', code: 'CS303', date: 'Dec 17, 2024', time: '10:00 AM', venue: 'Hall A', seat: 'A-15' },
  ];

  const handleDownload = () => {
    toast({ title: 'Download Started', description: 'Your hall ticket is being downloaded.' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hall Ticket</h2>
          <p className="text-muted-foreground">Your examination hall ticket</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Card ref={ticketRef} className="print:shadow-none">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>University Examination Hall Ticket</CardTitle>
                <p className="text-sm text-muted-foreground">CAT-1 December 2024</p>
              </div>
            </div>
            <div className="w-20 h-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
              Photo
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Student Details */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Roll Number</p>
              <p className="font-semibold">{user?.rollNo || 'CS2021001'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-semibold">{user?.department}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Semester</p>
              <p className="font-semibold">V</p>
            </div>
          </div>

          {/* Exam Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Subject</th>
                  <th className="text-left py-3 px-4 font-medium">Code</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Time</th>
                  <th className="text-left py-3 px-4 font-medium">Venue</th>
                  <th className="text-left py-3 px-4 font-medium">Seat</th>
                </tr>
              </thead>
              <tbody>
                {examDetails.map((exam, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-3 px-4">{exam.subject}</td>
                    <td className="py-3 px-4">{exam.code}</td>
                    <td className="py-3 px-4">{exam.date}</td>
                    <td className="py-3 px-4">{exam.time}</td>
                    <td className="py-3 px-4">{exam.venue}</td>
                    <td className="py-3 px-4 font-medium">{exam.seat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Bring this hall ticket along with a valid ID proof.</li>
              <li>• Report 30 minutes before the exam time.</li>
              <li>• Electronic devices are not allowed.</li>
              <li>• Follow all examination rules and regulations.</li>
            </ul>
          </div>

          {/* Signature */}
          <div className="mt-6 flex justify-end">
            <div className="text-center">
              <div className="w-32 border-b border-dashed mb-2"></div>
              <p className="text-sm text-muted-foreground">Controller of Examinations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HallTicket;
