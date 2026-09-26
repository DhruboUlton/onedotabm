'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Product } from '../../_types';

export default function AdminProductsPage() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    adjustStock,
  } = useStore();
  const base = '/webapp-demo/ecommerce/demo-04';

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal / Drawer State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Montessori & Early Learning');
  const [ageRange, setAgeRange] = useState('2-4 Years');
  const [material, setMaterial] = useState('Natural Beechwood');
  const [type, setType] = useState('Educational Toy');
  const [basePrice, setBasePrice] = useState(39.0);
  const [compareAtPrice, setCompareAtPrice] = useState(49.0);
  const [stock, setStock] = useState(25);
  const [badge, setBadge] = useState<Product['badge']>('New');
  const [status, setStatus] = useState<'Active' | 'Draft' | 'Archived'>('Active');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [primaryImage, setPrimaryImage] = useState('/demo-assets/ecommerce/demo-04/abacus-board.jpg');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.variants.some((v) => v.sku.toLowerCase().includes(search.toLowerCase()));
      const matchesCat = selectedCat === 'All' || p.category === selectedCat;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, search, selectedCat, selectedStatus]);

  const openEditor = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreating(false);
    setTitle(prod.title);
    setSlug(prod.slug);
    setCategory(prod.category);
    setAgeRange(prod.ageRange);
    setMaterial(prod.material);
    setType(prod.type);
    setBasePrice(prod.basePrice);
    setCompareAtPrice(prod.compareAtPrice || 0);
    setStock(prod.stock);
    setBadge(prod.badge);
    setStatus(prod.status);
    setShortDescription(prod.shortDescription);
    setDescription(prod.description);
    setPrimaryImage(prod.primaryImage);
  };

  const openCreator = () => {
    setEditingProduct(null);
    setIsCreating(true);
    setTitle('');
    setSlug('');
    setCategory('Montessori & Early Learning');
    setAgeRange('2-4 Years');
    setMaterial('Natural Beechwood');
    setType('Educational Toy');
    setBasePrice(35.0);
    setCompareAtPrice(45.0);
    setStock(20);
    setBadge('New');
    setStatus('Active');
    setShortDescription('Handcrafted educational toy designed for fine-motor discovery.');
    setDescription('Carefully sanded beechwood toy with non-toxic food-grade dyes.');
    setPrimaryImage('/demo-assets/ecommerce/demo-04/abacus-board.jpg');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (isCreating) {
      addProduct({
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        ageRange,
        material,
        type,
        basePrice,
        compareAtPrice: compareAtPrice > basePrice ? compareAtPrice : undefined,
        stock,
        badge,
        status,
        shortDescription,
        description,
        rating: 5.0,
        reviewCount: 0,
        primaryImage,
        galleryImages: [primaryImage],
        educationalBenefits: ['Fine motor dexterity', 'Problem solving intuition'],
        specs: { Material: material, RecommendedAge: ageRange },
        variants: [
          {
            id: 'var_' + Date.now(),
            name: 'Standard Edition',
            sku: 'WS-' + Math.floor(1000 + Math.random() * 9000),
            price: basePrice,
            compareAtPrice,
            inventory: stock,
          },
        ],
      });
    } else if (editingProduct) {
      updateProduct(editingProduct.id, {
        title,
        slug: slug || editingProduct.slug,
        category,
        ageRange,
        material,
        type,
        basePrice,
        compareAtPrice: compareAtPrice > 0 ? compareAtPrice : undefined,
        stock,
        badge,
        status,
        shortDescription,
        description,
        primaryImage,
        variants: editingProduct.variants.map((v) => ({
          ...v,
          price: basePrice,
          inventory: stock,
        })),
      });
    }

    setEditingProduct(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">
            Product Management
          </h1>
          <p className="text-xs text-[#6B6B84] font-nunito">
            {products.length} Montessori toys and learning kits configured in store catalogue.
          </p>
        </div>

        <button
          onClick={openCreator}
          className="ws-btn-primary px-5 py-2.5 text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-nunito font-bold text-[#0F172A] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold font-nunito">
          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[#0F172A] focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[#0F172A] focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-nunito">
            <thead>
              <tr className="border-b border-slate-100 bg-[#FFEFE4]/40 text-[#0A6375] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Toy Image & Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Inventory</th>
                <th className="py-3.5 px-4">Badge / Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Title & Image */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-[#FFEFE4] overflow-hidden shrink-0 border border-slate-200">
                        <Image src={prod.primaryImage} alt={prod.title} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0F172A] line-clamp-1">{prod.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          SKU: {prod.variants[0]?.sku || 'N/A'} • {prod.ageRange}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 font-bold text-[#0A6375]">{prod.category}</td>

                  {/* Price */}
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-sm text-[#0F172A]">
                      ${prod.basePrice.toFixed(2)}
                    </span>
                    {prod.compareAtPrice && (
                      <span className="text-[10px] text-[#F7941E] line-through block">
                        ${prod.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={prod.stock}
                        onChange={(e) => adjustStock(prod.id, Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-center"
                      />
                      <span className="text-[11px] text-slate-400">units</span>
                    </div>
                  </td>

                  {/* Status & Badges */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          prod.status === 'Active'
                            ? 'bg-[#008000]/10 text-[#008000]'
                            : prod.status === 'Draft'
                            ? 'bg-[#F7941E]/10 text-[#F7941E]'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {prod.status}
                      </span>
                      {prod.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFEFE4] text-[#EB1551] text-[10px] font-bold">
                          {prod.badge}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`${base}/products/${prod.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0A6375] hover:bg-slate-100"
                        title="View on Storefront"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => openEditor(prod)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#1CBBB4] hover:bg-slate-100"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => duplicateProduct(prod.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#F7941E] hover:bg-slate-100"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${prod.title}"?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#EB1551] hover:bg-slate-100"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PRODUCT EDITOR / CREATOR MODAL                                 */}
      {/* ============================================================== */}
      {(editingProduct || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setEditingProduct(null);
              setIsCreating(false);
            }}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bubblegum text-2xl sm:text-3xl text-[#0A6375]">
                {isCreating ? 'Create New Toy' : `Edit: ${editingProduct?.title}`}
              </h3>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreating(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-nunito text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    placeholder="e.g. wooden-abacus-board"
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Compare-At Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Age Range</label>
                  <input
                    type="text"
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Badge</label>
                  <select
                    value={badge || ''}
                    onChange={(e) => setBadge((e.target.value as Product['badge']) || undefined)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4] bg-white"
                  >
                    <option value="">No Badge</option>
                    <option value="New">New</option>
                    <option value="Hot">Hot</option>
                    <option value="Popular">Popular</option>
                    <option value="OFF 15%">OFF 15%</option>
                    <option value="OFF 20%">OFF 20%</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Storefront Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as typeof status)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4] bg-white"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Archived">Archived (Hidden)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1">Short Description</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1">Full Pedagogic Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ws-btn-primary px-6 py-2.5 text-xs uppercase tracking-wider font-extrabold shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
