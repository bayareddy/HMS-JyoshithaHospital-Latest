import React, { useState } from 'react';
import { Badge } from '../components/Badge';
import { Plus, Calendar, Edit2 } from 'lucide-react';
import { Department, Staff, Shift, TimeOffRequest } from '../types';

interface AppointmentsProps {
  appointments: any[];
  reasons?: { id: number; name: string }[];
  departments?: Department[];
  doctors?: Staff[];
  shifts?: Shift[];
  timeOffRequests?: TimeOffRequest[];
  onAddAppointment?: (appointment: any) => void;
  onUpdateAppointment?: (appointment: any) => void;
}

const REASON_OPTIONS = [
  'Consultation', 'Follow-up', 'Lab Test', 'X-Ray', 'MRI Scan', 'CT Scan',
  'Ultrasound', 'ECG', 'EEG', 'Vaccination', 'Pre-operative', 'Post-operative',
  'Emergency', 'Routine Checkup'
];

export function Appointments({ appointments = [], reasons = [], departments = [], doctors = [], shifts = [], timeOffRequests = [], onAddAppointment, onUpdateAppointment }: AppointmentsProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toLocaleDateString('en-CA'));
  const [formData, setFormData] = useState({
    patientName: '', doctorId: '', reason: 'Consultation', departmentId: '', time: ''
  });
  const [selectedScheduleDate, setSelectedScheduleDate] = useState(() => new Date().toLocaleDateString('en-CA'));
  const [selectedSlot, setSelectedSlot] = useState('');

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredAppointments = appointments.filter(apt => {
    if (!apt.date) return true;
    return apt.date === selectedDate;
  });

  const filteredDoctors = formData.departmentId
    ? doctors.filter(d => d.departmentId === parseInt(formData.departmentId) || d.department === formData.departmentId)
    : doctors;

  const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctorId));
  const shift = shifts?.find(st => st.id === selectedDoctor?.shiftId);

  const scheduleDates = [];
  const today = new Date();
  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    scheduleDates.push({
      date: date.toLocaleDateString('en-CA'),
      day: date.toLocaleDateString('en-US', { weekday: 'long' })
    });
  }

  const getAvailableSlots = () => {
    if (!shift || !selectedScheduleDate) return [];
    const dayName = new Date(selectedScheduleDate).toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = shift.schedule?.find(s => s.day === dayName);
    
    let generatedSlots: string[] = [];
    const slotDuration = shift.opdSlotTime || 15;

    if (daySchedule && daySchedule.tasks) {
      daySchedule.tasks.forEach(task => {
        if (!task.fromTime || !task.toTime) return;

        const [fromHour, fromMin] = task.fromTime.split(':').map(Number);
        const [toHour, toMin] = task.toTime.split(':').map(Number);
        
        let current = fromHour * 60 + fromMin;
        const end = toHour * 60 + toMin;

        while (current + slotDuration <= end) {
          const h = Math.floor(current / 60);
          const m = current % 60;
          const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          
          generatedSlots.push(timeString);
          current += slotDuration;
        }
      });
    }

    if (generatedSlots.length === 0) return [];

    const doctorIdNum = parseInt(formData.doctorId);
    const timeOffs = timeOffRequests?.filter(r => r.staffId === doctorIdNum && r.status === 'approved') || [];
    
    if (timeOffs.length > 0) {
       generatedSlots = generatedSlots.filter(slot => {
         const slotDateTime = new Date(`${selectedScheduleDate}T${slot}:00`);
         const slotEndDateTime = new Date(slotDateTime.getTime() + slotDuration * 60000);
         
         const isOverlap = timeOffs.some(timeOff => {
            const timeOffStart = new Date(timeOff.startDateTime);
            const timeOffEnd = new Date(timeOff.endDateTime);
            return (slotDateTime < timeOffEnd && slotEndDateTime > timeOffStart);
         });
         return !isOverlap;
       });
    }

    const formatApptTime = (timeStr: string) => {
      if (!timeStr) return '';
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        let h = parseInt(match[1]);
        const m = match[2];
        const ampm = match[3];
        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
          if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
        }
        return `${h.toString().padStart(2, '0')}:${m}`;
      }
      return timeStr;
    };

    const bookedAppointments = appointments.filter(apt => 
      apt.date === selectedScheduleDate && apt.doctor === selectedDoctor?.name
    ).map(apt => formatApptTime(apt.time));
    
    generatedSlots = generatedSlots.filter(slot => {
       return !bookedAppointments.includes(slot);
    });

    return generatedSlots.map((time, idx) => ({
       id: idx,
       fromTime: time,
       toTime: (() => {
         const [h, m] = time.split(':').map(Number);
         const endMins = h * 60 + m + slotDuration;
         return `${Math.floor(endMins / 60).toString().padStart(2, '0')}:${(endMins % 60).toString().padStart(2, '0')}`;
       })(),
       taskName: 'OPD'
    }));
  };

  const availableSlots = getAvailableSlots();

  const openEditModal = (apt: any) => {
    const doctor = doctors.find(d => d.name === apt.doctor);
    const dept = departments.find(d => d.name === apt.department);
    setFormData({
      patientName: apt.patient || '',
      doctorId: doctor?.id?.toString() || '',
      reason: apt.type || apt.reason || 'Consultation',
      departmentId: dept?.id?.toString() || doctor?.departmentId?.toString() || '',
      time: apt.time || ''
    });
    if (apt.date) {
      setSelectedDate(apt.date);
      setSelectedScheduleDate(apt.date);
    }
    setSelectedSlot(apt.time || '');
    setEditingAppointment(apt);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.patientName || !formData.doctorId || !selectedSlot) {
      alert('Please fill in required fields: Patient Name, Doctor, Schedule Date and Slot');
      return;
    }
    try {
      const appointmentDateTime = `${selectedScheduleDate} ${selectedSlot}:00`;
      const response = await fetch(`/api/appointments/${editingAppointment.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_time: appointmentDateTime, doctor_id: parseInt(formData.doctorId), type: formData.reason, p_name: formData.patientName }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update appointment');
      }
      const updated = await response.json();
      if (onUpdateAppointment) {
        const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctorId));
        const departmentName = selectedDoctor ? (departments.find(dep => dep.id === selectedDoctor.departmentId)?.name || '') : '';
        onUpdateAppointment({ ...editingAppointment, time: selectedSlot, date: selectedScheduleDate, patient: formData.patientName, doctor: selectedDoctor?.name || '', department: departmentName, type: formData.reason });
      }
      setShowModal(false);
      setIsEditing(false);
      setEditingAppointment(null);
      setFormData({ patientName: '', doctorId: '', reason: 'Consultation', departmentId: '', time: '' });
      setSelectedScheduleDate(today.toLocaleDateString('en-CA'));
      setSelectedSlot('');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update appointment: ' + error.message);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingAppointment(null);
    setFormData({ patientName: '', doctorId: '', reason: 'Consultation', departmentId: '', time: '' });
    setSelectedScheduleDate(today.toLocaleDateString('en-CA'));
    setSelectedSlot('');
  };

  const handleSave = async () => {
    if (!formData.patientName || !formData.doctorId || !selectedSlot) {
      alert('Please fill in required fields: Patient Name, Doctor, Schedule Date and Slot');
      return;
    }
    try {
      const appointmentDateTime = `${selectedScheduleDate} ${selectedSlot}:00`;
      const response = await fetch('/api/appointments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_time: appointmentDateTime, patient_id: null, doctor_id: parseInt(formData.doctorId), type: formData.reason, status: 'scheduled', p_name: formData.patientName }),
      });
      if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Failed to create appointment'); }
      const saved = await response.json();
      if (onAddAppointment) {
        const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctorId));
        const departmentName = selectedDoctor ? (departments.find(dep => dep.id === selectedDoctor.departmentId)?.name || '') : '';
        onAddAppointment({ id: saved.id || '', time: selectedSlot, date: saved.date || selectedScheduleDate, patient: formData.patientName, doctor: selectedDoctor?.name || '', department: departmentName, type: formData.reason, status: 'scheduled' });
      }
      handleModalClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create appointment: ' + error.message);
    }
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
      <div className="p-3 px-4 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-[13px] font-medium">Appointments — {formatDateDisplay(selectedDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" className="p-1.5 border border-border-subtle rounded-md text-[11px] bg-surface2 focus:border-accent outline-none" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          <button onClick={() => setShowModal(true)} className="px-2.5 py-1 bg-accent text-white border-none rounded-md text-[11px] cursor-pointer flex items-center gap-1 font-medium hover:bg-accent-dark transition-colors">
            <Plus className="w-[11px] h-[11px]" /> New
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px] border-collapse">
          <thead>
            <tr className="bg-surface2 border-b border-border-subtle">
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Time</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Patient</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Doctor</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Reason</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Department</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Status</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((apt, i) => (
              <tr key={i} className="border-b border-border-subtle last:border-0 hover:bg-[#fafaf9]">
                <td className={`py-2.5 px-3.5 font-medium ${apt.status === 'scheduled' ? 'text-warning' : 'text-accent'}`}>{apt.time}</td>
                <td className="py-2.5 px-3.5">{apt.patient}</td>
                <td className="py-2.5 px-3.5">{apt.doctor}</td>
                <td className="py-2.5 px-3.5">{apt.type || apt.reason}</td>
                <td className="py-2.5 px-3.5">{apt.department}</td>
                <td className="py-2.5 px-3.5"><Badge status={apt.status}>{apt.status === 'admitted' ? 'Confirmed' : apt.status === 'stable' ? 'In Progress' : 'Upcoming'}</Badge></td>
                <td className="py-2.5 px-3.5"><button onClick={() => openEditModal(apt)} className="p-1.5 text-gray-500 hover:text-accent hover:bg-accent/10 rounded transition-colors" title="Edit appointment"><Edit2 className="w-3.5 h-3.5" /></button></td>
              </tr>
            ))}
            {filteredAppointments.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-gray-500 text-[12px]">No appointments for {formatDateDisplay(selectedDate)}.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-2 sm:p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface rounded-xl border border-border-subtle w-full max-w-[420px] sm:max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-3 sm:p-4 px-4 sm:px-5 border-b border-border-subtle flex justify-between items-center sticky top-0 bg-surface z-10">
              <span className="text-[14px] sm:text-[15px] font-medium">{isEditing ? 'Edit Appointment' : 'New Appointment'}</span>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1">&times;</button>
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              <div><label className="block text-[11px] text-gray-500 mb-1">Patient Name *</label>
                <input type="text" className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="Enter patient name" value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} />
              </div>
              <div><label className="block text-[11px] text-gray-500 mb-1">Department</label>
                <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value, doctorId: '' })}>
                  <option value="">Select Department</option>{departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                </select>
              </div>
              <div><label className="block text-[11px] text-gray-500 mb-1">Doctor *</label>
                <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={formData.doctorId} onChange={e => setFormData({ ...formData, doctorId: e.target.value })} disabled={!formData.departmentId}>
                  <option value="">{formData.departmentId ? 'Select Doctor' : 'Select Department first'}</option>
                  {filteredDoctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Schedule Date (Current + 2 days)</label>
                <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={selectedScheduleDate} onChange={e => setSelectedScheduleDate(e.target.value)}>
                  {scheduleDates.map(sd => <option key={sd.date} value={sd.date}>{sd.date} ({sd.day})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Available Slot *</label>
                <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)}>
                  <option value="">Select Slot</option>
                  {availableSlots.map((slot, idx) => <option key={idx} value={slot.fromTime}>{slot.fromTime} - {slot.toTime} ({slot.taskName || 'N/A'})</option>)}
                </select>
              </div>
              <div><label className="block text-[11px] text-gray-500 mb-1">Reason</label>
                <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })}>
                  {(reasons && reasons.length > 0 ? reasons : REASON_OPTIONS).map(opt => <option key={opt.id || opt} value={opt.name || opt}>{opt.name || opt}</option>)}
                </select>
              </div>
            </div>
            <div className="p-3 sm:p-3.5 px-4 sm:px-5 border-t border-border-subtle flex gap-2 justify-end sticky bottom-0 bg-surface z-10">
              <button onClick={handleModalClose} className="px-3 sm:px-4 py-2 border border-border-subtle rounded-md bg-surface text-[12px] hover:bg-surface2 transition-colors">Cancel</button>
              {isEditing ? (
                <button onClick={handleUpdate} className="px-3 sm:px-4 py-2 bg-warning text-white rounded-md text-[12px] font-medium hover:bg-warning/90 transition-colors">Update</button>
              ) : (
                <button onClick={handleSave} className="px-3 sm:px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark transition-colors">Save</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}