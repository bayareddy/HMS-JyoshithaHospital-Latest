import React from 'react';
import { Department } from '../types';
import { Plus } from 'lucide-react';

interface DepartmentsProps {
  departments: Department[];
  onOpenModal: () => void;
}

export function Departments({ departments, onOpenModal }: DepartmentsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[14px] font-medium">Department Management</h3>
        <button onClick={onOpenModal} className="px-3 py-1.5 bg-accent text-white border-none rounded-md text-[11px] cursor-pointer flex items-center gap-1.5 font-medium hover:bg-accent-dark transition-colors">
          <Plus className="w-[13px] h-[13px]" />
          New Department
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-surface border border-border-subtle rounded-xl p-4 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div className="text-[14px] font-medium">{dept.name}</div>
              <div className="bg-surface2 text-gray-600 text-[10px] px-2 py-0.5 rounded-full border border-border-subtle">
                {dept.id}
              </div>
            </div>
            <div className="text-[11px] text-gray-500 mb-4 flex-1">{dept.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
