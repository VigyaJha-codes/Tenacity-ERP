import { Student, FeeTransaction, HostelRoom } from '../types';
import { mockStudents, mockHostelRooms } from '../data/mockStudents';

const STORAGE_KEYS = {
  STUDENTS: 'tenacity_students',
  TRANSACTIONS: 'tenacity_transactions',
  ROOMS: 'tenacity_rooms',
} as const;

// Local storage utilities with fallback to mock data
export const storageUtils = {
  // Students
  getStudents: (): Student[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return stored ? JSON.parse(stored) : mockStudents;
    } catch {
      return mockStudents;
    }
  },

  setStudents: (students: Student[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (error) {
      console.error('Failed to save students to localStorage:', error);
    }
  },

  // Transactions
  getTransactions: (): FeeTransaction[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setTransactions: (transactions: FeeTransaction[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions to localStorage:', error);
    }
  },

  // Hostel Rooms
  getRooms: (): HostelRoom[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROOMS);
      return stored ? JSON.parse(stored) : mockHostelRooms;
    } catch {
      return mockHostelRooms;
    }
  },

  setRooms: (rooms: HostelRoom[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    } catch (error) {
      console.error('Failed to save rooms to localStorage:', error);
    }
  },

  // Reset all data to initial state
  resetAllData: () => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(mockStudents));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(mockHostelRooms));
    } catch (error) {
      console.error('Failed to reset data:', error);
    }
  },

  // Export data as CSV
  exportStudentsAsCSV: (students: Student[]) => {
    const headers = ['ID', 'Name', 'Attendance %', 'Marks', 'GPA', 'Status'];
    const csvContent = [
      headers.join(','),
      ...students.map(s => [
        s.id,
        `"${s.name}"`,
        s.attendance,
        s.marks,
        s.gpa,
        s.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenacity_students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },
};