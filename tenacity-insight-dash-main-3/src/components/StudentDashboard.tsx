import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Student } from '../types';
import { getEarlyWarningIndicators, calculateHypotheticalCGPA } from '../utils/calculations';
import { generateStudentPortfolio, speakText } from '../utils/pdf';
import avatar from '../assets/avatar.png';
import { 
  User, 
  BookOpen, 
  TrendingUp, 
  Download, 
  Calculator,
  Volume2,
  Trophy,
  AlertTriangle
} from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
  const [hypotheticalMarks, setHypotheticalMarks] = useState(75);
  const warnings = getEarlyWarningIndicators(student);
  
  const subjects = [
    { name: 'Mathematics', marks: 78, credits: 4 },
    { name: 'Physics', marks: 82, credits: 4 },
    { name: 'Chemistry', marks: 75, credits: 4 },
    { name: 'Computer Science', marks: 88, credits: 4 },
    { name: 'English', marks: 70, credits: 3 },
  ];

  const projectedCGPA = calculateHypotheticalCGPA(
    student.gpa, 
    19, // current credits
    [{ credits: 4, marks: hypotheticalMarks }]
  );

  const handleSpeak = (text: string) => {
    speakText(text);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Safe': return 'status-safe';
      case 'Average': return 'status-average';
      case 'At-Risk': return 'status-at-risk';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Student Header */}
      <Card className="bg-gradient-card border-0 shadow-lg hover-lift">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <img 
              src={avatar} 
              alt="Student Avatar" 
              className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <User className="h-6 w-6 text-primary" />
                    {student.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    Student ID: {student.id}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(student.status)} text-sm px-3 py-1`}>
                    {student.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSpeak(`Student ${student.name}, ID ${student.id}, Status ${student.status}`)}
                    className="ml-2"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Early Warning Indicators */}
      {warnings.length > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Early Warning Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {warnings.map((warning, index) => (
                <Badge key={index} variant="outline" className="text-warning border-warning">
                  {warning.icon} {warning.message}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{student.attendance}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSpeak(`Attendance is ${student.attendance} percent`)}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={student.attendance} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {student.attendance >= 75 ? '✓ Meeting requirement' : '⚠ Below 75% requirement'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Current Marks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{student.marks}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSpeak(`Current average marks are ${student.marks} percent`)}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={student.marks} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Overall average across subjects
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-secondary" />
              CGPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{student.gpa.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSpeak(`Current CGPA is ${student.gpa.toFixed(2)} out of 10`)}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={student.gpa * 10} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Out of 10.0 scale
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance Table */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Subject Performance
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSpeak('Viewing subject performance table')}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Grade Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>{subject.marks}%</TableCell>
                  <TableCell>{subject.credits}</TableCell>
                  <TableCell>{(subject.marks / 10).toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CGPA Calculator & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              CGPA Predictor
            </CardTitle>
            <CardDescription>
              Calculate projected CGPA with hypothetical marks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Next Subject Marks: {hypotheticalMarks}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={hypotheticalMarks}
                onChange={(e) => setHypotheticalMarks(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Projected CGPA:</p>
              <p className="text-2xl font-bold text-primary">
                {projectedCGPA.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {projectedCGPA > student.gpa ? '↗ Improvement' : projectedCGPA < student.gpa ? '↘ Decline' : '→ No change'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-secondary" />
              My Records
            </CardTitle>
            <CardDescription>
              Download academic portfolio and certificates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => generateStudentPortfolio(student)}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Portfolio (PDF)
            </Button>
            
            {student.achievements && student.achievements.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Recent Achievements:</p>
                {student.achievements.slice(0, 3).map((achievement, index) => (
                  <Badge key={index} variant="outline" className="block text-left p-2">
                    🏆 {achievement}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};