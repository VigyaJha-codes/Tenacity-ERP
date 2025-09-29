import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Student, FeeTransaction, HostelRoom } from '../types';
import { generateStatistics, formatCurrency } from '../utils/calculations';
import { generateNAACReport } from '../utils/pdf';
import { storageUtils } from '../utils/storage';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Download,
  Building,
  DollarSign,
  FileText,
  RefreshCw,
  BarChart3,
  PieChart
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AdminDashboardProps {
  students: Student[];
  feeTransactions: FeeTransaction[];
  hostelRooms: HostelRoom[];
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  feeTransactions,
  hostelRooms,
  onResetData,
}) => {
  const stats = generateStatistics(students);
  const totalFees = feeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalHostelCapacity = hostelRooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalHostelOccupied = hostelRooms.reduce((sum, r) => sum + r.occupied, 0);
  const hostelOccupancy = totalHostelCapacity > 0 ? (totalHostelOccupied / totalHostelCapacity) * 100 : 0;

  // Chart data
  const attendanceChartData = {
    labels: ['90-100%', '80-89%', '70-79%', '60-69%', '<60%'],
    datasets: [
      {
        label: 'Students',
        data: [
          students.filter(s => s.attendance >= 90).length,
          students.filter(s => s.attendance >= 80 && s.attendance < 90).length,
          students.filter(s => s.attendance >= 70 && s.attendance < 80).length,
          students.filter(s => s.attendance >= 60 && s.attendance < 70).length,
          students.filter(s => s.attendance < 60).length,
        ],
        backgroundColor: [
          'hsl(142, 76%, 45%)',
          'hsl(142, 70%, 55%)',
          'hsl(38, 92%, 50%)',
          'hsl(38, 85%, 65%)',
          'hsl(0, 84%, 60%)',
        ],
        borderColor: [
          'hsl(142, 76%, 40%)',
          'hsl(142, 70%, 50%)',
          'hsl(38, 92%, 45%)',
          'hsl(38, 85%, 60%)',
          'hsl(0, 84%, 55%)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const statusPieData = {
    labels: ['Safe', 'Average', 'At-Risk'],
    datasets: [
      {
        data: [stats.safeCount, stats.averageCount, stats.atRiskCount],
        backgroundColor: [
          'hsl(142, 76%, 45%)',
          'hsl(38, 92%, 50%)',
          'hsl(0, 84%, 60%)',
        ],
        borderColor: [
          'hsl(142, 76%, 40%)',
          'hsl(38, 92%, 45%)',
          'hsl(0, 84%, 55%)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Admin Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary text-white hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalStudents}</p>
            <p className="text-sm opacity-90">Active enrollments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success text-white hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Avg Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.avgAttendance}%</p>
            <p className="text-sm opacity-90">
              {stats.avgAttendance >= 85 ? 'Excellent' : stats.avgAttendance >= 75 ? 'Good' : 'Needs Improvement'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary text-white hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Hostel Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{hostelOccupancy.toFixed(1)}%</p>
            <p className="text-sm opacity-90">
              {totalHostelOccupied}/{totalHostelCapacity} capacity
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-hero text-white hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Fees Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalFees)}</p>
            <p className="text-sm opacity-90">{feeTransactions.length} transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Alert */}
      {stats.atRiskCount > 0 && (
        <Card className="border-danger bg-danger/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger">
              <AlertTriangle className="h-5 w-5" />
              Critical Alert: {stats.atRiskCount} Students At-Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Immediate attention required for students with low attendance or poor performance.
            </p>
            <div className="space-y-2">
              {students
                .filter(s => s.status === 'At-Risk')
                .slice(0, 5)
                .map((student) => (
                  <div key={student.id} className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="font-medium">{student.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {student.attendance}% attendance, {student.gpa.toFixed(2)} CGPA
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Attendance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={attendanceChartData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Student Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie data={statusPieData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Institutional Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-sm mb-2">Academic Excellence</h4>
              <Progress value={stats.avgGPA * 10} className="h-2 mb-1" />
              <p className="text-sm text-muted-foreground">
                Average CGPA: {stats.avgGPA.toFixed(2)}/10.0
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Attendance Rate</h4>
              <Progress value={stats.avgAttendance} className="h-2 mb-1" />
              <p className="text-sm text-muted-foreground">
                {stats.avgAttendance.toFixed(1)}% average attendance
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Student Retention</h4>
              <Progress 
                value={((stats.totalStudents - stats.atRiskCount) / stats.totalStudents) * 100} 
                className="h-2 mb-1" 
              />
              <p className="text-sm text-muted-foreground">
                {((stats.totalStudents - stats.atRiskCount) / stats.totalStudents * 100).toFixed(1)}% retention rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => generateNAACReport(students)}
              className="w-full bg-gradient-primary"
            >
              <Download className="h-4 w-4 mr-2" />
              NAAC Sample Report
            </Button>
            <Button 
              onClick={() => storageUtils.exportStudentsAsCSV(students)}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Database (CSV)
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Quality Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Academic Performance:</span>
              <span className={`text-sm font-medium ${stats.avgGPA >= 7 ? 'text-success' : stats.avgGPA >= 6 ? 'text-warning' : 'text-danger'}`}>
                {stats.avgGPA >= 7 ? 'Excellent' : stats.avgGPA >= 6 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Attendance Rate:</span>
              <span className={`text-sm font-medium ${stats.avgAttendance >= 85 ? 'text-success' : stats.avgAttendance >= 75 ? 'text-warning' : 'text-danger'}`}>
                {stats.avgAttendance >= 85 ? 'Excellent' : stats.avgAttendance >= 75 ? 'Good' : 'Critical'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">At-Risk Students:</span>
              <span className={`text-sm font-medium ${stats.atRiskCount === 0 ? 'text-success' : stats.atRiskCount <= 2 ? 'text-warning' : 'text-danger'}`}>
                {stats.atRiskCount} ({((stats.atRiskCount/stats.totalStudents)*100).toFixed(1)}%)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              System Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onResetData}
              variant="outline"
              className="w-full text-danger hover:bg-danger/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Demo Data
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Resets all data to initial state for demo purposes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};