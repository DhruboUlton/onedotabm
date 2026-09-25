'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { Mail, Phone, MapPin, Send, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const { settings, showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Hardware Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Validation Error', 'Please fill out all required fields.', 'error');
      return;
    }
    showToast('Inquiry Dispatched', 'Thank you! A hardware specialist will respond within 4 hours.', 'success');
    setFormData({ name: '', email: '', subject: 'General Hardware Inquiry', message: '' });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12 space-y-10">
      <div className="max-w-xl space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          Support & Vendor Inquiries
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
          Connect with Kinetic Gear
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Have questions regarding an order, technical specifications, or becoming a verified marketplace seller?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Details Card */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Marketplace Operations</h2>

          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 dark:text-slate-100">Fulfillment Headquarters:</strong>
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 dark:text-slate-100">Telephone Inquiries:</strong>
                <span>{settings.contactPhone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 dark:text-slate-100">Electronic Mail:</strong>
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>48-Hour Vendor Onboarding SLA:</strong> Verified hardware partners undergo electrical safety and fulfillment verification before listings go live.
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Your Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Inquiry Topic</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-600"
              >
                <option value="General Hardware Inquiry">General Hardware Inquiry</option>
                <option value="Vendor Onboarding Application">Vendor Onboarding Application</option>
                <option value="Order Tracking / Delivery Help">Order Tracking / Delivery Help</option>
                <option value="Warranty / RMA Service">Warranty / RMA Service</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Message *</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can our technical support team assist you?"
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
