import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const marksData = {
  cat1: [
    { subject: 'Data Structures', code: 'CS301', marks: 42, total: 50, percentage: 84 },
    { subject: 'Database Systems', code: 'CS302', marks: 38, total: 50, percentage: 76 },
    { subject: 'Computer Networks', code: 'CS303', marks: 45, total: 50, percentage: 90 },
  ],
  cat2: [
    { subject: 'Data Structures', code: 'CS301', marks: 40, total: 50, percentage: 80 },
    { subject: 'Database Systems', code: 'CS302', marks: 44, total: 50, percentage: 88 },
    { subject: 'Computer Networks', code: 'CS303', marks: 41, total: 50, percentage: 82 },
  ],
  assignment: [
    { subject: 'Data Structures', code: 'CS301', marks: 18, total: 20, percentage: 90 },
    { subject: 'Database Systems', code: 'CS302', marks: 17, total: 20, percentage: 85 },
    { subject: 'Computer Networks', code: 'CS303', marks: 19, total: 20, percentage: 95 },
  ],
};

const InternalMarks: React.FC = () => {
  const MarksTable = ({ data }: { data: typeof marksData.cat1 }) => (
    <div className="space-y-4">
      {data.map((item, idx) => (
        <Card key={idx}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">{item.subject}</h3>
                <p className="text-sm text-muted-foreground">{item.code}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{item.marks}/{item.total}</p>
                  <p className="text-xs text-muted-foreground">Marks</p>
                </div>
                <div className="w-32">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Score</span>
                    <span className={`font-medium ${
                      item.percentage >= 80 ? 'text-green-600' :
                      item.percentage >= 60 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>{item.percentage}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const calculateAverage = (data: typeof marksData.cat1) => {
    const avg = data.reduce((sum, item) => sum + item.percentage, 0) / data.length;
    return avg.toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Internal Marks</h2>
        <p className="text-muted-foreground">Your internal assessment marks</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">CAT-1 Average</p>
            <p className="text-2xl font-bold text-blue-600">{calculateAverage(marksData.cat1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">CAT-2 Average</p>
            <p className="text-2xl font-bold text-green-600">{calculateAverage(marksData.cat2)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Assignment Average</p>
            <p className="text-2xl font-bold text-orange-600">{calculateAverage(marksData.assignment)}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cat1">
        <TabsList>
          <TabsTrigger value="cat1">CAT-1</TabsTrigger>
          <TabsTrigger value="cat2">CAT-2</TabsTrigger>
          <TabsTrigger value="assignment">Assignments</TabsTrigger>
        </TabsList>
        <TabsContent value="cat1" className="mt-4">
          <MarksTable data={marksData.cat1} />
        </TabsContent>
        <TabsContent value="cat2" className="mt-4">
          <MarksTable data={marksData.cat2} />
        </TabsContent>
        <TabsContent value="assignment" className="mt-4">
          <MarksTable data={marksData.assignment} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternalMarks;
