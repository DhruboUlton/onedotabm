'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Heart,
  Search,
  Bell,
  TrendingUp,
  Package,
  ShoppingBag,
  Send,
  Eye,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface WishlistDemandItem {
  id: string;
  productName: string;
  category: string;
  vendorName: string;
  price: number;
  totalWishlists: number;
  cartConversions: number;
  conversionRate: number; // %
  currentStock: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const initialWishlistItems: WishlistDemandItem[] = [
  {
    id: 'prod-01',
    productName: 'AeroBlade 16 Titanium Pro',
    category: 'Laptops',
    vendorName: 'AeroTech Labs',
    price: 2499.00,
    totalWishlists: 342,
    cartConversions: 84,
    conversionRate: 24.5,
    currentStock: 12,
    stockStatus: 'Low Stock',
  },
  {
    id: 'prod-02',
    productName: 'ApexView 34" Curved OLED Monitor',
    category: 'Displays',
    vendorName: 'Quantum Dynamics',
    price: 899.99,
    totalWishlists: 289,
    cartConversions: 42,
    conversionRate: 14.5,
    currentStock: 0,
    stockStatus: 'Out of Stock',
  },
  {
    id: 'prod-03',
    productName: 'Valkyrie Hall-Effect Wireless Controller',
    category: 'Gaming',
    vendorName: 'CyberForge Systems',
    price: 179.99,
    totalWishlists: 215,
    cartConversions: 68,
    conversionRate: 31.6,
    currentStock: 45,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-04',
    productName: 'Aura Studio Wireless ANC Headphones',
    category: 'Audio',
    vendorName: 'AudioCraft Acoustics',
    price: 449.00,
    totalWishlists: 198,
    cartConversions: 51,
    conversionRate: 25.7,
    currentStock: 24,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-05',
    productName: 'VoltStation 200W GaN Desktop Charger',
    category: 'Power',
    vendorName: 'VoltStream Energy',
    price: 129.99,
    totalWishlists: 164,
    cartConversions: 62,
    conversionRate: 37.8,
    currentStock: 60,
    stockStatus: 'In Stock',
  },
];

export default function WishlistActivityPage() {
  const { showToast } = useStore();
  const [items, setItems] = useState<WishlistDemandItem[]>(initialWishlistItems);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = items.filter((item) => {
    return (
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalSavedCount = items.reduce((sum, it) => sum + it.totalWishlists, 0);

  const handleBroadcastCampaign = (productName: string, count: number) => {
    showToast('Promotion Triggered', `Discount incentive notification dispatched to ${count} shoppers who saved ${productName}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Wishlist Activity & Demand
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300">
              Shopper Intent
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track unfulfilled consumer intent, identify high-intent restock alerts, and dispatch automated price drop campaigns.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Saved Items</span>
            <div className="w-9 h-9 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            {totalSavedCount.toLocaleString()} Saves
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+24.1% over last 30 days</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Wishlist-to-Cart Ratio</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-blue-600 dark:text-blue-400">
            26.8%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Strong purchasing intent signal</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unfulfilled Backorder Potential</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600 dark:text-amber-400">
            $260,000+
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pending out-of-stock monitor alerts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Demand Category</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            Laptops & PCs
          </div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">AeroBlade 16 leading</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search wishlist products, vendors, or category..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Hardware Item</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-center">Shoppers Saved</th>
                <th className="py-3 px-4 text-center">Cart Conversions</th>
                <th className="py-3 px-4 text-center">Conversion %</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Marketing Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    <div>{item.productName}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{item.category}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                    {item.vendorName}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-black text-pink-600 dark:text-pink-400">
                    {item.totalWishlists}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                    {item.cartConversions}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-600 dark:text-blue-400">
                    {item.conversionRate}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.stockStatus === 'In Stock'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : item.stockStatus === 'Low Stock'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.stockStatus} ({item.currentStock})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleBroadcastCampaign(item.productName, item.totalWishlists)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Incentivize</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
