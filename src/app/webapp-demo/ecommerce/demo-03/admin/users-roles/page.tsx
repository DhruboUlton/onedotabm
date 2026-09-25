'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  UserCheck,
  Search,
  Plus,
  Shield,
  Key,
  CheckCircle2,
  Clock,
  UserX,
  Lock,
  X,
  Mail,
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Catalog Manager' | 'Order Manager' | 'Finance Manager' | 'Support Manager' | 'Moderator';
  twoFactorEnabled: boolean;
  lastLogin: string;
  status: 'Active' | 'Suspended';
}

const initialUsers: AdminUser[] = [
  { id: 'ADM-01', name: 'Devon Bradley', email: 'd.bradley@kineticgear.internal', role: 'Super Admin', twoFactorEnabled: true, lastLogin: 'Today, 10:14 AM', status: 'Active' },
  { id: 'ADM-02', name: 'Siddharth Rao', email: 's.rao@kineticgear.internal', role: 'Catalog Manager', twoFactorEnabled: true, lastLogin: 'Yesterday, 17:30 PM', status: 'Active' },
  { id: 'ADM-03', name: 'Theresa Mayne', email: 't.mayne@kineticgear.internal', role: 'Finance Manager', twoFactorEnabled: true, lastLogin: 'Sep 24, 09:12 AM', status: 'Active' },
  { id: 'ADM-04', name: 'Carlos Mendez', email: 'c.mendez@kineticgear.internal', role: 'Order Manager', twoFactorEnabled: false, lastLogin: 'Sep 23, 14:05 PM', status: 'Active' },
  { id: 'ADM-05', name: 'Sarah Al-Mansoor', email: 's.mansoor@kineticgear.internal', role: 'Support Manager', twoFactorEnabled: true, lastLogin: 'Sep 22, 11:45 AM', status: 'Active' },
  { id: 'ADM-06', name: 'Julian Foster', email: 'j.foster@kineticgear.internal', role: 'Moderator', twoFactorEnabled: true, lastLogin: 'Sep 20, 18:20 PM', status: 'Active' },
];

export default function AdminUsersRolesPage() {
  const { showToast } = useStore();
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Invite modal form
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<AdminUser['role']>('Catalog Manager');

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleToggleSuspend = (id: string, name: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        showToast('Admin Status Changed', `Operator ${name} is now ${newStatus}`, newStatus === 'Suspended' ? 'warning' : 'success');
        return { ...u, status: newStatus };
      })
    );
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    const newUser: AdminUser = {
      id: `ADM-${Math.floor(10 + Math.random() * 90)}`,
      name: formName,
      email: formEmail,
      role: formRole,
      twoFactorEnabled: false,
      lastLogin: 'Never logged in',
      status: 'Active',
    };

    setUsers((prev) => [...prev, newUser]);
    showToast('Invitation Dispatched', `Credentials invitation sent to ${formEmail}`, 'success');
    setIsModalOpen(false);
    setFormName('');
    setFormEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Admin Users & Access Control (RBAC)
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {users.length} Operators
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage console permissions, enforce hardware 2FA key requirements, and audit administrator activity.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Admin User</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search admin user by name, email, or role..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Catalog Manager">Catalog Manager</option>
          <option value="Finance Manager">Finance Manager</option>
          <option value="Order Manager">Order Manager</option>
          <option value="Support Manager">Support Manager</option>
          <option value="Moderator">Moderator</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Operator Name</th>
                <th className="py-3 px-4">Role Permission</th>
                <th className="py-3 px-4 text-center">2FA Hardware Key</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
                    <div className="text-[11px] text-slate-400">{user.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                      <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{user.role}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                        user.twoFactorEnabled ? 'text-emerald-600' : 'text-amber-500'
                      }`}
                    >
                      <Key className="w-3 h-3" />
                      <span>{user.twoFactorEnabled ? 'Enforced' : 'Pending'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {user.lastLogin}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {user.role !== 'Super Admin' && (
                      <button
                        onClick={() => handleToggleSuspend(user.id, user.name)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          user.status === 'Active'
                            ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                            : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                        }`}
                      >
                        {user.status === 'Active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Invite Console Administrator
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Liam Sterling"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Internal Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="l.sterling@kineticgear.internal"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Assigned RBAC Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="Catalog Manager">Catalog Manager (Products, Categories, Brands)</option>
                  <option value="Order Manager">Order Manager (Pipeline, Shipping, Returns)</option>
                  <option value="Finance Manager">Finance Manager (Commissions, Payouts, Balances)</option>
                  <option value="Support Manager">Support Manager (Helpdesk, Complaints)</option>
                  <option value="Moderator">Moderator (Product & Review Approvals)</option>
                  <option value="Super Admin">Super Admin (Full Root Permissions)</option>
                </select>
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
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
