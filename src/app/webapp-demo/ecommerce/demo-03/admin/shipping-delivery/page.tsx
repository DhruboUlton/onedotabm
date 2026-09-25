'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  ExternalLink,
  RefreshCw,
  Navigation,
  Globe,
  Radio,
} from 'lucide-react';

interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  courier: 'FedEx Express' | 'DHL Global' | 'UPS CarbonNeutral' | 'Priority Freight';
  origin: string;
  destination: string;
  status: 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Customs Hold' | 'Exception';
  dispatchDate: string;
  estDelivery: string;
}

const initialShipments: Shipment[] = [
  {
    id: 'SHP-9901',
    orderId: 'KG-89021',
    trackingNumber: 'FX-889102934-US',
    courier: 'FedEx Express',
    origin: 'Austin Silicon Hub, TX',
    destination: 'San Francisco, CA',
    status: 'In Transit',
    dispatchDate: '2026-09-24',
    estDelivery: '2026-09-26',
  },
  {
    id: 'SHP-9902',
    orderId: 'KG-89022',
    trackingNumber: 'DHL-771920412-EXP',
    courier: 'DHL Global',
    origin: 'Shenzhen Tech Bay, CN',
    destination: 'New York, NY',
    status: 'Out for Delivery',
    dispatchDate: '2026-09-23',
    estDelivery: '2026-09-25',
  },
  {
    id: 'SHP-9903',
    orderId: 'KG-89023',
    trackingNumber: 'UPS-1Z999AA101239',
    courier: 'UPS CarbonNeutral',
    origin: 'Seattle Hardware Depot, WA',
    destination: 'Chicago, IL',
    status: 'Delivered',
    dispatchDate: '2026-09-22',
    estDelivery: '2026-09-24',
  },
  {
    id: 'SHP-9904',
    orderId: 'KG-89024',
    trackingNumber: 'PF-440219803-LTL',
    courier: 'Priority Freight',
    origin: 'Frankfurt Central, DE',
    destination: 'London, UK',
    status: 'Customs Hold',
    dispatchDate: '2026-09-21',
    estDelivery: '2026-09-27',
  },
];

export default function ShippingDeliveryPage() {
  const { showToast } = useStore();
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [searchTerm, setSearchTerm] = useState('');
  const [carrierFilter, setCarrierFilter] = useState('ALL');

  const filtered = shipments.filter((s) => {
    const matchSearch =
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.courier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCarrier = carrierFilter === 'ALL' || s.courier === carrierFilter;
    return matchSearch && matchCarrier;
  });

  const handleReSync = () => {
    showToast('Carrier APIs Synced', 'Refreshed webhook pings from FedEx, DHL, and UPS telemetry gateways', 'success');
  };

  const handleUpdateStatus = (id: string, newStatus: Shipment['status']) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    showToast('Tracking Updated', `Shipment ${id} marked as ${newStatus}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Shipping & Delivery
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Courier Hubs
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time multimodal logistics tracking, automated label generation, and carrier webhook status.
          </p>
        </div>

        <button
          onClick={handleReSync}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync Telemetry</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Shipments</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            {shipments.filter((s) => s.status !== 'Delivered').length} In Transit
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 4 carrier partners</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mean Transit Velocity</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            2.1 Days
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">98.4% on-schedule rate</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customs Clearance</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600 dark:text-amber-400">
            1 Clearance
          </div>
          <p className="text-[11px] text-slate-400 mt-1">EU to UK cross-border document check</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Carrier API Health</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            100% Online
          </div>
          <p className="text-[11px] text-slate-400 mt-1">FedEx, DHL, UPS API latency 42ms</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracking number, order ID, or destination city..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={carrierFilter}
          onChange={(e) => setCarrierFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Carriers</option>
          <option value="FedEx Express">FedEx Express</option>
          <option value="DHL Global">DHL Global</option>
          <option value="UPS CarbonNeutral">UPS CarbonNeutral</option>
          <option value="Priority Freight">Priority Freight</option>
        </select>
      </div>

      {/* Shipments Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Tracking / Order</th>
                <th className="py-3 px-4">Carrier</th>
                <th className="py-3 px-4">Origin Hub</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Est. Delivery</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{item.trackingNumber}</div>
                    <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{item.orderId}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {item.courier}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {item.origin}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {item.destination}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Delivered'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : item.status === 'Out for Delivery'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                          : item.status === 'In Transit'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {item.estDelivery}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status !== 'Delivered' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Delivered')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-sm"
                        >
                          Mark Delivered
                        </button>
                      )}
                      <Link
                        href={`/webapp-demo/ecommerce/demo-03/track-order?tracking=${item.trackingNumber}`}
                        target="_blank"
                        className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Open customer tracking page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
