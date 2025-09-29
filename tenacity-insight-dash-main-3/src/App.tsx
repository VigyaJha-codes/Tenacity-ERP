import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Components
import { Header } from './components/Header';
import { StudentDashboard } from './components/StudentDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdmissionsForm } from './components/AdmissionsForm';
import { FeeForm } from './components/FeeForm';
import { HostelPanel } from './components/HostelPanel';
import { Chatbot } from './components/Chatbot';

// Types and Utils
import { UserRole, Student, FeeTransaction, HostelRoom } from './types';
import { storageUtils } from './utils/storage';
import { mockStudents, mockHostelRooms } from './data/mockStudents';

const queryClient = new QueryClient();

const App = () => {
  // State management
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: UserRole } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [feeTransactions, setFeeTransactions] = useState<FeeTransaction[]>([]);
  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>([]);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isDyslexiaFriendly, setIsDyslexiaFriendly] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      setStudents(storageUtils.getStudents());
      setFeeTransactions(storageUtils.getTransactions());
      setHostelRooms(storageUtils.getRooms());
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      // Fallback to mock data
      setStudents(mockStudents);
      setHostelRooms(mockHostelRooms);
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (students.length > 0) {
      storageUtils.setStudents(students);
    }
  }, [students]);

  useEffect(() => {
    if (feeTransactions.length > 0) {
      storageUtils.setTransactions(feeTransactions);
    }
  }, [feeTransactions]);

  useEffect(() => {
    if (hostelRooms.length > 0) {
      storageUtils.setRooms(hostelRooms);
    }
  }, [hostelRooms]);

  // Accessibility effects
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    if (isDyslexiaFriendly) {
      document.body.classList.add('dyslexia-friendly');
    } else {
      document.body.classList.remove('dyslexia-friendly');
    }
  }, [isDyslexiaFriendly]);

  // Role change handler with mock user data
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    
    // Mock user data based on role
    if (role === 'Student') {
      const student = students[0]; // Use first student as example
      setCurrentUser({
        id: student?.id || 's1',
        name: student?.name || 'Aman Kumar',
        role: 'Student'
      });
    } else if (role === 'Faculty') {
      setCurrentUser({
        id: 'f001',
        name: 'Dr. Sarah Johnson',
        role: 'Faculty'
      });
    } else if (role === 'Admin') {
      setCurrentUser({
        id: 'a001',
        name: 'Admin User',
        role: 'Admin'
      });
    }
  };

  // Data handlers
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const handleAddTransaction = (transaction: FeeTransaction) => {
    setFeeTransactions(prev => [...prev, transaction]);
  };

  const handleUpdateRooms = (updatedRooms: HostelRoom[]) => {
    setHostelRooms(updatedRooms);
  };

  const handleResetData = () => {
    storageUtils.resetAllData();
    setStudents(mockStudents);
    setFeeTransactions([]);
    setHostelRooms(mockHostelRooms);
  };

  // Get current student data for student role
  const getCurrentStudent = (): Student | undefined => {
    if (currentRole === 'Student' && currentUser) {
      return students.find(s => s.id === currentUser.id);
    }
    return undefined;
  };

  // Render role selector if no role selected
  if (!currentRole) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-fadeIn">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to</h1>
                  <h2 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                    Tenacity ERP
                  </h2>
                  <p className="text-gray-600 mt-2">Education Management System</p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-700 mb-6">Select your role to continue:</p>
                  
                  <button
                    onClick={() => handleRoleChange('Student')}
                    className="w-full p-4 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all duration-300 hover-lift"
                  >
                    <div className="font-semibold">Student Portal</div>
                    <div className="text-sm opacity-90">View grades, attendance, and records</div>
                  </button>
                  
                  <button
                    onClick={() => handleRoleChange('Faculty')}
                    className="w-full p-4 bg-gradient-secondary text-white rounded-lg hover:opacity-90 transition-all duration-300 hover-lift"
                  >
                    <div className="font-semibold">Faculty Portal</div>
                    <div className="text-sm opacity-90">Manage students and grades</div>
                  </button>
                  
                  <button
                    onClick={() => handleRoleChange('Admin')}
                    className="w-full p-4 bg-gradient-success text-white rounded-lg hover:opacity-90 transition-all duration-300 hover-lift"
                  >
                    <div className="font-semibold">Admin Portal</div>
                    <div className="text-sm opacity-90">System administration and reports</div>
                  </button>
                </div>
                
                <div className="mt-8 text-xs text-gray-500">
                  Demo System - Smart India Hackathon 2025
                </div>
              </div>
            </div>
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Header
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            currentUser={currentUser}
            isHighContrast={isHighContrast}
            isDyslexiaFriendly={isDyslexiaFriendly}
            onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
            onToggleDyslexiaFriendly={() => setIsDyslexiaFriendly(!isDyslexiaFriendly)}
          />

          <main className="container mx-auto px-6 py-8">
            {/* Student View - Read Only */}
            {currentRole === 'Student' && (
              <div>
                {getCurrentStudent() ? (
                  <StudentDashboard student={getCurrentStudent()!} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">Student data not found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Faculty View - Editable */}
            {currentRole === 'Faculty' && (
              <div>
                <FacultyDashboard
                  students={students}
                  onUpdateStudent={handleUpdateStudent}
                />
              </div>
            )}

            {/* Admin View - Full Access */}
            {currentRole === 'Admin' && (
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="admissions">Admissions</TabsTrigger>
                  <TabsTrigger value="fees">Fee Module</TabsTrigger>
                  <TabsTrigger value="hostel">Hostel</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty View</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="mt-6">
                  <AdminDashboard
                    students={students}
                    feeTransactions={feeTransactions}
                    hostelRooms={hostelRooms}
                    onResetData={handleResetData}
                  />
                </TabsContent>

                <TabsContent value="admissions" className="mt-6">
                  <AdmissionsForm onAddStudent={handleAddStudent} />
                </TabsContent>

                <TabsContent value="fees" className="mt-6">
                  <FeeForm
                    students={students}
                    onAddTransaction={handleAddTransaction}
                  />
                </TabsContent>

                <TabsContent value="hostel" className="mt-6">
                  <HostelPanel
                    students={students}
                    hostelRooms={hostelRooms}
                    onUpdateRooms={handleUpdateRooms}
                  />
                </TabsContent>

                <TabsContent value="faculty" className="mt-6">
                  <FacultyDashboard
                    students={students}
                    onUpdateStudent={handleUpdateStudent}
                  />
                </TabsContent>
              </Tabs>
            )}
          </main>

          {/* Chatbot */}
          <Chatbot
            isOpen={isChatbotOpen}
            onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
          />
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
