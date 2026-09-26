'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  ProductVariant,
  Category,
  CartItem,
  Order,
  OrderStatus,
  Coupon,
  Review,
  ComboBundle,
  BannerSlide,
  PopupConfig,
  StaffMember,
  RolePermissions,
  ActivityLogItem,
  IntegrationItem,
  StoreSettings,
  ToastMessage,
} from '../_types';
import {
  initialSettings,
  initialCategories,
  initialProducts,
  initialCombos,
  initialCoupons,
  initialReviews,
  initialBanners,
  initialPopup,
  initialOrders,
  initialStaff,
  initialRoles,
  initialIntegrations,
  initialActivityLog,
} from '../_data/initialData';

const STORAGE_KEY = 'wondersprout_demo04_store_v1';

interface StoreContextType {
  // Settings
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  adjustStock: (id: string, newStock: number) => void;

  // Categories
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryVisibility: (id: string) => void;

  // Combos
  combos: ComboBundle[];
  addCombo: (combo: Omit<ComboBundle, 'id'>) => void;
  updateCombo: (id: string, updates: Partial<ComboBundle>) => void;
  deleteCombo: (id: string) => void;
  toggleCombo: (id: string) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'createdAt' | 'usageCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCoupon: (id: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (customerData: {
    customerName: string;
    customerEmail: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    paymentMethod: string;
    notes?: string;
  }) => Order | null;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  updateReview: (id: string, updates: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  toggleReviewVisibility: (id: string) => void;

  // Banners
  banners: BannerSlide[];
  updateBanner: (id: string, updates: Partial<BannerSlide>) => void;
  addBanner: (banner: Omit<BannerSlide, 'id'>) => void;
  deleteBanner: (id: string) => void;
  toggleBanner: (id: string) => void;

  // Pop-up
  popup: PopupConfig;
  updatePopup: (updates: Partial<PopupConfig>) => void;

  // Staff & Roles
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;
  toggleStaffStatus: (id: string) => void;
  roles: RolePermissions[];
  updateRolePermissions: (roleName: string, permissions: RolePermissions['permissions']) => void;

  // Integrations
  integrations: IntegrationItem[];
  updateIntegration: (id: string, updates: Partial<IntegrationItem>) => void;
  toggleIntegration: (id: string) => void;

  // Activity Log
  activityLog: ActivityLogItem[];
  logAction: (action: string, area: ActivityLogItem['area'], entity: string, details: string) => void;

  // Wishlist & Compare
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  compareList: string[];
  toggleCompare: (productId: string) => void;

  // Modals & UI
  quickAddProduct: Product | null;
  openQuickAdd: (product: Product) => void;
  closeQuickAdd: () => void;
  isEnquiryOpen: boolean;
  openEnquiry: (productTitle?: string) => void;
  closeEnquiry: () => void;
  enquiryProductTitle: string | null;

  // Toast
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Reset
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // States
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [combos, setCombos] = useState<ComboBundle[]>(initialCombos);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [banners, setBanners] = useState<BannerSlide[]>(initialBanners);
  const [popup, setPopup] = useState<PopupConfig>(initialPopup);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [roles, setRoles] = useState<RolePermissions[]>(initialRoles);
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(initialIntegrations);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>(initialActivityLog);

  // Wishlist, Compare, Modals
  const [wishlist, setWishlist] = useState<string[]>(['prod-01', 'prod-03']);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryProductTitle, setEnquiryProductTitle] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: ToastMessage['type'], title: string, message?: string) => {
      const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      setToasts((prev) => [...prev, { id, type, title, message, timestamp: Date.now() }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const logAction = useCallback(
    (action: string, area: ActivityLogItem['area'], entity: string, details: string) => {
      const newItem: ActivityLogItem = {
        id: 'act_' + Date.now(),
        timestamp: new Date().toISOString(),
        user: 'Store Administrator',
        action,
        area,
        entity,
        details,
      };
      setActivityLog((prev) => [newItem, ...prev]);
    },
    []
  );

  // Load from localStorage
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.settings) setSettings(data.settings);
        if (data.products) setProducts(data.products);
        if (data.categories) setCategories(data.categories);
        if (data.combos) setCombos(data.combos);
        if (data.coupons) setCoupons(data.coupons);
        if (data.orders) setOrders(data.orders);
        if (data.reviews) setReviews(data.reviews);
        if (data.banners) setBanners(data.banners);
        if (data.popup) setPopup(data.popup);
        if (data.staff) setStaff(data.staff);
        if (data.roles) setRoles(data.roles);
        if (data.integrations) setIntegrations(data.integrations);
        if (data.activityLog) setActivityLog(data.activityLog);
        if (data.cart) setCart(data.cart);
        if (data.wishlist) setWishlist(data.wishlist);
      }
    } catch {
      // Local storage unavailable or failed
    }
    setIsLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        settings,
        products,
        categories,
        combos,
        coupons,
        orders,
        reviews,
        banners,
        popup,
        staff,
        roles,
        integrations,
        activityLog,
        cart,
        wishlist,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  }, [
    isLoaded,
    settings,
    products,
    categories,
    combos,
    coupons,
    orders,
    reviews,
    banners,
    popup,
    staff,
    roles,
    integrations,
    activityLog,
    cart,
    wishlist,
  ]);

  // Reset Demo Data
  const resetDemoData = useCallback(() => {
    setSettings(initialSettings);
    setProducts(initialProducts);
    setCategories(initialCategories);
    setCombos(initialCombos);
    setCart([]);
    setCoupons(initialCoupons);
    setAppliedCoupon(null);
    setOrders(initialOrders);
    setReviews(initialReviews);
    setBanners(initialBanners);
    setPopup(initialPopup);
    setStaff(initialStaff);
    setRoles(initialRoles);
    setIntegrations(initialIntegrations);
    setActivityLog(initialActivityLog);
    setWishlist(['prod-01', 'prod-03']);
    setCompareList([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    addToast('success', 'Demo Data Reset', 'All store data restored to original seeded demo state.');
  }, [addToast]);

  // Settings
  const updateSettings = useCallback(
    (updates: Partial<StoreSettings>) => {
      setSettings((prev) => ({ ...prev, ...updates }));
      logAction('Settings Updated', 'Settings', 'Storefront Config', 'General store preferences updated.');
      addToast('success', 'Settings Saved', 'Storefront settings have been updated.');
    },
    [logAction, addToast]
  );

  // Products
  const addProduct = useCallback(
    (prodData: Omit<Product, 'id' | 'createdAt'>): Product => {
      const newProd: Product = {
        ...prodData,
        id: 'prod_' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProd, ...prev]);
      logAction('Product Created', 'Products', newProd.title, `Added new product with SKU ${newProd.variants[0]?.sku || 'N/A'}`);
      addToast('success', 'Product Created', `"${newProd.title}" is now available in your store.`);
      return newProd;
    },
    [logAction, addToast]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const updated = { ...p, ...updates };
            logAction('Product Updated', 'Products', updated.title, `Updated price: $${updated.basePrice}, stock: ${updated.stock}`);
            return updated;
          }
          return p;
        })
      );
      addToast('success', 'Product Updated', 'Product changes saved successfully.');
    },
    [logAction, addToast]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const target = products.find((p) => p.id === id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (target) {
        logAction('Product Deleted', 'Products', target.title, `Removed product with ID ${id}`);
        addToast('info', 'Product Removed', `"${target.title}" was deleted.`);
      }
    },
    [products, logAction, addToast]
  );

  const duplicateProduct = useCallback(
    (id: string) => {
      const source = products.find((p) => p.id === id);
      if (!source) return;
      const duplicated: Product = {
        ...source,
        id: 'prod_' + Date.now(),
        title: `${source.title} (Copy)`,
        slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [duplicated, ...prev]);
      logAction('Product Duplicated', 'Products', duplicated.title, `Duplicated from "${source.title}"`);
      addToast('success', 'Product Duplicated', `Created copy "${duplicated.title}".`);
    },
    [products, logAction, addToast]
  );

  const adjustStock = useCallback(
    (id: string, newStock: number) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const updated = {
              ...p,
              stock: Math.max(0, newStock),
              variants: p.variants.map((v) => ({ ...v, inventory: Math.max(0, newStock) })),
            };
            logAction('Inventory Adjusted', 'Inventory', p.title, `Stock count set to ${newStock}`);
            return updated;
          }
          return p;
        })
      );
      addToast('success', 'Inventory Updated', `Stock adjusted to ${newStock} units.`);
    },
    [logAction, addToast]
  );

  // Categories
  const addCategory = useCallback(
    (catData: Omit<Category, 'id'>) => {
      const newCat: Category = { ...catData, id: 'cat_' + Date.now() };
      setCategories((prev) => [...prev, newCat]);
      logAction('Category Created', 'Categories', newCat.name, 'Added category.');
      addToast('success', 'Category Created', `"${newCat.name}" is now active.`);
    },
    [logAction, addToast]
  );

  const updateCategory = useCallback(
    (id: string, updates: Partial<Category>) => {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
      logAction('Category Updated', 'Categories', id, 'Updated category parameters.');
      addToast('success', 'Category Saved', 'Category details updated.');
    },
    [logAction, addToast]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      const cat = categories.find((c) => c.id === id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (cat) {
        logAction('Category Deleted', 'Categories', cat.name, 'Deleted category.');
        addToast('info', 'Category Removed', `"${cat.name}" has been deleted.`);
      }
    },
    [categories, logAction, addToast]
  );

  const toggleCategoryVisibility = useCallback(
    (id: string) => {
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            const updated = { ...c, isVisible: !c.isVisible };
            logAction('Category Visibility', 'Categories', c.name, `Visibility set to ${updated.isVisible}`);
            return updated;
          }
          return c;
        })
      );
      addToast('info', 'Visibility Updated', 'Category storefront display changed.');
    },
    [logAction, addToast]
  );

  // Combos
  const addCombo = useCallback(
    (comboData: Omit<ComboBundle, 'id'>) => {
      const newCombo: ComboBundle = { ...comboData, id: 'combo_' + Date.now() };
      setCombos((prev) => [...prev, newCombo]);
      logAction('Combo Bundle Created', 'Combos', newCombo.name, `Priced at $${newCombo.bundlePrice}`);
      addToast('success', 'Bundle Created', `"${newCombo.name}" added.`);
    },
    [logAction, addToast]
  );

  const updateCombo = useCallback(
    (id: string, updates: Partial<ComboBundle>) => {
      setCombos((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      logAction('Combo Bundle Updated', 'Combos', id, 'Updated bundle properties.');
      addToast('success', 'Bundle Saved', 'Bundle updated successfully.');
    },
    [logAction, addToast]
  );

  const deleteCombo = useCallback(
    (id: string) => {
      setCombos((prev) => prev.filter((c) => c.id !== id));
      logAction('Combo Deleted', 'Combos', id, 'Deleted bundle.');
      addToast('info', 'Bundle Removed', 'Bundle deleted.');
    },
    [logAction, addToast]
  );

  const toggleCombo = useCallback(
    (id: string) => {
      setCombos((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
      );
    },
    []
  );

  // Cart Management
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (product: Product, variant?: ProductVariant, quantity = 1) => {
      const chosenVariant = variant || product.variants[0] || {
        id: 'default',
        name: 'Standard',
        sku: 'DEF',
        price: product.basePrice,
        inventory: product.stock,
      };

      const compositeId = `${product.id}_${chosenVariant.id}`;

      setCart((prev) => {
        const existing = prev.find((item) => item.id === compositeId);
        if (existing) {
          return prev.map((item) =>
            item.id === compositeId
              ? { ...item, quantity: Math.min(item.maxStock, item.quantity + quantity) }
              : item
          );
        } else {
          const newItem: CartItem = {
            id: compositeId,
            productId: product.id,
            variantId: chosenVariant.id,
            title: product.title,
            variantName: chosenVariant.name,
            unitPrice: chosenVariant.price,
            compareAtPrice: chosenVariant.compareAtPrice || product.compareAtPrice,
            thumbnail: product.primaryImage,
            quantity: Math.min(chosenVariant.inventory || 99, quantity),
            maxStock: chosenVariant.inventory || product.stock || 99,
          };
          return [...prev, newItem];
        }
      });

      addToast('success', 'Added to Cart! 🎒', `"${product.title}" (${chosenVariant.name}) added.`);
      setIsCartOpen(true);
    },
    [addToast]
  );

  const updateQuantity = useCallback((cartItemId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: Math.min(item.maxStock, qty) } : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (subtotal < appliedCoupon.minSpend) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return (subtotal * appliedCoupon.discountPercent) / 100;
    }
    return appliedCoupon.fixedAmount || 0;
  }, [subtotal, appliedCoupon]);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= settings.freeShippingThreshold ? 0 : 5.0;
  }, [subtotal, settings.freeShippingThreshold]);

  const grandTotal = useMemo(
    () => Math.max(0, subtotal - discount + shipping),
    [subtotal, discount, shipping]
  );

  // Coupons
  const applyCoupon = useCallback(
    (code: string) => {
      const trimmed = code.trim().toUpperCase();
      const found = coupons.find((c) => c.code === trimmed && c.isActive);

      if (!found) {
        addToast('error', 'Invalid Coupon', `Code "${code}" is expired or invalid.`);
        return { success: false, message: 'Coupon code not found or inactive.' };
      }

      if (subtotal < found.minSpend) {
        const msg = `Minimum spend of $${found.minSpend} required for this coupon.`;
        addToast('warning', 'Minimum Spend Required', msg);
        return { success: false, message: msg };
      }

      setAppliedCoupon(found);
      addToast('success', 'Coupon Applied! 🎉', `${found.discountPercent}% discount activated!`);
      return { success: true, message: 'Coupon applied successfully!' };
    },
    [coupons, subtotal, addToast]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    addToast('info', 'Coupon Removed', 'Coupon discount cleared.');
  }, [addToast]);

  const addCoupon = useCallback(
    (coupData: Omit<Coupon, 'id' | 'createdAt' | 'usageCount'>) => {
      const newCoupon: Coupon = {
        ...coupData,
        id: 'coup_' + Date.now(),
        code: coupData.code.toUpperCase().trim(),
        createdAt: new Date().toISOString().split('T')[0],
        usageCount: 0,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      logAction('Coupon Created', 'Coupons', newCoupon.code, `Created with ${newCoupon.discountPercent}% off`);
      addToast('success', 'Coupon Created', `Code "${newCoupon.code}" is ready to use.`);
    },
    [logAction, addToast]
  );

  const updateCoupon = useCallback(
    (id: string, updates: Partial<Coupon>) => {
      setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      logAction('Coupon Updated', 'Coupons', id, 'Modified coupon terms.');
      addToast('success', 'Coupon Saved', 'Coupon updated.');
    },
    [logAction, addToast]
  );

  const deleteCoupon = useCallback(
    (id: string) => {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      logAction('Coupon Deleted', 'Coupons', id, 'Removed coupon.');
      addToast('info', 'Coupon Removed', 'Coupon deleted.');
    },
    [logAction, addToast]
  );

  const toggleCoupon = useCallback(
    (id: string) => {
      setCoupons((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            const updated = { ...c, isActive: !c.isActive };
            logAction('Coupon Status', 'Coupons', c.code, `Set active to ${updated.isActive}`);
            return updated;
          }
          return c;
        })
      );
    },
    [logAction]
  );

  // Orders
  const placeOrder = useCallback(
    (customerData: {
      customerName: string;
      customerEmail: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
      paymentMethod: string;
      notes?: string;
    }): Order | null => {
      if (cart.length === 0) return null;

      const orderNumber = 'WS-2026-' + Math.floor(1000 + Math.random() * 9000);
      const newOrder: Order = {
        id: 'ord_' + Date.now(),
        orderNumber,
        date: new Date().toISOString(),
        customerName: customerData.customerName,
        customerEmail: customerData.customerEmail,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        postalCode: customerData.postalCode,
        items: cart.map((c) => ({
          productId: c.productId,
          variantId: c.variantId,
          title: c.title,
          variantName: c.variantName,
          price: c.unitPrice,
          quantity: c.quantity,
          thumbnail: c.thumbnail,
        })),
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        shippingFee: shipping,
        total: grandTotal,
        paymentMethod: customerData.paymentMethod,
        status: 'Confirmed',
        statusHistory: [
          { status: 'Pending', timestamp: new Date().toISOString() },
          { status: 'Confirmed', timestamp: new Date().toISOString(), note: 'Demo payment captured' },
        ],
        notes: customerData.notes,
        fraudRisk: 'Low',
        fraudScore: Math.floor(4 + Math.random() * 12),
      };

      // Reduce product stock
      setProducts((prev) =>
        prev.map((prod) => {
          const cartItem = cart.find((item) => item.productId === prod.id);
          if (cartItem) {
            return {
              ...prod,
              stock: Math.max(0, prod.stock - cartItem.quantity),
            };
          }
          return prod;
        })
      );

      // Increment coupon usage
      if (appliedCoupon) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === appliedCoupon.id ? { ...c, usageCount: c.usageCount + 1 } : c))
        );
      }

      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);
      setAppliedCoupon(null);
      setIsCartOpen(false);

      logAction('Order Placed', 'Orders', orderNumber, `Customer ${newOrder.customerName} placed order for $${newOrder.total.toFixed(2)}`);
      addToast('success', 'Order Confirmed! 🚀', `Order ${orderNumber} placed successfully.`);

      return newOrder;
    },
    [cart, subtotal, discount, shipping, grandTotal, appliedCoupon, logAction, addToast]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, newStatus: OrderStatus, note?: string) => {
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            const updated: Order = {
              ...ord,
              status: newStatus,
              statusHistory: [
                ...ord.statusHistory,
                { status: newStatus, timestamp: new Date().toISOString(), note },
              ],
            };
            logAction('Order Status Changed', 'Orders', ord.orderNumber, `Status updated to ${newStatus}`);
            return updated;
          }
          return ord;
        })
      );
      addToast('info', 'Order Status Updated', `Order set to "${newStatus}".`);
    },
    [logAction, addToast]
  );

  // Reviews
  const addReview = useCallback(
    (revData: Omit<Review, 'id' | 'date'>) => {
      const newRev: Review = {
        ...revData,
        id: 'rev_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
      };
      setReviews((prev) => [newRev, ...prev]);
      logAction('Review Submitted', 'Reviews', newRev.productTitle, `By ${newRev.author} (${newRev.rating}★)`);
      addToast('success', 'Thank You!', 'Your review has been submitted.');
    },
    [logAction, addToast]
  );

  const updateReview = useCallback(
    (id: string, updates: Partial<Review>) => {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
      logAction('Review Updated', 'Reviews', id, 'Updated review content.');
      addToast('success', 'Review Saved', 'Review updated.');
    },
    [logAction, addToast]
  );

  const deleteReview = useCallback(
    (id: string) => {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      logAction('Review Deleted', 'Reviews', id, 'Deleted review.');
      addToast('info', 'Review Deleted', 'Review removed from database.');
    },
    [logAction, addToast]
  );

  const toggleReviewVisibility = useCallback(
    (id: string) => {
      setReviews((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            const updated = { ...r, isVisible: !r.isVisible };
            logAction('Review Visibility', 'Reviews', r.productTitle, `Visibility: ${updated.isVisible}`);
            return updated;
          }
          return r;
        })
      );
      addToast('info', 'Visibility Changed', 'Storefront review visibility toggled.');
    },
    [logAction, addToast]
  );

  // Banners
  const updateBanner = useCallback(
    (id: string, updates: Partial<BannerSlide>) => {
      setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
      logAction('Banner Updated', 'Banners', id, 'Updated slide headline/link.');
      addToast('success', 'Banner Saved', 'Hero banner updated.');
    },
    [logAction, addToast]
  );

  const addBanner = useCallback(
    (bData: Omit<BannerSlide, 'id'>) => {
      const newBanner: BannerSlide = { ...bData, id: 'ban_' + Date.now() };
      setBanners((prev) => [...prev, newBanner]);
      logAction('Banner Created', 'Banners', newBanner.title, 'Added hero banner.');
      addToast('success', 'Banner Added', 'New slide added to hero.');
    },
    [logAction, addToast]
  );

  const deleteBanner = useCallback(
    (id: string) => {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      logAction('Banner Deleted', 'Banners', id, 'Removed banner slide.');
      addToast('info', 'Banner Removed', 'Slide deleted.');
    },
    [logAction, addToast]
  );

  const toggleBanner = useCallback(
    (id: string) => {
      setBanners((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
      );
    },
    []
  );

  // Pop-up
  const updatePopup = useCallback(
    (updates: Partial<PopupConfig>) => {
      setPopup((prev) => ({ ...prev, ...updates }));
      logAction('Popup Updated', 'Popups', 'Promotional Pop-up', `Active: ${updates.isEnabled ?? popup.isEnabled}`);
      addToast('success', 'Pop-up Saved', 'Storefront modal settings updated.');
    },
    [popup.isEnabled, logAction, addToast]
  );

  // Staff & Roles
  const addStaff = useCallback(
    (sData: Omit<StaffMember, 'id' | 'createdAt' | 'lastLogin'>) => {
      const newStaff: StaffMember = {
        ...sData,
        id: 'staff_' + Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never',
      };
      setStaff((prev) => [...prev, newStaff]);
      logAction('Staff Added', 'Staff', newStaff.name, `Assigned role ${newStaff.role}`);
      addToast('success', 'Staff Member Added', `${newStaff.name} invited.`);
    },
    [logAction, addToast]
  );

  const updateStaff = useCallback(
    (id: string, updates: Partial<StaffMember>) => {
      setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
      logAction('Staff Updated', 'Staff', id, 'Modified staff credentials.');
      addToast('success', 'Staff Updated', 'Staff member updated.');
    },
    [logAction, addToast]
  );

  const deleteStaff = useCallback(
    (id: string) => {
      setStaff((prev) => prev.filter((s) => s.id !== id));
      logAction('Staff Removed', 'Staff', id, 'Removed staff member.');
      addToast('info', 'Staff Member Removed', 'Staff account deleted.');
    },
    [logAction, addToast]
  );

  const toggleStaffStatus = useCallback(
    (id: string) => {
      setStaff((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
      );
    },
    []
  );

  const updateRolePermissions = useCallback(
    (roleName: string, permissions: RolePermissions['permissions']) => {
      setRoles((prev) =>
        prev.map((r) => (r.role === roleName ? { ...r, permissions } : r))
      );
      logAction('Role Permissions Updated', 'Staff', roleName, 'Updated permission matrix.');
      addToast('success', 'Permissions Saved', `Role "${roleName}" permissions updated.`);
    },
    [logAction, addToast]
  );

  // Integrations
  const updateIntegration = useCallback(
    (id: string, updates: Partial<IntegrationItem>) => {
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
      );
      addToast('success', 'Integration Saved', 'Tracking ID and status updated.');
    },
    [addToast]
  );

  const toggleIntegration = useCallback(
    (id: string) => {
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isEnabled: !i.isEnabled } : i))
      );
    },
    []
  );

  // Wishlist & Compare
  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          addToast('info', 'Wishlist', 'Item removed from wishlist.');
          return prev.filter((id) => id !== productId);
        } else {
          addToast('success', 'Saved to Wishlist! ❤️', 'Item saved to your favorites.');
          return [...prev, productId];
        }
      });
    },
    [addToast]
  );

  const toggleCompare = useCallback(
    (productId: string) => {
      setCompareList((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          addToast('info', 'Compare', 'Removed from comparison.');
          return prev.filter((id) => id !== productId);
        } else {
          if (prev.length >= 4) {
            addToast('warning', 'Compare Limit', 'You can compare up to 4 toys at once.');
            return prev;
          }
          addToast('success', 'Added to Compare ⚖️', 'Item added to comparison.');
          return [...prev, productId];
        }
      });
    },
    [addToast]
  );

  // Modals
  const openQuickAdd = useCallback((product: Product) => {
    setQuickAddProduct(product);
  }, []);

  const closeQuickAdd = useCallback(() => {
    setQuickAddProduct(null);
  }, []);

  const openEnquiry = useCallback((productTitle?: string) => {
    setEnquiryProductTitle(productTitle || null);
    setIsEnquiryOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => {
    setIsEnquiryOpen(false);
    setEnquiryProductTitle(null);
  }, []);

  const value = useMemo(
    () => ({
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
      toggleCategoryVisibility,
      combos,
      addCombo,
      updateCombo,
      deleteCombo,
      toggleCombo,
      cart,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      subtotal,
      discount,
      shipping,
      grandTotal,
      coupons,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      toggleCoupon,
      orders,
      placeOrder,
      updateOrderStatus,
      reviews,
      addReview,
      updateReview,
      deleteReview,
      toggleReviewVisibility,
      banners,
      updateBanner,
      addBanner,
      deleteBanner,
      toggleBanner,
      popup,
      updatePopup,
      staff,
      addStaff,
      updateStaff,
      deleteStaff,
      toggleStaffStatus,
      roles,
      updateRolePermissions,
      integrations,
      updateIntegration,
      toggleIntegration,
      activityLog,
      logAction,
      wishlist,
      toggleWishlist,
      compareList,
      toggleCompare,
      quickAddProduct,
      openQuickAdd,
      closeQuickAdd,
      isEnquiryOpen,
      openEnquiry,
      closeEnquiry,
      enquiryProductTitle,
      toasts,
      addToast,
      removeToast,
      resetDemoData,
    }),
    [
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
      toggleCategoryVisibility,
      combos,
      addCombo,
      updateCombo,
      deleteCombo,
      toggleCombo,
      cart,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      subtotal,
      discount,
      shipping,
      grandTotal,
      coupons,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      toggleCoupon,
      orders,
      placeOrder,
      updateOrderStatus,
      reviews,
      addReview,
      updateReview,
      deleteReview,
      toggleReviewVisibility,
      banners,
      updateBanner,
      addBanner,
      deleteBanner,
      toggleBanner,
      popup,
      updatePopup,
      staff,
      addStaff,
      updateStaff,
      deleteStaff,
      toggleStaffStatus,
      roles,
      updateRolePermissions,
      integrations,
      updateIntegration,
      toggleIntegration,
      activityLog,
      logAction,
      wishlist,
      toggleWishlist,
      compareList,
      toggleCompare,
      quickAddProduct,
      openQuickAdd,
      closeQuickAdd,
      isEnquiryOpen,
      openEnquiry,
      closeEnquiry,
      enquiryProductTitle,
      toasts,
      addToast,
      removeToast,
      resetDemoData,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
