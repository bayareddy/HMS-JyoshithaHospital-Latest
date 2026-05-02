import React, { useMemo } from 'react';
import { Bed } from 'lucide-react';

export function Beds() {
  const generateBeds = (start: number, count: number) => {
    const types = ['occupied', 'available', 'occupied', 'occupied', 'maintenance', 'available', 'reserved', 'occupied', 'occupied', 'available'];
    return Array.from({ length: count }).map((_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      return { id: start + i, type };
    });
  };

  const wardA = useMemo(() => generateBeds(101, 64), []);
  const wardB = useMemo(() => generateBeds(201, 64), []);

  const getBedStyle = (type: string) => {
    switch (type) {
      case 'occupied': return 'bg-[#FCEBEB] text-[#A32D2D] border-[#F7C1C1]';
      case 'available': return 'bg-[#E1F5EE] text-[#0F6E56] border-[#9FE1CB]';
      case 'maintenance': return 'bg-[#FAEEDA] text-[#854F0B] border-[#FAC775]';
      case 'reserved': return 'bg-[#E6F1FB] text-[#185FA5] border-[#B5D4F4]';
      default: return 'bg-surface text-gray-500 border-border-subtle';
    }
  };

  const BedGrid = ({ beds }: { beds: any[] }) => (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 p-4">
      {beds.map(bed => (
        <div 
          key={bed.id} 
          className={`aspect-square rounded-md flex flex-col items-center justify-center text-[9px] font-semibold cursor-pointer border-[0.5px] transition-transform hover:scale-105 ${getBedStyle(bed.type)}`}
          title={`Bed ${bed.id}: ${bed.type}`}
        >
          <Bed className="w-[13px] h-[13px] mb-0.5" />
          {bed.id}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Total Beds</div>
          <div className="text-[24px] font-medium leading-none">240</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Occupied</div>
          <div className="text-[24px] font-medium leading-none text-danger">184</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Available</div>
          <div className="text-[24px] font-medium leading-none text-accent">42</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Maintenance</div>
          <div className="text-[24px] font-medium leading-none text-warning">14</div>
        </div>
      </div>

      <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-3 px-4 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[13px] font-medium">Ward A — Ground Floor (Beds 101–164)</span>
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#FCEBEB] border-[0.5px] border-[#F7C1C1]"></div>Occupied
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#E1F5EE] border-[0.5px] border-[#9FE1CB]"></div>Available
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#FAEEDA] border-[0.5px] border-[#FAC775]"></div>Maintenance
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#E6F1FB] border-[0.5px] border-[#B5D4F4]"></div>Reserved
            </div>
          </div>
        </div>
        <BedGrid beds={wardA} />
      </div>

      <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-3 px-4 border-b border-border-subtle">
          <span className="text-[13px] font-medium">Ward B — First Floor (Beds 201–264)</span>
        </div>
        <BedGrid beds={wardB} />
      </div>
    </div>
  );
}
