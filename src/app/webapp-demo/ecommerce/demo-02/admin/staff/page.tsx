'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { StaffMember } from '../../_types';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Check,
  ShieldCheck,
  KeyRound,
  Mail,
  Clock,
  Calendar,
  X,
  Lock,
} from 'lucide-react';

export default function AdminStaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff, roles, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(roles[0]?.name || 'Owner');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName('');
    setEmail('');
    setRole('Order Manager');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: StaffMember) => {
    setEditingMember(m);
    setName(m.name);
    setEmail(m.email);
    setRole(m.role);
    setStatus(m.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingMember) {
      updateStaff(editingMember.id, {
        name: name.trim(),
        email: email.trim(),
        role,
        status,
      });
      showToast(`Staff member "${name}" updated.`, 'success');
    } else {
      addStaff({
        name: name.trim(),
        email: email.trim(),
        role,
        status,
      });
      showToast(`Staff member "${name}" invited successfully.`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleResetPassword = (m: StaffMember) => {
    showToast(`Temporary access token & reset link dispatched to ${m.email}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Internal Operations & Security
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Staff Accounts & Access Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage authenticated team members, roles, activity status, and credential resets.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Member Name & Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {staff.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <strong className="font-bold text-zinc-900 block">{m.name}</strong>
                        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-zinc-400" />
                          {m.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                      <ShieldCheck className="w-3 h-3 text-zinc-600" />
                      {m.role}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <button
                      onClick={() =>
                        updateStaff(m.id, {
                          status: m.status === 'active' ? 'inactive' : 'active',
                        })
                      }
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                        m.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          m.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-400'
                        }`}
                      ></span>
                      <span className="capitalize">{m.status}</span>
                    </button>
                  </td>

                  <td className="py-4 px-4 text-zinc-500 text-[11px] whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {m.lastLogin}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-zinc-400 text-[11px] whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {m.createdAt}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleResetPassword(m)}
                        className="p-1.5 text-zinc-500 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                        title="Reset Passkey / Send Login Link"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 text-zinc-500 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                        title="Edit Role & Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {staff.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove staff access for "${m.name}"?`)) {
                              deleteStaff(m.id);
                            }
                          }}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Revoke Staff"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <h2 className="text-lg font-extrabold text-zinc-900 mb-1">
              {editingMember ? 'Edit Staff Member' : 'Invite Team Member'}
            </h2>
            <p className="text-xs text-zinc-500 mb-4">
              Configure internal administrative permissions and operational access.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Navid Chowdhury"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@auraglass.studio"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Assigned Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white font-medium"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Account Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {editingMember ? 'Save Updates' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
