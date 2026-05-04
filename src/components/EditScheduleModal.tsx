import React, { useState, useEffect } from 'react';
import { Staff, Availability, Shift, StaffShiftAssignment } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface ModalProps {
  staff: Staff | null;
  onClose: () => void;
  onSave: (id: number, assignedShifts: StaffShiftAssignment[], availability: string, opdWindow: string) => void;
  availabilities: Availability[];
  shifts: Shift[];
}

export function EditScheduleModal({ staff, onClose, onSave, availabilities, shifts }: ModalProps) {
  const [assignedShifts, setAssignedShifts] = useState<StaffShiftAssignment[]>([]);
  const [availability, setAvailability] = useState('');
  const [opdWindow, setOpdWindow] = useState('');

  const [newDays, setNewDays] = useState<string[]>([]);
  const [newShifts, setNewShifts] = useState<string[]>([]);

  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const OPD_OPTIONS = ['5 min', '10 min', '15 min', '20 min', '25 min', '30 min'];

  useEffect(() => {
    if (staff) {
      setAssignedShifts(staff.assignedShifts || []);
      setAvailability(staff.availability);
      setOpdWindow(staff.opdWindow || '');
    }
  }, [staff]);

  if (!staff) return null;

  const handleSave = () => {
    onSave(staff.id, assignedShifts, availability, opdWindow);
    onClose();
  };

  const handleAddAssignment = () => {
    if (newDays.length === 0 || newShifts.length === 0) return;
    const newAssignment: StaffShiftAssignment = {
      id: Math.random().toString(36).substr(2, 9),
      days: newDays,
      shifts: newShifts
    };
    setAssignedShifts([...assignedShifts, newAssignment]);
    setNewDays([]);
    setNewShifts([]);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignedShifts(assignedShifts.filter(a => a.id !== id));
  };

  const toggleNewDay = (day: string) => {
    setNewDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const toggleNewShift = (shiftName: string) => {
    setNewShifts(prev => prev.includes(shiftName) ? prev.filter(s => s !== shiftName) : [...prev, shiftName]);
  };

  return (
    <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-xl border border-border-subtle w-full max-w-[480px] shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-4 px-5 border-b border-border-subtle flex justify-between items-center shrink-0">
          <span className="text-[15px] font-medium">Override Schedule</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        
        <div className="p-5 space-y-5 overflow-y-auto">
          <div>
            <div className="text-[13px] font-medium">{staff.name}</div>
            <div className="text-[11px] text-gray-500">{staff.role} • {staff.department}</div>
          </div>

          <div className="space-y-3">
            <label className="block text-[12px] font-medium text-gray-800">Assigned Shift(s)</label>
            
            {/* List of current assignments */}
            {assignedShifts.length > 0 && (
              <div className="space-y-2 mb-3">
                {assignedShifts.map(assignment => (
                  <div key={assignment.id} className="flex justify-between items-start p-2.5 bg-surface2 border border-border-subtle rounded-md">
                    <div>
                      <div className="text-[11px] font-medium text-gray-800 mb-1">
                        {assignment.days.map(d => d.substring(0, 3)).join(', ')}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {assignment.shifts.map(s => (
                          <span key={s} className="px-1.5 py-0.5 bg-white border border-border-subtle rounded text-[10px] text-gray-600">{s}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteAssignment(assignment.id)} className="text-danger hover:text-red-700 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new assignment form */}
            <div className="p-3 border border-border-subtle rounded-md bg-[#fafaf9] space-y-3">
              <div className="text-[11px] font-medium text-gray-600">Add New Assignment</div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Select Days</label>
                <div className="flex flex-wrap gap-1">
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleNewDay(day)}
                      className={`px-2 py-1 rounded text-[10px] border transition-colors ${newDays.includes(day) ? 'bg-accent text-white border-accent' : 'bg-white text-gray-600 border-border-subtle hover:bg-surface2'}`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Select Shifts</label>
                <div className="flex flex-wrap gap-1">
                  {shifts.filter(s => s.isActive !== false).map(s => (
                    <button
                      key={s.id}
                      onClick={() => toggleNewShift(s.name)}
                      className={`px-2 py-1 rounded text-[10px] border transition-colors ${newShifts.includes(s.name) ? 'bg-accent text-white border-accent' : 'bg-white text-gray-600 border-border-subtle hover:bg-surface2'}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={handleAddAssignment}
                disabled={newDays.length === 0 || newShifts.length === 0}
                className="w-full py-1.5 mt-1 bg-surface2 border border-border-subtle rounded text-[11px] font-medium text-gray-700 hover:bg-surface disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Assignment
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">OPD Window</label>
              <select 
                className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" 
                value={opdWindow} 
                onChange={e => setOpdWindow(e.target.value)}
              >
                <option value="">Select duration...</option>
                {OPD_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Current Availability</label>
              <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={availability} onChange={e => setAvailability(e.target.value)}>
                {availabilities.filter(a => a.isActive !== false).map(a => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-3.5 px-5 border-t border-border-subtle flex gap-2 justify-end shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-border-subtle rounded-md bg-surface text-[12px] hover:bg-surface2 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
