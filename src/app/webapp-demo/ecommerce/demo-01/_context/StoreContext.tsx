'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Product,
  ProductCategory,
  Order,
  OrderStatus,
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
} from '../_types';
import {
  initialSettings,
  initialCategories,
  initialProducts,
  initialCombos,
  initialCoupons,
  initialOrders,
  initialReviews,
  initialBanners,
  initialPopup,
  initialIntegrations,
  initialStaff,
  initialRoles,
  initialActivityLogs,
  initialMediaAssets,
} from '../_data/initialState';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title?: string;
  message: string;
}

interface StoreContextType {
  // State
  settings: StoreSettings;
  products: Product[];
  categories: ProductCategory[];
  combos: Combo[];
  coupons: Coupon[];
  orders: Order[];
  reviews: Review[];
  banners: Banner[];
  popup: PopupSettings;
  integrations: Integration[];
  staff: StaffMember[];
  roles: RolePermission[];
  activityLogs: ActivityLogItem[];
  mediaAssets: MediaAsset[];
  
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  shippingFee: number;
  deliveryArea: 'inside' | 'outside';
  setDeliveryArea: (area: 'inside' | 'outside') => void;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Product Actions
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;

  // Category Actions
  addCategory: (category: Omit<ProductCategory, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<ProductCategory>) => void;
  deleteCategory: (id: string) => void;

  // Combo Actions
  addCombo: (combo: Omit<Combo, 'id'>) => void;
  updateCombo: (id: string, updates: Partial<Combo>) => void;
  deleteCombo: (id: string) => void;

  // Order Actions
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

  // Coupon Actions
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Review Actions
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  toggleReviewVisibility: (id: string) => void;
  deleteReview: (id: string) => void;

  // Banner & Popup Actions
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  deleteBanner: (id: string) => void;
  updatePopup: (updates: Partial<PopupSettings>) => void;

  // Settings Actions
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Staff & Roles Actions
  addStaff: (member: Omit<StaffMember, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;
  updateRolePermissions: (roleId: string, permissions: string[]) => void;

  // Integrations Actions
  updateIntegration: (id: string, updates: Partial<Integration>) => void;
  addIntegration: (integration: Omit<Integration, 'id'>) => void;
  deleteIntegration: (id: string) => void;

  // Media Actions
  addMediaAsset: (asset: Omit<MediaAsset, 'id' | 'uploadedAt' | 'usageCount'>) => void;
  deleteMediaAsset: (id: string) => void;

  // Audit Log
  logActivity: (action: string, area: ActivityLogItem['area'], entity: string, details: string) => void;

  // System & Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
  dismissToast: (id: string) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY = 'shuddha_harvest_ecommerce_state_v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Core state collections
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<ProductCategory[]>(initialCategories);
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
  const [wishlist, setWishlist] = useState<string[]>(['p1']);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success', title?: string) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
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
      console.error('Failed to load demo state from localStorage', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever core data changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const payload = {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Failed to save state to localStorage', err);
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

  // Cart calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
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
  }, [cartSubtotal, settings, deliveryArea]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + shippingFee);
  }, [cartSubtotal, discountAmount, shippingFee]);

  // Cart Handlers
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock!`, 'error', 'Out of Stock');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: nextQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });

    showToast(`Added ${quantity}x "${product.name}" to cart.`, 'success', 'Cart Updated');
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(quantity, item.product.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`Removed "${item.product.name}" from cart.`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      showToast(`Coupon "${code}" is invalid or expired.`, 'error', 'Invalid Coupon');
      return { success: false, message: 'Invalid or inactive coupon code.' };
    }

    if (cartSubtotal < found.minOrder) {
      const msg = `Minimum order of ৳${found.minOrder.toLocaleString()} required for this coupon.`;
      showToast(msg, 'warning', 'Condition Not Met');
      return { success: false, message: msg };
    }

    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied successfully!`, 'success', 'Discount Applied');
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  // Wishlist Handlers
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newId = 'p_' + Date.now();
    const newProduct: Product = { ...productData, id: newId };
    setProducts((prev) => [newProduct, ...prev]);
    logActivity('Product Created', 'Products', newProduct.name, `Added SKU ${newProduct.sku} priced ৳${newProduct.price}`);
    showToast(`Product "${newProduct.name}" created successfully.`, 'success');
    return newProduct;
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
    const existing = products.find((p) => p.id === id);
    const productName = updates.name || existing?.name || id;
    logActivity('Product Updated', 'Products', productName, `Modified attributes: ${Object.keys(updates).join(', ')}`);
    showToast(`Updated product "${productName}".`, 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logActivity('Product Deleted', 'Products', target?.name || id, `Deleted product with SKU ${target?.sku}`);
    showToast(`Product deleted.`, 'info');
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Product = {
      ...target,
      id: 'p_' + Date.now(),
      slug: target.slug + '-copy-' + Math.floor(Math.random() * 1000),
      name: target.name + ' (Copy)',
      sku: target.sku + '-CP',
    };
    setProducts((prev) => [duplicated, ...prev]);
    logActivity('Product Duplicated', 'Products', duplicated.name, `Created copy from ${target.name}`);
    showToast(`Duplicated "${target.name}".`, 'success');
  };

  // Category CRUD
  const addCategory = (categoryData: Omit<ProductCategory, 'id'>) => {
    const newCategory: ProductCategory = { ...categoryData, id: 'c_' + Date.now() };
    setCategories((prev) => [...prev, newCategory]);
    logActivity('Category Created', 'Categories', newCategory.name, `Created category with slug ${newCategory.slug}`);
    showToast(`Category "${newCategory.name}" added.`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<ProductCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast(`Category updated.`, 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast(`Category deleted.`, 'info');
  };

  // Combo CRUD
  const addCombo = (comboData: Omit<Combo, 'id'>) => {
    const newCombo: Combo = { ...comboData, id: 'cb_' + Date.now() };
    setCombos((prev) => [newCombo, ...prev]);
    logActivity('Combo Created', 'Combos', newCombo.name, `Offered for ৳${newCombo.finalPrice}`);
    showToast(`Combo "${newCombo.name}" created.`, 'success');
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
    const orderId = 'SH-' + Math.floor(10000 + Math.random() * 90000);
    const dateFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const items = cart.map((item) => ({
      productId: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0] || '/demo-assets/ecommerce/gawa-ghee.jpg',
      weight: item.product.weight,
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

    // If a coupon was used, increment usage count
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
  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
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
    setWishlist(['p1']);
    showToast('Demo store data has been reset to defaults!', 'success', 'Reset Complete');
  };

  return (
    <StoreContext.Provider
      value={{
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
        cartCount,
        cartSubtotal,
        appliedCoupon,
        discountAmount,
        shippingFee,
        deliveryArea,
        setDeliveryArea,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addCombo,
        updateCombo,
        deleteCombo,
        placeOrder,
        updateOrderStatus,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addReview,
        toggleReviewVisibility,
        deleteReview,
        updateBanner,
        addBanner,
        deleteBanner,
        updatePopup,
        updateSettings,
        addStaff,
        updateStaff,
        deleteStaff,
        updateRolePermissions,
        updateIntegration,
        addIntegration,
        deleteIntegration,
        addMediaAsset,
        deleteMediaAsset,
        logActivity,
        toasts,
        showToast,
        dismissToast,
        resetToDefaults,
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
