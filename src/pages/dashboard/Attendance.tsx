import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const attendanceData = [
  { subject: 'Data Structures', code: 'CS301', present: 42, total: 45, percentage: 93 },
  { subject: 'Database Systems', code: 'CS302', present: 38, total: 45, percentage: 84 },
  { subject: 'Computer Networks', code: 'CS303', present: 40, total: 45, percentage: 89 },
  { subject: 'Operating Systems', code: 'CS304', present: 33, total: 45, percentage: 73 },
  { subject: 'Software Engineering', code: 'CS305', present: 41, total: 45, percentage: 91 },
];

const Attendance: React.FC = () => {
  const overallAttendance = Math.round(
    attendanceData.reduce((sum, item) => sum + item.percentage, 0) / attendanceData.length
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Attendance</h2>
        <p className="text-muted-foreground">Your class attendance record</p>
      </div>

      {/* Overall Attendance */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Attendance</p>
              <p className="text-4xl font-bold">{overallAttendance}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {overallAttendance >= 75 ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Eligible for exams
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> Below minimum requirement
                  </span>
                )}
              </p>
            </div>
            <div className="w-24 h-24 rounded-full border-8 border-primary flex items-center justify-center">
              <span className="text-2xl font-bold">{overallAttendance}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
          <CardDescription>Minimum 75% required for exam eligibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {attendanceData.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-muted-foreground">{item.code}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      item.percentage >= 75 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.percentage}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.present}/{item.total} classes
                    </p>
                  </div>
                </div>
                <Progress 
                  value={item.percentage} 
                  className={`h-2 ${item.percentage < 75 ? '[&>div]:bg-red-500' : ''}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Minimum 75% attendance is required for exam eligibility.</li>
            <li>• Medical leaves require valid documentation within 3 days.</li>
            <li>• OD (On Duty) must be approved by the department head.</li>
            <li>• Attendance shortage may lead to detention.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
