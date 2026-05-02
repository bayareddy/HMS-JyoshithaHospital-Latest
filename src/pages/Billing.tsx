import React from 'react';
import { invoices } from '../data';
import { Badge } from '../components/Badge';

export function Billing() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Total Billed (Apr)</div>
          <div className="text-[24px] font-medium leading-none">₹28.4L</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Collected</div>
          <div className="text-[24px] font-medium leading-none text-accent">₹19.2L</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Pending</div>
          <div className="text-[24px] font-medium leading-none text-warning">₹7.1L</div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-4">
          <div className="text-[11px] text-gray-500 mb-1">Overdue</div>
          <div className="text-[24px] font-medium leading-none text-danger">₹2.1L</div>
        </div>
      </div>

      <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-3 px-4 border-b border-border-subtle">
          <span className="text-[13px] font-medium">Invoice Records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead>
              <tr className="bg-surface2 border-b border-border-subtle">
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Invoice</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Patient</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Department</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Services</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Amount</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Insurance</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Status</th>
                <th className="py-2.5 px-3.5 font-medium text-[11px] text-gray-500">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} className="border-b border-border-subtle last:border-0 hover:bg-[#fafaf9]">
                  <td className="py-2.5 px-3.5 font-medium">#{inv.id}</td>
                  <td className="py-2.5 px-3.5">{inv.patient}</td>
                  <td className="py-2.5 px-3.5">{inv.department}</td>
                  <td className="py-2.5 px-3.5">{inv.services}</td>
                  <td className="py-2.5 px-3.5 font-medium">{inv.amount}</td>
                  <td className="py-2.5 px-3.5">{inv.insurance}</td>
                  <td className="py-2.5 px-3.5">
                    <Badge status={inv.status}>{inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</Badge>
                  </td>
                  <td className="py-2.5 px-3.5">{inv.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
