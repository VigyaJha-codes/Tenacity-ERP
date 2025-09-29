import { Student } from '../types';

export const mockStudents: Student[] = [
  {"id":"s1","name":"Aman Kumar","attendance":65,"marks":55,"gpa":6.8,"status":"At-Risk"},
  {"id":"s2","name":"Riya Singh","attendance":88,"marks":82,"gpa":8.2,"status":"Safe"},
  {"id":"s3","name":"Vikram Patel","attendance":58,"marks":40,"gpa":5.0,"status":"At-Risk"},
  {"id":"s4","name":"Priya Sharma","attendance":92,"marks":91,"gpa":9.1,"status":"Safe"},
  {"id":"s5","name":"Rahul Verma","attendance":74,"marks":68,"gpa":6.5,"status":"Average"},
  {"id":"s6","name":"Neha Gupta","attendance":80,"marks":75,"gpa":7.4,"status":"Safe"},
  {"id":"s7","name":"Karan Joshi","attendance":69,"marks":60,"gpa":6.0,"status":"Average"},
  {"id":"s8","name":"Sneha Reddy","attendance":54,"marks":38,"gpa":4.7,"status":"At-Risk"},
  {"id":"s9","name":"Dev Anand","attendance":86,"marks":79,"gpa":7.8,"status":"Safe"},
  {"id":"s10","name":"Meera Nair","attendance":71,"marks":65,"gpa":6.3,"status":"Average"}
];

export const mockHostelRooms = [
  { id: 'R101', capacity: 4, occupied: 3, occupants: ['s1', 's2', 's3'] },
  { id: 'R102', capacity: 4, occupied: 2, occupants: ['s4', 's5'] },
  { id: 'R103', capacity: 4, occupied: 4, occupants: ['s6', 's7', 's8', 's9'] },
  { id: 'R104', capacity: 4, occupied: 1, occupants: ['s10'] },
  { id: 'R105', capacity: 4, occupied: 0, occupants: [] },
];