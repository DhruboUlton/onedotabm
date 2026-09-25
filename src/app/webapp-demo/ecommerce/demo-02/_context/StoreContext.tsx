'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  Category,
  Order,
  Combo,
  Coupon,
  Review,
  Banner,
  PopupSettings,
  Integration,
  StaffMember,
  RolePermission,
  ActivityLogItem,
  StoreSettings,
  MediaAsset,
  CartItem,
  ToastMessage,
  OrderStatus,
  ProductSizeOption,
  ProductDesignOption,
} from '../_types';

import {
  initialSettings,
  initialCategories,
  initialProducts,
  initialOrders,
  initialCombos,
  initialCoupons,
  initialReviews,
  initialBanners,
  initialPopup,
  initialIntegrations,
  initialStaff,
  initialRoles,
  initialActivityLogs,
  initialMediaAssets,
} from '../_data/initialState';

const STORAGE_KEY = 'auraglass_ecommerce_state_v1';

interface StoreContextType {
  // Store Settings
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;

  // Categories
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id' | 'productCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Combos
  combos: Combo[];
  addCombo: (combo: Omit<Combo, 'id'>) => void;
  updateCombo: (id: string, updates: Partial<Combo>) => void;
  deleteCombo: (id: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    paymentMethod: 'Cash on Delivery' | 'bKash' | 'Card';
    notes?: string;
  }) => Order;
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  toggleReviewVisibility: (id: string) => void;
  deleteReview: (id: string) => void;

  // Banners & Popups
  banners: Banner[];
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  deleteBanner: (id: string) => void;
  popup: PopupSettings;
  updatePopup: (updates: Partial<PopupSettings>) => void;

  // Integrations
  integrations: Integration[];
  updateIntegration: (id: string, updates: Partial<Integration>) => void;
  addIntegration: (item: Omit<Integration, 'id'>) => void;
  deleteIntegration: (id: string) => void;

  // Staff & Roles
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;
  roles: RolePermission[];
  updateRolePermissions: (roleId: string, permissions: string[]) => void;

  // Activity Logs
  activityLogs: ActivityLogItem[];
  logActivity: (
    action: string,
    area: ActivityLogItem['area'],
    entity: string,
    details: string,
    user?: string
  ) => void;

  // Media
  mediaAssets: MediaAsset[];
  addMediaAsset: (asset: Omit<MediaAsset, 'id' | 'uploadedAt' | 'usageCount'>) => void;
  deleteMediaAsset: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedSize?: ProductSizeOption,
    selectedDesign?: ProductDesignOption
  ) => void;
  removeFromCart: (productId: string, sizeId?: string, designId?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    sizeId?: string,
    designId?: string
  ) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  discountAmount: number;
  shippingFee: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  deliveryArea: 'inside' | 'outside';
  setDeliveryArea: (area: 'inside' | 'outside') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
  dismissToast: (id: string) => void;

  // Reset
  resetDemoData: () => void;
  isHydrated: boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Core Data
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [combos, setCombos] = useState<Combo[]>(initialCombos);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [popup, setPopup] = useState<PopupSettings>(initialPopup);
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [roles, setRoles] = useState<RolePermission[]>(initialRoles);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(initialActivityLogs);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(initialMediaAssets);

  // Cart & UI state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(['ag-p1']);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success', title?: string) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to log activities
  const logActivity = (
    action: string,
    area: ActivityLogItem['area'],
    entity: string,
    details: string,
    user = 'Store Admin'
  ) => {
    const newLog: ActivityLogItem = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user,
      action,
      area,
      entity,
      details,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.combos) setCombos(parsed.combos);
        if (parsed.coupons) setCoupons(parsed.coupons);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.reviews) setReviews(parsed.reviews);
        if (parsed.banners) setBanners(parsed.banners);
        if (parsed.popup) setPopup(parsed.popup);
        if (parsed.integrations) setIntegrations(parsed.integrations);
        if (parsed.staff) setStaff(parsed.staff);
        if (parsed.roles) setRoles(parsed.roles);
        if (parsed.activityLogs) setActivityLogs(parsed.activityLogs);
        if (parsed.mediaAssets) setMediaAssets(parsed.mediaAssets);
        if (parsed.cart) setCart(parsed.cart);
        if (parsed.wishlist) setWishlist(parsed.wishlist);
      }
    } catch (err) {
      console.error('Failed to load demo-02 state from localStorage', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever core state updates
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const dataToSave = {
        settings,
        products,
        categories,
        combos,
        coupons,
        orders,
        reviews,
        banners,
        popup,
        integrations,
        staff,
        roles,
        activityLogs,
        mediaAssets,
        cart,
        wishlist,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (err) {
      console.error('Failed to save demo-02 state to localStorage', err);
    }
  }, [
    isHydrated,
    settings,
    products,
    categories,
    combos,
    coupons,
    orders,
    reviews,
    banners,
    popup,
    integrations,
    staff,
    roles,
    activityLogs,
    mediaAssets,
    cart,
    wishlist,
  ]);

  // Cart totals calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
      return acc + itemPrice * item.quantity;
    }, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (cartSubtotal < appliedCoupon.minOrder) return 0;

    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    }
    return Math.min(appliedCoupon.discountValue, cartSubtotal);
  }, [appliedCoupon, cartSubtotal]);

  const shippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= settings.freeShippingThreshold) return 0;
    return deliveryArea === 'inside'
      ? settings.insideDhakaShippingFee
      : settings.outsideDhakaShippingFee;
  }, [cartSubtotal, deliveryArea, settings]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + shippingFee);
  }, [cartSubtotal, discountAmount, shippingFee]);

  // Cart Operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedSize?: ProductSizeOption,
    selectedDesign?: ProductDesignOption
  ) => {
    const size = selectedSize || product.sizeOptions[0] || {
      id: 'default',
      label: 'Standard',
      dimensions: 'Standard',
      price: product.price,
      compareAtPrice: product.compareAtPrice,
    };
    const design = selectedDesign || product.designOptions[0] || {
      id: 'default',
      label: 'Standard',
      image: product.images[0],
    };

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedSize?.id === size.id &&
          i.selectedDesign?.id === design.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedSize: size,
          selectedDesign: design,
        },
      ];
    });

    setIsCartOpen(true);
    showToast(`Added ${quantity}x ${product.name} to cart.`, 'success');
  };

  const removeFromCart = (productId: string, sizeId?: string, designId?: string) => {
    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i.product.id === productId &&
            (!sizeId || i.selectedSize?.id === sizeId) &&
            (!designId || i.selectedDesign?.id === designId)
          )
      )
    );
    showToast('Item removed from cart.', 'info');
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    sizeId?: string,
    designId?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, sizeId, designId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          (!sizeId || item.selectedSize?.id === sizeId) &&
          (!designId || item.selectedDesign?.id === designId)
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      showToast('Invalid or expired coupon code.', 'error', 'Coupon Error');
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    if (cartSubtotal < found.minOrder) {
      const msg = `Minimum order ৳${found.minOrder} required for ${found.code}.`;
      showToast(msg, 'error', 'Coupon Minimum Order');
      return { success: false, message: msg };
    }

    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied successfully!`, 'success', 'Discount Applied');
    return { success: true, message: 'Coupon applied.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(
        exists ? 'Removed from wishlist' : 'Added to wishlist',
        exists ? 'info' : 'success'
      );
      return next;
    });
  };

  // Products CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const newId = 'ag-p_' + Date.now();
    const newProduct: Product = {
      ...productData,
      id: newId,
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
    logActivity('Product Created', 'Products', newProduct.name, `SKU: ${newProduct.sku}, Price: ৳${newProduct.price}`);
    showToast(`Product "${newProduct.name}" created.`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          return updated;
        }
        return p;
      })
    );
    logActivity('Product Edited', 'Products', updates.name || `ID: ${id}`, 'Updated specifications/pricing/inventory');
    showToast('Product updated successfully.', 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logActivity('Product Archived', 'Products', target?.name || id, 'Removed from active storefront listings');
    showToast('Product removed.', 'info');
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Product = {
      ...target,
      id: 'ag-p_' + Date.now(),
      name: `${target.name} (Copy)`,
      slug: `${target.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      sku: `${target.sku}-CP`,
      stock: 10,
    };
    setProducts((prev) => [duplicated, ...prev]);
    logActivity('Product Duplicated', 'Products', duplicated.name, `Cloned from ${target.name}`);
    showToast(`Duplicated "${target.name}".`, 'success');
  };

  const adjustStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
    const prod = products.find((p) => p.id === id);
    logActivity('Inventory Adjusted', 'Inventory', prod?.name || id, `Stock adjusted by ${delta > 0 ? `+${delta}` : delta} units`);
    showToast(`Stock updated for ${prod?.name || 'product'}.`, 'info');
  };

  // Categories CRUD
  const addCategory = (catData: Omit<Category, 'id' | 'productCount'>) => {
    const newCategory: Category = {
      ...catData,
      id: 'cat_' + Date.now(),
      productCount: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
    logActivity('Category Created', 'Categories', newCategory.name, `Created category with slug ${newCategory.slug}`);
    showToast(`Category "${newCategory.name}" added.`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Category updated.', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category removed.', 'info');
  };

  // Combos
  const addCombo = (comboData: Omit<Combo, 'id'>) => {
    const newCombo: Combo = { ...comboData, id: 'cmb_' + Date.now() };
    setCombos((prev) => [...prev, newCombo]);
    logActivity('Combo Created', 'Combos', newCombo.name, `Bundle price: ৳${newCombo.finalPrice}`);
    showToast(`Combo bundle "${newCombo.name}" added.`, 'success');
  };

  const updateCombo = (id: string, updates: Partial<Combo>) => {
    setCombos((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Combo bundle updated.', 'success');
  };

  const deleteCombo = (id: string) => {
    setCombos((prev) => prev.filter((c) => c.id !== id));
    showToast('Combo bundle removed.', 'info');
  };

  // Orders
  const placeOrder = (orderData: {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    paymentMethod: 'Cash on Delivery' | 'bKash' | 'Card';
    notes?: string;
  }): Order => {
    const orderId = 'AG-' + Math.floor(10000 + Math.random() * 90000);
    const dateFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const items = cart.map((item) => ({
      productId: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      price: item.selectedSize ? item.selectedSize.price : item.product.price,
      quantity: item.quantity,
      image: item.product.images[0] || '/demo-assets/ecommerce/demo-02/poster-f1-redbull.jpg',
      selectedSize: item.selectedSize?.label,
      selectedDesign: item.selectedDesign?.label,
    }));

    const newOrder: Order = {
      id: orderId,
      date: dateFormatted,
      customerName: orderData.customerName,
      phone: orderData.phone,
      email: orderData.email,
      address: orderData.address,
      city: orderData.city,
      items,
      subtotal: cartSubtotal,
      discount: discountAmount,
      shippingFee,
      total: cartTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      status: 'Pending',
      notes: orderData.notes,
      timeline: [
        {
          status: 'Pending',
          timestamp: dateFormatted,
          note: `Order placed online via website (${orderData.paymentMethod}).`,
        },
      ],
      fraudRisk: 'Low',
    };

    // Decrement stock for ordered items
    setProducts((prev) =>
      prev.map((p) => {
        const ordered = cart.find((i) => i.product.id === p.id);
        if (ordered) {
          return { ...p, stock: Math.max(0, p.stock - ordered.quantity) };
        }
        return p;
      })
    );

    // If coupon used, increment count
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === appliedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c
        )
      );
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    logActivity(
      'Order Placed',
      'Orders',
      `Order #${orderId}`,
      `Customer ${orderData.customerName} placed order for ${items.length} items (Total: ৳${newOrder.total})`,
      orderData.customerName
    );

    showToast(`Order #${orderId} placed successfully!`, 'success', 'Thank You');
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus, note?: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          const nextTimeline = [
            ...order.timeline,
            {
              status,
              timestamp,
              note: note || `Status updated to ${status}.`,
            },
          ];
          return {
            ...order,
            status,
            paymentStatus: status === 'Delivered' ? 'Paid' : order.paymentStatus,
            timeline: nextTimeline,
          };
        }
        return order;
      })
    );

    logActivity('Order Status Changed', 'Orders', `Order #${id}`, `Updated status to ${status}${note ? ` (${note})` : ''}`);
    showToast(`Order #${id} status changed to ${status}.`, 'info');
  };

  // Coupons
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: 'cp_' + Date.now(),
      usedCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    logActivity('Coupon Created', 'Coupons', newCoupon.code, `Discount ${newCoupon.discountValue}${newCoupon.discountType === 'percentage' ? '%' : '৳'}`);
    showToast(`Coupon ${newCoupon.code} created.`, 'success');
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Coupon updated.', 'success');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon removed.', 'info');
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: 'rev_' + Date.now(),
      date: new Date().toISOString().substring(0, 10),
    };
    setReviews((prev) => [newReview, ...prev]);
    logActivity('Review Submitted', 'Reviews', newReview.productName, `Rating: ${newReview.rating}★ by ${newReview.customerName}`);
    showToast('Thank you! Your review was submitted.', 'success');
  };

  const toggleReviewVisibility = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.isVisible;
          showToast(`Review is now ${next ? 'visible on storefront' : 'hidden from storefront'}.`, 'info');
          logActivity('Review Visibility Toggled', 'Reviews', r.productName, `Set to ${next ? 'Visible' : 'Hidden'}`);
          return { ...r, isVisible: next };
        }
        return r;
      })
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review deleted.', 'info');
  };

  // Banners & Popups
  const updateBanner = (id: string, updates: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    logActivity('Banner Updated', 'Banners', `Banner #${id}`, 'Updated promotional headline/settings');
    showToast('Banner saved. Storefront updated.', 'success');
  };

  const addBanner = (bannerData: Omit<Banner, 'id'>) => {
    const newBanner: Banner = { ...bannerData, id: 'b_' + Date.now() };
    setBanners((prev) => [...prev, newBanner]);
    showToast('New banner added.', 'success');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner removed.', 'info');
  };

  const updatePopup = (updates: Partial<PopupSettings>) => {
    setPopup((prev) => ({ ...prev, ...updates }));
    logActivity('Popup Settings Updated', 'Popups', 'Storefront Popup', `Active: ${updates.isEnabled !== undefined ? updates.isEnabled : popup.isEnabled}`);
    showToast('Popup settings saved.', 'success');
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    logActivity('Settings Updated', 'Settings', 'Store Configuration', `Updated: ${Object.keys(updates).join(', ')}`);
    showToast('Settings saved successfully.', 'success');
  };

  // Staff & Roles
  const addStaff = (member: Omit<StaffMember, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newStaff: StaffMember = {
      ...member,
      id: 'st_' + Date.now(),
      createdAt: new Date().toISOString().substring(0, 10),
      lastLogin: 'Never',
    };
    setStaff((prev) => [...prev, newStaff]);
    logActivity('Staff Added', 'Staff', newStaff.name, `Assigned role: ${newStaff.role}`);
    showToast(`Staff member "${newStaff.name}" added.`, 'success');
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Staff details updated.', 'success');
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    showToast('Staff member deleted.', 'info');
  };

  const updateRolePermissions = (roleId: string, permissions: string[]) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions } : r))
    );
    showToast('Role permissions updated.', 'success');
  };

  // Integrations
  const updateIntegration = (id: string, updates: Partial<Integration>) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Integration configuration updated.', 'success');
  };

  const addIntegration = (integrationData: Omit<Integration, 'id'>) => {
    const newInt: Integration = { ...integrationData, id: 'int_' + Date.now() };
    setIntegrations((prev) => [...prev, newInt]);
    showToast(`Integration "${newInt.name}" added.`, 'success');
  };

  const deleteIntegration = (id: string) => {
    setIntegrations((prev) => prev.filter((i) => i.id !== id));
    showToast('Integration deleted.', 'info');
  };

  // Media
  const addMediaAsset = (assetData: Omit<MediaAsset, 'id' | 'uploadedAt' | 'usageCount'>) => {
    const newAsset: MediaAsset = {
      ...assetData,
      id: 'm_' + Date.now(),
      uploadedAt: new Date().toISOString().substring(0, 10),
      usageCount: 1,
    };
    setMediaAssets((prev) => [newAsset, ...prev]);
    showToast(`Uploaded "${newAsset.name}".`, 'success');
  };

  const deleteMediaAsset = (id: string) => {
    setMediaAssets((prev) => prev.filter((m) => m.id !== id));
    showToast('Asset removed from library.', 'info');
  };

  // Reset to original demo dataset
  const resetDemoData = () => {
    setSettings(initialSettings);
    setProducts(initialProducts);
    setCategories(initialCategories);
    setCombos(initialCombos);
    setCoupons(initialCoupons);
    setOrders(initialOrders);
    setReviews(initialReviews);
    setBanners(initialBanners);
    setPopup(initialPopup);
    setIntegrations(initialIntegrations);
    setStaff(initialStaff);
    setRoles(initialRoles);
    setActivityLogs(initialActivityLogs);
    setMediaAssets(initialMediaAssets);
    setCart([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('Demo data reset to factory defaults.', 'info', 'Reset Completed');
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        adjustStock,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        combos,
        addCombo,
        updateCombo,
        deleteCombo,
        orders,
        placeOrder,
        updateOrderStatus,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        reviews,
        addReview,
        toggleReviewVisibility,
        deleteReview,
        banners,
        updateBanner,
        addBanner,
        deleteBanner,
        popup,
        updatePopup,
        integrations,
        updateIntegration,
        addIntegration,
        deleteIntegration,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        roles,
        updateRolePermissions,
        activityLogs,
        logActivity,
        mediaAssets,
        addMediaAsset,
        deleteMediaAsset,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        discountAmount,
        shippingFee,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        deliveryArea,
        setDeliveryArea,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        toasts,
        showToast,
        dismissToast,
        resetDemoData,
        isHydrated,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
