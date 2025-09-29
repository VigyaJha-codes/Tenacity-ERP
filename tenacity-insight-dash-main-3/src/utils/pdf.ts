import jsPDF from 'jspdf';
import { Student, FeeTransaction } from '../types';
import { generateStatistics, formatCurrency } from './calculations';

// Generate student portfolio PDF
export const generateStudentPortfolio = (student: Student) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  
  // Header
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text('TENACITY ERP', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.text('Student Academic Portfolio', pageWidth / 2, 35, { align: 'center' });
  
  // Student Info
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text(`Student: ${student.name}`, 20, 55);
  pdf.text(`ID: ${student.id}`, 20, 70);
  
  // Academic Summary
  pdf.setFont(undefined, 'normal');
  pdf.text(`Attendance: ${student.attendance}%`, 20, 85);
  pdf.text(`Current Marks: ${student.marks}%`, 20, 100);
  pdf.text(`CGPA: ${student.gpa.toFixed(2)}`, 20, 115);
  pdf.text(`Status: ${student.status}`, 20, 130);
  
  // Achievements
  if (student.achievements && student.achievements.length > 0) {
    pdf.setFont(undefined, 'bold');
    pdf.text('Achievements:', 20, 150);
    pdf.setFont(undefined, 'normal');
    student.achievements.forEach((achievement, index) => {
      pdf.text(`• ${achievement}`, 25, 165 + (index * 15));
    });
  }
  
  // Footer
  pdf.setFontSize(10);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 280);
  pdf.text('Tenacity ERP - Education Management System', pageWidth / 2, 280, { align: 'center' });
  
  // Download
  pdf.save(`${student.name.replace(/\s+/g, '_')}_Portfolio.pdf`);
};

// Generate fee receipt PDF
export const generateFeeReceipt = (transaction: FeeTransaction) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  
  // Header
  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  pdf.text('TENACITY ERP', pageWidth / 2, 25, { align: 'center' });
  pdf.text('Fee Receipt', pageWidth / 2, 40, { align: 'center' });
  
  // Receipt Details
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Receipt ID: ${transaction.receiptId}`, 20, 65);
  pdf.text(`Date: ${new Date(transaction.date).toLocaleDateString()}`, 20, 80);
  
  // Student Details
  pdf.text(`Student Name: ${transaction.studentName}`, 20, 100);
  pdf.text(`Student ID: ${transaction.studentId}`, 20, 115);
  
  // Payment Details
  pdf.setFont(undefined, 'bold');
  pdf.text(`Amount Paid: ${formatCurrency(transaction.amount)}`, 20, 135);
  
  // Footer
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text('This is a computer-generated receipt.', pageWidth / 2, 200, { align: 'center' });
  pdf.text('Thank you for your payment.', pageWidth / 2, 215, { align: 'center' });
  
  // Download
  pdf.save(`Receipt_${transaction.receiptId}.pdf`);
};

// Generate NAAC report PDF
export const generateNAACReport = (students: Student[]) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const stats = generateStatistics(students);
  
  // Header
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text('TENACITY ERP', pageWidth / 2, 25, { align: 'center' });
  pdf.text('NAAC Assessment Report', pageWidth / 2, 40, { align: 'center' });
  
  // Institution Summary
  pdf.setFontSize(14);
  pdf.text('Institutional Summary', 20, 65);
  
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Total Students: ${stats.totalStudents}`, 20, 85);
  pdf.text(`Average Attendance: ${stats.avgAttendance}%`, 20, 100);
  pdf.text(`Average CGPA: ${stats.avgGPA}`, 20, 115);
  
  // Performance Distribution
  pdf.setFont(undefined, 'bold');
  pdf.text('Performance Distribution:', 20, 135);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Safe Students: ${stats.safeCount} (${((stats.safeCount/stats.totalStudents)*100).toFixed(1)}%)`, 25, 150);
  pdf.text(`Average Students: ${stats.averageCount} (${((stats.averageCount/stats.totalStudents)*100).toFixed(1)}%)`, 25, 165);
  pdf.text(`At-Risk Students: ${stats.atRiskCount} (${((stats.atRiskCount/stats.totalStudents)*100).toFixed(1)}%)`, 25, 180);
  
  // Quality Indicators
  pdf.setFont(undefined, 'bold');
  pdf.text('Quality Indicators:', 20, 200);
  pdf.setFont(undefined, 'normal');
  pdf.text(`• Academic Performance: ${stats.avgGPA >= 7 ? 'Excellent' : stats.avgGPA >= 6 ? 'Good' : 'Needs Improvement'}`, 25, 215);
  pdf.text(`• Attendance Rate: ${stats.avgAttendance >= 85 ? 'Excellent' : stats.avgAttendance >= 75 ? 'Good' : 'Needs Improvement'}`, 25, 230);
  pdf.text(`• Student Retention: ${((stats.totalStudents - stats.atRiskCount)/stats.totalStudents*100).toFixed(1)}%`, 25, 245);
  
  // Footer
  pdf.setFontSize(10);
  pdf.text(`Report generated on: ${new Date().toLocaleDateString()}`, 20, 270);
  pdf.text('Tenacity ERP - Institutional Excellence', pageWidth / 2, 280, { align: 'center' });
  
  // Download
  pdf.save(`NAAC_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Text-to-Speech utility using Web Speech API
export const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Text-to-Speech not supported in this browser');
  }
};