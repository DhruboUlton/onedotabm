'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  BellRing,
  Mail,
  Smartphone,
  CheckCircle2,
  Save,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  ShoppingBag,
  Store,
  Users,
} from 'lucide-react';

interface NotificationRule {
  id: string;
  category: 'Orders' | 'Vendors' | 'Customers' | 'Admin Alerts';
  name: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
}

const initialRules: NotificationRule[] = [
  { id: 'notif-1', category: 'Orders', name: 'Order Confirmation & Receipt', description: 'Dispatched to buyer immediately upon payment capture.', email: true, sms: false, push: true },
  { id: 'notif-2', category: 'Orders', name: 'Courier Tracking & Out for Delivery', description: 'Real-time transit updates as carrier scans parcel.', email: true, sms: true, push: true },
  { id: 'notif-3', category: 'Vendors', name: 'New Sale Order Dispatch Notice', description: 'Alerts merchant fulfillment hub to pick & pack parcel.', email: true, sms: false, push: true },
  { id: 'notif-4', category: 'Vendors', name: 'Weekly ACH Payout Remittance', description: 'Summary of settled funds deposited into merchant bank.', email: true, sms: false, push: false },
  { id: 'notif-5', category: 'Customers', name: 'Wishlist Back-in-Stock Alert', description: 'Notifies shoppers when monitored hardware re-stocks.', email: true, sms: false, push: true },
  { id: 'notif-6', category: 'Admin Alerts', name: 'Critical Stockout Alert (< 3 units)', description: 'Alerts operations when high-demand flagship nears zero.', email: true, sms: true, push: true },
  { id: 'notif-7', category: 'Admin Alerts', name: 'Chargeback & Dispute Notification', description: 'Urgent notice when customer opens financial dispute.', email: true, sms: true, push: true },
];

export default function NotificationSettingsPage() {
  const { showToast } = useStore();
  const [rules, setRules] = useState<NotificationRule[]>(initialRules);

  const handleToggleChannel = (id: string, channel: 'email' | 'sms' | 'push') => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, [channel]: !r[channel] };
        showToast('Notification Channel Toggled', `${channel.toUpperCase()} for "${r.name}" updated`, 'info');
        return updated;
      })
    );
  };

  const handleSaveAll = () => {
    showToast('Notification Triggers Saved', 'Updated communication pipelines across email, SMS, and webhook relays', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Notification & Trigger Settings
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Event Subscriptions
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure automated transaction emails, SMS delivery alerts, and mission-critical ops push notifications.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* Rules Table by Category */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Event Trigger & Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Email</th>
                <th className="py-3 px-4 text-center">SMS Relay</th>
                <th className="py-3 px-4 text-center">App Push</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{rule.name}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {rule.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-[280px]">
                    {rule.description}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleChannel(rule.id, 'email')}
                      className={`p-1 rounded-lg transition-colors ${
                        rule.email ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    >
                      {rule.email ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleChannel(rule.id, 'sms')}
                      className={`p-1 rounded-lg transition-colors ${
                        rule.sms ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    >
                      {rule.sms ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleChannel(rule.id, 'push')}
                      className={`p-1 rounded-lg transition-colors ${
                        rule.push ? 'text-purple-600 dark:text-purple-400' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    >
                      {rule.push ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
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
