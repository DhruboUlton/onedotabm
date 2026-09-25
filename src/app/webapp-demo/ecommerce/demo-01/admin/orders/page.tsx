import React from 'react';
import type { Metadata } from 'next';
import { orders, formatPrice } from '../../_data/catalog';

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Order management interface in the Kaya Supply admin demo.',
};

const statusStyles: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  processing: 'bg-amber-50 text-amber-700 border-amber-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  refunded: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminOrdersPage() {
  const revenue = orders
    .filter((order) => order.status !== 'refunded')
    .reduce((total, order) => total + order.total, 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Orders</h1>
        <p className="mt-1 text-sm text-[#5A5F6B]">
          {orders.length} orders · {formatPrice(revenue)} net of refunds
        </p>
      </header>

      <div className="rounded-xl border border-[#E3E5EB] bg-white">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E3E5EB] text-left text-xs uppercase tracking-wider text-[#8A90A0]">
                <th scope="col" className="px-5 py-3 font-medium">Order</th>
                <th scope="col" className="px-5 py-3 font-medium">Customer</th>
                <th scope="col" className="px-5 py-3 font-medium">Date</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Items</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5EB]">
              {orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[#F7F8FA]">
                  <td className="px-5 py-3.5 font-medium">{order.id}</td>
                  <td className="px-5 py-3.5">
                    <span className="block text-[#1B1F27]">{order.customer}</span>
                    <span className="block text-xs text-[#8A90A0]">{order.email}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[#5A5F6B]">{order.placedAt}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">{order.items}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="divide-y divide-[#E3E5EB] md:hidden">
          {orders.map((order) => (
            <li key={order.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{order.id}</p>
                  <p className="truncate text-xs text-[#5A5F6B]">{order.customer}</p>
                  <p className="mt-0.5 text-[11px] text-[#8A90A0]">{order.placedAt}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm tabular-nums">{formatPrice(order.total)}</p>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
