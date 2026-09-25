'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Headphones,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  User,
  ShieldCheck,
  Tag,
  Paperclip,
  Check,
} from 'lucide-react';

interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: 'Order Logistics' | 'Hardware Warranty' | 'Payment & Billing' | 'Account Access';
  priority: 'Urgent' | 'High' | 'Normal';
  status: 'Open' | 'Pending Response' | 'Resolved';
  createdDate: string;
  lastUpdated: string;
  messages: {
    sender: 'customer' | 'agent';
    text: string;
    timestamp: string;
  }[];
}

const initialTickets: SupportTicket[] = [
  {
    id: 'TICK-401',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@techlabs.io',
    subject: 'AeroBlade 16 trackpad calibration patch request',
    category: 'Hardware Warranty',
    priority: 'High',
    status: 'Open',
    createdDate: '2026-09-24',
    lastUpdated: '10 mins ago',
    messages: [
      {
        sender: 'customer',
        text: 'Hi support team, I received my AeroBlade 16 yesterday. The haptic feedback on the glass trackpad feels loose on the left quadrant. Is there a firmware patch or do I need an RMA exchange?',
        timestamp: 'Sep 24, 09:15 AM',
      },
    ],
  },
  {
    id: 'TICK-402',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@designworks.com',
    subject: 'Request VAT corporate tax invoice for Order #KG-89023',
    category: 'Payment & Billing',
    priority: 'Normal',
    status: 'Pending Response',
    createdDate: '2026-09-23',
    lastUpdated: '3 hours ago',
    messages: [
      {
        sender: 'customer',
        text: 'Hello, could you please issue an amended invoice containing our company VAT ID DE399102834 for accounting reimbursement?',
        timestamp: 'Sep 23, 14:20 PM',
      },
      {
        sender: 'agent',
        text: 'Hello Elena, our finance ledger has generated the amended PDF invoice with your VAT identification. Please verify.',
        timestamp: 'Sep 23, 16:45 PM',
      },
    ],
  },
  {
    id: 'TICK-403',
    customerName: 'David Kim',
    customerEmail: 'david.kim@streamerhub.gg',
    subject: 'Custom USB-C polling rate query for Valkyrie controller',
    category: 'Order Logistics',
    priority: 'Normal',
    status: 'Resolved',
    createdDate: '2026-09-22',
    lastUpdated: '1 day ago',
    messages: [
      {
        sender: 'customer',
        text: 'Can this controller sustain 1000Hz polling rate through a USB-C Thunderbolt hub?',
        timestamp: 'Sep 22, 11:00 AM',
      },
      {
        sender: 'agent',
        text: 'Yes David, the Valkyrie controller is calibrated for up to 1000Hz native polling over direct USB 3.2 Gen 2 and certified Thunderbolt 4 docks.',
        timestamp: 'Sep 22, 11:30 AM',
      },
    ],
  },
  {
    id: 'TICK-404',
    customerName: 'Chloe Bennett',
    customerEmail: 'chloe.b@creativecorp.org',
    subject: 'URGENT: Delayed courier delivery for Seattle commercial address',
    category: 'Order Logistics',
    priority: 'Urgent',
    status: 'Open',
    createdDate: '2026-09-25',
    lastUpdated: 'Just now',
    messages: [
      {
        sender: 'customer',
        text: 'Our commercial studio closes at 5PM today. FedEx tracking still says "On Delivery Vehicle". Can you request priority afternoon window dispatch?',
        timestamp: 'Sep 25, 08:30 AM',
      },
    ],
  },
];

export default function CustomerSupportPage() {
  const { showToast } = useStore();
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TICK-401');
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMessage = {
      sender: 'agent' as const,
      text: replyText.trim(),
      timestamp: 'Just now',
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: 'Pending Response',
              lastUpdated: 'Just now',
              messages: [...t.messages, newMessage],
            }
          : t
      )
    );

    showToast('Reply Dispatched', `Support message transmitted to ${selectedTicket.customerName}`, 'success');
    setReplyText('');
  };

  const handleToggleStatus = (newStatus: SupportTicket['status']) => {
    if (!selectedTicket) return;
    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: newStatus } : t))
    );
    showToast('Ticket Updated', `Ticket #${selectedTicket.id} marked as ${newStatus}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Customer Support Helpdesk
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Omnichannel Triage
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Resolve buyer inquiries, dispatch technical hardware advisories, and track tier-1 SLA metrics.
          </p>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Ticket Queue List (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[700px]">
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tickets by customer or subject..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                {filteredTickets.length} Active Tickets
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Pending Response">Pending</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Ticket Items Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredTickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicketId;

              return (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full text-left p-4 transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-blue-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      {ticket.id}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        ticket.priority === 'Urgent'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                          : ticket.priority === 'High'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                    {ticket.subject}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{ticket.customerName}</span>
                    <span>{ticket.lastUpdated}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {ticket.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        ticket.status === 'Open'
                          ? 'text-rose-600 dark:text-rose-400'
                          : ticket.status === 'Resolved'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      • {ticket.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Ticket Detail & Chat Thread (7 Cols) */}
        {selectedTicket && (
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[700px]">
            {/* Conversation Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {selectedTicket.id}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <span className="text-xs font-semibold text-slate-500">{selectedTicket.category}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mt-1">
                  {selectedTicket.subject}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  From: {selectedTicket.customerName} ({selectedTicket.customerEmail})
                </div>
              </div>

              {/* Status Controls */}
              <div className="flex items-center gap-1.5">
                {selectedTicket.status !== 'Resolved' ? (
                  <button
                    onClick={() => handleToggleStatus('Resolved')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve Ticket</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleStatus('Open')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {selectedTicket.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'agent' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400 font-medium">
                    <span>{msg.sender === 'agent' ? 'Support Desk (You)' : selectedTicket.customerName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'agent'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Composer Form */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="relative">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official support resolution or internal guidance note..."
                  rows={3}
                  className="w-full p-3.5 text-xs rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner resize-none"
                />

                <div className="flex items-center justify-between mt-2 pt-2">
                  <span className="text-[11px] text-slate-400">
                    Pressing Send transmits notification to buyer's verified email.
                  </span>

                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
