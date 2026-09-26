'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles, School } from 'lucide-react';
import { useStore } from '../_context/StoreContext';

export function EnquiryModal() {
  const { isEnquiryOpen, closeEnquiry, enquiryProductTitle, addToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState<'Email' | 'Phone' | 'Both'>('Email');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isEnquiryOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      addToast('error', 'Missing Information', 'Please provide at least your name and email.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast(
        'success',
        'Enquiry Received! 🌟',
        'Our Montessori education specialist will reach out within 24 hours.'
      );
      closeEnquiry();
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeEnquiry}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#FFEFE4] border-2 border-[#F7941E]/40 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={closeEnquiry}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white hover:bg-[#EB1551] hover:text-white flex items-center justify-center transition-colors text-slate-500 shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#EB1551] text-white">
              <School className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bubblegum text-2xl sm:text-3xl text-[#0A6375] leading-tight">
                {enquiryProductTitle ? 'Product & Classroom Enquiry' : 'Parent & School Enquiry'}
              </h3>
              <p className="text-xs text-[#6B6B84] font-nunito mt-0.5">
                {enquiryProductTitle ? `Regarding: ${enquiryProductTitle}` : 'Ask questions about classroom kits, bulk orders, or developmental guides.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 font-nunito">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clara Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-full bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-full bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-full bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Preferred Contact Method:
              </label>
              <div className="flex gap-4 text-xs font-bold text-[#0A6375]">
                {(['Email', 'Phone', 'Both'] as const).map((method) => (
                  <label key={method} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      checked={contactMethod === method}
                      onChange={() => setContactMethod(method)}
                      className="text-[#EB1551] focus:ring-[#EB1551]"
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Your Message or Questions
              </label>
              <textarea
                rows={3}
                placeholder="Tell us about your student age group, quantities needed, or specific learning goals..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full ws-btn-primary py-3.5 text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Request...' : 'Send Enquiry to Educators'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
