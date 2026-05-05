import React, { useState } from 'react';
import { Staff as StaffType } from '../types';
import { Badge } from '../components/Badge';
import { Plus, Power, PowerOff, Edit, Trash2, Calendar, Users } from 'lucide-react';
import { TimeOffRequests } from './TimeOffRequests';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

interface StaffProps {
  staffList: StaffType[];
  onToggleStatus: (id: number) => void;
  onOpenModal: () => void;
  onEditStaff: (staff: StaffType) => void;
  onDeleteStaff: (id: number) => void;
  timeOffRequests?: any[];
  onAddTimeOffRequest?: (request: any) => void;
  onUpdateTimeOffRequest?: (request: any) => void;
  onDeleteTimeOffRequest?: (id: number) => void;
  currentStaffName?: string;
  staffListForTimeOff?: Array<{ id: number; name: string }>;
}

export function Staff({ staffList, onToggleStatus, onOpenModal, onEditStaff, onDeleteStaff, timeOffRequests = [], onAddTimeOffRequest, onUpdateTimeOffRequest, onDeleteTimeOffRequest, currentStaffName = '', staffListForTimeOff = [] }: StaffProps) {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'time-off'>('directory');

  const [staffToDelete, setStaffToDelete] = useState<number | null>(null);

  const confirmDelete = () => {
    if (staffToDelete !== null) {
      onDeleteStaff(staffToDelete);
      setStaffToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-border-subtle pb-2">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeSubTab === 'directory' ? 'bg-accent text-white' : 'bg-surface text-gray-600 hover:bg-surface2'}`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Staff Directory
        </button>
        <button
          onClick={() => setActiveSubTab('time-off')}
          className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeSubTab === 'time-off' ? 'bg-accent text-white' : 'bg-surface text-gray-600 hover:bg-surface2'}`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Time Off
        </button>
      </div>

      <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
        {activeSubTab === 'directory' && (
          <>
            <div className="p-3 px-4 border-b border-border-subtle flex justify-between items-center gap-2 flex-wrap">
              <span className="text-[13px] font-medium">Staff Directory</span>
              <button onClick={onOpenModal} className="px-2.5 py-1.5 sm:py-1 bg-accent text-white border-none rounded-md text-[11px] cursor-pointer flex items-center gap-1 font-medium hover:bg-accent-dark transition-colors touch-manipulation">
                <Plus className="w-[11px] h-[11px]" />
                <span className="hidden sm:inline">Onboard Staff</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="w-full text-left text-[12px] border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-surface2 border-b border-border-subtle">
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">Name</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500 hide-mobile">Role</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500 hide-mobile">Department</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500 hide-mobile">Hospital</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500 hide-mobile">Shift</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">Status</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff, i) => (
              <tr key={i} className={`border-b border-border-subtle last:border-0 hover:bg-[#fafaf9] ${!staff.isActive ? 'opacity-60' : ''}`}>
                <td className="py-2.5 px-3 sm:px-3.5">
                  <div className="font-medium">{staff.name}</div>
                </td>
                <td className="py-2.5 px-3 sm:px-3.5 hide-mobile">{staff.role}</td>
                <td className="py-2.5 px-3 sm:px-3.5 hide-mobile">{staff.department}</td>
                <td className="py-2.5 px-3 sm:px-3.5 hide-mobile">{staff.hospital}</td>
                <td className="py-2.5 px-3 sm:px-3.5 hide-mobile">{staff.shift || 'N/A'}</td>
                <td className="py-2.5 px-3 sm:px-3.5">
                  <Badge status={staff.isActive ? 'admitted' : 'critical'}>
                    {staff.isActive ? 'Active' : 'Disabled'}</Badge>
                </td>
                <td className="py-2.5 px-3 sm:px-3.5">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => onToggleStatus(staff.id)}
                      className={`p-1.5 rounded-md border transition-colors touch-manipulation ${
                        staff.isActive ? 'text-danger border-danger/20 hover:bg-danger/10' : 'text-accent border-accent/20 hover:bg-accent/10'
                      }`}
                      title={staff.isActive ? "Disable Account" : "Enable Account"}
                    >
                      {staff.isActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => onEditStaff(staff)} className="text-accent hover:text-accent-dark p-1.5 rounded-md border border-border-subtle hover:bg-surface2 touch-manipulation" title="Edit Staff">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setStaffToDelete(staff.id)} className="text-danger hover:text-red-700 p-1.5 rounded-md border border-border-subtle hover:bg-surface2 touch-manipulation" title="Delete Staff">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
          </>
        )}

        {activeSubTab === 'time-off' && (
          <TimeOffRequests isStaffView={true} staffName={currentStaffName} timeOffRequests={timeOffRequests} onAddTimeOffRequest={onAddTimeOffRequest} onUpdateTimeOffRequest={onUpdateTimeOffRequest} onDeleteTimeOffRequest={onDeleteTimeOffRequest} embedded={true} staffList={staffListForTimeOff.map(s => ({ id: typeof s.id === 'string' ? parseInt(String(s.id).replace('S-', ''), 10) || s.id : s.id, name: s.name }))} />
        )}
      </div>
      
      <DeleteConfirmationModal
        isOpen={staffToDelete !== null}
        onClose={() => setStaffToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
      />
    </div>
  );
}