import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { updateStudentStatus, calculateCGPA, getEarlyWarningIndicators } from '../utils/calculations';
import { 
  Users, 
  Edit, 
  Save, 
  AlertTriangle, 
  TrendingUp,
  UserCheck,
  BookOpen,
  Award
} from 'lucide-react';

interface FacultyDashboardProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ 
  students, 
  onUpdateStudent 
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editMarks, setEditMarks] = useState('');
  const [editAttendance, setEditAttendance] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditMarks(student.marks.toString());
    setEditAttendance(student.attendance.toString());
    setNewNote('');
    setNewAchievement('');
  };

  const handleSaveChanges = () => {
    if (!selectedStudent) return;

    const updatedMarks = Number(editMarks);
    const updatedAttendance = Number(editAttendance);
    const updatedGPA = calculateCGPA(updatedMarks);
    
    const updatedStudent: Student = {
      ...selectedStudent,
      marks: updatedMarks,
      attendance: updatedAttendance,
      gpa: updatedGPA,
      status: updateStudentStatus({
        ...selectedStudent,
        marks: updatedMarks,
        attendance: updatedAttendance,
        gpa: updatedGPA,
      }),
      notes: newNote ? [...(selectedStudent.notes || []), newNote] : selectedStudent.notes,
      achievements: newAchievement ? [...(selectedStudent.achievements || []), newAchievement] : selectedStudent.achievements,
    };

    onUpdateStudent(updatedStudent);
    setSelectedStudent(null);
  };

  const handleMarkAbsent = (student: Student) => {
    const updatedStudent = {
      ...student,
      absentFlag: true,
    };
    onUpdateStudent(updatedStudent);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Safe': return 'status-safe';
      case 'Average': return 'status-average';
      case 'At-Risk': return 'status-at-risk';
      default: return '';
    }
  };

  const atRiskStudents = students.filter(s => s.status === 'At-Risk');
  const avgAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / students.length;
  const avgGPA = students.reduce((sum, s) => sum + s.gpa, 0) / students.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Faculty Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{students.length}</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-success" />
              Avg Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">{avgAttendance.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Avg CGPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-secondary">{avgGPA.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              At-Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-danger">{atRiskStudents.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Student Management
          </CardTitle>
          <CardDescription>
            Edit student marks, attendance, and academic records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Warnings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const warnings = getEarlyWarningIndicators(student);
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.attendance}%</TableCell>
                    <TableCell>{student.marks}%</TableCell>
                    <TableCell>{student.gpa.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {warnings.map((warning, index) => (
                          <span key={index} title={warning.message}>
                            {warning.icon}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Student: {student.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <Label htmlFor="marks">Marks (%)</Label>
                                <Input
                                  id="marks"
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={editMarks}
                                  onChange={(e) => setEditMarks(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="attendance">Attendance (%)</Label>
                                <Input
                                  id="attendance"
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={editAttendance}
                                  onChange={(e) => setEditAttendance(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="note">Add Note</Label>
                                <Textarea
                                  id="note"
                                  placeholder="Academic note or observation..."
                                  value={newNote}
                                  onChange={(e) => setNewNote(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="achievement">Add Achievement</Label>
                                <Input
                                  id="achievement"
                                  placeholder="Award, certificate, or recognition..."
                                  value={newAchievement}
                                  onChange={(e) => setNewAchievement(e.target.value)}
                                />
                              </div>
                              <Button 
                                onClick={handleSaveChanges} 
                                className="w-full bg-gradient-primary"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAbsent(student)}
                          disabled={student.absentFlag}
                          className="text-danger hover:bg-danger/10"
                        >
                          {student.absentFlag ? '⭕' : 'Mark Absent'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* At-Risk Students Alert */}
      {atRiskStudents.length > 0 && (
        <Card className="border-danger bg-danger/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger">
              <AlertTriangle className="h-5 w-5" />
              Students Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {atRiskStudents.map((student) => (
                <div key={student.id} className="p-4 border border-danger/20 rounded-lg">
                  <h4 className="font-medium">{student.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Attendance: {student.attendance}% | CGPA: {student.gpa.toFixed(2)}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {getEarlyWarningIndicators(student).map((warning, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {warning.icon} {warning.message}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};