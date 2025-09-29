import { Student, CGPACalculation, EarlyWarningRules } from '../types';

// CGPA Calculation using weighted average (10-point scale)
export const calculateCGPA = (marks: number): number => {
  // Simple mapping: marks percentage to 10-point CGPA
  if (marks >= 90) return 9.0 + (marks - 90) * 0.1;
  if (marks >= 80) return 8.0 + (marks - 80) * 0.1;
  if (marks >= 70) return 7.0 + (marks - 70) * 0.1;
  if (marks >= 60) return 6.0 + (marks - 60) * 0.1;
  if (marks >= 50) return 5.0 + (marks - 50) * 0.1;
  if (marks >= 40) return 4.0 + (marks - 40) * 0.1;
  return Math.max(0, marks * 0.1);
};

// Update student status based on performance
export const updateStudentStatus = (student: Student): Student['status'] => {
  if (student.attendance < 75 || student.gpa < 5.0) return 'At-Risk';
  if (student.attendance >= 85 && student.gpa >= 7.5) return 'Safe';
  return 'Average';
};

// Early warning system rules
export const earlyWarningRules: EarlyWarningRules = {
  lowAttendance: 75,
  performanceDrop: 10,
};

// Check early warning indicators
export const getEarlyWarningIndicators = (student: Student) => {
  const indicators = [];
  
  if (student.attendance < earlyWarningRules.lowAttendance) {
    indicators.push({ type: 'attendance', icon: '🔻', message: 'Low attendance' });
  }
  
  if (student.absentFlag) {
    indicators.push({ type: 'absent', icon: '⭕', message: 'Absent in exam' });
  }
  
  if (student.gpa < 5.5) {
    indicators.push({ type: 'performance', icon: '📉', message: 'Declining performance' });
  }
  
  return indicators;
};

// Calculate hypothetical CGPA with new marks
export const calculateHypotheticalCGPA = (
  currentCGPA: number,
  currentCredits: number,
  newSubjects: Array<{ credits: number; marks: number }>
): number => {
  const currentWeightedTotal = currentCGPA * currentCredits;
  const newWeightedTotal = newSubjects.reduce((total, subject) => {
    return total + (calculateCGPA(subject.marks) * subject.credits);
  }, 0);
  
  const totalCredits = currentCredits + newSubjects.reduce((sum, s) => sum + s.credits, 0);
  
  return (currentWeightedTotal + newWeightedTotal) / totalCredits;
};

// Generate statistics for admin dashboard
export const generateStatistics = (students: Student[]) => {
  const totalStudents = students.length;
  const avgAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents;
  const atRiskCount = students.filter(s => s.status === 'At-Risk').length;
  const avgGPA = students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents;
  
  return {
    totalStudents,
    avgAttendance: Math.round(avgAttendance * 100) / 100,
    atRiskCount,
    avgGPA: Math.round(avgGPA * 100) / 100,
    safeCount: students.filter(s => s.status === 'Safe').length,
    averageCount: students.filter(s => s.status === 'Average').length,
  };
};

// Format currency for Indian Rupees
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Generate unique receipt ID
export const generateReceiptId = (): string => {
  const prefix = 'REC';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};