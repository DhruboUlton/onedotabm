'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '../../_context/StoreContext';
import {
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Eye,
  Filter,
  Search,
  ExternalLink,
  ShieldAlert,
  X,
} from 'lucide-react';

interface ApprovalProduct {
  id: string;
  name: string;
  vendor: string;
  category: string;
  price: number;
  specs: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Changes Requested';
  image: string;
}

const initialApprovalList: ApprovalProduct[] = [
  {
    id: 'appr-1',
    name: 'NovaSync 100W GaN Travel Adapter',
    vendor: 'VoltStream Dynamics',
    category: 'Charging & Power',
    price: 69.99,
    specs: 'Dual USB-C PD 3.1, GaNFast IC, Foldable US/EU pins',
    submittedAt: 'Sep 24, 2026, 14:20',
    status: 'Pending',
    image: '/demo-assets/ecommerce/demo-03/bento-power.jpg',
  },
  {
    id: 'appr-2',
    name: 'Vortex RGB Mechanical Keycaps Set (PBT Double-Shot)',
    vendor: 'CyberForge Hardware',
    category: 'Gaming Peripherals',
    price: 45.00,
    specs: 'Cherry profile, 134 keys, ISO/ANSI layout compatible',
    submittedAt: 'Sep 24, 2026, 11:05',
    status: 'Pending',
    image: '/demo-assets/ecommerce/demo-03/bento-gaming.jpg',
  },
  {
    id: 'appr-3',
    name: 'Studio One Precision Mic Boom Arm with XLR Channel',
    vendor: 'AudioCraft Precision',
    category: 'Studio Audio',
    price: 119.00,
    specs: 'Internal spring design, 360-degree rotation, hidden cable track',
    submittedAt: 'Sep 23, 2026, 18:40',
    status: 'Changes Requested',
    image: '/demo-assets/ecommerce/demo-03/bento-audio.jpg',
  },
  {
    id: 'appr-4',
    name: 'ApexCooler V2 Magnetic MagSafe Radiator',
    vendor: 'AeroTech Labs',
    category: 'Smartphones & Accessories',
    price: 39.99,
    specs: 'Thermoelectric peltier cooling chip, 7-blade silent fan',
    submittedAt: 'Sep 22, 2026, 09:15',
    status: 'Approved',
    image: '/demo-assets/ecommerce/demo-03/deal-phone.jpg',
  },
];

export default function AdminProductApprovalsPage() {
  const { showToast } = useStore();
  const [items, setItems] = useState<ApprovalProduct[]>(initialApprovalList);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ApprovalProduct | null>(null);

  const filtered = items.filter((item) => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: ApprovalProduct['status'], name: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
    showToast(
      `Status: ${newStatus}`,
      `Updated moderation state for "${name}"`,
      newStatus === 'Approved' ? 'success' : newStatus === 'Rejected' ? 'error' : 'info'
    );
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct({ ...selectedProduct, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            Product Approvals & Moderation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review vendor catalog listings, inspect device specifications, and enforce marketplace quality standards.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pending submissions by product name or vendor..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {['all', 'Pending', 'Approved', 'Changes Requested', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                filter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Submitted Product</th>
                <th className="py-3.5 px-3">Merchant</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">MSRP</th>
                <th className="py-3.5 px-3">Submitted</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Moderator Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="max-w-xs">
                        <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{item.name}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{item.specs}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{item.vendor}</td>
                  <td className="py-3.5 px-3 text-slate-500">{item.category}</td>
                  <td className="py-3.5 px-3 font-black text-slate-900 dark:text-slate-100">${item.price.toFixed(2)}</td>
                  <td className="py-3.5 px-3 text-[11px] text-slate-400 whitespace-nowrap">{item.submittedAt}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : item.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : item.status === 'Changes Requested'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedProduct(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Inspect Submission"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {item.status !== 'Approved' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Approved', item.name)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Approve
                        </button>
                      )}

                      {item.status === 'Pending' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Changes Requested', item.name)}
                          className="px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-[11px]"
                        >
                          Revise
                        </button>
                      )}

                      {item.status !== 'Rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Rejected', item.name)}
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

      {/* Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base">{selectedProduct.name}</h3>
                <span className="text-xs text-slate-400">By {selectedProduct.vendor}</span>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                  <span className="font-bold">{selectedProduct.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Proposed Price</span>
                  <span className="font-bold">${selectedProduct.price.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Technical Specs</span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                  {selectedProduct.specs}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleUpdateStatus(selectedProduct.id, 'Changes Requested', selectedProduct.name)}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600"
              >
                Request Changes
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedProduct.id, 'Approved', selectedProduct.name)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white"
              >
                Approve Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
