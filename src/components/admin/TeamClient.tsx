'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Users2,
  Plus,
  Shield,
  ShieldCheck,
  Mail,
  Phone,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { ProfileRecord, UserRole } from '@/types/database';
import {
  createTeamMemberAction,
  updateTeamMemberAction,
  deleteTeamMemberAction,
} from '@/lib/actions/adminActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface TeamClientProps {
  members: ProfileRecord[];
}

const ROLES_LIST: Array<{ role: UserRole; title: string; desc: string }> = [
  { role: 'owner', title: 'Owner', desc: 'Root executive permissions across all agency systems.' },
  { role: 'admin', title: 'Admin', desc: 'Full administration across operations, CMS & billing.' },
  { role: 'manager', title: 'Manager', desc: 'Client account management, deliverables & proposals.' },
  { role: 'developer', title: 'Developer', desc: 'Web development, server architecture & technical tasks.' },
  { role: 'marketing', title: 'Marketing', desc: 'Performance marketing, Meta ads telemetry & lead ops.' },
  { role: 'finance', title: 'Finance', desc: 'Invoices ledger, payment verification & quotations.' },
];

export function TeamClient({ members }: TeamClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showInviteModalDefault = searchParams.get('invite') === 'true';

  const [isInviteOpen, setIsInviteOpen] = useState(showInviteModalDefault);
  const [editingMember, setEditingMember] = useState<ProfileRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Invite Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('developer');
  const [tempPassword, setTempPassword] = useState('onedot2026!');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const res = await createTeamMemberAction({
      full_name: fullName,
      email,
      phone,
      role,
      password: tempPassword,
      active: true,
    });

    setSubmitting(false);

    if (res.success) {
      setIsInviteOpen(false);
      setFullName('');
      setEmail('');
      setPhone('');
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to create team member.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setSubmitting(true);
    setErrorMsg(null);

    const res = await updateTeamMemberAction(editingMember.id, {
      full_name: editingMember.full_name,
      email: editingMember.email,
      phone: editingMember.phone,
      role: editingMember.role,
      active: editingMember.active,
    });

    setSubmitting(false);

    if (res.success) {
      setEditingMember(null);
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to update member.');
    }
  };

  const handleDelete = async (member: ProfileRecord) => {
    if (member.role === 'owner') {
      alert('The primary owner of OneDot ABM cannot be deleted.');
      return;
    }
    if (confirm(`Are you sure you want to remove ${member.full_name} from the team?`)) {
      const res = await deleteTeamMemberAction(member.id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete member.');
      }
    }
  };

  const roleBadges: Record<UserRole, { bg: string; text: string; border: string }> = {
    owner: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    admin: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    manager: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    developer: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    marketing: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    finance: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    editor: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
              Team & Staff Management
            </h1>
            <Badge variant="accent" size="sm">
              {members.length} Active Staff
            </Badge>
          </div>
          <p className="text-xs text-[#555555]">
            Manage internal role permissions, account credentials, and team access.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1400FF] hover:bg-[#1000CC] text-white text-xs font-semibold shadow-[0_2px_12px_rgba(20,0,255,0.25)] transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Directory Table */}
      <Card className="bg-white border border-[#E5E5E2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#858585] font-mono uppercase tracking-wider border-b border-[#E5E5E2]">
              <tr>
                <th className="py-3.5 px-4">Member</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E2]">
              {members.map((member) => {
                const badge = roleBadges[member.role] || roleBadges.developer;
                return (
                  <tr key={member.id} className="hover:bg-[#F9F9F8] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          {member.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-[#111111] flex items-center gap-1.5">
                            <span>{member.full_name}</span>
                            {member.role === 'owner' && (
                              <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-1 rounded">
                                Founder
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#858585]">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#555555]">
                      <div>{member.phone || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                          member.active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.active ? 'bg-emerald-500' : 'bg-zinc-400'
                          }`}
                        />
                        <span>{member.active ? 'Active' : 'Disabled'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#858585]">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="p-1.5 rounded-lg text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED]"
                        title="Edit member"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {member.role !== 'owner' && (
                        <button
                          onClick={() => handleDelete(member)}
                          className="p-1.5 rounded-lg text-[#858585] hover:text-red-600 hover:bg-red-50"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Permission Guidance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {ROLES_LIST.map((r) => (
          <div
            key={r.role}
            className="p-4 rounded-xl bg-white border border-[#E5E5E2] space-y-1.5 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#111111]">{r.title}</span>
              <span className="font-mono text-[10px] uppercase text-[#858585]">{r.role}</span>
            </div>
            <p className="text-[#555555] leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* INVITE MEMBER MODAL */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
              <div>
                <h3 className="font-bold text-base text-[#111111]">Invite Team Member</h3>
                <p className="text-xs text-[#858585]">
                  Assign operational permissions and workspace access.
                </p>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="p-1.5 rounded-lg text-[#858585] hover:text-[#111111] hover:bg-[#F0F0ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111]">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Shakil Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111]">Email Address *</label>
                <input
                  type="email"
                  placeholder="shakil@onedotabm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+880 17..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white font-medium"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="developer">Developer</option>
                    <option value="marketing">Marketing</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111]">
                  Temporary Password
                </label>
                <input
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs font-mono bg-white"
                />
                <span className="text-[10px] text-[#858585] block">
                  The member can change this upon their initial sign-in.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E2]">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E2] text-xs font-medium text-[#555555]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1400FF] hover:bg-[#1000CC] text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Add Team Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
              <div>
                <h3 className="font-bold text-base text-[#111111]">Edit Team Member</h3>
                <p className="text-xs text-[#858585]">{editingMember.full_name}</p>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1.5 rounded-lg text-[#858585] hover:text-[#111111] hover:bg-[#F0F0ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111]">Full Name</label>
                <input
                  type="text"
                  value={editingMember.full_name}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, full_name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111]">Email</label>
                <input
                  type="email"
                  value={editingMember.email}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, email: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Phone</label>
                  <input
                    type="text"
                    value={editingMember.phone || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Role</label>
                  <select
                    value={editingMember.role}
                    disabled={editingMember.role === 'owner'}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        role: e.target.value as UserRole,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="developer">Developer</option>
                    <option value="marketing">Marketing</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editingMember.active}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, active: e.target.checked })
                  }
                  className="rounded border-[#E5E5E2] text-[#1400FF]"
                />
                <label htmlFor="activeCheck" className="text-xs font-medium text-[#111111]">
                  Account active and permitted to sign in
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E2]">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E2] text-xs font-medium text-[#555555]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1400FF] hover:bg-[#1000CC] text-white text-xs font-semibold shadow-xs"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
