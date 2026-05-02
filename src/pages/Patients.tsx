import React, { useState, useEffect } from 'react';
import { Patient, State } from '../types';
import { Badge } from '../components/Badge';
import { Edit, X } from 'lucide-react';

interface PatientsProps {
  patients: Patient[];
  onUpdatePatient: (patient: Patient) => void;
  states: { id: number; name: string }[];
}

export function Patients({ patients, onUpdatePatient, states }: PatientsProps) {
  const [filter, setFilter] = useState('all');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editForm, setEditForm] = useState({
    name: '', age: '', gender: '', diagnosis: '', blood: '',
    phoneNo: '', emergencyContact: '', allergies: '',
    relationshipType: '', relationship: '',
    whatsappNo: '', emailId: '', address: '', pinCode: '', city: '', stateId: ''
  });

  const filteredPatients = filter === 'all' 
    ? patients 
    : patients.filter(p => p.status === filter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'admitted', label: 'Admitted' },
    { id: 'critical', label: 'Critical' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'discharged', label: 'Discharged' },
  ];

  useEffect(() => {
    if (editingPatient) {
      setEditForm({
        name: editingPatient.name || '',
        age: editingPatient.age !== undefined && editingPatient.age !== '—' && editingPatient.age !== '' ? String(editingPatient.age) : '',
        gender: editingPatient.gender || '',
        diagnosis: editingPatient.diagnosis || '',
        blood: editingPatient.blood || '',
        phoneNo: (editingPatient as any).phoneNo || '',
        emergencyContact: (editingPatient as any).emergencyContact || '',
        allergies: (editingPatient as any).allergies || '',
        relationshipType: (editingPatient as any).relationshipType || 'W/O',
        relationship: (editingPatient as any).relationship || '',
        whatsappNo: (editingPatient as any).whatsappNo || '',
        emailId: (editingPatient as any).emailId || '',
        address: (editingPatient as any).address || '',
        pinCode: (editingPatient as any).pinCode ? String((editingPatient as any).pinCode) : '',
        city: (editingPatient as any).city || '',
        stateId: (editingPatient as any).stateId ? String((editingPatient as any).stateId) : ''
      });
    }
  }, [editingPatient]);

  const handleEditSave = () => {
    if (!editingPatient) return;
    const numericId = parseInt(editingPatient.id.replace('P-', ''), 10);
    const updatedPatient: Patient = {
      ...editingPatient,
      name: editForm.name,
      age: editForm.age ? parseInt(editForm.age) : '',
      gender: editForm.gender,
      diagnosis: editForm.diagnosis,
      blood: editForm.blood,
      phoneNo: editForm.phoneNo || undefined,
      emergencyContact: editForm.emergencyContact || undefined,
      allergies: editForm.allergies || undefined,
      relationshipType: editForm.relationshipType || undefined,
      relationship: editForm.relationship || undefined,
      whatsappNo: editForm.whatsappNo || undefined,
      emailId: editForm.emailId || undefined,
      address: editForm.address || undefined,
      pinCode: editForm.pinCode ? parseInt(editForm.pinCode) : undefined,
      city: editForm.city || undefined,
      stateId: editForm.stateId ? parseInt(editForm.stateId) : undefined
    };
    onUpdatePatient(updatedPatient);
    setEditingPatient(null);
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
      {/* Horizontal scrollable filter bar */}
      <div className="flex gap-1.5 sm:gap-2 p-2 sm:p-2.5 px-3 sm:px-4 border-b border-border-subtle items-center overflow-x-auto">
        <span className="text-[11px] text-gray-500 shrink-0">Filter:</span>
        <div className="flex gap-1.5 sm:gap-2">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] border transition-colors whitespace-nowrap touch-manipulation ${
                filter === f.id 
                  ? 'bg-accent-light text-accent-dark border-accent' 
                  : 'bg-surface text-gray-500 border-border-subtle hover:bg-surface2'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Responsive table with horizontal scroll */}
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="w-full text-left text-[12px] border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-surface2 border-b border-border-subtle">
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">Patient</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">Age / Gender</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500 hide-mobile">Doctor</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500 hide-mobile">Diagnosis</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500 hide-mobile">Blood</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">Status</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500 hide-mobile">Admitted</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500 w-[60px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p, i) => (
              <tr key={i} className="border-b border-border-subtle last:border-0 hover:bg-[#fafaf9]">
                <td className="py-2.5 px-3 sm:px-3.5">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-[10px] text-gray-500">#{p.id}</div>
                  {(p as any).phoneNo && <div className="text-[10px] text-gray-400">📞 {(p as any).phoneNo}</div>}
                  {(p as any).whatsappNo && <div className="text-[10px] text-gray-400">💬 {(p as any).whatsappNo}</div>}
                  {(p as any).emailId && <div className="text-[10px] text-gray-400">✉️ {(p as any).emailId}</div>}
                  {(p as any).address && <div className="text-[10px] text-gray-400">📍 {(p as any).address}, {(p as any).city} {(p as any).pinCode}</div>}
                </td>
                <td className="py-2.5 px-3 sm:px-3.5">{p.age} / {p.gender}</td>
                <td className="py-2.5 px-3 sm:px-3.5 hide-mobile">{p.doctor}</td>
                <td className="py-2.5 px-3 sm:px-3.5 hide-mobile">{p.diagnosis}</td>
                <td className="py-2.5 px-3 sm:px-3.5 hide-mobile">{p.blood}</td>
                <td className="py-2.5 px-3 sm:px-3.5">
                  <Badge status={p.status}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</Badge>
                </td>
                <td className="py-2.5 px-3 sm:px-3.5 hide-mobile">{p.date}</td>
                <td className="py-2.5 px-3 sm:px-3.5">
                  <button 
                    onClick={() => setEditingPatient(p)}
                    className="text-accent hover:text-accent-dark p-1"
                    title="Edit patient"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500 text-[12px]">
                  No patients found matching the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Patient Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-2 sm:p-4" onClick={() => setEditingPatient(null)}>
          <div className="bg-surface rounded-xl border border-border-subtle w-full max-w-[500px] sm:max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-3 sm:p-4 px-4 sm:px-5 border-b border-border-subtle flex justify-between items-center sticky top-0 bg-surface z-10">
              <span className="text-[14px] sm:text-[15px] font-medium">Edit Patient</span>
              <button onClick={() => setEditingPatient(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1">&times;</button>
            </div>
            
            <div className="p-4 sm:p-5 space-y-3">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Patient Name *</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Age</label>
                  <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.age} onChange={e => setEditForm({...editForm, age: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Gender</label>
                  <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})}>
                    <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Blood group</label>
                  <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.blood} onChange={e => setEditForm({...editForm, blood: e.target.value})}>
                    <option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Phone</label>
                  <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.phoneNo} onChange={e => setEditForm({...editForm, phoneNo: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">WhatsApp</label>
                  <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.whatsappNo} onChange={e => setEditForm({...editForm, whatsappNo: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Email</label>
                  <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.emailId} onChange={e => setEditForm({...editForm, emailId: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Address</label>
                <textarea className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" rows={2} value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Pincode</label>
                  <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.pinCode} onChange={e => setEditForm({...editForm, pinCode: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">City</label>
                  <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">State</label>
                  <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.stateId} onChange={e => setEditForm({...editForm, stateId: e.target.value})}>
                    <option value="">Select</option>
                    {states.map(s => (
                      <option key={s.id} value={s.id.toString()}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Relationship</label>
                <div className="flex gap-1">
                  <select className="w-16 p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.relationshipType} onChange={e => setEditForm({...editForm, relationshipType: e.target.value})}>
                    <option value="W/O">W/O</option><option value="S/O">S/O</option><option value="D/O">D/O</option><option value="C/O">C/O</option>
                  </select>
                  <input className="flex-1 p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="Guardian name" value={editForm.relationship} onChange={e => setEditForm({...editForm, relationship: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Emergency contact</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.emergencyContact} onChange={e => setEditForm({...editForm, emergencyContact: e.target.value})} />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Allergies</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.allergies} onChange={e => setEditForm({...editForm, allergies: e.target.value})} />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Diagnosis</label>
                <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={editForm.diagnosis} onChange={e => setEditForm({...editForm, diagnosis: e.target.value})} />
              </div>
            </div>

            <div className="p-3 sm:p-3.5 px-4 sm:px-5 border-t border-border-subtle flex gap-2 justify-end sticky bottom-0 bg-surface z-10">
              <button onClick={() => setEditingPatient(null)} className="px-3 sm:px-4 py-2 border border-border-subtle rounded-md bg-surface text-[12px] hover:bg-surface2 transition-colors">Cancel</button>
              <button onClick={handleEditSave} className="px-3 sm:px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
