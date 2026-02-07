import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const resultsData = {
  sem5: [
    { subject: 'Data Structures', code: 'CS301', internal: 85, external: 78, total: 82, grade: 'A', credits: 4 },
    { subject: 'Database Systems', code: 'CS302', internal: 78, external: 82, total: 80, grade: 'A', credits: 4 },
    { subject: 'Computer Networks', code: 'CS303', internal: 90, external: 85, total: 88, grade: 'A+', credits: 3 },
    { subject: 'Operating Systems', code: 'CS304', internal: 72, external: 68, total: 70, grade: 'B+', credits: 4 },
    { subject: 'Software Engineering', code: 'CS305', internal: 88, external: 90, total: 89, grade: 'A+', credits: 3 },
  ],
  sem4: [
    { subject: 'Discrete Mathematics', code: 'CS201', internal: 82, external: 75, total: 79, grade: 'B+', credits: 4 },
    { subject: 'OOP with Java', code: 'CS202', internal: 90, external: 88, total: 89, grade: 'A+', credits: 4 },
    { subject: 'Digital Logic', code: 'CS203', internal: 75, external: 70, total: 73, grade: 'B', credits: 3 },
    { subject: 'Computer Architecture', code: 'CS204', internal: 85, external: 82, total: 84, grade: 'A', credits: 4 },
  ],
};

const Results: React.FC = () => {
  const calculateSGPA = (results: typeof resultsData.sem5) => {
    const gradePoints: Record<string, number> = {
      'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 0
    };
    const totalCredits = results.reduce((sum, r) => sum + r.credits, 0);
    const totalPoints = results.reduce((sum, r) => sum + (gradePoints[r.grade] * r.credits), 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  const ResultsTable = ({ data }: { data: typeof resultsData.sem5 }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left py-3 px-4 font-medium">Subject</th>
            <th className="text-center py-3 px-4 font-medium">Internal</th>
            <th className="text-center py-3 px-4 font-medium">External</th>
            <th className="text-center py-3 px-4 font-medium">Total</th>
            <th className="text-center py-3 px-4 font-medium">Grade</th>
            <th className="text-center py-3 px-4 font-medium">Credits</th>
          </tr>
        </thead>
        <tbody>
          {data.map((result, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-3 px-4">
                <p className="font-medium">{result.subject}</p>
                <p className="text-xs text-muted-foreground">{result.code}</p>
              </td>
              <td className="text-center py-3 px-4">{result.internal}</td>
              <td className="text-center py-3 px-4">{result.external}</td>
              <td className="text-center py-3 px-4 font-medium">{result.total}</td>
              <td className="text-center py-3 px-4">
                <Badge variant={result.grade.startsWith('A') ? 'default' : 'secondary'}>
                  {result.grade}
                </Badge>
              </td>
              <td className="text-center py-3 px-4">{result.credits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Results</h2>
          <p className="text-muted-foreground">Your examination results</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Transcript
        </Button>
      </div>

      {/* CGPA Card */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Current CGPA</p>
            <p className="text-3xl font-bold text-primary">8.52</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Semester 5 SGPA</p>
            <p className="text-3xl font-bold text-green-600">{calculateSGPA(resultsData.sem5)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p className="text-3xl font-bold">92</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semester Results</CardTitle>
          <CardDescription>View your results by semester</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sem5">
            <TabsList>
              <TabsTrigger value="sem5">Semester 5</TabsTrigger>
              <TabsTrigger value="sem4">Semester 4</TabsTrigger>
            </TabsList>
            <TabsContent value="sem5" className="mt-4">
              <ResultsTable data={resultsData.sem5} />
              <div className="mt-4 p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                <span className="font-medium">Semester 5 SGPA</span>
                <span className="text-xl font-bold text-primary">{calculateSGPA(resultsData.sem5)}</span>
              </div>
            </TabsContent>
            <TabsContent value="sem4" className="mt-4">
              <ResultsTable data={resultsData.sem4} />
              <div className="mt-4 p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                <span className="font-medium">Semester 4 SGPA</span>
                <span className="text-xl font-bold text-primary">{calculateSGPA(resultsData.sem4)}</span>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
