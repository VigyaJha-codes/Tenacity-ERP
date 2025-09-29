# Tenacity ERP - Education Management System

**Smart India Hackathon 2025 Prototype**

A comprehensive frontend-only educational management platform with role-based dashboards, real-time analytics, and intelligent student management features.

## 🚀 Features Implemented

### ✅ Core Functionality
- **Role-based Authentication**: Student, Faculty, Admin portals
- **Student Dashboard**: Read-only view with CGPA calculator, portfolio download
- **Faculty Dashboard**: Edit marks, attendance, add notes and achievements
- **Admin Dashboard**: Statistics, charts, NAAC reports, system management
- **Early Warning System**: Visual indicators for at-risk students (🔻📉⭕)

### ✅ Modules
- **Admissions**: Add new students with auto-calculated CGPA
- **Fee Management**: Payment processing with PDF receipt generation
- **Hostel Allocation**: Room management and student assignment
- **CGPA Calculator**: Real-time prediction with hypothetical marks
- **Chatbot**: Keyword-based assistance for common queries

### ✅ Accessibility
- **High Contrast Mode**: Toggle for better visibility
- **Dyslexia-Friendly Fonts**: Lexend font support
- **Text-to-Speech**: Web Speech API integration
- **Responsive Design**: Mobile and desktop optimized

### ✅ Technical Features
- **PDF Generation**: Student portfolios, fee receipts, NAAC reports
- **Data Persistence**: localStorage with fallback to mock data
- **Interactive Charts**: Bar and pie charts for analytics
- **Modern UI**: Gradient designs, animations, hover effects

## 🎯 Demo Users

- **Student**: Aman Kumar (s1) - View-only access to personal data
- **Faculty**: Dr. Sarah Johnson - Edit student records and grades  
- **Admin**: Full system access with reporting capabilities

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Chart.js + react-chartjs-2
- **PDF**: jsPDF for document generation
- **Icons**: Lucide React
- **Build**: Vite
- **UI Components**: shadcn/ui

## 📊 Data Structure

Uses exact 10-student dataset as specified:
- Initial attendance and marks data
- Calculated CGPA and status
- Real-time updates with localStorage persistence

## 🎨 Design System

- **Primary**: Professional Blue (#4F46E5)
- **Secondary**: Energetic Orange (#F97316)  
- **Success**: Fresh Green (#059669)
- **Gradients**: Multiple themed gradients
- **Typography**: Inter + Lexend for accessibility

## 🔧 Getting Started

```bash
npm install
npm run dev
```

Access the application and select your role to explore different dashboards.

## 📋 SIH Requirements Compliance

✅ Role chooser with Student/Faculty/Admin access  
✅ Exact 10-student JSON dataset implementation  
✅ Read-only student dashboard with CGPA calculator  
✅ Editable faculty dashboard with marks management  
✅ Admin dashboard with summary cards and charts  
✅ Admissions form with auto-CGPA calculation  
✅ Fee module with PDF receipt generation  
✅ Hostel allocation system  
✅ Rule-based early warning indicators  
✅ Basic chatbot with keyword responses  
✅ Accessibility features (contrast, fonts, TTS)  
✅ Modern, colorful UI with responsive design  

## 🏆 Judge Demo Script

1. **Role Selection**: Choose Student → Faculty → Admin
2. **Student View**: Explore read-only dashboard, use CGPA calculator
3. **Faculty Features**: Edit student marks, see real-time updates
4. **Admin Analytics**: View charts, generate NAAC report
5. **Modules**: Try admissions, fee payment, hostel allocation
6. **Accessibility**: Toggle high contrast and dyslexia fonts
7. **Chatbot**: Ask about "fees", "exams", "hostel"

## 🎓 Educational Impact

This prototype demonstrates how modern web technologies can revolutionize educational administration, providing real-time insights, early intervention capabilities, and seamless user experiences across all stakeholder roles.

---

**Team**: Tenacity ERP Development Team  
**Event**: Smart India Hackathon 2025  
**Category**: Educational Technology Solutions
