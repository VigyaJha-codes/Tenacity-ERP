// Tenacity ERP Core Types

export type UserRole = 'Student' | 'Faculty' | 'Admin';

export interface Student {
  id: string;
  name: string;
  attendance: number;
  marks: number;
  gpa: number;
  status: 'Safe' | 'Average' | 'At-Risk';
  absentFlag?: boolean;
  notes?: string[];
  achievements?: string[];
  certificates?: string[];
}

export interface FeeTransaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  receiptId: string;
}

export interface HostelRoom {
  id: string;
  capacity: number;
  occupied: number;
  occupants: string[];
}

export interface AppState {
  currentUser: {
    id: string;
    name: string;
    role: UserRole;
  } | null;
  students: Student[];
  feeTransactions: FeeTransaction[];
  hostelRooms: HostelRoom[];
  isHighContrast: boolean;
  isDyslexiaFriendly: boolean;
}

export interface EarlyWarningRules {
  lowAttendance: number; // Below this percentage shows 🔻
  performanceDrop: number; // Percentage drop shows 📉
}

export interface CGPACalculation {
  subjects: Array<{
    name: string;
    credits: number;
    marks: number;
  }>;
  totalCredits: number;
  weightedTotal: number;
  cgpa: number;
}