import React from 'react';

export function Reports() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Patient Satisfaction</div>
          <div className="text-[24px] font-medium leading-none">4.6 / 5</div>
          <div className="text-[11px] text-gray-500 mt-1"><span className="text-accent">↑0.2</span> from last quarter</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Avg. Length of Stay</div>
          <div className="text-[24px] font-medium leading-none">4.2 days</div>
          <div className="text-[11px] text-gray-500 mt-1"><span className="text-accent">↓0.5</span> days improvement</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Readmission Rate</div>
          <div className="text-[24px] font-medium leading-none">3.8%</div>
          <div className="text-[11px] text-gray-500 mt-1"><span className="text-accent">↓0.4%</span> vs benchmark</div>
        </div>
      </div>

      <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-3 px-4 border-b border-border-subtle">
          <span className="text-[13px] font-medium">Monthly Summary — March 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead>
              <tr className="bg-surface2 border-b border-border-subtle">
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Department</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Admissions</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Discharges</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Surgeries</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Avg LOS</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Occupancy</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dept: 'General Medicine', adm: 142, dis: 138, sur: '—', los: '3.8 days', occ: '87%', rev: '₹12.4L' },
                { dept: 'Cardiology', adm: 68, dis: 65, sur: 14, los: '5.2 days', occ: '76%', rev: '₹24.8L' },
                { dept: 'Neurology', adm: 52, dis: 51, sur: 6, los: '4.7 days', occ: '58%', rev: '₹18.2L' },
                { dept: 'Orthopedics', adm: 44, dis: 44, sur: 22, los: '6.1 days', occ: '48%', rev: '₹31.6L' },
                { dept: 'OB/GYN', adm: 78, dis: 76, sur: 18, los: '3.2 days', occ: '82%', rev: '₹14.9L' },
                { dept: 'Emergency', adm: 214, dis: 198, sur: 8, los: '1.4 days', occ: '—', rev: '₹8.7L' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border-subtle last:border-0 hover:bg-[#fafaf9]">
                  <td className="py-2.5 px-3.5 font-medium">{row.dept}</td>
                  <td className="py-2.5 px-3.5">{row.adm}</td>
                  <td className="py-2.5 px-3.5">{row.dis}</td>
                  <td className="py-2.5 px-3.5">{row.sur}</td>
                  <td className="py-2.5 px-3.5">{row.los}</td>
                  <td className="py-2.5 px-3.5">{row.occ}</td>
                  <td className="py-2.5 px-3.5">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
