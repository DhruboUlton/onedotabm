import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Package, Receipt, TrendingUp, Users } from 'lucide-react';
import {
  dashboardStats,
  formatPrice,
  orders,
  products,
  getStorefrontProducts,
} from '../_data/catalog';

const base = '/webapp-demo/ecommerce/demo-01';

const statusStyles: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  processing: 'bg-amber-50 text-amber-700 border-amber-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  refunded: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminDashboardPage() {
  const recentOrders = orders.slice(0, 5);
  const lowStock = getStorefrontProducts()
    .filter((product) => product.stock <= 8)
    .slice(0, 4);
  const peak = Math.max(...dashboardStats.weeklyRevenue);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Dashboard</h1>
          <p className="mt-1 text-sm text-[#5A5F6B]">Last 30 days. Mock data, no live orders.</p>
        </div>
        <Link
          href={`${base}/admin/orders`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3E5EB] bg-white px-3.5 py-2 text-xs font-medium transition-colors hover:bg-[#F1F2F6] active:scale-[0.97] active:duration-75"
        >
          All orders
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </header>

      {/* Stat cards */}
      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatPrice(dashboardStats.revenue)}
          hint="+12% vs last month"
          icon={<TrendingUp className="h-4 w-4" aria-hidden="true" />}
        />
        <StatCard
          label="Orders"
          value={String(dashboardStats.orders)}
          hint="2 awaiting dispatch"
          icon={<Receipt className="h-4 w-4" aria-hidden="true" />}
        />
        <StatCard
          label="Units sold"
          value={String(dashboardStats.unitsSold)}
          hint={`${products.length} products listed`}
          icon={<Package className="h-4 w-4" aria-hidden="true" />}
        />
        <StatCard
          label="Returning"
          value={`${dashboardStats.returningRate}%`}
          hint="of customers reorder"
          icon={<Users className="h-4 w-4" aria-hidden="true" />}
        />
      </dl>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue chart */}
        <section className="rounded-xl border border-[#E3E5EB] bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold">Weekly revenue</h2>
          <p className="mt-0.5 text-xs text-[#8A90A0]">Last 12 weeks</p>

          <div className="mt-5 flex h-36 items-end gap-1.5" role="img" aria-label="Bar chart of weekly revenue for the last twelve weeks, trending upward">
            {dashboardStats.weeklyRevenue.map((value, index) => (
              <div
                key={index}
                className="flex-1 rounded-t bg-[#4F46E5] transition-opacity hover:opacity-80"
                style={{ height: `${(value / peak) * 100}%` }}
              />
            ))}
          </div>
        </section>

        {/* Low stock */}
        <section className="rounded-xl border border-[#E3E5EB] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Low stock</h2>
            <Link
              href={`${base}/admin/products`}
              className="text-xs text-[#4F46E5] transition-opacity hover:opacity-70"
            >
              Manage
            </Link>
          </div>

          <ul className="mt-4 space-y-3">
            {lowStock.map((product) => (
              <li key={product.slug} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate">{product.name}</span>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                    product.stock === 0
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                  }`}
                >
                  {product.stock === 0 ? 'Sold out' : `${product.stock} left`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Recent orders */}
      <section className="rounded-xl border border-[#E3E5EB] bg-white">
        <div className="flex items-center justify-between border-b border-[#E3E5EB] px-5 py-4">
          <h2 className="text-sm font-semibold">Recent orders</h2>
          <Link
            href={`${base}/admin/orders`}
            className="text-xs text-[#4F46E5] transition-opacity hover:opacity-70"
          >
            View all
          </Link>
        </div>

        {/* Table on wide screens, cards on narrow — a squashed table helps nobody */}
        <div className="hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E3E5EB] text-left text-xs uppercase tracking-wider text-[#8A90A0]">
                <th scope="col" className="px-5 py-3 font-medium">Order</th>
                <th scope="col" className="px-5 py-3 font-medium">Customer</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5EB]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[#F7F8FA]">
                  <td className="px-5 py-3.5 font-medium">{order.id}</td>
                  <td className="px-5 py-3.5 text-[#5A5F6B]">{order.customer}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="divide-y divide-[#E3E5EB] sm:hidden">
          {recentOrders.map((order) => (
            <li key={order.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{order.id}</p>
                <p className="truncate text-xs text-[#5A5F6B]">{order.customer}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm tabular-nums">{formatPrice(order.total)}</p>
                <span
                  className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#E3E5EB] bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <dt className="text-xs uppercase tracking-wider text-[#8A90A0]">{label}</dt>
        <span className="text-[#4F46E5]">{icon}</span>
      </div>
      <dd className="mt-2 text-xl font-semibold tabular-nums sm:text-2xl">{value}</dd>
      <p className="mt-1 text-[11px] text-[#8A90A0]">{hint}</p>
    </div>
  );
}
