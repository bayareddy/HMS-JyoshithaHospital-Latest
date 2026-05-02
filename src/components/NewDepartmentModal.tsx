import React, { useState } from 'react';
import { Department } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dept: Department) => void;
}

export function NewDepartmentModal({ isOpen, onClose, onSave }: ModalProps) {
  const [formData, setFormData] = useState({ name: '', description: '' });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name) {
      alert('Department name is required.');
      return;
    }
    onSave({
      name: formData.name,
      description: formData.description || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-xl border border-border-subtle w-full max-w-[420px] shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 px-5 border-b border-border-subtle flex justify-between items-center">
          <span className="text-[15px] font-medium">Create Department</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        
        <div className="p-5 space-y-3.5">
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Department Name *</label>
            <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="e.g. Pediatrics" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Description</label>
            <textarea rows={3} className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none resize-none" placeholder="Brief description of the department..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
        </div>

        <div className="p-3.5 px-5 border-t border-border-subtle flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-border-subtle rounded-md bg-surface text-[12px] hover:bg-surface2 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark transition-colors">Create Department</button>
        </div>
      </div>
    </div>
  );
}
