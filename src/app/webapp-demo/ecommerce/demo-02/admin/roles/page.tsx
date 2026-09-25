'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import {
  KeyRound,
  ShieldCheck,
  Check,
  Save,
  Lock,
  Users,
  Info,
} from 'lucide-react';

const PERMISSION_GROUPS = [
  {
    group: 'Products & Catalogue',
    items: [
      { key: 'PRODUCTS_VIEW', label: 'View Products & SKUs' },
      { key: 'PRODUCTS_CREATE', label: 'Create New Artworks' },
      { key: 'PRODUCTS_EDIT', label: 'Edit Pricing & Options' },
      { key: 'PRODUCTS_ARCHIVE', label: 'Archive / Delete Artworks' },
    ],
  },
  {
    group: 'Orders & Fulfillment',
    items: [
      { key: 'ORDERS_VIEW', label: 'View Orders & Invoices' },
      { key: 'ORDERS_EDIT', label: 'Edit Delivery Notes' },
      { key: 'ORDERS_STATUS_CHANGE', label: 'Advance Status (Packed/Shipped)' },
      { key: 'ORDERS_CANCEL', label: 'Cancel & Void Orders' },
    ],
  },
  {
    group: 'Inventory Management',
    items: [
      { key: 'INVENTORY_VIEW', label: 'Audit Stock Levels' },
      { key: 'INVENTORY_ADJUST', label: 'Adjust Warehouse Stock' },
    ],
  },
  {
    group: 'Categories & Merchandising',
    items: [
      { key: 'CATEGORIES_VIEW', label: 'View Collections' },
      { key: 'CATEGORIES_MANAGE', label: 'Add/Edit/Sort Categories' },
    ],
  },
  {
    group: 'Marketing & Promos',
    items: [
      { key: 'BANNER_VIEW', label: 'View Homepage Banners' },
      { key: 'BANNER_MANAGE', label: 'Manage Hero & Promo Popups' },
      { key: 'REVIEWS_VIEW', label: 'Read Customer Reviews' },
      { key: 'REVIEWS_MANAGE', label: 'Moderate & Toggle Reviews' },
    ],
  },
  {
    group: 'Administration & System',
    items: [
      { key: 'STAFF_VIEW', label: 'View Team Directory' },
      { key: 'STAFF_MANAGE', label: 'Invite & Manage Staff' },
      { key: 'SETTINGS_VIEW', label: 'View Store Configuration' },
      { key: 'SETTINGS_MANAGE', label: 'Modify Shipping & Core Settings' },
    ],
  },
];

export default function AdminRolesPage() {
  const { roles, updateRolePermissions, showToast } = useStore();

  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || 'role-owner');

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];
  const [currentPermissions, setCurrentPermissions] = useState<string[]>(
    selectedRole?.permissions || []
  );

  const handleSelectRole = (rId: string) => {
    setSelectedRoleId(rId);
    const r = roles.find((role) => role.id === rId);
    if (r) {
      setCurrentPermissions(r.permissions);
    }
  };

  const handleTogglePermission = (key: string) => {
    if (selectedRole.name === 'Owner') {
      showToast('Owner role retains full root permissions by default.', 'info');
      return;
    }

    if (currentPermissions.includes(key)) {
      setCurrentPermissions(currentPermissions.filter((p) => p !== key));
    } else {
      setCurrentPermissions([...currentPermissions, key]);
    }
  };

  const handleSavePermissions = () => {
    updateRolePermissions(selectedRoleId, currentPermissions);
    showToast(`Updated permissions for "${selectedRole.name}".`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Access Control (RBAC)
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Roles & Granular Permissions
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure authorization matrices for Owners, Order Managers, Inventory Officers, and Marketers.
          </p>
        </div>

        <button
          onClick={handleSavePermissions}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Role Matrix</span>
        </button>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Roles List Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 px-1">
              Select Role to Configure
            </h2>

            {roles.map((r) => {
              const isSelected = r.id === selectedRoleId;
              return (
                <button
                  key={r.id}
                  onClick={() => handleSelectRole(r.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                  }`}
                >
                  <div>
                    <strong className="text-xs font-bold block">{r.name}</strong>
                    <span
                      className={`text-[10px] block mt-0.5 line-clamp-1 ${
                        isSelected ? 'text-zinc-300' : 'text-zinc-500'
                      }`}
                    >
                      {r.description}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {r.permissions.length} perms
                  </span>
                </button>
              );
            })}
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 text-amber-700" />
              <span>Permission Enforcement</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Toggling permissions here immediately updates internal role definitions. In this demo, changes are stored in client state for realistic audit testing.
            </p>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-black" />
                <h3 className="text-sm font-extrabold text-zinc-900">
                  Permissions Matrix: {selectedRole.name}
                </h3>
              </div>
              <p className="text-xs text-zinc-500 mt-1">{selectedRole.description}</p>
            </div>

            {selectedRole.name === 'Owner' && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> Root Immutable
              </span>
            )}
          </div>

          <div className="space-y-6">
            {PERMISSION_GROUPS.map((grp) => (
              <div key={grp.group} className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {grp.group}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {grp.items.map((item) => {
                    const isGranted = currentPermissions.includes(item.key);
                    return (
                      <label
                        key={item.key}
                        onClick={() => handleTogglePermission(item.key)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isGranted
                            ? 'bg-zinc-50 border-zinc-300 text-zinc-900'
                            : 'bg-white border-zinc-200/80 text-zinc-400 hover:border-zinc-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isGranted}
                          readOnly
                          className="w-4 h-4 rounded text-black focus:ring-black mt-0.5 cursor-pointer"
                        />
                        <div>
                          <strong className="font-semibold block text-zinc-900">
                            {item.label}
                          </strong>
                          <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                            {item.key}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">
              {currentPermissions.length} total permissions enabled for this role
            </span>

            <button
              onClick={handleSavePermissions}
              className="px-5 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Apply to {selectedRole.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
