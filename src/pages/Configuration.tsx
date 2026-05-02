import React, { useState } from 'react';
import { Department, Role, Tenant, Qualification, Availability, Shift, State, Reason, Task, ScheduleTemplate, ScheduleTask } from '../types';
import { Building2, Shield, MapPin, Plus, Edit, Trash2, X, GraduationCap, Clock, Calendar, List, User } from 'lucide-react';

interface ConfigurationProps {
  departments: Department[];
  roles: Role[];
  tenants: Tenant[];
  qualifications: Qualification[];
  availabilities: Availability[];
  shifts: Shift[];
  states: State[];
  reasons: Reason[];
  tasks: Task[];
  scheduleTemplates: ScheduleTemplate[];
  onAddDepartment: (dept: Department) => void;
  onUpdateDepartment: (dept: Department) => void;
  onDeleteDepartment: (id: number) => void;
  onToggleDepartment: (id: number) => void;
  onAddRole: (role: Role) => void;
  onUpdateRole: (role: Role) => void;
  onDeleteRole: (id: string) => void;
  onToggleRole: (id: string) => void;
  onAddTenant: (tenant: Tenant) => void;
  onUpdateTenant: (tenant: Tenant) => void;
  onDeleteTenant: (id: number) => void;
  onToggleTenant: (id: number) => void;
  onAddQualification: (qual: Qualification) => void;
  onUpdateQualification: (qual: Qualification) => void;
  onDeleteQualification: (id: string) => void;
  onToggleQualification: (id: string) => void;
  onAddAvailability: (avail: Availability) => void;
  onUpdateAvailability: (avail: Availability) => void;
  onDeleteAvailability: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  onAddShift: (shift: Shift) => void;
  onUpdateShift: (shift: Shift) => void;
  onDeleteShift: (id: string) => void;
  onToggleShift: (id: string) => void;
  onAddState: (state: State) => void;
  onUpdateState: (state: State) => void;
  onDeleteState: (id: number) => void;
  onToggleState: (id: number) => void;
  onAddReason: (reason: Reason) => void;
  onUpdateReason: (reason: Reason) => void;
  onDeleteReason: (id: number) => void;
  onToggleReason: (id: number) => void;
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  onToggleTask: (id: number) => void;
  onAddScheduleTemplate: (template: ScheduleTemplate) => void;
  onUpdateScheduleTemplate: (template: ScheduleTemplate) => void;
  onDeleteScheduleTemplate: (id: number) => void;
  onToggleScheduleTemplate: (id: number) => void;
}

export function Configuration({ 
  departments, roles, tenants, qualifications, availabilities, shifts, states, reasons, tasks, scheduleTemplates,
  onAddDepartment, onUpdateDepartment, onDeleteDepartment, onToggleDepartment,
  onAddRole, onUpdateRole, onDeleteRole, onToggleRole,
  onAddTenant, onUpdateTenant, onDeleteTenant, onToggleTenant,
  onAddQualification, onUpdateQualification, onDeleteQualification, onToggleQualification,
  onAddAvailability, onUpdateAvailability, onDeleteAvailability, onToggleAvailability,
  onAddShift, onUpdateShift, onDeleteShift, onToggleShift,
  onAddState, onUpdateState, onDeleteState, onToggleState,
  onAddReason, onUpdateReason, onDeleteReason, onToggleReason,
  onAddTask, onUpdateTask, onDeleteTask, onToggleTask,
  onAddScheduleTemplate, onUpdateScheduleTemplate, onDeleteScheduleTemplate, onToggleScheduleTemplate
}: ConfigurationProps) {
  const [activeSubTab, setActiveSubTab] = useState<'roles' | 'departments' | 'tenants' | 'qualifications' | 'availabilities' | 'tasks' | 'scheduleTemplates' | 'states' | 'reasons'>('roles');

  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [editingRoleId, setEditingRoleId] = useState<any>(null);

  const [newDept, setNewDept] = useState({ name: '', description: '' });
  const [editingDeptId, setEditingDeptId] = useState<any>(null);

  const [newTenant, setNewTenant] = useState({ name: '', location: '' });
  const [editingTenantId, setEditingTenantId] = useState<any>(null);

  const [newQual, setNewQual] = useState({ name: '', description: '' });
  const [editingQualId, setEditingQualId] = useState<any>(null);

  const [newAvail, setNewAvail] = useState({ name: '', description: '' });
  const [editingAvailId, setEditingAvailId] = useState<any>(null);

  const [newShift, setNewShift] = useState({ name: '', days: [] as string[] });
  const [editingShiftId, setEditingShiftId] = useState<any>(null);

  const [newState, setNewState] = useState({ name: '', stateCode: '' });
  const [editingStateId, setEditingStateId] = useState<any>(null);

  const [newReason, setNewReason] = useState({ name: '', description: '' });
  const [editingReasonId, setEditingReasonId] = useState<any>(null);

  const [newTask, setNewTask] = useState({ name: '', description: '' });
  const [editingTaskId, setEditingTaskId] = useState<any>(null);

  const [newScheduleTemplate, setNewScheduleTemplate] = useState({ 
    name: '', 
    opdSlotTime: 15,
    schedule: [
      { day: 'Monday', tasks: [] as ScheduleTask[] },
      { day: 'Tuesday', tasks: [] as ScheduleTask[] },
      { day: 'Wednesday', tasks: [] as ScheduleTask[] },
      { day: 'Thursday', tasks: [] as ScheduleTask[] },
      { day: 'Friday', tasks: [] as ScheduleTask[] },
      { day: 'Saturday', tasks: [] as ScheduleTask[] },
      { day: 'Sunday', tasks: [] as ScheduleTask[] }
    ] as { day: string; tasks: ScheduleTask[] }[]
  });
  const [editingScheduleTemplateId, setEditingScheduleTemplateId] = useState<any>(null);
  const [activeDayTab, setActiveDayTab] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');

  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
  const SLOT_TIME_OPTIONS = [5, 10, 15, 20, 30];

  // --- Roles ---
  const handleSaveRole = () => {
    if (!newRole.name) return;
    const roleData = editingRoleId ? { ...newRole, id: editingRoleId } : newRole;
    if (editingRoleId) {
      onUpdateRole(roleData as Role);
      setEditingRoleId(null);
    } else {
      onAddRole(roleData as Role);
    }
    setNewRole({ name: '', description: '' });
  };

  const handleEditRole = (role: Role) => {
    setEditingRoleId(role.id);
    setNewRole({ name: role.name, description: role.description });
  };

  const cancelEditRole = () => {
    setEditingRoleId(null);
    setNewRole({ name: '', description: '' });
  };

  // --- Departments ---
  const handleSaveDept = () => {
    if (!newDept.name) return;
    const existingDept = editingDeptId ? departments.find(d => d.id === editingDeptId) : null;
    const deptData = editingDeptId 
      ? { ...newDept, id: editingDeptId, isActive: existingDept?.isActive ?? true }
      : newDept;
    if (editingDeptId) {
      onUpdateDepartment(deptData as Department);
      setEditingDeptId(null);
    } else {
      onAddDepartment(deptData as Department);
    }
    setNewDept({ name: '', description: '' });
  };

  const handleEditDept = (dept: Department) => {
    setEditingDeptId(dept.id);
    setNewDept({ name: dept.name, description: dept.description });
  };

  const cancelEditDept = () => {
    setEditingDeptId(null);
    setNewDept({ name: '', description: '' });
  };

  // --- Tenants ---
  const handleSaveTenant = () => {
    if (!newTenant.name) return;
    const tenantData = editingTenantId ? { ...newTenant, id: editingTenantId } : newTenant;
    if (editingTenantId) {
      onUpdateTenant(tenantData as Tenant);
      setEditingTenantId(null);
    } else {
      onAddTenant(tenantData as Tenant);
    }
    setNewTenant({ name: '', location: '' });
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenantId(tenant.id);
    setNewTenant({ name: tenant.name, location: tenant.location });
  };

  const cancelEditTenant = () => {
    setEditingTenantId(null);
    setNewTenant({ name: '', location: '' });
  };

  // --- Qualifications ---
  const handleSaveQual = () => {
    if (!newQual.name) return;
    const qualData = editingQualId ? { ...newQual, id: editingQualId } : newQual;
    if (editingQualId) {
      onUpdateQualification(qualData as Qualification);
      setEditingQualId(null);
    } else {
      onAddQualification(qualData as Qualification);
    }
    setNewQual({ name: '', description: '' });
  };

  const handleEditQual = (qual: Qualification) => {
    setEditingQualId(qual.id);
    setNewQual({ name: qual.name, description: qual.description });
  };

  const cancelEditQual = () => {
    setEditingQualId(null);
    setNewQual({ name: '', description: '' });
  };

  // --- Availabilities ---
  const handleSaveAvail = () => {
    if (!newAvail.name) return;
    const availData = editingAvailId ? { ...newAvail, id: editingAvailId } : newAvail;
    if (editingAvailId) {
      onUpdateAvailability(availData as Availability);
      setEditingAvailId(null);
    } else {
      onAddAvailability(availData as Availability);
    }
    setNewAvail({ name: '', description: '' });
  };

  const handleEditAvail = (avail: Availability) => {
    setEditingAvailId(avail.id);
    setNewAvail({ name: avail.name, description: avail.description });
  };

  const cancelEditAvail = () => {
    setEditingAvailId(null);
    setNewAvail({ name: '', description: '' });
  };

  // --- Shifts ---
  const handleSaveShift = () => {
    if (!newShift.name || newShift.days.length === 0) return;
    const shiftData = editingShiftId ? { ...newShift, id: editingShiftId } : newShift;
    if (editingShiftId) {
      onUpdateShift(shiftData as Shift);
      setEditingShiftId(null);
    } else {
      onAddShift(shiftData as Shift);
    }
    setNewShift({ name: '', days: [] });
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShiftId(shift.id);
    setNewShift({ name: shift.name, days: shift.days });
  };

  const cancelEditShift = () => {
    setEditingShiftId(null);
    setNewShift({ name: '', days: [] });
  };

  const handleToggleDay = (day: string) => {
    setNewShift(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }));
  };

  // --- States ---
  const handleSaveState = () => {
    if (!newState.name) return;
    const stateData = editingStateId ? { ...newState, id: editingStateId } : newState;
    if (editingStateId) {
      onUpdateState(stateData as State);
      setEditingStateId(null);
    } else {
      onAddState(stateData as State);
    }
    setNewState({ name: '', stateCode: '' });
  };

  const handleEditState = (state: State) => {
    setEditingStateId(state.id);
    setNewState({ name: state.name, stateCode: state.stateCode || '' });
  };

  const cancelEditState = () => {
    setEditingStateId(null);
    setNewState({ name: '', stateCode: '' });
  };

  // --- Reasons ---
  const handleSaveReason = () => {
    if (!newReason.name) return;
    const reasonData = editingReasonId ? { ...newReason, id: editingReasonId } : newReason;
    if (editingReasonId) {
      onUpdateReason(reasonData as Reason);
      setEditingReasonId(null);
    } else {
      onAddReason(reasonData as Reason);
    }
    setNewReason({ name: '', description: '' });
  };

  const handleEditReason = (reason: Reason) => {
    setEditingReasonId(reason.id);
    setNewReason({ name: reason.name, description: reason.description || '' });
  };

  const cancelEditReason = () => {
    setEditingReasonId(null);
    setNewReason({ name: '', description: '' });
  };

  const handleToggleReason = (id: number) => {
    const reason = reasons.find(r => r.id === id);
    if (reason) {
      onUpdateReason({ ...reason, isActive: !reason.isActive });
    }
  };

  // --- Tasks ---
  const handleSaveTask = () => {
    if (!newTask.name) return;
    const taskData = editingTaskId ? { ...newTask, id: editingTaskId } : newTask;
    if (editingTaskId) {
      onUpdateTask(taskData as Task);
      setEditingTaskId(null);
    } else {
      onAddTask(taskData as Task);
    }
    setNewTask({ name: '', description: '' });
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTask({ name: task.name, description: task.description || '' });
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setNewTask({ name: '', description: '' });
  };

  // --- Schedule Templates ---
  const handleSaveScheduleTemplate = () => {
    if (!newScheduleTemplate.name) return;
    const templateData = editingScheduleTemplateId ? { ...newScheduleTemplate, id: editingScheduleTemplateId } : newScheduleTemplate;
    if (editingScheduleTemplateId) {
      onUpdateScheduleTemplate(templateData as ScheduleTemplate);
      setEditingScheduleTemplateId(null);
    } else {
      onAddScheduleTemplate(templateData as ScheduleTemplate);
    }
    setNewScheduleTemplate({ 
      name: '', 
      opdSlotTime: 15,
      schedule: [
        { day: 'Monday', tasks: [] },
        { day: 'Tuesday', tasks: [] },
        { day: 'Wednesday', tasks: [] },
        { day: 'Thursday', tasks: [] },
        { day: 'Friday', tasks: [] }
      ]
    });
  };

  const handleEditScheduleTemplate = (template: ScheduleTemplate) => {
    setEditingScheduleTemplateId(template.id);
    setNewScheduleTemplate({
      name: template.name,
      opdSlotTime: template.opdSlotTime,
      schedule: template.schedule || [
        { day: 'Monday', tasks: [] },
        { day: 'Tuesday', tasks: [] },
        { day: 'Wednesday', tasks: [] },
        { day: 'Thursday', tasks: [] },
        { day: 'Friday', tasks: [] },
        { day: 'Saturday', tasks: [] },
        { day: 'Sunday', tasks: [] }
      ]
    });
  };

  const cancelEditScheduleTemplate = () => {
    setEditingScheduleTemplateId(null);
    setNewScheduleTemplate({ 
      name: '', 
      opdSlotTime: 15,
      schedule: [
        { day: 'Monday', tasks: [] },
        { day: 'Tuesday', tasks: [] },
        { day: 'Wednesday', tasks: [] },
        { day: 'Thursday', tasks: [] },
        { day: 'Friday', tasks: [] },
        { day: 'Saturday', tasks: [] },
        { day: 'Sunday', tasks: [] }
      ]
    });
  };

  const addTaskToDay = (day: string) => {
    setNewScheduleTemplate(prev => ({
      ...prev,
      schedule: prev.schedule.map(ds => 
        ds.day === day 
          ? { ...ds, tasks: [...ds.tasks, { id: Date.now(), taskName: '', fromTime: '09:00', toTime: '17:00' }] }
          : ds
      )
    }));
  };

  const updateTaskInDay = (day: string, taskId: number, field: keyof ScheduleTask, value: string) => {
    setNewScheduleTemplate(prev => ({
      ...prev,
      schedule: prev.schedule.map(ds => 
        ds.day === day 
          ? { ...ds, tasks: ds.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t) }
          : ds
      )
    }));
  };

  const removeTaskFromDay = (day: string, taskId: number) => {
    setNewScheduleTemplate(prev => ({
      ...prev,
      schedule: prev.schedule.map(ds => 
        ds.day === day 
          ? { ...ds, tasks: ds.tasks.filter(t => t.id !== taskId) }
          : ds
      )
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-border-subtle pb-2">
        <button 
          onClick={() => setActiveSubTab('roles')}
          className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeSubTab === 'roles' ? 'bg-accent text-white' : 'bg-surface text-gray-600 hover:bg-surface2'}`}
        >
          Roles
        </button>
        <button 
          onClick={() => setActiveSubTab('departments')}
          className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeSubTab === 'departments' ? 'bg-accent text-white' : 'bg-surface text-gray-600 hover:bg-surface2'}`}
        >
          Departments
        </button>
        <button 
          onClick={() => setActiveSubTab('tenants')}
          className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeSubTab === 'tenants' ? 'bg-accent text-white' : 'bg-surface text-gray-600 hover:bg-surface2'}`}
        >
          Hospitals (Tenants)
        </button>
        <button 
          onClick={() => setActiveSubTab('qualifications')}
          className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeSubTab === 'qualifications' ? 'bg-accent text-white' : 'bg-surface text-gray-600 hover:bg-surface2'}`}
        >
          Qualifications
        </button>
        <button 
          onClick={() => setActiveSubTab('availabilities')}
          className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeSubTab === 'availabilities' ? 'bg-accent text-white' : 'bg-surface text-gray-600 hover:bg-surface2'}`}
        >
          Availabilities
        </button>
        <button 
          onClick={() => setActiveSubTab('tasks')}
          className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeSubTab === 'tasks' ? 'bg-accent text-white' : 'bg-surface text-gray-600 hover:bg-surface2'}`}
        >
          Tasks
        </button>
        <button 
          onClick={() => setActiveSubTab('scheduleTemplates')}
          className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeSubTab === 'scheduleTemplates' ? 'bg-accent text-white' : 'bg-surface text-gray-600 hover:bg-surface2'}`}
        >
          Schedule Template
        </button>
         <button 
           onClick={() => setActiveSubTab('states')}
           className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeSubTab === 'states' ? 'bg-accent text-white' : 'bg-surface text-gray-600 hover:bg-surface2'}`}
         >
           States
         </button>
         <button 
           onClick={() => setActiveSubTab('reasons')}
           className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeSubTab === 'reasons' ? 'bg-accent text-white' : 'bg-surface text-gray-600 hover:bg-surface2'}`}
         >
           Reasons
         </button>
      </div>

      <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
        {activeSubTab === 'tasks' && (
          <div>
            <div className="p-4 border-b border-border-subtle bg-surface2 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">Task Name</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="e.g. OPD, Surgery" value={newTask.name} onChange={e => setNewTask({...newTask, name: e.target.value})} />
              </div>
              <div className="flex-[2]">
                <label className="block text-[11px] text-gray-500 mb-1">Description</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="Description..." value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="flex gap-2">
                {editingTaskId && (
                  <button onClick={cancelEditTask} className="px-3 py-2 bg-surface text-gray-600 border border-border-subtle rounded-md text-[12px] font-medium hover:bg-surface2 flex items-center gap-1.5 h-[34px]">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
                <button onClick={handleSaveTask} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark flex items-center gap-1.5 h-[34px]">
                  {editingTaskId ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} 
                  {editingTaskId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[200px]">Task Name</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500">Description</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[160px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t.id} className={`border-b border-border-subtle last:border-0 hover:bg-[#fafaf9] ${t.isActive === false ? 'opacity-60' : ''}`}>
                    <td className="py-2.5 px-4 font-medium flex items-center gap-2"><User className="w-3.5 h-3.5 text-accent" /> {t.name}</td>
                    <td className="py-2.5 px-4">{t.description}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onToggleTask(t.id)} className={`text-[10px] px-2 py-1 rounded border ${t.isActive === false ? 'border-accent text-accent bg-accent/10' : 'border-border-subtle text-gray-600 hover:bg-surface2'}`}>
                          {t.isActive === false ? 'Enable' : 'Disable'}
                        </button>
                        <button onClick={() => handleEditTask(t)} className="text-accent hover:text-accent-dark p-1"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { if (window.confirm('Are you sure you want to delete this task?')) onDeleteTask(t.id); }} className="text-danger hover:text-red-700 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'scheduleTemplates' && (
          <div>
            <div className="p-4 border-b border-border-subtle bg-surface2 flex flex-col gap-3">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-[11px] text-gray-500 mb-1">Template Name</label>
                  <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="e.g. Standard OPD Schedule" value={newScheduleTemplate.name} onChange={e => setNewScheduleTemplate({...newScheduleTemplate, name: e.target.value})} />
                </div>
                <div className="w-40">
                  <label className="block text-[11px] text-gray-500 mb-1">OPD Slot (min)</label>
                  <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" value={newScheduleTemplate.opdSlotTime} onChange={e => setNewScheduleTemplate({...newScheduleTemplate, opdSlotTime: parseInt(e.target.value)})}>
                    {SLOT_TIME_OPTIONS.map(slot => (
                      <option key={slot} value={slot}>{slot} min</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  {editingScheduleTemplateId && (
                    <button onClick={cancelEditScheduleTemplate} className="px-3 py-2 bg-surface text-gray-600 border border-border-subtle rounded-md text-[12px] font-medium hover:bg-surface2 flex items-center gap-1.5 h-[34px]">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                  <button onClick={handleSaveScheduleTemplate} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark flex items-center gap-1.5 h-[34px]">
                    {editingScheduleTemplateId ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} 
                    {editingScheduleTemplateId ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Schedule (Monday - Friday)</label>
                <div className="flex gap-1">
                  {WEEKDAYS.map(day => (
                    <button
                      key={day}
                      onClick={() => setActiveDayTab(day)}
                      className={`px-3 py-1.5 rounded-md text-[11px] border transition-colors ${activeDayTab === day ? 'bg-accent text-white border-accent' : 'bg-surface text-gray-600 border-border-subtle hover:bg-surface2'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border border-border-subtle rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-medium text-gray-600">Schedule for {activeDayTab}</span>
                  <button onClick={() => addTaskToDay(activeDayTab)} className="text-[10px] px-2 py-1 bg-accent text-white rounded flex items-center gap-1 hover:bg-accent-dark">
                    <Plus className="w-3 h-3" /> Add Task
                  </button>
                </div>
                <div className="space-y-2">
                  {newScheduleTemplate.schedule.find(s => s.day === activeDayTab)?.tasks.map(task => (
                    <div key={task.id} className="flex gap-2 items-center">
                      <select 
                        className="flex-1 p-1.5 border border-border-subtle rounded text-[11px] focus:border-accent outline-none"
                        value={task.taskName}
                        onChange={e => updateTaskInDay(activeDayTab, task.id, 'taskName', e.target.value)}
                      >
                        <option value="">Select Task</option>
                        {tasks.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                      <input 
                        type="time" 
                        className="w-24 p-1.5 border border-border-subtle rounded text-[11px] focus:border-accent outline-none"
                        value={task.fromTime}
                        onChange={e => updateTaskInDay(activeDayTab, task.id, 'fromTime', e.target.value)}
                      />
                      <span className="text-[11px] text-gray-500">to</span>
                      <input 
                        type="time" 
                        className="w-24 p-1.5 border border-border-subtle rounded text-[11px] focus:border-accent outline-none"
                        value={task.toTime}
                        onChange={e => updateTaskInDay(activeDayTab, task.id, 'toTime', e.target.value)}
                      />
                      <button onClick={() => removeTaskFromDay(activeDayTab, task.id)} className="text-danger hover:text-red-700 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {newScheduleTemplate.schedule.find(s => s.day === activeDayTab)?.tasks.length === 0 && (
                    <div className="text-[11px] text-gray-400 text-center py-2">No tasks scheduled. Click "Add Task" to add.</div>
                  )}
                </div>
              </div>
            </div>
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[200px]">Template Name</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500">OPD Slot</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500">Schedule</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[160px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduleTemplates.map(t => (
                  <tr key={t.id} className={`border-b border-border-subtle last:border-0 hover:bg-[#fafaf9] ${t.isActive === false ? 'opacity-60' : ''}`}>
                    <td className="py-2.5 px-4 font-medium flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-accent" /> {t.name}</td>
                    <td className="py-2.5 px-4">{t.opdSlotTime} min</td>
                    <td className="py-2.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {WEEKDAYS.map(day => {
                          const daySchedule = t.schedule?.find(s => s.day === day);
                          const taskCount = daySchedule?.tasks?.length || 0;
                          return <span key={day} className="bg-surface2 border border-border-subtle px-1.5 py-0.5 rounded text-[10px] text-gray-600">{day.substring(0, 3)}({taskCount})</span>;
                        })}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onToggleScheduleTemplate(t.id)} className={`text-[10px] px-2 py-1 rounded border ${t.isActive === false ? 'border-accent text-accent bg-accent/10' : 'border-border-subtle text-gray-600 hover:bg-surface2'}`}>
                          {t.isActive === false ? 'Enable' : 'Disable'}
                        </button>
                        <button onClick={() => handleEditScheduleTemplate(t)} className="text-accent hover:text-accent-dark p-1"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { if (window.confirm('Are you sure you want to delete this template?')) onDeleteScheduleTemplate(t.id); }} className="text-danger hover:text-red-700 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'availabilities' && (
          <div>
            <div className="p-4 border-b border-border-subtle bg-surface2 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">Availability Status</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="e.g. OPD" value={newAvail.name} onChange={e => setNewAvail({...newAvail, name: e.target.value})} />
              </div>
              <div className="flex-[2]">
                <label className="block text-[11px] text-gray-500 mb-1">Description</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="Description..." value={newAvail.description} onChange={e => setNewAvail({...newAvail, description: e.target.value})} />
              </div>
              <div className="flex gap-2">
                {editingAvailId && (
                  <button onClick={cancelEditAvail} className="px-3 py-2 bg-surface text-gray-600 border border-border-subtle rounded-md text-[12px] font-medium hover:bg-surface2 flex items-center gap-1.5 h-[34px]">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
                <button onClick={handleSaveAvail} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark flex items-center gap-1.5 h-[34px]">
                  {editingAvailId ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} 
                  {editingAvailId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[200px]">Status</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500">Description</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[160px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {availabilities.map(a => (
                  <tr key={a.id} className={`border-b border-border-subtle last:border-0 hover:bg-[#fafaf9] ${a.isActive === false ? 'opacity-60' : ''}`}>
                    <td className="py-2.5 px-4 font-medium flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-accent" /> {a.name}</td>
                    <td className="py-2.5 px-4">{a.description}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onToggleAvailability(a.id)} className={`text-[10px] px-2 py-1 rounded border ${a.isActive === false ? 'border-accent text-accent bg-accent/10' : 'border-border-subtle text-gray-600 hover:bg-surface2'}`}>
                          {a.isActive === false ? 'Enable' : 'Disable'}
                        </button>
                        <button onClick={() => handleEditAvail(a)} className="text-accent hover:text-accent-dark p-1"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { if (window.confirm('Are you sure you want to delete this availability status?')) onDeleteAvailability(a.id); }} className="text-danger hover:text-red-700 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'roles' && (
          <div>
            <div className="p-4 border-b border-border-subtle bg-surface2 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">Role Name</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="e.g. Pharmacist" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} />
              </div>
              <div className="flex-[2]">
                <label className="block text-[11px] text-gray-500 mb-1">Description</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="Role description..." value={newRole.description} onChange={e => setNewRole({...newRole, description: e.target.value})} />
              </div>
              <div className="flex gap-2">
                {editingRoleId && (
                  <button onClick={cancelEditRole} className="px-3 py-2 bg-surface text-gray-600 border border-border-subtle rounded-md text-[12px] font-medium hover:bg-surface2 flex items-center gap-1.5 h-[34px]">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
                <button onClick={handleSaveRole} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark flex items-center gap-1.5 h-[34px]">
                  {editingRoleId ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} 
                  {editingRoleId ? 'Update Role' : 'Add Role'}
                </button>
              </div>
            </div>
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[200px]">Role Name</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500">Description</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[160px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(r => (
                  <tr key={r.id} className={`border-b border-border-subtle last:border-0 hover:bg-[#fafaf9] ${r.isActive === false ? 'opacity-60' : ''}`}>
                    <td className="py-2.5 px-4 font-medium flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-accent" /> {r.name}</td>
                    <td className="py-2.5 px-4">{r.description}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onToggleRole(r.id)} className={`text-[10px] px-2 py-1 rounded border ${r.isActive === false ? 'border-accent text-accent bg-accent/10' : 'border-border-subtle text-gray-600 hover:bg-surface2'}`}>
                          {r.isActive === false ? 'Enable' : 'Disable'}
                        </button>
                        <button onClick={() => handleEditRole(r)} className="text-accent hover:text-accent-dark p-1"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { if (window.confirm('Are you sure you want to delete this role?')) onDeleteRole(r.id); }} className="text-danger hover:text-red-700 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'departments' && (
          <div>
            <div className="p-4 border-b border-border-subtle bg-surface2 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">Dept Name</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="e.g. Pediatrics" value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} />
              </div>
              <div className="flex-[2]">
                <label className="block text-[11px] text-gray-500 mb-1">Description</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="Dept description..." value={newDept.description} onChange={e => setNewDept({...newDept, description: e.target.value})} />
              </div>
              <div className="flex gap-2">
                {editingDeptId && (
                  <button onClick={cancelEditDept} className="px-3 py-2 bg-surface text-gray-600 border border-border-subtle rounded-md text-[12px] font-medium hover:bg-surface2 flex items-center gap-1.5 h-[34px]">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
                <button onClick={handleSaveDept} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark flex items-center gap-1.5 h-[34px]">
                  {editingDeptId ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} 
                  {editingDeptId ? 'Update Dept' : 'Add Dept'}
                </button>
              </div>
            </div>
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[200px]">Department</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500">Description</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[160px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(d => (
                  <tr key={d.id} className={`border-b border-border-subtle last:border-0 hover:bg-[#fafaf9] ${d.isActive === false ? 'opacity-60' : ''}`}>
                    <td className="py-2.5 px-4 font-medium flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-accent" /> {d.name}</td>
                    <td className="py-2.5 px-4">{d.description}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onToggleDepartment(d.id)} className={`text-[10px] px-2 py-1 rounded border ${d.isActive === false ? 'border-accent text-accent bg-accent/10' : 'border-border-subtle text-gray-600 hover:bg-surface2'}`}>
                          {d.isActive === false ? 'Enable' : 'Disable'}
                        </button>
                        <button onClick={() => handleEditDept(d)} className="text-accent hover:text-accent-dark p-1"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { if (window.confirm('Are you sure you want to delete this department?')) onDeleteDepartment(d.id); }} className="text-danger hover:text-red-700 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'tenants' && (
          <div>
            <div className="p-4 border-b border-border-subtle bg-surface2 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">Hospital Name</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="e.g. MediCore East" value={newTenant.name} onChange={e => setNewTenant({...newTenant, name: e.target.value})} />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">Location</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="e.g. East Side" value={newTenant.location} onChange={e => setNewTenant({...newTenant, location: e.target.value})} />
              </div>
              <div className="flex gap-2">
                {editingTenantId && (
                  <button onClick={cancelEditTenant} className="px-3 py-2 bg-surface text-gray-600 border border-border-subtle rounded-md text-[12px] font-medium hover:bg-surface2 flex items-center gap-1.5 h-[34px]">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
                <button onClick={handleSaveTenant} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark flex items-center gap-1.5 h-[34px]">
                  {editingTenantId ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} 
                  {editingTenantId ? 'Update Hospital' : 'Add Hospital'}
                </button>
              </div>
            </div>
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[250px]">Hospital Name</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500">Location</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[160px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(t => (
                  <tr key={t.id} className={`border-b border-border-subtle last:border-0 hover:bg-[#fafaf9] ${t.isActive === false ? 'opacity-60' : ''}`}>
                    <td className="py-2.5 px-4 font-medium flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-accent" /> {t.name}</td>
                    <td className="py-2.5 px-4">{t.location}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onToggleTenant(t.id)} className={`text-[10px] px-2 py-1 rounded border ${t.isActive === false ? 'border-accent text-accent bg-accent/10' : 'border-border-subtle text-gray-600 hover:bg-surface2'}`}>
                          {t.isActive === false ? 'Enable' : 'Disable'}
                        </button>
                        <button onClick={() => handleEditTenant(t)} className="text-accent hover:text-accent-dark p-1"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { if (window.confirm('Are you sure you want to delete this hospital?')) onDeleteTenant(t.id); }} className="text-danger hover:text-red-700 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'qualifications' && (
          <div>
            <div className="p-4 border-b border-border-subtle bg-surface2 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">Qualification Name</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="e.g. MBBS" value={newQual.name} onChange={e => setNewQual({...newQual, name: e.target.value})} />
              </div>
              <div className="flex-[2]">
                <label className="block text-[11px] text-gray-500 mb-1">Description</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="Qualification description..." value={newQual.description} onChange={e => setNewQual({...newQual, description: e.target.value})} />
              </div>
              <div className="flex gap-2">
                {editingQualId && (
                  <button onClick={cancelEditQual} className="px-3 py-2 bg-surface text-gray-600 border border-border-subtle rounded-md text-[12px] font-medium hover:bg-surface2 flex items-center gap-1.5 h-[34px]">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
                <button onClick={handleSaveQual} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark flex items-center gap-1.5 h-[34px]">
                  {editingQualId ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} 
                  {editingQualId ? 'Update Qual' : 'Add Qual'}
                </button>
              </div>
            </div>
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[200px]">Qualification Name</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500">Description</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[160px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {qualifications.map(q => (
                  <tr key={q.id} className={`border-b border-border-subtle last:border-0 hover:bg-[#fafaf9] ${q.isActive === false ? 'opacity-60' : ''}`}>
                    <td className="py-2.5 px-4 font-medium flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5 text-accent" /> {q.name}</td>
                    <td className="py-2.5 px-4">{q.description}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onToggleQualification(q.id)} className={`text-[10px] px-2 py-1 rounded border ${q.isActive === false ? 'border-accent text-accent bg-accent/10' : 'border-border-subtle text-gray-600 hover:bg-surface2'}`}>
                          {q.isActive === false ? 'Enable' : 'Disable'}
                        </button>
                        <button onClick={() => handleEditQual(q)} className="text-accent hover:text-accent-dark p-1"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { if (window.confirm('Are you sure you want to delete this qualification?')) onDeleteQualification(q.id); }} className="text-danger hover:text-red-700 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'states' && (
          <div>
            <div className="p-4 border-b border-border-subtle bg-surface2 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">State Name</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="e.g. Telangana" value={newState.name} onChange={e => setNewState({...newState, name: e.target.value})} />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">State Code</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="e.g. TS" value={newState.stateCode} onChange={e => setNewState({...newState, stateCode: e.target.value})} />
              </div>
              <div className="flex gap-2">
                {editingStateId && (
                  <button onClick={cancelEditState} className="px-3 py-2 bg-surface text-gray-600 border border-border-subtle rounded-md text-[12px] font-medium hover:bg-surface2 flex items-center gap-1.5 h-[34px]">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
                <button onClick={handleSaveState} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark flex items-center gap-1.5 h-[34px]">
                  {editingStateId ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} 
                  {editingStateId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[200px]">State Name</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500">State Code</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[160px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {states.map(s => (
                  <tr key={s.id} className={`border-b border-border-subtle last:border-0 hover:bg-[#fafaf9] ${s.isActive === false ? 'opacity-60' : ''}`}>
                    <td className="py-2.5 px-4 font-medium">{s.name}</td>
                    <td className="py-2.5 px-4">{s.stateCode || '-'}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onToggleState(s.id)} className={`text-[10px] px-2 py-1 rounded border ${s.isActive === false ? 'border-accent text-accent bg-accent/10' : 'border-border-subtle text-gray-600 hover:bg-surface2'}`}>
                          {s.isActive === false ? 'Enable' : 'Disable'}
                        </button>
                        <button onClick={() => handleEditState(s)} className="text-accent hover:text-accent-dark p-1"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { if (window.confirm('Are you sure you want to delete this state?')) onDeleteState(s.id); }} className="text-danger hover:text-red-700 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'reasons' && (
          <div>
            <div className="p-4 border-b border-border-subtle bg-surface2 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">Reason Name</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="e.g. Consultation" value={newReason.name} onChange={e => setNewReason({...newReason, name: e.target.value})} />
              </div>
              <div className="flex-[2]">
                <label className="block text-[11px] text-gray-500 mb-1">Description</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] focus:border-accent outline-none" placeholder="Description..." value={newReason.description} onChange={e => setNewReason({...newReason, description: e.target.value})} />
              </div>
              <div className="flex gap-2">
                {editingReasonId && (
                  <button onClick={cancelEditReason} className="px-3 py-2 bg-surface text-gray-600 border border-border-subtle rounded-md text-[12px] font-medium hover:bg-surface2 flex items-center gap-1.5 h-[34px]">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
                <button onClick={handleSaveReason} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark flex items-center gap-1.5 h-[34px]">
                  {editingReasonId ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} 
                  {editingReasonId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[200px]">Reason</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500">Description</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] text-gray-500 w-[160px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reasons.map(r => (
                  <tr key={r.id} className={`border-b border-border-subtle last:border-0 hover:bg-[#fafaf9] ${r.isActive === false ? 'opacity-60' : ''}`}>
                    <td className="py-2.5 px-4 font-medium flex items-center gap-2"><List className="w-3.5 h-3.5 text-accent" /> {r.name}</td>
                    <td className="py-2.5 px-4">{r.description}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onToggleReason(r.id)} className={`text-[10px] px-2 py-1 rounded border ${r.isActive === false ? 'border-accent text-accent bg-accent/10' : 'border-border-subtle text-gray-600 hover:bg-surface2'}`}>
                          {r.isActive === false ? 'Enable' : 'Disable'}
                        </button>
                        <button onClick={() => handleEditReason(r)} className="text-accent hover:text-accent-dark p-1"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { if (window.confirm('Are you sure you want to delete this reason?')) onDeleteReason(r.id); }} className="text-danger hover:text-red-700 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
