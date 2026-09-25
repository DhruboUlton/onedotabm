'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../_context/StoreContext';
import { ArrowLeft, Save, Trash2, ExternalLink, Check, Eye } from 'lucide-react';

const adminBase = '/webapp-demo/ecommerce/demo-02/admin';
const baseHref = '/webapp-demo/ecommerce/demo-02';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { products, categories, updateProduct, deleteProduct, showToast } = useStore();

  const product = products.find((p) => p.id === id);

  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [category, setCategory] = useState(product?.category || 'car-glass-poster');
  const [shortBlurb, setShortBlurb] = useState(product?.shortBlurb || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || 1550);
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice || 1780);
  const [sku, setSku] = useState(product?.sku || '');
  const [stock, setStock] = useState(product?.stock || 0);
  const [status, setStatus] = useState<'active' | 'archived' | 'draft'>(product?.status || 'active');
  const [badge, setBadge] = useState<any>(product?.badge || 'Best Seller');
  const [image1, setImage1] = useState(product?.images[0] || '');
  const [finish, setFinish] = useState(product?.finish || 'Ultra-Gloss 4mm Toughened Glass');
  const [mounting, setMounting] = useState(product?.mounting || '3M Command™ No-Damage Adhesive Strips');

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Glass Poster Not Found</h2>
        <p className="text-xs text-zinc-500">The product you are trying to edit does not exist in the active catalogue.</p>
        <Link
          href={`${adminBase}/products`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = categories.find((c) => c.slug === category);

    updateProduct(product.id, {
      name: name.trim(),
      slug: slug.trim(),
      category,
      categoryName: catObj?.name || product.categoryName,
      shortBlurb: shortBlurb.trim(),
      description: description.trim(),
      price,
      compareAtPrice,
      sku: sku.trim(),
      stock,
      status,
      badge: badge === 'none' ? undefined : badge,
      finish,
      mounting,
      images: [image1, ...product.images.slice(1)].filter(Boolean),
    });

    showToast(`Updated "${name}". Storefront synced immediately.`, 'success');
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      deleteProduct(product.id);
      router.push(`${adminBase}/products`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={`${adminBase}/products`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`${baseHref}/products/${product.slug}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
          >
            <span>View on Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
              Product Editor
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
              Edit {product.name}
            </h1>
            <p className="text-xs text-zinc-500">
              Modifications immediately update the customer-facing storefront in real time.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image1 || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Section 1: Identification */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-zinc-900 pb-2 border-b border-zinc-100">
              1. Title & Classification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-medium text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Listing Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                >
                  <option value="active">Active (Visible on Storefront)</option>
                  <option value="archived">Archived (Hidden from Storefront)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Badge</label>
                <select
                  value={badge || 'none'}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-medium text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                >
                  <option value="none">No Badge</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Trending">Trending</option>
                  <option value="New Arrival">New Arrival</option>
                  <option value="Limited Edition">Limited Edition</option>
                  <option value="Save ৳230">Save ৳230</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Short Feature Blurb</label>
              <input
                type="text"
                value={shortBlurb}
                onChange={(e) => setShortBlurb(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Stock */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h4 className="font-extrabold text-sm text-zinc-900 pb-2 border-b border-zinc-100">
              2. Commercial Pricing & Stock
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Price (৳)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-black text-sm text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Compare Price (৳)</label>
                <input
                  type="number"
                  min={0}
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-sm text-zinc-500 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">SKU</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Available Stock (Units)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-black text-sm text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Imagery */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h4 className="font-extrabold text-sm text-zinc-900 pb-2 border-b border-zinc-100">
              3. Glass Imagery & Finish Details
            </h4>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Primary Image Asset URL</label>
              <input
                type="text"
                required
                value={image1}
                onChange={(e) => setImage1(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-zinc-900 focus:outline-hidden focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Glass Finish</label>
                <input
                  type="text"
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Mounting Hardware</label>
                <input
                  type="text"
                  value={mounting}
                  onChange={(e) => setMounting(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
            <Link
              href={`${adminBase}/products`}
              className="px-5 py-2.5 border border-zinc-300 text-zinc-700 font-bold rounded-xl hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save & Sync Storefront</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
