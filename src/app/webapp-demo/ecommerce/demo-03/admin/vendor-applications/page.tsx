'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  Store,
  MapPin,
  Clock,
  X,
} from 'lucide-react';

interface Application {
  id: string;
  storeName: string;
  applicant: string;
  email: string;
  phone: string;
  hub: string;
  category: string;
  catalogSize: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Info Requested';
  ein: string;
}

const initialApplications: Application[] = [
  {
    id: 'va-101',
    storeName: 'OptiLens Optics',
    applicant: 'Marcus Vance',
    email: 'marcus@optilens.demo',
    phone: '+1 (503) 555-0192',
    hub: 'Portland, OR',
    category: 'Camera Gear & Lenses',
    catalogSize: '32 SKUs',
    date: 'Sep 24, 2026',
    status: 'Pending',
    ein: 'XX-XXX4912',
  },
  {
    id: 'va-102',
    storeName: 'Quantum Thermal Labs',
    applicant: 'Elena Rostova',
    email: 'elena@quantumthermal.demo',
    phone: '+1 (408) 555-3819',
    hub: 'San Jose, CA',
    category: 'PC Cooling & Chassis',
    catalogSize: '15 SKUs',
    date: 'Sep 23, 2026',
    status: 'Pending',
    ein: 'XX-XXX8120',
  },
  {
    id: 'va-103',
    storeName: 'HyperSpeed Cables',
    applicant: 'David Chen',
    email: 'david@hyperspeed.demo',
    phone: '+1 (206) 555-7711',
    hub: 'Seattle, WA',
    category: 'Thunderbolt 5 Accessories',
    catalogSize: '40 SKUs',
    date: 'Sep 21, 2026',
    status: 'Info Requested',
    ein: 'XX-XXX3041',
  },
];

export default function AdminVendorApplicationsPage() {
  const { showToast } = useStore();
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filtered = applications.filter((a) =>
    a.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.hub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = (id: string, newStatus: Application['status'], storeName: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    showToast(
      `Application: ${newStatus}`,
      `Updated onboarding application for "${storeName}"`,
      newStatus === 'Approved' ? 'success' : newStatus === 'Rejected' ? 'error' : 'info'
    );
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            Merchant Onboarding Applications
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review incoming third-party seller registrations, verify tax identification, and grant marketplace access.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search seller applications by business name, applicant or city..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Merchant Store</th>
                <th className="py-3.5 px-3">Primary Contact</th>
                <th className="py-3.5 px-3">Fulfillment Hub</th>
                <th className="py-3.5 px-3">Category Focus</th>
                <th className="py-3.5 px-3">Catalog Size</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 font-bold flex items-center justify-center text-xs">
                        <Store className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{a.storeName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-semibold block text-slate-800 dark:text-slate-200">{a.applicant}</span>
                    <span className="text-[10px] text-slate-400">{a.email}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{a.hub}</td>
                  <td className="py-3.5 px-3 text-slate-500">{a.category}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{a.catalogSize}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        a.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : a.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : a.status === 'Info Requested'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedApp(a)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Review Documents"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {a.status !== 'Approved' && (
                        <button
                          onClick={() => handleUpdateStatus(a.id, 'Approved', a.storeName)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                        >
                          Approve
                        </button>
                      )}

                      {a.status === 'Pending' && (
                        <button
                          onClick={() => handleUpdateStatus(a.id, 'Info Requested', a.storeName)}
                          className="px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-[11px]"
                        >
                          Request Info
                        </button>
                      )}

                      {a.status !== 'Rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(a.id, 'Rejected', a.storeName)}
                          className="px-2 py-1 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold text-[11px]"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base">{selectedApp.storeName}</h3>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Applicant:</span><strong>{selectedApp.applicant}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Email:</span><span>{selectedApp.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Phone:</span><span>{selectedApp.phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Warehouse Location:</span><span>{selectedApp.hub}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Tax ID (EIN):</span><span className="font-mono">{selectedApp.ein}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Current Status:</span><span className="font-bold">{selectedApp.status}</span></div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleUpdateStatus(selectedApp.id, 'Info Requested', selectedApp.storeName)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600"
              >
                Request Info
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedApp.id, 'Approved', selectedApp.storeName)}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white"
              >
                Approve Seller
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
