import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Student, HostelRoom } from '../types';
import { toast } from '../hooks/use-toast';
import { 
  Building, 
  Users, 
  UserPlus, 
  UserMinus, 
  Home,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface HostelPanelProps {
  students: Student[];
  hostelRooms: HostelRoom[];
  onUpdateRooms: (rooms: HostelRoom[]) => void;
}

export const HostelPanel: React.FC<HostelPanelProps> = ({
  students,
  hostelRooms,
  onUpdateRooms,
}) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  // Calculate occupancy statistics
  const totalCapacity = hostelRooms.reduce((sum, room) => sum + room.capacity, 0);
  const totalOccupied = hostelRooms.reduce((sum, room) => sum + room.occupied, 0);
  const occupancyRate = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;
  const availableRooms = hostelRooms.filter(room => room.occupied < room.capacity);

  // Get students who are not allocated to any room
  const allocatedStudentIds = hostelRooms.flatMap(room => room.occupants);
  const unallocatedStudents = students.filter(student => !allocatedStudentIds.includes(student.id));

  const handleAllocateStudent = () => {
    if (!selectedStudent || !selectedRoom) {
      toast({
        title: "Missing Information",
        description: "Please select both a student and a room",
        variant: "destructive",
      });
      return;
    }

    const room = hostelRooms.find(r => r.id === selectedRoom);
    const student = students.find(s => s.id === selectedStudent);

    if (!room || !student) {
      toast({
        title: "Error",
        description: "Invalid room or student selection",
        variant: "destructive",
      });
      return;
    }

    if (room.occupied >= room.capacity) {
      toast({
        title: "Room Full",
        description: `Room ${room.id} is at full capacity`,
        variant: "destructive",
      });
      return;
    }

    const updatedRooms = hostelRooms.map(r => {
      if (r.id === selectedRoom) {
        return {
          ...r,
          occupied: r.occupied + 1,
          occupants: [...r.occupants, selectedStudent],
        };
      }
      return r;
    });

    onUpdateRooms(updatedRooms);
    
    toast({
      title: "Student Allocated",
      description: `${student.name} has been allocated to room ${room.id}`,
    });

    setSelectedStudent('');
    setSelectedRoom('');
  };

  const handleDeallocateStudent = (roomId: string, studentId: string) => {
    const room = hostelRooms.find(r => r.id === roomId);
    const student = students.find(s => s.id === studentId);

    if (!room || !student) return;

    const updatedRooms = hostelRooms.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          occupied: Math.max(0, r.occupied - 1),
          occupants: r.occupants.filter(id => id !== studentId),
        };
      }
      return r;
    });

    onUpdateRooms(updatedRooms);
    
    toast({
      title: "Student Deallocated",
      description: `${student.name} has been removed from room ${room.id}`,
    });
  };

  const getRoomStatusColor = (room: HostelRoom) => {
    const occupancyPercent = (room.occupied / room.capacity) * 100;
    if (occupancyPercent === 100) return 'status-at-risk';
    if (occupancyPercent >= 75) return 'status-average';
    return 'status-safe';
  };

  const getRoomStatusIcon = (room: HostelRoom) => {
    const occupancyPercent = (room.occupied / room.capacity) * 100;
    if (occupancyPercent === 100) return <AlertCircle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hostel Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary text-white hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Total Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{hostelRooms.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success text-white hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{occupancyRate.toFixed(1)}%</p>
            <p className="text-sm opacity-90">{totalOccupied}/{totalCapacity} beds</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary text-white hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5" />
              Available Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{availableRooms.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-hero text-white hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Unallocated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{unallocatedStudents.length}</p>
            <p className="text-sm opacity-90">Students</p>
          </CardContent>
        </Card>
      </div>

      {/* Room Allocation Form */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Allocate Student to Room
          </CardTitle>
          <CardDescription>
            Assign unallocated students to available hostel rooms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Student</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose unallocated student" />
                </SelectTrigger>
                <SelectContent>
                  {unallocatedStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Room</label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose available room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.id} ({room.occupied}/{room.capacity} occupied)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleAllocateStudent}
            disabled={!selectedStudent || !selectedRoom}
            className="bg-gradient-primary"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Allocate Student
          </Button>
        </CardContent>
      </Card>

      {/* Rooms Table */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Room Management</CardTitle>
          <CardDescription>
            Current room occupancy and student allocations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room ID</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupied</TableHead>
                <TableHead>Occupancy %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Occupants</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hostelRooms.map((room) => {
                const occupancyPercent = (room.occupied / room.capacity) * 100;
                return (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.id}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{room.occupied}</TableCell>
                    <TableCell>{occupancyPercent.toFixed(0)}%</TableCell>
                    <TableCell>
                      <Badge className={`${getRoomStatusColor(room)} flex items-center gap-1 w-fit`}>
                        {getRoomStatusIcon(room)}
                        {occupancyPercent === 100 ? 'Full' : occupancyPercent >= 75 ? 'Nearly Full' : 'Available'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {room.occupants.map((studentId) => {
                          const student = students.find(s => s.id === studentId);
                          return student ? (
                            <div key={studentId} className="flex items-center justify-between text-sm bg-muted/30 px-2 py-1 rounded">
                              <span>{student.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeallocateStudent(room.id, studentId)}
                                className="h-6 w-6 p-0 text-danger hover:bg-danger/10"
                              >
                                <UserMinus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : null;
                        })}
                        {room.occupants.length === 0 && (
                          <span className="text-sm text-muted-foreground italic">No occupants</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {room.occupied < room.capacity ? (
                        <Badge variant="outline" className="text-success border-success">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-danger border-danger">
                          Full
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Unallocated Students Alert */}
      {unallocatedStudents.length > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              Unallocated Students ({unallocatedStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {unallocatedStudents.map((student) => (
                <div key={student.id} className="p-3 border border-warning/20 rounded-lg bg-white">
                  <h4 className="font-medium">{student.name}</h4>
                  <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                  <p className="text-sm text-muted-foreground">Status: {student.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};