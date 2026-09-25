'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { Product, ProductVariant } from '../../_types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle,
  XCircle,
  Filter,
  Sparkles,
  Award,
  Layers,
  SlidersHorizontal,
  X,
  Save,
} from 'lucide-react';

export default function AdminProductsPage() {
  const {
    products,
    categories,
    vendors,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    toggleFeatured,
    toggleSponsored,
    showToast,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    brand: '',
    vendorId: '',
    basePrice: 299,
    compareAtPrice: 349,
    stock: 25,
    rating: 4.8,
    reviewCount: 15,
    isFeatured: false,
    isSponsored: false,
    description: '',
    primaryImage: '/demo-assets/ecommerce/demo-03/prod-laptop.jpg',
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const firstSku = p.variants?.[0]?.sku || '';
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firstSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();

      let matchesStock = true;
      if (stockFilter === 'in_stock') matchesStock = p.stock > 15;
      else if (stockFilter === 'low_stock') matchesStock = p.stock > 0 && p.stock <= 15;
      else if (stockFilter === 'out_of_stock') matchesStock = p.stock === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, stockFilter]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      slug: '',
      category: categories[0]?.slug || 'laptops',
      brand: 'Kinetic Pro',
      vendorId: vendors[0]?.id || 'ven-aerotech',
      basePrice: 299,
      compareAtPrice: 349,
      stock: 25,
      rating: 4.8,
      reviewCount: 12,
      isFeatured: false,
      isSponsored: false,
      description: 'Engineered for high performance and daily reliability.',
      primaryImage: '/demo-assets/ecommerce/demo-03/prod-laptop.jpg',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      category: product.category,
      brand: product.brand,
      vendorId: product.vendorId,
      basePrice: product.basePrice,
      compareAtPrice: product.compareAtPrice || product.basePrice,
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      isFeatured: product.isFeatured || false,
      isSponsored: product.isSponsored || false,
      description: product.description,
      primaryImage: product.primaryImage,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Validation Error', 'Product title is required', 'error');
      return;
    }

    const genSlug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const selectedVendor = vendors.find((v) => v.id === formData.vendorId);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: formData.title,
        slug: genSlug,
        category: formData.category,
        brand: formData.brand,
        vendorId: formData.vendorId,
        vendorName: selectedVendor?.name || editingProduct.vendorName,
        basePrice: Number(formData.basePrice),
        compareAtPrice: Number(formData.compareAtPrice),
        stock: Number(formData.stock),
        rating: Number(formData.rating),
        reviewCount: Number(formData.reviewCount),
        isFeatured: formData.isFeatured,
        isSponsored: formData.isSponsored,
        description: formData.description,
        primaryImage: formData.primaryImage,
      });
      showToast('Product Updated', `Saved changes to "${formData.title}"`, 'success');
    } else {
      const newSku = `KNT-${Math.floor(1000 + Math.random() * 9000)}`;
      const defaultVariants: ProductVariant[] = [
        {
          id: `var-1-${Date.now()}`,
          name: 'Space Grey Finish',
          colorHex: '#4b5563',
          sku: `${newSku}-GRY`,
          price: Number(formData.basePrice),
          compareAtPrice: Number(formData.compareAtPrice),
          inventory: Number(formData.stock),
          image: formData.primaryImage,
        },
        {
          id: `var-2-${Date.now()}`,
          name: 'Silver Edition',
          colorHex: '#9ca3af',
          sku: `${newSku}-SLV`,
          price: Number(formData.basePrice) + 50,
          compareAtPrice: Number(formData.compareAtPrice) + 50,
          inventory: 10,
          image: formData.primaryImage,
        },
      ];

      addProduct({
        title: formData.title,
        slug: genSlug,
        brand: formData.brand,
        category: formData.category,
        description: formData.description,
        highlights: ['High-Performance Componentry', 'Ultra-Durable Chassis', 'Kinetic Warranty'],
        specs: {
          Connectivity: 'Wi-Fi 6E, Bluetooth 5.3',
          Warranty: '2-Year Manufacturer Warranty',
          Condition: 'Brand New',
        },
        variants: defaultVariants,
        basePrice: Number(formData.basePrice),
        compareAtPrice: Number(formData.compareAtPrice),
        rating: Number(formData.rating),
        reviewCount: Number(formData.reviewCount),
        isFeatured: formData.isFeatured,
        isSponsored: formData.isSponsored,
        vendorId: formData.vendorId,
        vendorName: selectedVendor?.name || 'Kinetic Certified',
        vendorRating: selectedVendor?.rating || 4.9,
        stock: Number(formData.stock),
        primaryImage: formData.primaryImage,
        galleryImages: [formData.primaryImage],
        locationCity: selectedVendor?.location || 'San Francisco, CA',
      });
      showToast('Product Created', `Added "${formData.title}" to catalog`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProduct(id);
      showToast('Product Deleted', `"${title}" removed from catalog`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Products & Variants
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {products.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage live inventory, configure hardware finishes, price points, and promotional placements.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, SKU, or brand..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Stock Levels</option>
            <option value="in_stock">In Stock (&gt;15)</option>
            <option value="low_stock">Low Stock (1-15)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Item & SKU</th>
                <th className="py-3.5 px-3">Category / Brand</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">Stock & Stepper</th>
                <th className="py-3.5 px-3 text-center">Featured</th>
                <th className="py-3.5 px-3 text-center">Sponsored</th>
                <th className="py-3.5 px-3 text-center">Variants</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= 15;
                  const isOut = p.stock === 0;
                  const firstSku = p.variants?.[0]?.sku || 'KNT-PRO';

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                            <Image
                              src={p.primaryImage}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          </div>
                          <div className="max-w-[200px] sm:max-w-xs">
                            <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                              {p.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-400 font-mono">
                                {firstSku}
                              </span>
                              <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                <span>{p.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Brand */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                            {p.category}
                          </span>
                          <span className="text-[10px] text-slate-400">{p.brand}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            ${p.basePrice.toFixed(2)}
                          </span>
                          {p.compareAtPrice && p.compareAtPrice > p.basePrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ${p.compareAtPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Level & Live Stepper */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                            <button
                              onClick={() => adjustStock(p.id, -1)}
                              className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors"
                              title="Decrease Stock"
                            >
                              -
                            </button>
                            <span
                              className={`px-2 py-1 font-mono font-bold text-xs min-w-[32px] text-center ${
                                isOut
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : isLow
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {p.stock}
                            </span>
                            <button
                              onClick={() => adjustStock(p.id, 1)}
                              className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors"
                              title="Increase Stock"
                            >
                              +
                            </button>
                          </div>
                          {isOut ? (
                            <span className="text-[10px] font-bold text-rose-500 uppercase">
                              Out
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] font-bold text-amber-500 uppercase">
                              Low
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleFeatured(p.id)}
                          className={`p-1.5 rounded-xl transition-colors ${
                            p.isFeatured
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                              : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
                          }`}
                          title="Toggle Featured"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Sponsored Toggle */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleSponsored(p.id)}
                          className={`p-1.5 rounded-xl transition-colors ${
                            p.isSponsored
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                              : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
                          }`}
                          title="Toggle Sponsored"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Variants Count */}
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                          <Layers className="w-3 h-3 text-slate-400" />
                          <span>{p.variants?.length || 1}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/webapp-demo/ecommerce/demo-03/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Hardware Product'}
                </h3>
                <p className="text-xs text-slate-400">
                  Fill in the device specifications, pricing, and initial inventory.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Slug (URL Key)
                  </label>
                  <input
                    type="text"
                    placeholder="auto-generated-if-empty"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Vendor */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Vendor *
                  </label>
                  <select
                    value={formData.vendorId}
                    onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.verified ? 'Verified' : 'Pending'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Base Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Compare At Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Compare At Price ($) (MSRP)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Stock Units Available *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Baseline Rating (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Flags */}
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Highlight as Featured Item</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSponsored}
                      onChange={(e) => setFormData({ ...formData, isSponsored: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Promoted / Sponsored Tier</span>
                  </label>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Device Overview Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
