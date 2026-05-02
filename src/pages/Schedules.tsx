import React from 'react';
import { Staff as StaffType } from '../types';
import { Badge } from '../components/Badge';
import { Edit } from 'lucide-react';

interface SchedulesProps {
  staffList: StaffType[];
  onEditSchedule: (staff: StaffType) => void;
}

export function Schedules({ staffList, onEditSchedule }: SchedulesProps) {
  return (
    <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
      <div className="p-3 px-4 border-b border-border-subtle">
        <span className="text-[13px] font-medium">Scheduling Oversight</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px] border-collapse">
          <thead>
            <tr className="bg-surface2 border-b border-border-subtle">
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Staff Member</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Role</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Department</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Current Shift</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">OPD Window</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Availability</th>
              <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.filter(s => s.isActive).map((staff, i) => (
              <tr key={i} className="border-b border-border-subtle last:border-0 hover:bg-[#fafaf9]">
                <td className="py-2.5 px-3.5 font-medium">{staff.name}</td>
                <td className="py-2.5 px-3.5">{staff.role}</td>
                <td className="py-2.5 px-3.5">{staff.department}</td>
                <td className="py-2.5 px-3.5">
                  <div className="flex flex-col gap-1">
                    {staff.assignedShifts?.map(a => (
                      <div key={a.id} className="text-[10px] text-gray-600">
                        <span className="font-medium text-gray-800">{a.days.map(d => d.substring(0, 3)).join(', ')}:</span> {a.shifts.join(', ')}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-2.5 px-3.5">{staff.opdWindow || '—'}</td>
                <td className="py-2.5 px-3.5">
                  <Badge status={staff.availability === 'Available' ? 'admitted' : staff.availability === 'In Surgery' ? 'scheduled' : 'critical'}>
                    {staff.availability}
                  </Badge>
                </td>
                <td className="py-2.5 px-3.5">
                  <button 
                    onClick={() => onEditSchedule(staff)}
                    className="flex items-center gap-1 text-[11px] text-accent hover:text-accent-dark border border-border-subtle px-2 py-1 rounded-md hover:bg-surface2 transition-colors"
                  >
                    <Edit className="w-3 h-3" /> Override
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
