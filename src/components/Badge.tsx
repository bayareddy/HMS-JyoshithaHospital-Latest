import React from 'react';

export function Badge({ status, children }: { status: string, children: React.ReactNode }) {
  const styles: Record<string, string> = {
    admitted: 'bg-[#E1F5EE] text-[#0F6E56]',
    critical: 'bg-[#FCEBEB] text-[#A32D2D]',
    stable: 'bg-[#E6F1FB] text-[#185FA5]',
    discharged: 'bg-[#F1EFE8] text-[#5F5E5A]',
    scheduled: 'bg-[#FAEEDA] text-[#854F0B]',
    paid: 'bg-[#E1F5EE] text-[#0F6E56]',
    pending: 'bg-[#FAEEDA] text-[#854F0B]',
    overdue: 'bg-[#FCEBEB] text-[#A32D2D]',
  };
  
  return (
    <span className={`px-2 py-[3px] rounded-full text-[10px] font-medium ${styles[status] || styles.stable}`}>
      {children}
    </span>
  );
}
