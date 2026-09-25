'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, notFound } from 'next/navigation';
import { ArrowLeft, Save, Trash2, ExternalLink } from 'lucide-react';
import { useStore } from '../../../_context/StoreContext';
import { ProductStatus } from '../../../_types';

const baseHref = '/webapp-demo/ecommerce/demo-01';
const adminBase = `${baseHref}/admin`;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { products, categories, updateProduct, deleteProduct, mediaAssets } = useStore();

  const product = products.find((p) => p.id === id);

  const [name, setName] = useState('');
  const [bengaliName, setBengaliName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState(0);
  const [status, setStatus] = useState<ProductStatus>('active');
  const [badge, setBadge] = useState('');
  const [brand, setBrand] = useState('');
  const [weight, setWeight] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setBengaliName(product.bengaliName || '');
      setSlug(product.slug);
      setSku(product.sku);
      setCategory(product.category);
      setPrice(product.price);
      setCompareAtPrice(product.compareAtPrice);
      setStock(product.stock);
      setStatus(product.status);
      setBadge(product.badge || '');
      setBrand(product.brand);
      setWeight(product.weight || '');
      setShortDescription(product.shortDescription);
      setDescription(product.description);
      setSelectedImage(product.images[0] || '/demo-assets/ecommerce/gawa-ghee.jpg');
      setSpecifications(product.specifications || []);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="p-8 text-center text-xs space-y-3">
        <p className="font-bold text-zinc-800">Product not found.</p>
        <Link href={`${adminBase}/products`} className="text-blue-600 underline">
          Return to product list
        </Link>
      </div>
    );
  }

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
    const matchedCategory = categories.find((c) => c.slug === category);

    updateProduct(product.id, {
      name,
      bengaliName: bengaliName || undefined,
      slug,
      sku,
      category,
      categoryName: matchedCategory?.name || product.categoryName,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      status,
      badge: badge || undefined,
      brand,
      weight,
      shortDescription,
      description,
      images: [selectedImage, ...product.images.slice(1)],
      specifications: specifications.filter((s) => s.label && s.value),
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

        <div className="flex items-center gap-3">
          <Link
            href={`${baseHref}/products/${product.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-bold text-[#E87121] hover:underline"
          >
            <span>View on Storefront</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete "${product.name}"?`)) {
                deleteProduct(product.id);
                router.push(`${adminBase}/products`);
              }
            }}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Basic Information */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2923] border-b border-[#F0ECE4] pb-2.5">
            Product Attributes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Product Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Bengali Title</label>
              <input
                type="text"
                value={bengaliName}
                onChange={(e) => setBengaliName(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">SKU</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-white p-2.5 text-xs text-zinc-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2923] border-b border-[#F0ECE4] pb-2.5">
            Pricing, Stock & Publication
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Price (৳)</label>
              <input
                type="number"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs font-bold text-[#E87121]"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Compare-At Price (৳)</label>
              <input
                type="number"
                value={compareAtPrice || ''}
                onChange={(e) =>
                  setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Current Stock (Units)</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs font-bold text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-white p-2.5 text-xs text-zinc-900"
              >
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Badge</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Weight / Volume</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2923] border-b border-[#F0ECE4] pb-2.5">
            Product Photos
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

        {/* Description & Specs */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2923] border-b border-[#F0ECE4] pb-2.5">
            Descriptions & Specifications
          </h2>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">Short Description</label>
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
                  placeholder="Label"
                  value={spec.label}
                  onChange={(e) => handleSpecChange(i, 'label', e.target.value)}
                  className="flex-1 rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Value"
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
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
