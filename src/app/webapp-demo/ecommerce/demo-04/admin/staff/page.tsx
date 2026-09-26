'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { StaffMember } from '../../_types';

export default function AdminStaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff, toggleStaffStatus, addToast } = useStore();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Order Manager' as StaffMember['role'],
    status: 'Active' as StaffMember['status'],
    avatar: '👩‍🏫',
  });

  const filteredStaff = staff.filter((s) => {
    if (roleFilter !== 'all' && s.role !== roleFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setForm({
      name: '',
      email: '',
      role: 'Order Manager',
      status: 'Active',
      avatar: '👩‍💻',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: StaffMember) => {
    setEditingStaff(member);
    setForm({
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
      avatar: member.avatar,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      addToast('error', 'Name and email are required');
      return;
    }

    if (editingStaff) {
      updateStaff(editingStaff.id, form);
      addToast('success', `Staff member ${form.name} updated`);
    } else {
      addStaff(form);
      addToast('success', `Staff member ${form.name} invited`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteStaff(id);
    setDeleteConfirmId(null);
    addToast('info', 'Staff member deleted');
  };

  const handleResetAccess = (member: StaffMember) => {
    addToast('info', `Password reset instructions dispatched to ${member.email}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0A6375] uppercase tracking-wider mb-1">
            <Link href="/webapp-demo/ecommerce/demo-04/admin" className="hover:underline">Admin</Link>
            <span>/</span>
            <span>Organization</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-bubblegum">
            Staff & Team Members 👥
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage administrative store access, merchant roles, and permissions across WonderSprout educators and fulfillment teams.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#EB1551] hover:bg-[#d01044] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Staff</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">{staff.length} Members</span>
          <span className="text-xs text-gray-400 mt-1 block">Full store access team</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Active Accounts</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {staff.filter((s) => s.status === 'Active').length}
          </span>
          <span className="text-xs text-emerald-600 mt-1 block">Currently logged in/active</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Managers</span>
          <span className="text-2xl font-black text-[#0A6375] mt-1 block">
            {staff.filter((s) => s.role.includes('Manager')).length}
          </span>
          <span className="text-xs text-gray-400 mt-1 block">Orders & Inventory</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Store Owners</span>
          <span className="text-2xl font-black text-[#EB1551] mt-1 block">
            {staff.filter((s) => s.role === 'Owner').length}
          </span>
          <span className="text-xs text-[#EB1551] mt-1 block">Super-administrator</span>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <svg className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by staff name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#EB1551]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-white"
        >
          <option value="all">All Roles</option>
          <option value="Owner">Owner</option>
          <option value="Order Manager">Order Manager</option>
          <option value="Inventory Manager">Inventory Manager</option>
          <option value="Marketing Manager">Marketing Manager</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Active' | 'Inactive')}
          className="w-full sm:w-auto px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Member</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Name & Avatar */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-[#FFEFE4] text-lg flex items-center justify-center shadow-inner">
                        {member.avatar}
                      </div>
                      <div className="font-bold text-gray-900">{member.name}</div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 font-mono text-gray-600 whitespace-nowrap">
                    {member.email}
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        member.role === 'Owner'
                          ? 'bg-rose-50 text-[#EB1551]'
                          : member.role === 'Order Manager'
                          ? 'bg-teal-50 text-[#0A6375]'
                          : member.role === 'Inventory Manager'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        toggleStaffStatus(member.id);
                        addToast('info', `${member.name} status changed`);
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                        member.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      <span>{member.status}</span>
                    </button>
                  </td>

                  {/* Last Login */}
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                    {member.lastLogin}
                  </td>

                  {/* Created */}
                  <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                    {member.createdAt}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 whitespace-nowrap text-right space-x-2">
                    <button
                      onClick={() => handleResetAccess(member)}
                      className="text-gray-400 hover:text-gray-700 font-semibold p-1"
                      title="Send Password Reset"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="text-[#0A6375] hover:text-[#084f5e] font-bold p-1"
                      title="Edit Member"
                    >
                      Edit
                    </button>
                    {member.role !== 'Owner' && (
                      <button
                        onClick={() => setDeleteConfirmId(member.id)}
                        className="text-red-400 hover:text-red-600 font-semibold p-1"
                        title="Remove Access"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bubblegum text-xl font-bold text-gray-900">
                {editingStaff ? 'Edit Staff Member' : 'Invite New Team Member'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Jessica Taylor"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#EB1551]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. jessica@wondersprout.store"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#EB1551]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Role Assignment
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as StaffMember['role'] })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Order Manager">Order Manager</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Avatar Emoji
                  </label>
                  <select
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="👩‍🏫">👩‍🏫 Teacher</option>
                    <option value="👨‍🏫">👨‍🏫 Educator</option>
                    <option value="👩‍💻">👩‍💻 Technologist</option>
                    <option value="👨‍💼">👨‍💼 Manager</option>
                    <option value="🎨">🎨 Designer</option>
                    <option value="📦">📦 Logistics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Account Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as StaffMember['status'] })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                >
                  <option value="Active">Active (Granted Access)</option>
                  <option value="Inactive">Inactive (Suspended)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#EB1551] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow"
                >
                  {editingStaff ? 'Save Changes' : 'Invite Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 mx-auto flex items-center justify-center text-xl">
              🗑️
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Remove Staff Access?</h4>
              <p className="text-xs text-gray-500 mt-1">
                This administrator will lose immediate access to the WonderSprout store dashboard.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
