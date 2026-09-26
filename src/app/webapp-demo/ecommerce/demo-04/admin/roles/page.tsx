'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { RolePermissions } from '../../_types';

export default function AdminRolesPage() {
  const { roles, updateRolePermissions, addToast } = useStore();

  const [selectedRoleName, setSelectedRoleName] = useState<string>('Order Manager');

  const selectedRole = roles.find((r) => r.role === selectedRoleName) || roles[0];

  // Local state for editing the active role's permissions
  const [localPermissions, setLocalPermissions] = useState<RolePermissions['permissions']>(() => ({
    ...(roles[0]?.permissions || {}),
  } as RolePermissions['permissions']));

  const handleSelectRole = (roleName: string) => {
    setSelectedRoleName(roleName);
    const target = roles.find((r) => r.role === roleName);
    if (target) {
      setLocalPermissions({ ...target.permissions });
    }
  };

  const handleTogglePermission = (key: keyof RolePermissions['permissions']) => {
    if (selectedRoleName === 'Owner') {
      addToast('warning', 'Owner role always maintains full unrestricted permissions');
      return;
    }
    setLocalPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    if (selectedRoleName === 'Owner') {
      addToast('info', 'Owner permissions are fixed to SuperAdmin');
      return;
    }
    updateRolePermissions(selectedRoleName, localPermissions);
    addToast('success', `${selectedRoleName} permissions updated`);
  };

  const permissionCategories: Array<{
    group: string;
    icon: string;
    keys: Array<{ key: keyof RolePermissions['permissions']; label: string; desc: string }>;
  }> = [
    {
      group: 'Product Catalogue',
      icon: '🧸',
      keys: [
        { key: 'PRODUCTS_VIEW', label: 'View Products', desc: 'Browse toy list and details' },
        { key: 'PRODUCTS_CREATE', label: 'Create Products', desc: 'Add new toys to catalogue' },
        { key: 'PRODUCTS_EDIT', label: 'Edit Products', desc: 'Modify prices, options, and descriptions' },
        { key: 'PRODUCTS_ARCHIVE', label: 'Delete & Archive', desc: 'Remove toys from live store' },
      ],
    },
    {
      group: 'Orders & Fulfillment',
      icon: '📦',
      keys: [
        { key: 'ORDERS_VIEW', label: 'View Orders', desc: 'Inspect customer checkout orders' },
        { key: 'ORDERS_EDIT', label: 'Edit Order Info', desc: 'Modify delivery notes and addresses' },
        { key: 'ORDERS_STATUS_CHANGE', label: 'Update Status', desc: 'Progress orders to Packed, Shipped, Delivered' },
        { key: 'ORDERS_CANCEL', label: 'Cancel & Refund', desc: 'Revoke and cancel placed orders' },
      ],
    },
    {
      group: 'Inventory & Stock Control',
      icon: '📊',
      keys: [
        { key: 'INVENTORY_VIEW', label: 'View Stock', desc: 'View units on hand and reserved stock' },
        { key: 'INVENTORY_ADJUST', label: 'Adjust Stock', desc: 'Perform manual stock adjustments' },
      ],
    },
    {
      group: 'Categories & Taxonomy',
      icon: '🗂️',
      keys: [
        { key: 'CATEGORIES_VIEW', label: 'View Categories', desc: 'Browse category collections' },
        { key: 'CATEGORIES_MANAGE', label: 'Manage Categories', desc: 'Create, reorder, and toggle visibility' },
      ],
    },
    {
      group: 'Marketing & Homepage Banners',
      icon: '🎨',
      keys: [
        { key: 'BANNER_VIEW', label: 'View Banners', desc: 'Inspect homepage slider slides' },
        { key: 'BANNER_MANAGE', label: 'Manage Banners', desc: 'Add and reorder promotional slides' },
        { key: 'REVIEWS_VIEW', label: 'View Reviews', desc: 'Read customer feedback' },
        { key: 'REVIEWS_MANAGE', label: 'Moderate Reviews', desc: 'Publish, hide, or delete reviews' },
      ],
    },
    {
      group: 'Store Administration',
      icon: '⚙️',
      keys: [
        { key: 'STAFF_VIEW', label: 'View Staff', desc: 'See team members and audit activity' },
        { key: 'STAFF_MANAGE', label: 'Manage Staff', desc: 'Invite and deactivate team accounts' },
        { key: 'SETTINGS_VIEW', label: 'View Settings', desc: 'Inspect store configurations' },
        { key: 'SETTINGS_MANAGE', label: 'Modify Settings', desc: 'Change store brand parameters and reset' },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0A6375] uppercase tracking-wider mb-1">
            <Link href="/webapp-demo/ecommerce/demo-04/admin" className="hover:underline">Admin</Link>
            <span>/</span>
            <span>Security & Access Control</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-bubblegum">
            Roles & Granular Permissions 🔐
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Define capability boundaries across staff roles to secure customer records, order operations, and financial metrics.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={selectedRoleName === 'Owner'}
          className="px-6 py-2.5 bg-[#EB1551] hover:bg-[#d01044] disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow transition-all"
        >
          Save Role Permissions
        </button>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {roles.map((r) => {
          const isSelected = r.role === selectedRoleName;
          const grantedCount = Object.values(r.permissions).filter(Boolean).length;
          const totalCount = Object.values(r.permissions).length;

          return (
            <button
              key={r.role}
              onClick={() => handleSelectRole(r.role)}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-[#0A6375] shadow-md ring-2 ring-[#0A6375]/20'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bubblegum text-lg font-bold text-gray-900">{r.role}</span>
                {r.role === 'Owner' && (
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-black">
                    SuperAdmin
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1CBBB4] rounded-full"
                    style={{ width: `${(grantedCount / totalCount) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {grantedCount}/{totalCount}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Role Matrix */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="font-bubblegum text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>Configuring:</span>
              <span className="text-[#0A6375]">{selectedRole?.role}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{selectedRole?.description}</p>
          </div>

          {selectedRoleName === 'Owner' && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold">
              🔒 Locked (All privileges required for Root Administrator)
            </span>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {permissionCategories.map((cat) => (
            <div key={cat.group} className="bg-gray-50/75 rounded-2xl p-5 border border-gray-100 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-200/60 pb-2">
                <span>{cat.icon}</span>
                <span>{cat.group}</span>
              </h3>

              <div className="space-y-2.5">
                {cat.keys.map((perm) => {
                  const isChecked = selectedRoleName === 'Owner' ? true : !!localPermissions[perm.key];

                  return (
                    <label
                      key={perm.key}
                      className={`flex items-start gap-3 p-2 rounded-xl transition-colors cursor-pointer select-none ${
                        isChecked ? 'bg-white shadow-xs' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={selectedRoleName === 'Owner'}
                        checked={isChecked}
                        onChange={() => handleTogglePermission(perm.key)}
                        className="mt-0.5 rounded text-[#0A6375] focus:ring-0"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-gray-800 block leading-tight">{perm.label}</span>
                        <span className="text-[11px] text-gray-400 leading-normal">{perm.desc}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Staff members assigned to &quot;{selectedRole?.role}&quot; will receive these authorization grants immediately.
          </span>
          <button
            onClick={handleSave}
            disabled={selectedRoleName === 'Owner'}
            className="px-6 py-2.5 bg-[#EB1551] hover:bg-[#d01044] disabled:opacity-40 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow transition-all"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
