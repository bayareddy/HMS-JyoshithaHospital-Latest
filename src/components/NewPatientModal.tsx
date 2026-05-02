import React, { useState } from 'react';
import { Patient, State } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  states: State[];
}

const RELATIONSHIP_OPTIONS = ['W/O', 'S/O', 'D/O', 'C/O'];

export function NewPatientModal({ isOpen, onClose, onSave, states }: ModalProps) {
  const [formData, setFormData] = useState({
    first: '', dob: '', gender: '', phone: '', blood: '',
    emergency: '', allergy: '', relationshipType: 'W/O', relationship: '',
    whatsapp: '', email: '', address: '', pincode: '', city: '', stateId: ''
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.first) {
      alert('Please enter patient name as per Aadhar.');
      return;
    }
    
    const newPt: Patient = {
      name: formData.first,
      age: formData.dob ? new Date(formData.dob).getFullYear() : '',
      gender: formData.gender || '',
      ward: '',
      doctor: '',
      diagnosis: '',
      blood: formData.blood || '',
      status: 'admitted',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      phoneNo: formData.phone || undefined,
      emergencyContact: formData.emergency || undefined,
      allergies: formData.allergy || undefined,
      relationshipType: formData.relationshipType || undefined,
      relationship: formData.relationship || undefined,
      whatsappNo: formData.whatsapp || undefined,
      emailId: formData.email || undefined,
      address: formData.address || undefined,
      pinCode: formData.pincode ? Number(formData.pincode) : undefined,
      city: formData.city || undefined,
      stateId: formData.stateId ? Number(formData.stateId) : undefined
    };
    
    onSave(newPt);
    onClose();
    setFormData({
      first: '', dob: '', gender: '', phone: '', blood: '',
      emergency: '', allergy: '', relationshipType: 'W/O', relationship: '',
      whatsapp: '', email: '', address: '', pincode: '', city: '', stateId: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-2 sm:p-4" onClick={onClose}>
      <div className="bg-surface rounded-xl border border-border-subtle w-full max-w-[500px] sm:max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-3 sm:p-4 px-4 sm:px-5 border-b border-border-subtle flex justify-between items-center sticky top-0 bg-surface z-10">
          <span className="text-[14px] sm:text-[15px] font-medium">Register Patient</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1">&times;</button>
        </div>
        
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Patient Name as per Aadhar *</label>
            <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="Patient name as per Aadhar" value={formData.first} onChange={e => setFormData({...formData, first: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Relationship</label>
              <div className="flex gap-1">
                <select 
                  className="w-16 p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none"
                  value={formData.relationshipType}
                  onChange={e => setFormData({...formData, relationshipType: e.target.value})}
                >
                  {RELATIONSHIP_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <input className="flex-1 p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="Guardian name" value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Date of birth</label>
              <input type="date" className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Gender</label>
              <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Blood group</label>
              <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={formData.blood} onChange={e => setFormData({...formData, blood: e.target.value})}>
                <option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Phone *</label>
              <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">WhatsApp Number</label>
              <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="+91 98765 43210" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Email ID</label>
            <input type="email" className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="email@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Emergency contact</label>
            <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="Name & relationship" value={formData.emergency} onChange={e => setFormData({...formData, emergency: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Allergies</label>
              <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="e.g. Penicillin" value={formData.allergy} onChange={e => setFormData({...formData, allergy: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Address</label>
            <textarea className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="Address" rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Pincode</label>
              <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="500001" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">City</label>
              <input className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">State</label>
               <select className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-surface2 focus:bg-white focus:border-accent outline-none" value={formData.stateId} onChange={e => setFormData({...formData, stateId: e.target.value})}>
                 <option value="">Select</option>
                 {states.map(s => (
                   <option key={s.id} value={s.id.toString()}>{s.name}</option>
                 ))}
               </select>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 px-4 sm:px-5 border-t border-border-subtle flex gap-2 justify-end sticky bottom-0 bg-surface z-10">
          <button onClick={onClose} className="px-3 sm:px-4 py-2 border border-border-subtle rounded-md bg-surface text-[12px] hover:bg-surface2 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-3 sm:px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark transition-colors">Register</button>
        </div>
      </div>
    </div>
  );
}
