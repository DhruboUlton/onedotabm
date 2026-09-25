'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { Vendor } from '../../_types';
import {
  Store,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Star,
  Package,
  TrendingUp,
  Percent,
  Search,
  ShieldCheck,
  Edit2,
  X,
  Save,
} from 'lucide-react';

export default function AdminVendorsPage() {
  const { vendors, products, approveVendor, updateVendor, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    location: '',
    verified: false,
    status: 'Active' as Vendor['status'],
    priceCategory: '$$' as Vendor['priceCategory'],
  });

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductCount = (vendorId: string) => {
    return products.filter((p) => p.vendorId === vendorId).length;
  };

  const handleApprove = (id: string, name: string) => {
    approveVendor(id);
    showToast('Vendor Verified', `${name} is now a Verified Official Merchant`, 'success');
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setFormData({
      location: v.location,
      verified: v.verified,
      status: v.status,
      priceCategory: v.priceCategory,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;

    updateVendor(editingVendor.id, {
      location: formData.location,
      verified: formData.verified,
      status: formData.status,
      priceCategory: formData.priceCategory,
    });

    showToast('Vendor Saved', `Updated parameters for ${editingVendor.name}`, 'success');
    setEditingVendor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Merchant & Vendor Network
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {vendors.length} Merchants
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authorize seller credentials, enforce marketplace compliance tiers, and review fulfillment metrics.
          </p>
        </div>

        <Link
          href="/webapp-demo/ecommerce/demo-03/vendors"
          target="_blank"
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition-colors self-start sm:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Public Vendor Directory</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchants by business name or fulfillment hub location..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.map((v) => {
          const productCount = getProductCount(v.id);

          return (
            <div
              key={v.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
            >
              <div>
                {/* Top Row: Name, Status Badge, Location */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                      {v.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {v.name}
                        </h3>
                        {v.verified ? (
                          <span
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold"
                            title="Verified Merchant"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                            <Clock className="w-3 h-3" />
                            <span>Pending Review</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{v.location} Hub</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(v)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Merchant"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">
                  {v.bio}
                </p>

                {/* 4 Stats Grid */}
                <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Catalog
                    </span>
                    <span className="font-black text-xs text-slate-800 dark:text-slate-200">
                      {productCount} SKUs
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Rating
                    </span>
                    <div className="flex items-center justify-center gap-0.5 font-black text-xs text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{v.rating}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Tier
                    </span>
                    <span className="font-black text-xs text-blue-600 dark:text-blue-400">
                      {v.priceCategory}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Sales
                    </span>
                    <span className="font-black text-xs text-emerald-600 dark:text-emerald-400">
                      {v.salesCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  Status: <strong className="text-slate-700 dark:text-slate-200">{v.status}</strong>
                </span>

                {!v.verified && (
                  <button
                    onClick={() => handleApprove(v.id, v.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Credentials</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Vendor Modal */}
      {editingVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Edit Merchant Settings
                </h3>
                <p className="text-xs text-slate-400">{editingVendor.name}</p>
              </div>
              <button
                onClick={() => setEditingVendor(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Hub Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pricing Tier
                </label>
                <select
                  value={formData.priceCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, priceCategory: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="$">$ (Budget-Friendly)</option>
                  <option value="$$">$$ (Mid-Range & Pro)</option>
                  <option value="$$$">$$$ (Enthusiast & Luxury)</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Verified Merchant Status Badge</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingVendor(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Merchant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
