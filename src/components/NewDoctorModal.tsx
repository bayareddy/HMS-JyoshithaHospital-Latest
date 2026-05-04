import React, { useState, useEffect } from 'react';
import { Staff, Department, Role, Tenant, Qualification, Shift } from '../types';
import { Plus, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doctor: Staff) => void;
  departments: Department[];
  roles: Role[];
  tenants: Tenant[];
  qualifications: Qualification[];
  editingStaff: Staff | null;
  shifts?: Shift[];
}

export function NewDoctorModal({ isOpen, onClose, onSave, departments, roles, tenants, qualifications, editingStaff, shifts = [] }: ModalProps) {
  const [formData, setFormData] = useState({
    name: '', role: '', department: '', specialization: [] as string[], qualifications: [] as string[],
    phone: '', hospital: '', shift: ''
  });
  const [newSpec, setNewSpec] = useState('');

  useEffect(() => {
    if (editingStaff && isOpen) {
      setFormData({
        name: editingStaff.name || '',
        role: editingStaff.role || '',
        department: editingStaff.department || '',
        specialization: editingStaff.specialization || [],
        qualifications: editingStaff.qualifications || [],
        phone: editingStaff.phone || '',
        hospital: editingStaff.hospital || editingStaff.tenant?.toString() || '',
        shift: editingStaff.shiftId ? editingStaff.shiftId.toString() : ''
      });
    } else if (isOpen) {
      setFormData({ name: '', role: '', department: '', specialization: [], qualifications: [], phone: '', hospital: '', shift: '' });
    }
  }, [editingStaff, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name || !formData.department) {
      alert('Please fill required fields.');
      return;
    }
    
    const selectedRole = roles.find(r => r.name === formData.role);
    const selectedDept = departments.find(d => d.name === formData.department);
    const selectedTenant = tenants.find(t => t.name === formData.hospital);
    
    const newDoc: Staff = {
      id: editingStaff ? editingStaff.id : 0,
      name: formData.name,
      role: formData.role || (roles.length > 0 ? String(roles[0].name) : 'Doctor'),
      roleId: selectedRole ? Number(selectedRole.id) : (roles.length > 0 ? Number(roles[0].id) : undefined),
      department: formData.department,
      departmentId: selectedDept ? Number(selectedDept.id) : (departments.length > 0 ? Number(departments[0].id) : undefined),
      specialization: formData.specialization.length > 0 ? formData.specialization : ['General'],
      qualifications: formData.qualifications,
      phone: formData.phone || '',
      status: editingStaff ? editingStaff.status : 'admitted',
      assignedShifts: editingStaff ? editingStaff.assignedShifts : [],
      hospital: formData.hospital || (tenants.length > 0 ? String(tenants[0].name) : 'Hospital'),
      tenant: selectedTenant ? Number(selectedTenant.id) : undefined,
      tenantId: selectedTenant ? Number(selectedTenant.id) : (tenants.length > 0 ? Number(tenants[0].id) : undefined),
      shift: formData.shift,
      shiftId: formData.shift ? parseInt(formData.shift) : undefined,
      isActive: editingStaff ? editingStaff.isActive : true
    };
    
    onSave(newDoc);
    setFormData({ name: '', role: '', department: '', specialization: [], qualifications: [], phone: '', hospital: '', shift: '' });
    onClose();
  };

  const handleAddSpec = () => {
    if (newSpec.trim() && !formData.specialization.includes(newSpec.trim())) {
      setFormData({ ...formData, specialization: [...formData.specialization, newSpec.trim()] });
      setNewSpec('');
    }
  };

  const handleRemoveSpec = (spec: string) => {
    setFormData({ ...formData, specialization: formData.specialization.filter(s => s !== spec) });
  };

  const handleToggleQual = (q: string) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.includes(q) ? prev.qualifications.filter(x => x !== q) : [...prev.qualifications, q]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-xl border border-border-subtle w-full max-w-[480px] shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 px-5 border-b border-border-subtle flex justify-between items-center">
          <span className="text-[15px] font-medium">{editingStaff ? 'Edit Staff Profile' : 'Onboard New Staff'}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        
        <div className="p-5 space-y-3.5">
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Full Name *</label>
            <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="Dr. First Last" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Role</label>
              <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="">Select Role</option>
                {roles.filter(r => r.isActive !== false).map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Department *</label>
              <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                <option value="">Select</option>
                {departments.filter(d => d.isActive !== false).map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Specialization(s)</label>
              <div className="flex gap-1 mb-1.5">
                <input 
                  className="flex-1 p-1.5 border border-border-subtle rounded-md text-[11px] bg-surface2 focus:bg-white focus:border-accent outline-none" 
                  placeholder="e.g. Cardiology" 
                  value={newSpec} 
                  onChange={e => setNewSpec(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddSpec()}
                />
                <button onClick={handleAddSpec} className="bg-surface2 border border-border-subtle rounded-md px-2 hover:bg-surface text-gray-600"><Plus className="w-3 h-3" /></button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.specialization.map(spec => (
                  <span key={spec} className="flex items-center gap-1 bg-accent-light text-accent-dark px-1.5 py-0.5 rounded-md text-[10px]">
                    {spec}
                    <button onClick={() => handleRemoveSpec(spec)} className="hover:text-danger"><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Qualifications</label>
              <div className="flex flex-wrap gap-1">
                {qualifications.filter(q => q.isActive !== false).map(q => (
                  <button
                    key={q.id}
                    onClick={() => handleToggleQual(q.name)}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] border transition-colors ${formData.qualifications.includes(q.name) ? 'bg-accent text-white border-accent' : 'bg-surface2 text-gray-600 border-border-subtle hover:bg-surface'}`}
                  >
                    {q.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Phone</label>
              <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="+91..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Hospital (Tenant)</label>
              <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})}>
                <option value="">Select Hospital</option>
                {tenants.filter(t => t.isActive !== false).map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Shift</label>
            <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}>
              <option value="">Select Shift</option>
              {shifts.filter(t => t.isActive !== false).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>

        <div className="p-3.5 px-5 border-t border-border-subtle flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-border-subtle rounded-md bg-surface text-[12px] hover:bg-surface2 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark transition-colors">{editingStaff ? 'Save Changes' : 'Onboard Staff'}</button>
        </div>
      </div>
    </div>
  );
}
