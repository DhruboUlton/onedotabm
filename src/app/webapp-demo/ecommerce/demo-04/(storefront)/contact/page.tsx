'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, School, Clock, Sparkles } from 'lucide-react';
import { StoreHeader } from '../../_components/StoreHeader';
import { StoreFooter } from '../../_components/StoreFooter';
import { BreadcrumbBanner } from '../../_components/BreadcrumbBanner';
import { useStore } from '../../_context/StoreContext';

export default function ContactPage() {
  const { settings, addToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Bulk School Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    addToast('success', 'Message Transmitted! 📬', 'Thank you! Our education team will respond within 24 hours.');
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <StoreHeader />

      <BreadcrumbBanner
        title="Contact WonderSprout"
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full space-y-16">
        {/* 3 Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFEFE4] p-8 rounded-3xl border border-[#F7941E]/30 space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EB1551] text-white mx-auto flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h4 className="font-bubblegum text-2xl text-[#0A6375]">Phone Inquiries</h4>
            <p className="text-xs text-[#6B6B84] font-nunito">Monday – Friday, 8:00 AM – 6:00 PM CST</p>
            <a href={`tel:${settings.supportPhone}`} className="font-extrabold text-sm text-[#EB1551] block hover:underline">
              {settings.supportPhone}
            </a>
          </div>

          <div className="bg-[#FFEFE4] p-8 rounded-3xl border border-[#F7941E]/30 space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1CBBB4] text-white mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="font-bubblegum text-2xl text-[#0A6375]">Email Concierge</h4>
            <p className="text-xs text-[#6B6B84] font-nunito">Classroom orders & curriculum consulting</p>
            <a href={`mailto:${settings.supportEmail}`} className="font-extrabold text-sm text-[#0A6375] block hover:underline">
              {settings.supportEmail}
            </a>
          </div>

          <div className="bg-[#FFEFE4] p-8 rounded-3xl border border-[#F7941E]/30 space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F7941E] text-white mx-auto flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="font-bubblegum text-2xl text-[#0A6375]">Workshop & Studio</h4>
            <p className="text-xs text-[#6B6B84] font-nunito">{settings.address}</p>
            <span className="font-extrabold text-xs text-[#F7941E] block">Austin, Texas, USA</span>
          </div>
        </div>

        {/* Form & Map/Hours Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-[36px] border border-slate-100 shadow-xl items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#EB1551]">
              Reach Out Directly
            </span>
            <h3 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">
              We Love Connecting with Parents & Schools
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6B84] font-nunito leading-relaxed">
              Whether you are an educator outfitting a classroom or a parent seeking developmental toy recommendations, send us a note and our team of child development specialists will assist you.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-[#008000]/10 border border-[#008000]/30 text-[#008000] text-center space-y-2">
                <h4 className="font-bold text-base">Inquiry Submitted Successfully!</h4>
                <p className="text-xs">We have logged your request and our educator will reply shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 font-nunito">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4] bg-white cursor-pointer"
                  >
                    <option value="Bulk School Inquiry">Bulk Daycare / School Order Inquiry</option>
                    <option value="Product Sizing & Age Range">Product Sizing & Age Range Question</option>
                    <option value="Shipping & International Delivery">Shipping & Delivery Question</option>
                    <option value="Press & Partnership">Press & Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you're looking for..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>

                <button
                  type="submit"
                  className="ws-btn-primary px-8 py-3.5 text-xs uppercase tracking-wider font-extrabold flex items-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 bg-[#FFEFE4] p-8 rounded-3xl space-y-5 border border-[#F7941E]/20">
            <h4 className="font-bubblegum text-2xl text-[#0A6375]">
              Montessori Educator Hours
            </h4>
            <div className="space-y-3 text-xs font-nunito text-[#6B6B84]">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Monday – Friday:</span>
                <strong className="text-[#0F172A]">8:00 AM – 6:00 PM CST</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Saturday Studio:</span>
                <strong className="text-[#0F172A]">10:00 AM – 3:00 PM CST</strong>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <strong className="text-[#EB1551]">Closed for Family Play</strong>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F7941E]/20 text-xs text-[#0F172A] space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-[#0A6375]">
                <School className="w-4 h-4 text-[#EB1551]" />
                <span>School Purchase Orders</span>
              </span>
              <p className="text-[#6B6B84] text-[11px] leading-relaxed">
                We accept official institutional Net-30 purchase orders from certified Montessori schools, public school districts, and daycare networks.
              </p>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
