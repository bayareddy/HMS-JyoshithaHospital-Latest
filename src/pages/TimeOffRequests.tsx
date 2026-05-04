import React, { useState, useEffect } from 'react';
import { Badge } from '../components/Badge';
import { Plus, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { TimeOffRequest } from '../types';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

interface TimeOffRequestsProps {
  timeOffRequests: TimeOffRequest[];
  onAddTimeOffRequest?: (request: Omit<TimeOffRequest, 'id' | 'createdAt'>) => void;
  onUpdateTimeOffRequest?: (request: TimeOffRequest) => void;
  onDeleteTimeOffRequest?: (id: number) => void;
  staffName?: string;
  isStaffView?: boolean;
  embedded?: boolean;
  staffList?: Array<{ id: number; name: string }>;
}

const REASONS = [
  'Personal Leave', 'Sick Leave', 'Vacation', 'Family Emergency', 
  'Medical Appointment', 'Maternity/Paternity Leave', 'Bereavement',
  'Other'
];

export function TimeOffRequests({
  timeOffRequests = [],
  onAddTimeOffRequest,
  onUpdateTimeOffRequest,
  onDeleteTimeOffRequest,
  staffName = '',
  isStaffView = false,
  embedded = false,
  staffList = []
}: TimeOffRequestsProps) {
  const [showModal, setShowModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingRequest, setEditingRequest] = useState<TimeOffRequest | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    staffId: isStaffView ? 0 : (staffList.length > 0 ? staffList[0].id : 0),
    startDateTime: '',
    endDateTime: '',
    reason: 'Personal Leave',
    status: 'pending' as const
  });

// Fetch staff from API when modal opens
  const [fetchedStaffList, setFetchedStaffList] = useState<Array<{ id: number; name: string }>>([]);
  const [isFetchingStaff, setIsFetchingStaff] = useState(false);
  
  const fetchStaffFromApi = async () => {
    if (isFetchingStaff) return;
    setIsFetchingStaff(true);
    console.log('Fetching staff from /api/staff...');
    try {
      const response = await fetch('/api/staff');
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Raw staff data:', data);
        const formatted = data.map((s: any) => ({ 
          id: typeof s.id === 'string' ? parseInt(s.id.replace('S-', ''), 10) || s.id : s.id, 
          name: s.name 
        }));
        setFetchedStaffList(formatted);
        console.log('Formatted staff list:', formatted);
      } else {
        console.error('Failed to fetch staff, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setIsFetchingStaff(false);
    }
  };

  // Use fetched staff list as fallback
  const effectiveStaffList = staffList.length > 0 ? staffList : fetchedStaffList;

  // Fetch staff when modal opens if needed
  React.useEffect(() => {
    if (showModal && effectiveStaffList.length === 0) {
      console.log('Modal opened, triggering fetch...');
      fetchStaffFromApi();
    }
  }, [showModal, effectiveStaffList.length]);

  // Update staffId when staffList changes (for initial load)
  React.useEffect(() => {
    if (effectiveStaffList.length > 0 && formData.staffId === 0) {
      setFormData(prev => ({ ...prev, staffId: effectiveStaffList[0].id }));
    }
  }, [effectiveStaffList, isStaffView, formData.staffId]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredRequests = timeOffRequests.filter(req => {
    if (selectedStatusFilter === 'all') return true;
    return req.status === selectedStatusFilter;
  });

  const handleStatusUpdate = (request: TimeOffRequest, newStatus: 'approved' | 'rejected') => {
    const updated = { ...request, status: newStatus };
    onUpdateTimeOffRequest?.(updated);
  };

  const openEditModal = (request: TimeOffRequest) => {
    setEditingRequest(request);
    setFormData({
      staffId: request.staffId,
      startDateTime: toDateTimeLocal(request.startDateTime),
      endDateTime: toDateTimeLocal(request.endDateTime),
      reason: request.reason,
      status: request.status
    });
    setIsEditing(true);
    setShowModal(true);
};

  const openAddModal = () => {
    setEditingRequest(null);
    setFormData({
      staffId: isStaffView ? 0 : (effectiveStaffList.length > 0 ? effectiveStaffList[0].id : 0),
      startDateTime: '',
      endDateTime: '',
      reason: 'Personal Leave',
      status: 'pending'
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.staffId || formData.staffId === 0) {
      alert('Please select a staff member');
      return;
    }
    if (!formData.startDateTime || !formData.endDateTime) {
      alert('Please fill in required fields: Start Date/Time and End Date/Time');
      return;
    }

    if (isEditing && editingRequest) {
      onUpdateTimeOffRequest?.({
        ...editingRequest,
        staffId: formData.staffId,
        startDateTime: toMySqlDateTime(formData.startDateTime),
        endDateTime: toMySqlDateTime(formData.endDateTime),
        reason: formData.reason,
        status: formData.status
});
    } else if (onAddTimeOffRequest) {
      const selectedStaff = effectiveStaffList.find(s => s.id === formData.staffId);
      onAddTimeOffRequest({
        staffId: formData.staffId,
        staffName: selectedStaff ? selectedStaff.name : (staffName || 'Staff Member'),
        startDateTime: toMySqlDateTime(formData.startDateTime),
        endDateTime: toMySqlDateTime(formData.endDateTime),
        reason: formData.reason,
        status: 'pending'
      });
    }
    setShowModal(false);
  };

  const getStatusBadge = (status: TimeOffRequest['status']) => {
    switch (status) {
      case 'approved': return <Badge status="admitted">Approved</Badge>;
      case 'rejected': return <Badge status="critical">Rejected</Badge>;
      default: return <Badge status="warning">Pending</Badge>;
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Convert any valid date string to datetime-local format (YYYY-MM-DDTHH:mm)
  const toDateTimeLocal = (dateTimeStr: string) => {
    if (!dateTimeStr) return '';
    try {
      const d = new Date(dateTimeStr);
      if (isNaN(d.getTime())) return dateTimeStr.replace(' ', 'T').substring(0, 16);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return dateTimeStr.replace(' ', 'T').substring(0, 16);
    }
  };

  // Convert datetime-local format to MySQL format
  const toMySqlDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return '';
    if (dateTimeStr.includes('T')) {
      return dateTimeStr.replace('T', ' ') + ':00';
    }
    if (dateTimeStr.length === 19 && dateTimeStr.includes(' ')) return dateTimeStr;
    return dateTimeStr + ':00';
  };

  const content = (
    <div>
      <div className="p-3 px-4 border-b border-border-subtle flex justify-between items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium">
            {isStaffView ? 'My Time Off' : 'Time Off Requests'}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                selectedStatusFilter === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-surface2 text-gray-600 hover:bg-surface'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatusFilter('pending')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                selectedStatusFilter === 'pending'
                  ? 'bg-warning text-white'
                  : 'bg-surface2 text-gray-600 hover:bg-surface'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedStatusFilter('approved')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                selectedStatusFilter === 'approved'
                  ? 'bg-accent text-white'
                  : 'bg-surface2 text-gray-600 hover:bg-surface'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setSelectedStatusFilter('rejected')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                selectedStatusFilter === 'rejected'
                  ? 'bg-danger text-white'
                  : 'bg-surface2 text-gray-600 hover:bg-surface'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="px-2.5 py-1.5 sm:py-1 bg-accent text-white border-none rounded-md text-[11px] cursor-pointer flex items-center gap-1 font-medium hover:bg-accent-dark transition-colors touch-manipulation"
        >
          <Plus className="w-[11px] h-[11px]" />
          <span className="hidden sm:inline">Request Time Off</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="w-full text-left text-[12px] border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-surface2 border-b border-border-subtle">
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">Staff</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">Start Date/Time</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">End Date/Time</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">Reason</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">Status</th>
              <th className="py-2.5 px-3 sm:px-3.5 font-medium text-[11px] text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400 text-[12px]">
                  {isStaffView ? 'No time off requests submitted' : 'No time off requests'}
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-border-subtle last:border-0 hover:bg-[#fafaf9]">
                  <td className="py-2.5 px-3 sm:px-3.5 font-medium">{request.staffName}</td>
                  <td className="py-2.5 px-3 sm:px-3.5 text-[11px]">{formatDateTime(request.startDateTime)}</td>
                  <td className="py-2.5 px-3 sm:px-3.5 text-[11px]">{formatDateTime(request.endDateTime)}</td>
                  <td className="py-2.5 px-3 sm:px-3.5 text-[11px]">{request.reason}</td>
                  <td className="py-2.5 px-3 sm:px-3.5">{getStatusBadge(request.status)}</td>
                     <td className="py-2.5 px-3 sm:px-3.5">
                     <div className="flex items-center gap-1">
                       {!isStaffView && request.status === 'pending' && (
                         <>
                           <button
                             onClick={() => handleStatusUpdate(request, 'approved')}
                             className="p-1.5 rounded-md border border-border-subtle hover:bg-accent/10 text-accent hover:text-accent-dark transition-colors touch-manipulation"
                             title="Approve"
                           >
                             <CheckCircle className="w-3.5 h-3.5" />
                           </button>
                           <button
                             onClick={() => handleStatusUpdate(request, 'rejected')}
                             className="p-1.5 rounded-md border border-border-subtle hover:bg-danger/10 text-danger hover:text-red-700 transition-colors touch-manipulation"
                             title="Reject"
                           >
                             <XCircle className="w-3.5 h-3.5" />
                           </button>
                         </>
                       )}
                       {isStaffView && request.status === 'pending' && (
                         <>
                           <button
                             onClick={() => openEditModal(request)}
                             className="p-1.5 rounded-md border border-border-subtle hover:bg-surface2 text-accent transition-colors touch-manipulation"
                             title="Edit"
                           >
                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                             </svg>
                           </button>
                           <button
                             onClick={() => setRequestToDelete(request.id)}
                             className="p-1.5 rounded-md border border-border-subtle hover:bg-danger/10 text-danger hover:text-red-700 transition-colors touch-manipulation"
                             title="Delete"
                           >
                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                           </button>
                         </>
                       )}
                     </div>
                   </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Add modal to content when not embedded
  const fullContent = (
    <div>
      {content}
      {showModal && (
        <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-2 sm:p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface rounded-xl border border-border-subtle w-full max-w-[440px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-3 sm:p-4 px-4 sm:px-5 border-b border-border-subtle flex justify-between items-center">
              <span className="text-[14px] sm:text-[15px] font-medium">
                {isEditing ? 'Edit Time Off Request' : 'Request Time Off'}
              </span>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1">&times;</button>
            </div>

<div className="p-4 sm:p-5 space-y-3.5">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Staff Member *</label>
                <select
                  className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-white focus:bg-white focus:border-accent outline-none"
                  value={formData.staffId || ''}
                  onChange={e => setFormData({...formData, staffId: e.target.value ? parseInt(e.target.value) : 0})}
                >
                  <option value="">Select Staff Member</option>
                  {effectiveStaffList.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
                {effectiveStaffList.length === 0 && (
                  <div className="text-orange-500 text-[10px] mt-1">Loading staff...</div>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-white focus:bg-white focus:border-accent outline-none"
                  value={formData.startDateTime}
                  onChange={e => setFormData({...formData, startDateTime: e.target.value})}
                  placeholder="Select start date and time"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">End Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-white focus:bg-white focus:border-accent outline-none"
                  value={formData.endDateTime}
                  onChange={e => setFormData({...formData, endDateTime: e.target.value})}
                  placeholder="Select end date and time"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Reason *</label>
                <select
                  className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-white focus:bg-white focus:border-accent outline-none"
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                >
                  {REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {isEditing && (
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Status</label>
                  <select
                    className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-white focus:bg-white focus:border-accent outline-none"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as 'pending' | 'approved' | 'rejected'})}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-border-subtle flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="px-3 sm:px-4 py-2 border border-border-subtle rounded-md bg-surface text-[12px] hover:bg-surface2 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-3 sm:px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark transition-colors">
                {isEditing ? 'Save Changes' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

    const deleteModal = (
      <DeleteConfirmationModal
        isOpen={requestToDelete !== null}
        onClose={() => setRequestToDelete(null)}
        onConfirm={() => {
          if (requestToDelete) {
            onDeleteTimeOffRequest?.(requestToDelete);
          }
        }}
        title="Delete Time Off Request"
        message="Are you sure you want to delete this time off request? This action cannot be undone."
      />
    );

  return embedded ? (
    <>
      {content}
      {showModal && (
        <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-2 sm:p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface rounded-xl border border-border-subtle w-full max-w-[440px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-3 sm:p-4 px-4 sm:px-5 border-b border-border-subtle flex justify-between items-center">
              <span className="text-[14px] sm:text-[15px] font-medium">
                {isEditing ? 'Edit Time Off Request' : 'Request Time Off'}
              </span>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1">&times;</button>
            </div>

            <div className="p-4 sm:p-5 space-y-3.5">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Staff Member *</label>
                <select
                  className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-white focus:bg-white focus:border-accent outline-none"
                  value={formData.staffId || ''}
                  onChange={e => setFormData({...formData, staffId: e.target.value ? parseInt(e.target.value) : 0})}
                >
                  <option value="">Select Staff Member</option>
                  {effectiveStaffList.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
                {effectiveStaffList.length === 0 && (
                  <div className="text-orange-500 text-[10px] mt-1">Loading staff...</div>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-white focus:bg-white focus:border-accent outline-none"
                  value={formData.startDateTime}
                  onChange={e => setFormData({...formData, startDateTime: e.target.value})}
                  placeholder="Select start date and time"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">End Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-white focus:bg-white focus:border-accent outline-none"
                  value={formData.endDateTime}
                  onChange={e => setFormData({...formData, endDateTime: e.target.value})}
                  placeholder="Select end date and time"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Reason *</label>
                <select
                  className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-white focus:bg-white focus:border-accent outline-none"
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                >
                  {REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {isEditing && (
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Status</label>
                  <select
                    className="w-full p-2 border border-border-subtle rounded-md text-[12px] bg-white focus:bg-white focus:border-accent outline-none"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as 'pending' | 'approved' | 'rejected'})}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-border-subtle flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="px-3 sm:px-4 py-2 border border-border-subtle rounded-md bg-surface text-[12px] hover:bg-surface2 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-3 sm:px-4 py-2 bg-accent text-white rounded-md text-[12px] font-medium hover:bg-accent-dark transition-colors">
                {isEditing ? 'Save Changes' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteModal}
    </>
  ) : (
    <>
      {fullContent}
      {deleteModal}
    </>
  );
}