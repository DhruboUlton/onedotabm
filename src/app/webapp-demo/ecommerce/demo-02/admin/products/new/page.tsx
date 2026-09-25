'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../_context/StoreContext';
import { ChevronLeft, Plus, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const adminBase = '/webapp-demo/ecommerce/demo-02/admin';

export default function NewProductPage() {
  const router = useRouter();
  const { categories, addProduct } = useStore();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(categories[0]?.slug || 'car-glass-poster');
  const [shortBlurb, setShortBlurb] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1550);
  const [compareAtPrice, setCompareAtPrice] = useState(1780);
  const [sku, setSku] = useState('AG-GLASS-01');
  const [stock, setStock] = useState(25);
  const [badge, setBadge] = useState<'Best Seller' | 'Trending' | 'New Arrival' | 'Limited Edition' | 'Save ৳230'>('New Arrival');
  const [image1, setImage1] = useState('/demo-assets/ecommerce/demo-02/poster-porsche-gt3.jpg');
  const [image2, setImage2] = useState('/demo-assets/ecommerce/demo-02/size-guide-chart.jpg');
  const [finish, setFinish] = useState('Ultra-Gloss 4mm Toughened Glass with Beveled Edges');
  const [mounting, setMounting] = useState('Includes 3M Heavy-Duty No-Nail Adhesive Hanging Strips');

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const catObj = categories.find((c) => c.slug === category);

    addProduct({
      name: name.trim(),
      slug: slug.trim() || 'new-glass-poster-' + Date.now(),
      category,
      categoryName: catObj?.name || 'Glass Poster',
      shortBlurb: shortBlurb.trim() || 'Premium reflective glass wall art.',
      description: description.trim() || '4mm diamond-cut safety float glass poster.',
      price,
      compareAtPrice,
      sku: sku.trim() || 'AG-01',
      stock,
      status: 'active',
      isFeatured: true,
      badge,
      images: [image1, image2].filter(Boolean),
      sizeOptions: [
        { id: 'sz-sm', label: 'Small (8" x 12")', dimensions: '8" x 12"', price: 550, compareAtPrice: 700 },
        { id: 'sz-md', label: 'Medium (12" x 18")', dimensions: '12" x 18"', price: 850, compareAtPrice: 1050 },
        { id: 'sz-lg', label: 'Large (18" x 24")', dimensions: '18" x 24"', price, compareAtPrice },
      ],
      designOptions: [
        { id: 'd1', label: 'Design 1', image: image1 },
      ],
      finish,
      mounting,
    });

    router.push(`${adminBase}/products`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
        <Link href={`${adminBase}/products`} className="hover:text-black flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">New Product</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Add New Tempered Glass Poster
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Fill in the details to publish a new glass poster across the customer storefront catalogue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-zinc-900 pb-2 border-b border-zinc-100">
              1. Title & Classification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lamborghini Revuelto Neon Gold Glass Art"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-medium text-xs text-zinc-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-hidden focus:border-black"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Merchandising Badge</label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-hidden focus:border-black"
                >
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
                placeholder="e.g. V12 hybrid supercar captured in radiant metallic reflection on 4mm glass."
                value={shortBlurb}
                onChange={(e) => setShortBlurb(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Long Description</label>
              <textarea
                rows={3}
                placeholder="Describe optical depth, glass thickness, UV sublimation details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Stock */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h4 className="font-extrabold text-sm text-zinc-900 pb-2 border-b border-zinc-100">
              2. Pricing & Inventory
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
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-sm text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Compare-At Price (৳)</label>
                <input
                  type="number"
                  min={0}
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-sm text-zinc-500 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">SKU Code</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Initial Stock (Units)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-sm text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Images & Finish */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h4 className="font-extrabold text-sm text-zinc-900 pb-2 border-b border-zinc-100">
              3. Glass Imagery & Wall Mounting
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Primary Poster Image URL</label>
                <input
                  type="text"
                  required
                  value={image1}
                  onChange={(e) => setImage1(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Secondary / Size Guide URL</label>
                <input
                  type="text"
                  value={image2}
                  onChange={(e) => setImage2(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>
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
                <label className="block font-bold text-zinc-700 mb-1">Wall Mounting Hardware</label>
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
              className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Publish to Storefront
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
