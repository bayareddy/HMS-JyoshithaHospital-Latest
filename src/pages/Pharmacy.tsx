import React from 'react';
import { meds } from '../data';

export function Pharmacy() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Total SKUs</div>
          <div className="text-[24px] font-medium leading-none">342</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Low Stock</div>
          <div className="text-[24px] font-medium leading-none text-danger">18</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Dispensed Today</div>
          <div className="text-[24px] font-medium leading-none">214</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Pending Orders</div>
          <div className="text-[24px] font-medium leading-none text-warning">7</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {meds.map((m, i) => {
          const pct = Math.round((m.qty / m.max) * 100);
          const barColor = m.low ? '#E24B4A' : pct < 40 ? '#EF9F27' : '#1D9E75';
          
          return (
            <div key={i} className="bg-surface border border-border-subtle rounded-xl p-4">
              <div className="text-[13px] font-medium mb-0.5">{m.name}</div>
              <div className="text-[10px] text-gray-500 mb-3">{m.cat}</div>
              <div className="flex justify-between items-end mt-2">
                <div>
                  <div className="text-[22px] font-medium leading-none mb-1">
                    {m.qty} <span className="text-[11px] text-gray-500 font-normal">units</span>
                  </div>
                  <div className={`text-[10px] font-semibold ${m.low ? 'text-danger' : 'text-accent'}`}>
                    {m.low ? '▲ Low stock' : '✓ In stock'}
                  </div>
                </div>
                <div className="text-[11px] text-gray-500">of {m.max}</div>
              </div>
              <div className="h-1 bg-surface2 rounded-full mt-2 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
