'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { RolePermission } from '../../_types';
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  Plus,
  Lock,
  Edit2,
  Users,
  Info,
  CheckSquare,
  Square,
  X,
  Layers
} from 'lucide-react';

const ALL_AVAILABLE_PERMISSIONS: { key: string; label: string; group: string }[] = [
  // Products
  { key: 'PRODUCTS_VIEW', label: 'View Products Catalogue', group: 'Products' },
  { key: 'PRODUCTS_CREATE', label: 'Create New Products', group: 'Products' },
  { key: 'PRODUCTS_EDIT', label: 'Edit Product Details & Pricing', group: 'Products' },
  { key: 'PRODUCTS_ARCHIVE', label: 'Archive / Delete Products', group: 'Products' },

  // Inventory
  { key: 'INVENTORY_VIEW', label: 'View Inventory & Stock Levels', group: 'Inventory' },
  { key: 'INVENTORY_ADJUST', label: 'Adjust Warehouse Stock Counts', group: 'Inventory' },

  // Orders
  { key: 'ORDERS_VIEW', label: 'View Customer Orders & History', group: 'Orders' },
  { key: 'ORDERS_EDIT', label: 'Edit Order Notes & Details', group: 'Orders' },
  { key: 'ORDERS_STATUS_CHANGE', label: 'Advance Order Fulfillment Status', group: 'Orders' },
  { key: 'ORDERS_CANCEL', label: 'Cancel & Void Orders', group: 'Orders' },

  // Categories
  { key: 'CATEGORIES_VIEW', label: 'View Category Taxonomies', group: 'Categories' },
  { key: 'CATEGORIES_MANAGE', label: 'Create & Modify Categories', group: 'Categories' },

  // Marketing
  { key: 'BANNER_VIEW', label: 'View Promotional Banners', group: 'Marketing' },
  { key: 'BANNER_MANAGE', label: 'Publish & Reorder Banners', group: 'Marketing' },
  { key: 'REVIEWS_VIEW', label: 'View Customer Reviews', group: 'Marketing' },
  { key: 'REVIEWS_MANAGE', label: 'Moderate & Hide Customer Reviews', group: 'Marketing' },

  // Staff & Settings
  { key: 'STAFF_VIEW', label: 'View Staff Directory', group: 'Administration' },
  { key: 'STAFF_MANAGE', label: 'Manage Staff Accounts & Security', group: 'Administration' },
  { key: 'SETTINGS_VIEW', label: 'View Store Settings', group: 'Administration' },
  { key: 'SETTINGS_MANAGE', label: 'Update Business & Shipping Settings', group: 'Administration' },
];

export default function RolesAndPermissionsPage() {
  const { roles, staff, updateRolePermissions } = useStore();

  const [selectedRole, setSelectedRole] = useState<RolePermission>(roles[0] || {
    id: 'r1',
    name: 'Owner',
    description: 'Full administrative access',
    permissions: ALL_AVAILABLE_PERMISSIONS.map(p => p.key)
  });

  const [editingPermissions, setEditingPermissions] = useState<string[]>(
    selectedRole ? [...selectedRole.permissions] : []
  );

  const [hasChanges, setHasChanges] = useState(false);

  const handleSelectRole = (role: RolePermission) => {
    setSelectedRole(role);
    setEditingPermissions([...role.permissions]);
    setHasChanges(false);
  };

  const handleTogglePermission = (permKey: string) => {
    if (selectedRole.name === 'Owner') {
      // Owner cannot be restricted
      return;
    }

    setEditingPermissions((prev) => {
      const exists = prev.includes(permKey);
      const next = exists ? prev.filter((p) => p !== permKey) : [...prev, permKey];
      setHasChanges(true);
      return next;
    });
  };

  const handleSelectAllGroup = (groupPermKeys: string[]) => {
    if (selectedRole.name === 'Owner') return;
    setEditingPermissions((prev) => {
      const allPresent = groupPermKeys.every((k) => prev.includes(k));
      let next: string[];
      if (allPresent) {
        next = prev.filter((k) => !groupPermKeys.includes(k));
      } else {
        next = Array.from(new Set([...prev, ...groupPermKeys]));
      }
      setHasChanges(true);
      return next;
    });
  };

  const handleSave = () => {
    updateRolePermissions(selectedRole.id, editingPermissions);
    setSelectedRole({ ...selectedRole, permissions: editingPermissions });
    setHasChanges(false);
  };

  // Group permissions
  const groups = Array.from(new Set(ALL_AVAILABLE_PERMISSIONS.map((p) => p.group)));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#0f4a38]" />
            Roles & Permissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure access-control policies across catalog management, order processing, and administrative controls.
          </p>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 animate-in fade-in">
            <button
              onClick={() => {
                setEditingPermissions([...selectedRole.permissions]);
                setHasChanges(false);
              }}
              className="px-3.5 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#0f4a38] hover:bg-[#0c382b] text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save Permissions
            </button>
          </div>
        )}
      </div>

      {/* Role Selection & Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Role Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            System Roles ({roles.length})
          </div>

          {roles.map((r) => {
            const isSelected = selectedRole.id === r.id;
            const staffCount = staff.filter((s) => s.role.toLowerCase() === r.name.toLowerCase()).length;

            return (
              <div
                key={r.id}
                onClick={() => handleSelectRole(r)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/60 border-[#0f4a38] shadow-xs ring-1 ring-[#0f4a38]'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-[#0f4a38] text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{r.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{r.description}</p>
                    </div>
                  </div>
                  {r.name === 'Owner' && (
                    <span className="p-1 text-slate-400" title="Protected System Role">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {staffCount} assigned {staffCount === 1 ? 'member' : 'members'}
                  </span>
                  <span className="font-semibold text-emerald-700">
                    {r.permissions.length} active permissions
                  </span>
                </div>
              </div>
            );
          })}

          <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200/60 text-xs text-amber-800">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              Role Enforcement Notice
            </div>
            Permissions determine UI component rendering and mutation authorization across all storefront catalog and admin panels.
          </div>
        </div>

        {/* Right Column: Permission Matrix for Selected Role */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800">{selectedRole.name} Permissions</h2>
                {selectedRole.name === 'Owner' && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-md">
                    Full System Root
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{selectedRole.description}</p>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <span className="font-bold text-[#0f4a38]">{editingPermissions.length}</span> of{' '}
              {ALL_AVAILABLE_PERMISSIONS.length} permissions granted
            </div>
          </div>

          {/* Groups list */}
          <div className="space-y-6">
            {groups.map((group) => {
              const groupPerms = ALL_AVAILABLE_PERMISSIONS.filter((p) => p.group === group);
              const allChecked = groupPerms.every((p) => editingPermissions.includes(p.key));
              const someChecked =
                groupPerms.some((p) => editingPermissions.includes(p.key)) && !allChecked;

              return (
                <div key={group} className="border border-slate-100 rounded-xl p-4 bg-slate-50/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#0f4a38]" />
                      {group} Module
                    </span>

                    {selectedRole.name !== 'Owner' && (
                      <button
                        onClick={() => handleSelectAllGroup(groupPerms.map((p) => p.key))}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                      >
                        {allChecked ? 'Deselect All' : 'Select All'}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {groupPerms.map((perm) => {
                      const isChecked = editingPermissions.includes(perm.key);
                      const isOwner = selectedRole.name === 'Owner';

                      return (
                        <div
                          key={perm.key}
                          onClick={() => !isOwner && handleTogglePermission(perm.key)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs transition-colors select-none ${
                            isChecked
                              ? 'bg-emerald-50/80 border-emerald-200 text-slate-800'
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                          } ${isOwner ? 'cursor-default opacity-85' : 'cursor-pointer'}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-xs border mt-0.5 flex items-center justify-center shrink-0 ${
                              isChecked
                                ? 'bg-[#0f4a38] border-[#0f4a38] text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>

                          <div className="flex-1">
                            <p className="font-semibold">{perm.label}</p>
                            <code className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                              {perm.key}
                            </code>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          {hasChanges && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-amber-600 font-medium">
                You have unsaved changes for this role.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingPermissions([...selectedRole.permissions]);
                    setHasChanges(false);
                  }}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-[#0f4a38] text-white text-xs font-semibold rounded-lg hover:bg-[#0c382b] cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
