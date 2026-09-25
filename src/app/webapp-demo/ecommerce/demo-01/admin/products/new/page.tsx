'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../../_context/StoreContext';
import { ProductStatus } from '../../../_types';

const baseHref = '/webapp-demo/ecommerce/demo-01';
const adminBase = `${baseHref}/admin`;

export default function CreateProductPage() {
  const router = useRouter();
  const { categories, addProduct, mediaAssets } = useStore();

  const [name, setName] = useState('');
  const [bengaliName, setBengaliName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('SH-PR-' + Math.floor(100 + Math.random() * 900));
  const [category, setCategory] = useState(categories[0]?.slug || 'oil-and-ghee');
  const [price, setPrice] = useState(1200);
  const [compareAtPrice, setCompareAtPrice] = useState(1400);
  const [stock, setStock] = useState(25);
  const [status, setStatus] = useState<ProductStatus>('active');
  const [badge, setBadge] = useState('New Arrival');
  const [brand, setBrand] = useState('Shuddha Harvest');
  const [weight, setWeight] = useState('1 kg');
  const [shortDescription, setShortDescription] = useState('১০০% খাঁটি ও প্রাকৃতিক খামার থেকে সংগৃহীত পুষ্টিকর পণ্য।');
  const [description, setDescription] = useState(
    'শুদ্ধ হারভেস্টের এই পণ্যটি অত্যন্ত যত্নের সাথে সংগ্রহ ও স্বাস্থ্যসম্মতভাবে প্যাকেজিং করা হয়েছে। কোনো প্রকার কৃত্রিম ফ্লেভার বা ক্ষতিকারক প্রিজারভেটিভ নেই।'
  );
  const [selectedImage, setSelectedImage] = useState('/demo-assets/ecommerce/gawa-ghee.jpg');
  const [specifications, setSpecifications] = useState([
    { label: 'Brand', value: 'Shuddha Harvest' },
    { label: 'Net Weight', value: '1000g' },
    { label: 'Quality', value: '100% Organic' },
  ]);

  // Handle name change and auto-slug
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleAddSpec = () => {
    setSpecifications((prev) => [...prev, { label: '', value: '' }]);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: 'label' | 'value', val: string) => {
    setSpecifications((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    const matchedCategory = categories.find((c) => c.slug === category);

    const newProduct = addProduct({
      slug,
      name,
      bengaliName,
      sku,
      category,
      categoryName: matchedCategory?.name || 'Pantry',
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      status,
      badge: badge || undefined,
      rating: 5.0,
      reviewCount: 1,
      shortDescription,
      description,
      specifications: specifications.filter((s) => s.label && s.value),
      images: [selectedImage, '/demo-assets/ecommerce/mid-banner.jpg'],
      brand,
      weight,
      isFeatured: true,
    });

    router.push(`${adminBase}/products`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <Link
          href={`${adminBase}/products`}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>

        <h1 className="text-xl font-black text-[#1F2923]">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Basic Information */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2923] border-b border-[#F0ECE4] pb-2.5">
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Product Title (English) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sundarban Raw Honey 500g"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Bengali Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. সুন্দরবনের প্রাকৃতিক খলিশা মধু ৫০০ গ্রাম"
                value={bengaliName}
                onChange={(e) => setBengaliName(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-[#E87121] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-[#E87121] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-white p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} ({c.bengaliName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121]"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2923] border-b border-[#F0ECE4] pb-2.5">
            Pricing, Stock & Promotional Badges
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Selling Price (৳)</label>
              <input
                type="number"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs font-bold text-[#E87121] focus:outline-none focus:border-[#E87121] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Compare-At Price (৳ Struck-through)
              </label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-500 focus:outline-none focus:border-[#E87121] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Initial Inventory Stock
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-white p-2.5 text-xs text-zinc-900"
              >
                <option value="active">Active (Visible on Storefront)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Promotional Badge Label
              </label>
              <input
                type="text"
                placeholder="e.g. Best Seller / 15% OFF"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Package Weight / Vol</label>
              <input
                type="text"
                placeholder="e.g. 1 kg / 500 ml"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* Media / Image Selection */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2923] border-b border-[#F0ECE4] pb-2.5">
            Select Product Primary Photo
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mediaAssets.slice(0, 8).map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => setSelectedImage(asset.url)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-1 bg-[#FAF8F5] ${
                  selectedImage === asset.url
                    ? 'border-[#E87121] ring-2 ring-orange-500/20'
                    : 'border-[#ECE6DC] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={asset.url} alt={asset.altText} className="h-full w-full object-cover rounded-xl" />
              </button>
            ))}
          </div>
        </div>

        {/* Descriptions & Specs */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2923] border-b border-[#F0ECE4] pb-2.5">
            Descriptions & Specifications
          </h2>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Short Description (Highlighted on product card)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">Detailed Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 leading-relaxed"
            />
          </div>

          {/* Specifications */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-700">Specifications Table</span>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs font-bold text-[#E87121] hover:underline"
              >
                + Add Spec
              </button>
            </div>

            {specifications.map((spec, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Label (e.g. Origin)"
                  value={spec.label}
                  onChange={(e) => handleSpecChange(i, 'label', e.target.value)}
                  className="flex-1 rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Sundarbans)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                  className="flex-1 rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(i)}
                  className="text-zinc-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href={`${adminBase}/products`}
            className="rounded-xl px-5 py-2.5 font-bold text-zinc-600 hover:bg-zinc-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#072D24] px-7 py-3 font-bold text-white shadow-md hover:bg-[#0c4437] transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Publish Product</span>
          </button>
        </div>
      </form>
    </div>
  );
}
