export interface Patient {
  id: string;
  name: string;
  age: number | string;
  gender: string;
  ward: string;
  doctor: string;
  diagnosis: string;
  blood: string;
  status: 'admitted' | 'critical' | 'stable' | 'discharged' | 'scheduled';
  date: string;
  phoneNo?: string;
  emergencyContact?: string;
  allergies?: string;
  relationshipType?: string;
  relationship?: string;
  whatsappNo?: string;
  emailId?: string;
  address?: string;
  pinCode?: number;
  city?: string;
  stateId?: number;
}

export interface Medication {
  name: string;
  cat: string;
  qty: number;
  max: number;
  low: boolean;
}

export interface Appointment {
  time: string;
  patient: string;
  doctor: string;
  type: string;
  department: string;
  status: 'admitted' | 'stable' | 'scheduled';
}

export interface Invoice {
  id: string;
  patient: string;
  department: string;
  services: string;
  amount: string;
  insurance: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  isActive?: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
}

export interface Tenant {
  id: number;
  name: string;
  location: string;
  isActive?: boolean;
}

export interface Qualification {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
}

export interface Availability {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
}

export interface Task {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface ScheduleTemplate {
  id: number;
  name: string;
  opdSlotTime: number;
  schedule: DaySchedule[];
  isActive?: boolean;
}

export interface DaySchedule {
  day: string;
  tasks: ScheduleTask[];
}

export interface ScheduleTask {
  id: number;
  taskName: string;
  fromTime: string;
  toTime: string;
}

export interface Reason {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface State {
  id: number;
  name: string;
  stateCode?: string;
  isActive?: boolean;
}

export interface StaffShiftAssignment {
  id: string;
  days: string[];
  shifts: string[];
}

export interface TimeOffRequest {
  id: number;
  staffId: number;
  staffName: string;
  startDateTime: string;
  endDateTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  roleId?: number;
  department: string;
  departmentId?: number;
  specialization: string[];
  qualifications: string[];
  phone: string;
  status: 'admitted' | 'scheduled';
  assignedShifts: StaffShiftAssignment[];
  opdWindow?: string;
  hospital: string;
  tenant?: number;
  tenantId?: number;
  scheduleTemplateId?: number;
  scheduleTemplate?: string;
  isActive: boolean;
  availability?: string;
}
