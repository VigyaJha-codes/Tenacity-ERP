import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student } from '../types';
import { calculateCGPA, updateStudentStatus } from '../utils/calculations';
import { toast } from '../hooks/use-toast';
import { UserPlus, Save } from 'lucide-react';

interface AdmissionsFormProps {
  onAddStudent: (student: Student) => void;
}

export const AdmissionsForm: React.FC<AdmissionsFormProps> = ({ onAddStudent }) => {
  const [formData, setFormData] = useState({
    name: '',
    initialAttendance: '',
    initialMarks: '',
    initialGPA: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate GPA when marks are entered
    if (field === 'initialMarks' && value) {
      const marks = Number(value);
      const calculatedGPA = calculateCGPA(marks);
      setFormData(prev => ({
        ...prev,
        initialGPA: calculatedGPA.toFixed(2)
      }));
    }
  };

  const generateStudentId = () => {
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.random().toString(36).substring(2, 4);
    return `s${timestamp}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const attendance = Number(formData.initialAttendance);
      const marks = Number(formData.initialMarks);
      const gpa = formData.initialGPA ? Number(formData.initialGPA) : calculateCGPA(marks);

      const newStudent: Student = {
        id: generateStudentId(),
        name: formData.name.trim(),
        attendance,
        marks,
        gpa,
        status: updateStudentStatus({ attendance, marks, gpa } as Student),
        notes: [],
        achievements: [],
        certificates: [],
      };

      onAddStudent(newStudent);

      toast({
        title: "Student Added Successfully",
        description: `${newStudent.name} has been enrolled with ID: ${newStudent.id}`,
      });

      // Reset form
      setFormData({
        name: '',
        initialAttendance: '',
        initialMarks: '',
        initialGPA: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() && 
                     formData.initialAttendance && 
                     formData.initialMarks &&
                     Number(formData.initialAttendance) >= 0 && 
                     Number(formData.initialAttendance) <= 100 &&
                     Number(formData.initialMarks) >= 0 && 
                     Number(formData.initialMarks) <= 100;

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <Card className="hover-lift shadow-lg">
        <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-6 w-6" />
            Student Admissions
          </CardTitle>
          <CardDescription className="text-white/90">
            Add new student to the system
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Student Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Initial Attendance */}
            <div className="space-y-2">
              <Label htmlFor="attendance" className="text-sm font-medium">
                Initial Attendance (%) *
              </Label>
              <Input
                id="attendance"
                type="number"
                min="0"
                max="100"
                placeholder="Enter attendance percentage"
                value={formData.initialAttendance}
                onChange={(e) => handleInputChange('initialAttendance', e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter starting attendance percentage (0-100)
              </p>
            </div>

            {/* Initial Marks */}
            <div className="space-y-2">
              <Label htmlFor="marks" className="text-sm font-medium">
                Initial Marks (%) *
              </Label>
              <Input
                id="marks"
                type="number"
                min="0"
                max="100"
                placeholder="Enter initial marks"
                value={formData.initialMarks}
                onChange={(e) => handleInputChange('initialMarks', e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter average marks percentage (0-100)
              </p>
            </div>

            {/* Calculated GPA */}
            <div className="space-y-2">
              <Label htmlFor="gpa" className="text-sm font-medium">
                Calculated CGPA
              </Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                placeholder="Auto-calculated from marks"
                value={formData.initialGPA}
                onChange={(e) => handleInputChange('initialGPA', e.target.value)}
                className="w-full bg-muted/50"
                readOnly
              />
              <p className="text-xs text-muted-foreground">
                CGPA is automatically calculated based on marks entered
              </p>
            </div>

            {/* Status Preview */}
            {formData.initialAttendance && formData.initialMarks && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Student Status Preview:</h4>
                <div className="flex gap-4 text-sm">
                  <span>Attendance: {formData.initialAttendance}%</span>
                  <span>Marks: {formData.initialMarks}%</span>
                  <span>CGPA: {formData.initialGPA}</span>
                  <span className={`font-medium ${
                    Number(formData.initialAttendance) < 75 || Number(formData.initialMarks) < 50 
                      ? 'text-danger' 
                      : Number(formData.initialAttendance) >= 85 && Number(formData.initialMarks) >= 75 
                        ? 'text-success' 
                        : 'text-warning'
                  }`}>
                    Status: {
                      Number(formData.initialAttendance) < 75 || Number(formData.initialMarks) < 50
                        ? 'At-Risk'
                        : Number(formData.initialAttendance) >= 85 && Number(formData.initialMarks) >= 75
                          ? 'Safe'
                          : 'Average'
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-gradient-primary text-white hover:opacity-90"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Student...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Student to System
                  </>
                )}
              </Button>
            </div>

            {/* Form Validation Messages */}
            {!isFormValid && (formData.name || formData.initialAttendance || formData.initialMarks) && (
              <div className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
                <p className="font-medium">Please check the following:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {!formData.name.trim() && <li>Student name is required</li>}
                  {!formData.initialAttendance && <li>Initial attendance is required</li>}
                  {!formData.initialMarks && <li>Initial marks are required</li>}
                  {formData.initialAttendance && (Number(formData.initialAttendance) < 0 || Number(formData.initialAttendance) > 100) && 
                    <li>Attendance must be between 0-100%</li>}
                  {formData.initialMarks && (Number(formData.initialMarks) < 0 || Number(formData.initialMarks) > 100) && 
                    <li>Marks must be between 0-100%</li>}
                </ul>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};