import React from 'react';
import { Users, Bed, Calendar, Activity } from 'lucide-react';
import { Patient } from '../types';
import { Badge } from '../components/Badge';

interface DashboardProps {
  patients: Patient[];
  appointments: any[];
  onNavigate: (tab: string) => void;
}

export function Dashboard({ patients, appointments, onNavigate }: DashboardProps) {
  const recentPatients = patients.slice(0, 5);
  
  const today = new Date().toLocaleDateString('en-CA');
  const todaysAppointments = appointments.filter(apt => apt.date === today);
  const appointmentCount = todaysAppointments.length;

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center mb-3 bg-[#E1F5EE] text-[#1D9E75]">
            <Users className="w-[17px] h-[17px]" />
          </div>
          <div className="text-[11px] text-gray-500 mb-1">Total Patients</div>
          <div className="text-[24px] font-medium leading-none">{patients.length}</div>
          <div className="text-[11px] text-gray-500 mt-1">registered patients</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center mb-3 bg-[#FAEEDA] text-[#EF9F27]">
            <Calendar className="w-[17px] h-[17px]" />
          </div>
          <div className="text-[11px] text-gray-500 mb-1">Today's Appointments</div>
          <div className="text-[24px] font-medium leading-none">{appointmentCount}</div>
          <div className="text-[11px] text-gray-500 mt-1">appointments scheduled</div>
        </div>
      </div>

      {/* Two Col Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3.5">
        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 px-4 border-b border-border-subtle flex items-center justify-between">
            <span className="text-[13px] font-medium">Recent Patients</span>
            <button onClick={() => onNavigate('patients')} className="text-[11px] text-accent hover:underline">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="bg-surface2 border-b border-border-subtle">
                  <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Patient</th>
                  <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Doctor</th>
                  <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Status</th>
                  <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((p, i) => (
                  <tr key={i} className="border-b border-border-subtle last:border-0 hover:bg-[#fafaf9]">
                    <td className="py-2.5 px-3.5">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[10px] text-gray-500">#{p.id}</div>
                    </td>
                    <td className="py-2.5 px-3.5">{p.doctor}</td>
                    <td className="py-2.5 px-3.5"><Badge status={p.status}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</Badge></td>
                    <td className="py-2.5 px-3.5">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 px-4 border-b border-border-subtle flex items-center justify-between">
            <span className="text-[13px] font-medium">Today's Appointments</span>
            <button onClick={() => onNavigate('appointments')} className="text-[11px] text-accent hover:underline">Schedule →</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {todaysAppointments.length > 0 ? (
              todaysAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((apt, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 px-4 border-b border-border-subtle last:border-0 hover:bg-surface2 cursor-pointer">
                    <div className="text-[11px] font-semibold text-accent min-w-[42px]">{apt.time}</div>
                    <div>
                      <div className="text-[12px] font-medium">{apt.patient}</div>
                      <div className="text-[10px] text-gray-500">{apt.type || apt.reason}</div>
                    </div>
                    <div className="text-[10px] text-gray-500 ml-auto text-right">{apt.doctor}</div>
                  </div>
                ))
            ) : (
              <div className="py-8 text-center text-gray-500 text-[12px]">
                No appointments today
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Three Col Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
          <div className="p-3 px-4 border-b border-border-subtle"><span className="text-[13px] font-medium">Department Load</span></div>
          <div className="p-2 px-4 py-3 space-y-2.5">
            {[
              { name: 'General Medicine', count: 52, pct: 87, color: '#378ADD' },
              { name: 'Cardiology', count: 38, pct: 76, color: '#E24B4A' },
              { name: 'Neurology', count: 29, pct: 58, color: '#7F77DD' },
              { name: 'Orthopedics', count: 24, pct: 48, color: '#1D9E75' },
              { name: 'OB/GYN', count: 41, pct: 82, color: '#EF9F27' },
              { name: 'Emergency', count: 18, pct: 36, color: '#E24B4A' },
            ].map((dept, i) => (
              <div key={i}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span>{dept.name}</span><span className="font-medium">{dept.count}</span>
                </div>
                <div className="h-[5px] bg-surface2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${dept.pct}%`, backgroundColor: dept.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
          <div className="p-3 px-4 border-b border-border-subtle"><span className="text-[13px] font-medium">Doctors on Duty</span></div>
          <div>
            {[
              { av: 'VM', bg: '#E1F5EE', text: '#0F6E56', name: 'Dr. Vikram Mehta', spec: 'Cardiologist', status: 'On duty', dot: '#1D9E75' },
              { av: 'SK', bg: '#E6F1FB', text: '#185FA5', name: 'Dr. Sunita Kapoor', spec: 'Neurologist', status: 'On duty', dot: '#1D9E75' },
              { av: 'RS', bg: '#FAEEDA', text: '#854F0B', name: 'Dr. Ravi Singh', spec: 'Orthopedic Surgeon', status: 'In surgery', dot: '#EF9F27' },
              { av: 'AI', bg: '#EEEDFE', text: '#3C3489', name: 'Dr. Anita Iyer', spec: 'General Medicine', status: 'On duty', dot: '#1D9E75' },
              { av: 'PV', bg: '#E1F5EE', text: '#0F6E56', name: 'Dr. Preethi Verma', spec: 'Gynecologist', status: 'On duty', dot: '#1D9E75' },
            ].map((doc, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 px-4 border-b border-border-subtle last:border-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0" style={{ backgroundColor: doc.bg, color: doc.text }}>{doc.av}</div>
                <div>
                  <div className="text-[12px] font-medium">{doc.name}</div>
                  <div className="text-[10px] text-gray-500">{doc.spec}</div>
                </div>
                <div className="ml-auto flex items-center gap-1 text-[10px]" style={{ color: doc.dot === '#1D9E75' ? '#1D9E75' : '#EF9F27' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: doc.dot }}></div>
                  {doc.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
          <div className="p-3 px-4 border-b border-border-subtle"><span className="text-[13px] font-medium">Live Activity</span></div>
          <div>
            {[
              { dot: '#E24B4A', text: 'Patient #P-4521 moved to ICU', time: '2 min ago' },
              { dot: '#1D9E75', text: 'Mohammed Ali discharged from Ward B', time: '18 min ago' },
              { dot: '#378ADD', text: 'Lab results ready for Ananya Reddy', time: '31 min ago' },
              { dot: '#EF9F27', text: 'Paracetamol stock running low — 12 units', time: '1 hr ago' },
              { dot: '#1D9E75', text: 'Bed 204 cleaned and marked available', time: '1.5 hr ago' },
            ].map((act, i) => (
              <div key={i} className="flex gap-2.5 py-2 px-4 border-b border-border-subtle last:border-0 items-start">
                <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: act.dot }}></div>
                <div>
                  <div className="text-[11px] leading-relaxed">{act.text}</div>
                  <div className="text-[10px] text-gray-500">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
