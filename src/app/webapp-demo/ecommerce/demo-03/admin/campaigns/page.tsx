'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Megaphone,
  Search,
  Plus,
  TrendingUp,
  DollarSign,
  Target,
  ArrowUpRight,
  Eye,
  MousePointer,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
} from 'lucide-react';

interface MarketingCampaign {
  id: string;
  name: string;
  channel: 'Google Search Ads' | 'Meta Dynamic Retargeting' | 'Tech Newsletter Co-Op' | 'YouTube Hardware Reviews';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  attributedRevenue: number;
  roas: number; // Return on Ad Spend (e.g., 4.2x)
  status: 'Active' | 'Paused' | 'Completed';
}

const initialCampaigns: MarketingCampaign[] = [
  {
    id: 'CMP-501',
    name: 'Q3 Titanium Laptop Intent Search',
    channel: 'Google Search Ads',
    budget: 8500.00,
    spend: 6420.00,
    impressions: 142000,
    clicks: 11400,
    conversions: 240,
    attributedRevenue: 38400.00,
    roas: 5.98,
    status: 'Active',
  },
  {
    id: 'CMP-502',
    name: 'Abandoned Cart Retargeting Audiophile',
    channel: 'Meta Dynamic Retargeting',
    budget: 4000.00,
    spend: 3120.00,
    impressions: 89000,
    clicks: 6800,
    conversions: 180,
    attributedRevenue: 19800.00,
    roas: 6.34,
    status: 'Active',
  },
  {
    id: 'CMP-503',
    name: 'Linus Tech Hardware Drop Newsletter',
    channel: 'Tech Newsletter Co-Op',
    budget: 3500.00,
    spend: 3500.00,
    impressions: 450000,
    clicks: 28000,
    conversions: 410,
    attributedRevenue: 24600.00,
    roas: 7.02,
    status: 'Completed',
  },
  {
    id: 'CMP-504',
    name: 'Hall-Effect Controller Creator Sponsorships',
    channel: 'YouTube Hardware Reviews',
    budget: 5000.00,
    spend: 1800.00,
    impressions: 210000,
    clicks: 14500,
    conversions: 130,
    attributedRevenue: 8900.00,
    roas: 4.94,
    status: 'Paused',
  },
];

export default function MarketingCampaignsPage() {
  const { showToast } = useStore();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New campaign state
  const [formName, setFormName] = useState('');
  const [formChannel, setFormChannel] = useState<MarketingCampaign['channel']>('Google Search Ads');
  const [formBudget, setFormBudget] = useState(5000);

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.channel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchChannel = channelFilter === 'ALL' || c.channel === channelFilter;
    return matchSearch && matchChannel;
  });

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.attributedRevenue, 0);
  const overallRoas = (totalRevenue / (totalSpend || 1)).toFixed(2);

  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newStatus = c.status === 'Active' ? 'Paused' : 'Active';
        showToast('Campaign Status Updated', `Campaign "${c.name}" is now ${newStatus}`, 'info');
        return { ...c, status: newStatus };
      })
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const newCamp: MarketingCampaign = {
      id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
      name: formName,
      channel: formChannel,
      budget: formBudget,
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      attributedRevenue: 0,
      roas: 0,
      status: 'Active',
    };

    setCampaigns((prev) => [newCamp, ...prev]);
    showToast('Ad Campaign Launched', `Initiated "${formName}" with $${formBudget} budget`, 'success');
    setIsModalOpen(false);
    setFormName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Paid Ad Campaigns & ROAS
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Acquisition Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track multi-touch advertising channels, blended customer acquisition cost, and revenue returns on ad spend.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Ad Spend</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 4 digital channels</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Attributed GMV</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Direct pixel attribution</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Blended ROAS</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-purple-600 dark:text-purple-400">
            {overallRoas}x
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Target benchmark: 3.50x</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Conversions</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <MousePointer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            960 Orders
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avg CPA: $15.45 / sale</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campaigns by name or channel..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Ad Channels</option>
          <option value="Google Search Ads">Google Search Ads</option>
          <option value="Meta Dynamic Retargeting">Meta Dynamic Retargeting</option>
          <option value="Tech Newsletter Co-Op">Tech Newsletter Co-Op</option>
          <option value="YouTube Hardware Reviews">YouTube Hardware Reviews</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Budget</th>
                <th className="py-3 px-4 text-right">Spend</th>
                <th className="py-3 px-4 text-center">Clicks / Conv</th>
                <th className="py-3 px-4 text-right">Attributed GMV</th>
                <th className="py-3 px-4 text-center">ROAS</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    <div>{item.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{item.id}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {item.channel}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-500 dark:text-slate-400">
                    ${item.budget.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                    ${item.spend.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.clicks.toLocaleString()}</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{item.conversions}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100">
                    ${item.attributedRevenue.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-black text-purple-600 dark:text-purple-400">
                    {item.roas > 0 ? `${item.roas}x` : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : item.status === 'Paused'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Toggle Active/Paused"
                    >
                      {item.status === 'Active' ? (
                        <ToggleRight className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                      )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Launch Paid Marketing Campaign
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Q4 Black Friday High-Intent Search"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Traffic Channel
                </label>
                <select
                  value={formChannel}
                  onChange={(e) => setFormChannel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="Google Search Ads">Google Search Ads</option>
                  <option value="Meta Dynamic Retargeting">Meta Dynamic Retargeting</option>
                  <option value="Tech Newsletter Co-Op">Tech Newsletter Co-Op</option>
                  <option value="YouTube Hardware Reviews">YouTube Hardware Reviews</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Allocated Budget ($)
                </label>
                <input
                  type="number"
                  value={formBudget}
                  onChange={(e) => setFormBudget(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/25"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
