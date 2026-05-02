import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { NewPatientModal } from './components/NewPatientModal';
import { NewDoctorModal } from './components/NewDoctorModal';
import { NewDepartmentModal } from './components/NewDepartmentModal';
import { EditScheduleModal } from './components/EditScheduleModal';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Beds } from './pages/Beds';
import { Appointments } from './pages/Appointments';
import { Pharmacy } from './pages/Pharmacy';
import { Billing } from './pages/Billing';
import { Staff } from './pages/Staff';
import { Departments } from './pages/Departments';
import { Schedules } from './pages/Schedules';
import { Reports } from './pages/Reports';
import { Configuration } from './pages/Configuration';
import { TimeOffRequests } from './pages/TimeOffRequests';
import { staffList, initialDepartments, initialTenants, initialQualifications, initialAvailabilities, initialShifts } from './data';
import { Patient, Staff as StaffType, Department, Role, Tenant, Qualification, Availability, Shift, State, Reason, Task, ScheduleTemplate } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  
  const [staff, setStaff] = useState<StaffType[]>(staffList);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [roles, setRoles] = useState<Role[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [qualifications, setQualifications] = useState<Qualification[]>(initialQualifications);
  const [availabilities, setAvailabilities] = useState<Availability[]>(initialAvailabilities);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [states, setStates] = useState<State[]>([]);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'OPD', description: 'Outpatient Department', isActive: true },
    { id: 2, name: 'Surgery', description: 'Surgical procedures', isActive: true },
  ]);
  const [scheduleTemplates, setScheduleTemplates] = useState<ScheduleTemplate[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<any[]>([]);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffType | null>(null);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [scheduleModalStaff, setScheduleModalStaff] = useState<StaffType | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles');
        if (!response.ok) throw new Error('Failed to fetch roles');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
        if (!response.ok) throw new Error('Failed to fetch departments');
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/staff');
        if (!response.ok) throw new Error('Failed to fetch staff');
        const data = await response.json();
        if (data && data.length > 0) {
          setStaff(data);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/tenants');
        if (!response.ok) throw new Error('Failed to fetch tenants');
        const data = await response.json();
        setTenants(data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/states');
        if (!response.ok) throw new Error('Failed to fetch states');
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    const fetchReasons = async () => {
      try {
        const response = await fetch('/api/reasons');
        if (!response.ok) throw new Error('Failed to fetch reasons');
        const data = await response.json();
        setReasons(data);
      } catch (error) {
        console.error('Error fetching reasons:', error);
      }
    };
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients');
        if (!response.ok) throw new Error('Failed to fetch patients');
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments');
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    const fetchScheduleTemplates = async () => {
      try {
        const response = await fetch('/api/scheduleTemplates');
        if (!response.ok) throw new Error('Failed to fetch schedule templates');
        const data = await response.json();
        setScheduleTemplates(data);
      } catch (error) {
        console.error('Error fetching schedule templates:', error);
      }
    };
    fetchRoles();
    fetchDepartments();
    fetchStaff();
    fetchTenants();
    fetchStates();
    fetchReasons();
    fetchPatients();
    fetchAppointments();
    fetchScheduleTemplates();

    const fetchTimeOffRequests = async () => {
      try {
        const response = await fetch('/api/timeOff');
        if (!response.ok) throw new Error('Failed to fetch time off requests');
        const data = await response.json();
        const mappedData = data.map((item: any) => ({
          id: item.id,
          staffId: item.staff_id,
          staffName: item.staff_name,
          startDateTime: item.start_date_time,
          endDateTime: item.end_date_time,
          reason: item.reason,
          status: item.status,
          createdAt: item.created_at
        }));
        setTimeOffRequests(mappedData);
      } catch (error) {
        console.error('Error fetching time off requests:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
    fetchTimeOffRequests();
  }, []);

  const handleSavePatient = useCallback(async (newPatient: Patient) => {
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });
      if (!response.ok) throw new Error('Failed to add patient');
      const savedPatient = await response.json();
      setPatients(prev => [savedPatient, ...prev]);
      setActiveTab('patients');
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  }, []);

  const handleUpdatePatient = useCallback(async (updatedPatient: Patient) => {
    try {
      const patientIdStr = updatedPatient.id;
      const numericId = typeof patientIdStr === 'string' ? parseInt(patientIdStr.replace('P-', ''), 10) : patientIdStr;
      if (!numericId || isNaN(numericId)) {
        throw new Error('Invalid patient ID');
      }
      const response = await fetch(`/api/patients/${numericId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPatient),
      });
      if (!response.ok) throw new Error('Failed to update patient');
      const savedPatient = await response.json();
      setPatients(prev => prev.map(p => p.id === updatedPatient.id ? savedPatient : p));
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  }, []);

  const handleToggleStaffStatus = async (id: number) => {
    const target = staff.find(s => s.id === id);
    if (!target) return;
    try {
      const updated = { ...target, isActive: !target.isActive };
      const response = await fetch(`/api/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!response.ok) throw new Error('Failed to toggle staff status');
      setStaff(prev => prev.map(s => s.id === id ? updated : s));
    } catch (error) {
      console.error('Error toggling staff status:', error);
    }
  };

  const handleDeleteStaff = async (id: number) => {
    try {
      const response = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete staff');
      setStaff(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  const handleSaveStaff = async (staffData: StaffType) => {
    try {
      const method = editingStaff ? 'PUT' : 'POST';
      const endpoint = editingStaff ? `/api/staff/${staffData.id}` : '/api/staff';
      const payload = {
        name: staffData.name,
        roleId: Number(staffData.roleId) || Number(staffData.role) || 1,
        departmentId: Number(staffData.departmentId) || Number(staffData.department) || 1,
        phone: staffData.phone,
        status: staffData.status,
        opdWindow: staffData.opdWindow || '15 min',
        tenantId: Number(staffData.tenantId) || Number(staffData.tenant) || Number(staffData.hospital) || 1,
        scheduleTemplateId: staffData.scheduleTemplateId || null,
        isActive: staffData.isActive
      };
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to save staff');
      const savedStaff = await response.json();
      if (editingStaff) {
        setStaff(prev => prev.map(s => s.id === savedStaff.id ? savedStaff : s));
      } else {
        setStaff(prev => [savedStaff, ...prev]);
      }
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const handleAddDepartment = async (newDept: Department) => {
    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDept),
      });
      if (!response.ok) throw new Error('Failed to add department');
      const savedDept = await response.json();
      setDepartments(prev => [...prev, savedDept]);
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const handleUpdateDepartment = async (updatedDept: Department) => {
    try {
      const response = await fetch(`/api/departments/${updatedDept.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDept),
      });
      if (!response.ok) throw new Error('Failed to update department');
      setDepartments(prev => prev.map(d => d.id === updatedDept.id ? updatedDept : d));
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    try {
      const response = await fetch(`/api/departments/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete department');
      setDepartments(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleToggleDepartment = (id: number) => {
    const dept = departments.find(d => d.id === id);
    if (dept) {
      handleUpdateDepartment({ ...dept, isActive: !dept.isActive });
    }
  };

  const handleAddRole = async (newRole: Role) => {
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole),
      });
      if (!response.ok) throw new Error('Failed to add role');
      const savedRole = await response.json();
      setRoles(prev => [...prev, savedRole]);
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  const handleUpdateRole = async (updatedRole: Role) => {
    try {
      const response = await fetch(`/api/roles/${updatedRole.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRole),
      });
      if (!response.ok) throw new Error('Failed to update role');
      const savedRole = await response.json();
      setRoles(prev => prev.map(r => r.id === savedRole.id ? savedRole : r));
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const response = await fetch(`/api/roles/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete role');
      setRoles(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleToggleRole = (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role) {
      handleUpdateRole({ ...role, isActive: !role.isActive });
    }
  };

  const handleAddTenant = async (newTenant: Tenant) => {
    try {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTenant),
      });
      if (!response.ok) throw new Error('Failed to add tenant');
      const savedTenant = await response.json();
      setTenants(prev => [...prev, savedTenant]);
    } catch (error) {
      console.error('Error adding tenant:', error);
    }
  };

  const handleUpdateTenant = async (updatedTenant: Tenant) => {
    try {
      const response = await fetch(`/api/tenants/${updatedTenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTenant),
      });
      if (!response.ok) throw new Error('Failed to update hospital');
      const savedTenant = await response.json();
      setTenants(prev => prev.map(t => t.id === savedTenant.id ? savedTenant : t));
    } catch (error) {
      console.error('Error updating hospital:', error);
    }
  };

  const handleDeleteTenant = async (id: number) => {
    try {
      const response = await fetch(`/api/tenants/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete hospital');
      setTenants(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting hospital:', error);
    }
  };

  const handleToggleTenant = (id: number) => {
    const tenant = tenants.find(t => t.id === id);
    if (tenant) {
      handleUpdateTenant({ ...tenant, isActive: !tenant.isActive });
    }
  };

  const handleAddQualification = async (newQual: Qualification) => {
    try {
      const response = await fetch('/api/qualifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQual),
      });
      if (!response.ok) throw new Error('Failed to add qualification');
      const savedQual = await response.json();
      setQualifications(prev => [...prev, savedQual]);
    } catch (error) {
      console.error('Error adding qualification:', error);
    }
  };

  const handleUpdateQualification = async (updatedQual: Qualification) => {
    try {
      const response = await fetch(`/api/qualifications/${updatedQual.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQual),
      });
      if (!response.ok) throw new Error('Failed to update qualification');
      setQualifications(prev => prev.map(q => q.id === updatedQual.id ? updatedQual : q));
    } catch (error) {
      console.error('Error updating qualification:', error);
    }
  };

  const handleDeleteQualification = async (id: string) => {
    try {
      const response = await fetch(`/api/qualifications/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete qualification');
      setQualifications(prev => prev.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting qualification:', error);
    }
  };

  const handleToggleQualification = (id: string) => {
    const qual = qualifications.find(q => q.id === id);
    if (qual) {
      handleUpdateQualification({ ...qual, isActive: !qual.isActive });
    }
  };

  const handleAddAvailability = async (newAvail: Availability) => {
    try {
      const response = await fetch('/api/availabilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAvail),
      });
      if (!response.ok) throw new Error('Failed to add availability');
      const savedAvail = await response.json();
      setAvailabilities(prev => [...prev, savedAvail]);
    } catch (error) {
      console.error('Error adding availability:', error);
    }
  };

  const handleUpdateAvailability = async (updatedAvail: Availability) => {
    try {
      const response = await fetch(`/api/availabilities/${updatedAvail.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAvail),
      });
      if (!response.ok) throw new Error('Failed to update availability');
      setAvailabilities(prev => prev.map(a => a.id === updatedAvail.id ? updatedAvail : a));
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleDeleteAvailability = async (id: string) => {
    try {
      const response = await fetch(`/api/availabilities/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete availability');
      setAvailabilities(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  };

  const handleToggleAvailability = (id: string) => {
    const avail = availabilities.find(a => a.id === id);
    if (avail) {
      handleUpdateAvailability({ ...avail, isActive: !avail.isActive });
    }
  };

  const handleAddShift = async (newShift: Shift) => {
    try {
      const response = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShift),
      });
      if (!response.ok) throw new Error('Failed to add shift');
      const savedShift = await response.json();
      setShifts(prev => [...prev, savedShift]);
    } catch (error) {
      console.error('Error adding shift:', error);
    }
  };

  const handleUpdateShift = async (updatedShift: Shift) => {
    try {
      const response = await fetch(`/api/shifts/${updatedShift.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedShift),
      });
      if (!response.ok) throw new Error('Failed to update shift');
      setShifts(prev => prev.map(s => s.id === updatedShift.id ? updatedShift : s));
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  };

  const handleDeleteShift = async (id: string) => {
    try {
      const response = await fetch(`/api/shifts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete shift');
      setShifts(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  const handleToggleShift = (id: string) => {
    const shift = shifts.find(s => s.id === id);
    if (shift) {
      handleUpdateShift({ ...shift, isActive: !shift.isActive });
    }
  };

  const handleAddState = async (newState: State) => {
    try {
      const response = await fetch('/api/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newState),
      });
      if (!response.ok) throw new Error('Failed to add state');
      const savedState = await response.json();
      setStates(prev => [...prev, savedState]);
    } catch (error) {
      console.error('Error adding state:', error);
    }
  };

  const handleUpdateState = async (updatedState: State) => {
    try {
      const response = await fetch(`/api/states/${updatedState.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedState),
      });
      if (!response.ok) throw new Error('Failed to update state');
      setStates(prev => prev.map(s => s.id === updatedState.id ? updatedState : s));
    } catch (error) {
      console.error('Error updating state:', error);
    }
  };

  const handleDeleteState = async (id: number) => {
    try {
      const response = await fetch(`/api/states/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete state');
      setStates(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting state:', error);
    }
  };

  const handleToggleState = (id: number) => {
    const state = states.find(s => s.id === id);
    if (state) {
      handleUpdateState({ ...state, isActive: !state.isActive });
    }
  };

  const handleAddReason = async (newReason: Reason) => {
    try {
      const response = await fetch('/api/reasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReason),
      });
      if (!response.ok) throw new Error('Failed to add reason');
      const savedReason = await response.json();
      setReasons(prev => [...prev, savedReason]);
    } catch (error) {
      console.error('Error adding reason:', error);
    }
  };

  const handleUpdateReason = async (updatedReason: Reason) => {
    try {
      const response = await fetch(`/api/reasons/${updatedReason.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReason),
      });
      if (!response.ok) throw new Error('Failed to update reason');
      const savedReason = await response.json();
      setReasons(prev => prev.map(r => r.id === savedReason.id ? savedReason : r));
    } catch (error) {
      console.error('Error updating reason:', error);
    }
  };

  const handleDeleteReason = async (id: number) => {
    try {
      const response = await fetch(`/api/reasons/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete reason');
      setReasons(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting reason:', error);
    }
  };

  const handleToggleReason = (id: number) => {
    const reason = reasons.find(r => r.id === id);
    if (reason) {
      handleUpdateReason({ ...reason, isActive: !reason.isActive });
    }
  };

  const handleUpdateSchedule = (id: string, assignedShifts: StaffType['assignedShifts'], availability: string, opdWindow: string) => {
    setStaff(staff.map(s => s.id === id ? { ...s, assignedShifts, availability, opdWindow } : s));
  };

  const handleAddTask = async (newTask: Task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error('Failed to add task');
      const savedTask = await response.json();
      setTasks(prev => [...prev, savedTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const savedTask = await response.json();
      setTasks(prev => prev.map(t => t.id === savedTask.id ? savedTask : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      handleUpdateTask({ ...task, isActive: !task.isActive });
    }
  };

  const handleAddScheduleTemplate = async (newTemplate: ScheduleTemplate) => {
    try {
      const response = await fetch('/api/scheduleTemplates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate),
      });
      if (!response.ok) throw new Error('Failed to add schedule template');
      const savedTemplate = await response.json();
      setScheduleTemplates(prev => [...prev, savedTemplate]);
    } catch (error) {
      console.error('Error adding schedule template:', error);
    }
  };

  const handleUpdateScheduleTemplate = async (updatedTemplate: ScheduleTemplate) => {
    try {
      const response = await fetch(`/api/scheduleTemplates/${updatedTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTemplate),
      });
      if (!response.ok) throw new Error('Failed to update schedule template');
      const savedTemplate = await response.json();
      setScheduleTemplates(prev => prev.map(t => t.id === savedTemplate.id ? savedTemplate : t));
    } catch (error) {
      console.error('Error updating schedule template:', error);
    }
  };

  const handleDeleteScheduleTemplate = async (id: number) => {
    try {
      const response = await fetch(`/api/scheduleTemplates/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete schedule template');
      setScheduleTemplates(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting schedule template:', error);
    }
  };

  const handleToggleScheduleTemplate = (id: number) => {
    const template = scheduleTemplates.find(t => t.id === id);
    if (template) {
      handleUpdateScheduleTemplate({ ...template, isActive: !template.isActive });
    }
  };

  const handleAddTimeOffRequest = async (requestData: any) => {
    try {
      const payload = {
        staff_id: requestData.staffId,
        staff_name: requestData.staffName,
        start_date_time: requestData.startDateTime,
        end_date_time: requestData.endDateTime,
        reason: requestData.reason,
        status: requestData.status || 'pending'
      };
      const response = await fetch('/api/timeOff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to add time off request');
      const savedRequest = await response.json();
      const mappedRequest = {
        id: savedRequest.id,
        staffId: savedRequest.staff_id,
        staffName: savedRequest.staff_name,
        startDateTime: savedRequest.start_date_time,
        endDateTime: savedRequest.end_date_time,
        reason: savedRequest.reason,
        status: savedRequest.status,
        createdAt: savedRequest.created_at
      };
      setTimeOffRequests(prev => [mappedRequest, ...prev]);
    } catch (error) {
      console.error('Error adding time off request:', error);
      alert('Failed to add time off request');
    }
  };

  const handleUpdateTimeOffRequest = async (updatedRequest: any) => {
    try {
      const payload = {
        start_date_time: updatedRequest.startDateTime,
        end_date_time: updatedRequest.endDateTime,
        reason: updatedRequest.reason,
        status: updatedRequest.status
      };
      const response = await fetch(`/api/timeOff/${updatedRequest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update time off request');
      const savedRequest = await response.json();
      const mappedRequest = {
        id: savedRequest.id,
        staffId: savedRequest.staff_id,
        staffName: savedRequest.staff_name,
        startDateTime: savedRequest.start_date_time,
        endDateTime: savedRequest.end_date_time,
        reason: savedRequest.reason,
        status: savedRequest.status,
        createdAt: savedRequest.created_at
      };
      setTimeOffRequests(prev => prev.map(r => r.id === mappedRequest.id ? mappedRequest : r));
    } catch (error) {
      console.error('Error updating time off request:', error);
      alert('Failed to update time off request');
    }
  };

  const handleDeleteTimeOffRequest = async (id: number) => {
    try {
      const response = await fetch(`/api/timeOff/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete time off request');
      setTimeOffRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting time off request:', error);
      alert('Failed to delete time off request');
    }
  };

  const handleSaveAppointment = useCallback(async (newPatient: Patient) => {
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });
      if (!response.ok) throw new Error('Failed to add patient');
      const savedPatient = await response.json();
      setPatients(prev => [savedPatient, ...prev]);
      setActiveTab('patients');
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  }, []);

  const handleUpdateAppointment = (updatedAppointment: any) => {
    setAppointments(prev => prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt));
  };

  const handleAddAppointment = (newAppointment: any) => {
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && activeTab !== 'patients') {
      setActiveTab('patients');
    }
  };

  const filteredPatients = searchQuery.trim() 
    ? patients.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.doctor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : patients;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard patients={patients} appointments={appointments} onNavigate={setActiveTab} />;
      case 'patients': return <Patients patients={filteredPatients} onUpdatePatient={handleUpdatePatient} states={states} />;
      case 'beds': return <Beds />;
      case 'appointments': return <Appointments appointments={appointments} onAddAppointment={handleAddAppointment} onUpdateAppointment={handleUpdateAppointment} reasons={reasons} departments={departments} doctors={staff} scheduleTemplates={scheduleTemplates} />;
      case 'pharmacy': return <Pharmacy />;
      case 'billing': return <Billing />;
      case 'departments': return <Departments departments={departments} onOpenModal={() => setIsDeptModalOpen(true)} />;
      case 'staff': return <Staff staffList={staff} onToggleStatus={handleToggleStaffStatus} onOpenModal={() => { setEditingStaff(null); setIsDoctorModalOpen(true); }} onEditStaff={(s) => { setEditingStaff(s); setIsDoctorModalOpen(true); }} onDeleteStaff={handleDeleteStaff} timeOffRequests={timeOffRequests} onAddTimeOffRequest={handleAddTimeOffRequest} onUpdateTimeOffRequest={handleUpdateTimeOffRequest} onDeleteTimeOffRequest={handleDeleteTimeOffRequest} currentStaffName="Staff Member" staffListForTimeOff={staff.map(s => ({ id: typeof s.id === 'string' ? parseInt(s.id.replace('S-', ''), 10) || s.id : s.id, name: s.name }))} />;
      case 'schedules': return <Schedules staffList={staff} onEditSchedule={setScheduleModalStaff} />;
      case 'time-off': return <TimeOffRequests timeOffRequests={timeOffRequests} onAddTimeOffRequest={handleAddTimeOffRequest} onUpdateTimeOffRequest={handleUpdateTimeOffRequest} onDeleteTimeOffRequest={handleDeleteTimeOffRequest} staffList={staff.map(s => ({ id: typeof s.id === 'string' ? parseInt(s.id.replace('S-', ''), 10) || s.id : s.id, name: s.name }))} isStaffView={false} />;
      case 'reports': return <Reports />;
      case 'configuration': return (
        <Configuration 
          departments={departments} roles={roles} tenants={tenants} qualifications={qualifications} availabilities={availabilities} shifts={shifts} states={states} reasons={reasons} tasks={tasks} scheduleTemplates={scheduleTemplates}
          onAddDepartment={handleAddDepartment} onUpdateDepartment={handleUpdateDepartment} onDeleteDepartment={handleDeleteDepartment} onToggleDepartment={handleToggleDepartment}
          onAddRole={handleAddRole} onUpdateRole={handleUpdateRole} onDeleteRole={handleDeleteRole} onToggleRole={handleToggleRole}
          onAddTenant={handleAddTenant} onUpdateTenant={handleUpdateTenant} onDeleteTenant={handleDeleteTenant} onToggleTenant={handleToggleTenant}
          onAddQualification={handleAddQualification} onUpdateQualification={handleUpdateQualification} onDeleteQualification={handleDeleteQualification} onToggleQualification={handleToggleQualification}
          onAddAvailability={handleAddAvailability} onUpdateAvailability={handleUpdateAvailability} onDeleteAvailability={handleDeleteAvailability} onToggleAvailability={handleToggleAvailability}
          onAddShift={handleAddShift} onUpdateShift={handleUpdateShift} onDeleteShift={handleDeleteShift} onToggleShift={handleToggleShift}
          onAddState={handleAddState} onUpdateState={handleUpdateState} onDeleteState={handleDeleteState} onToggleState={handleToggleState}
          onAddReason={handleAddReason} onUpdateReason={handleUpdateReason} onDeleteReason={handleDeleteReason} onToggleReason={handleToggleReason}
          onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onToggleTask={handleToggleTask}
          onAddScheduleTemplate={handleAddScheduleTemplate} onUpdateScheduleTemplate={handleUpdateScheduleTemplate} onDeleteScheduleTemplate={handleDeleteScheduleTemplate} onToggleScheduleTemplate={handleToggleScheduleTemplate}
        />
      );
      default: return <Dashboard patients={patients} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f0] text-[#1a1a1a] font-sans">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} 
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar 
          title={activeTab} 
          onOpenModal={() => setIsModalOpen(true)} 
          onSearch={handleSearch}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5">
          {renderContent()}
        </div>
      </div>

      <NewPatientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSavePatient} 
        states={states}
      />
      <NewDoctorModal
        isOpen={isDoctorModalOpen}
        onClose={() => { setIsDoctorModalOpen(false); setEditingStaff(null); }}
        onSave={handleSaveStaff}
        departments={departments}
        roles={roles}
        tenants={tenants}
        qualifications={qualifications}
        editingStaff={editingStaff}
        scheduleTemplates={scheduleTemplates}
      />
      <NewDepartmentModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onSave={handleAddDepartment}
      />
      <EditScheduleModal
        staff={scheduleModalStaff}
        onClose={() => setScheduleModalStaff(null)}
        onSave={handleUpdateSchedule}
        availabilities={availabilities}
        shifts={shifts}
      />
    </div>
  );
}
