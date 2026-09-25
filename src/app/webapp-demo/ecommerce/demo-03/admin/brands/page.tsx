'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import {
  Award,
  Search,
  Plus,
  ExternalLink,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  Package,
  TrendingUp,
  X,
  Save,
} from 'lucide-react';

interface BrandItem {
  id: string;
  name: string;
  country: string;
  productCount: number;
  revenue: number;
  verified: boolean;
  status: 'Active' | 'Under Review';
}

const initialBrands: BrandItem[] = [
  { id: 'b-1', name: 'AeroTech', country: 'United States', productCount: 18, revenue: 142000, verified: true, status: 'Active' },
  { id: 'b-2', name: 'CyberForge', country: 'Germany', productCount: 14, revenue: 98000, verified: true, status: 'Active' },
  { id: 'b-3', name: 'VoltStream', country: 'Japan', productCount: 12, revenue: 84000, verified: true, status: 'Active' },
  { id: 'b-4', name: 'AudioCraft', country: 'Denmark', productCount: 9, revenue: 62000, verified: true, status: 'Active' },
  { id: 'b-5', name: 'Quantum Core', country: 'Taiwan', productCount: 8, revenue: 45000, verified: true, status: 'Active' },
  { id: 'b-6', name: 'Synapse AI', country: 'Canada', productCount: 6, revenue: 38000, verified: false, status: 'Under Review' },
];

export default function AdminBrandsPage() {
  const { showToast } = useStore();
  const [brands, setBrands] = useState<BrandItem[]>(initialBrands);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', country: 'United States' });

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleVerified = (id: string) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, verified: !b.verified } : b))
    );
    showToast('Brand Updated', 'Verification credentials toggled', 'info');
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const newBrand: BrandItem = {
      id: `b-${Date.now()}`,
      name: formData.name,
      country: formData.country,
      productCount: 0,
      revenue: 0,
      verified: true,
      status: 'Active',
    };
    setBrands([newBrand, ...brands]);
    showToast('Brand Added', `Registered brand "${formData.name}"`, 'success');
    setIsModalOpen(false);
    setFormData({ name: '', country: 'United States' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            Hardware Brands & Manufacturers
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered electronics OEMs, authorized trademarks, and marketplace distributor contracts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Brand</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search brands by OEM name or country..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Brands Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Brand / OEM</th>
                <th className="py-3.5 px-3">Country of Origin</th>
                <th className="py-3.5 px-3">Catalog Size</th>
                <th className="py-3.5 px-3">Marketplace Revenue</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-black flex items-center justify-center text-sm shadow-xs">
                        {b.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{b.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{b.country}</td>
                  <td className="py-3.5 px-3 font-semibold">{b.productCount} SKUs</td>
                  <td className="py-3.5 px-3 font-black text-slate-900 dark:text-slate-100">
                    ${b.revenue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleVerified(b.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                        b.verified
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{b.verified ? 'Verified OEM' : 'Verify'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base">Register Hardware Brand</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Country of Origin</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold rounded-xl text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
