'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  ProductVariant,
  Category,
  Vendor,
  CartItem,
  Order,
  OrderStatus,
  Coupon,
  Review,
  Article,
  StoreSettings,
  ToastMessage,
} from '../_types';
import {
  initialSettings,
  initialCategories,
  initialVendors,
  initialProducts,
  initialCoupons,
  initialOrders,
  initialReviews,
  initialArticles,
} from '../_data/initialState';

const STORAGE_KEY = 'kinetic_gear_store_v1';

interface LocationFilter {
  city: string;
  radiusMiles: number; // 0 means 'Everywhere'
}

interface StoreContextType {
  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  toggleFeatured: (id: string) => void;
  toggleSponsored: (id: string) => void;

  // Categories
  categories: Category[];
  updateCategory: (id: string, updates: Partial<Category>) => void;

  // Vendors
  vendors: Vendor[];
  approveVendor: (id: string) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  freeShippingProgress: {
    eligible: boolean;
    remaining: number;
    percent: number;
  };

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  toggleCouponActive: (id: string) => void;

  // Orders & Tracking
  orders: Order[];
  placeOrder: (customerData: {
    customerName: string;
    customerEmail: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    shippingMethod: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderByIdOrTracking: (query: string) => Order | undefined;

  // Wishlist & Compare
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  compareList: string[];
  toggleCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;

  // Location filter
  locationFilter: LocationFilter;
  setLocationFilter: React.Dispatch<React.SetStateAction<LocationFilter>>;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Mobile Navigation Drawer
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;

  // Articles & Reviews
  articles: Article[];
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;

  // Global Search state in header
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryScope: string;
  setCategoryScope: (scope: string) => void;

  // Toast notifications
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Reset demo data
  resetAllData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [articles] = useState<Article[]>(initialArticles);

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState<LocationFilter>({
    city: 'All Locations',
    radiusMiles: 0,
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryScope, setCategoryScope] = useState('All Categories');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('kinetic_gear_theme');
      if (savedTheme === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.products && Array.isArray(parsed.products)) {
          const mergedProducts = initialProducts.map((p) => {
            const cached = parsed.products.find((cp: any) => cp.id === p.id);
            if (!cached) return p;
            return {
              ...p,
              ...cached,
              primaryImage: cached.primaryImage?.startsWith('/demo-assets') ? cached.primaryImage : p.primaryImage,
            };
          });
          setProducts(mergedProducts);
        }
        if (parsed.categories && Array.isArray(parsed.categories)) {
          const mergedCategories = initialCategories.map((c) => {
            const cached = parsed.categories.find((cc: any) => cc.id === c.id);
            if (!cached) return c;
            return {
              ...c,
              ...cached,
              image: cached.image?.startsWith('/demo-assets') ? cached.image : c.image,
            };
          });
          setCategories(mergedCategories);
        }
        if (parsed.vendors && Array.isArray(parsed.vendors)) {
          const mergedVendors = initialVendors.map((v) => {
            const cached = parsed.vendors.find((cv: any) => cv.id === v.id);
            if (!cached) return v;
            return {
              ...v,
              ...cached,
              logo: cached.logo?.startsWith('/demo-assets') ? cached.logo : v.logo,
              banner: cached.banner?.startsWith('/demo-assets') ? cached.banner : v.banner,
            };
          });
          setVendors(mergedVendors);
        }
        if (parsed.cart) setCart(parsed.cart);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.coupons) setCoupons(parsed.coupons);
        if (parsed.wishlist) setWishlist(parsed.wishlist);
        if (parsed.compareList) setCompareList(parsed.compareList);
        if (parsed.reviews) setReviews(parsed.reviews);
        if (parsed.settings) setSettings(parsed.settings);
      }
    } catch (err) {
      console.error('Failed to load Kinetic Gear local storage state:', err);
    }
    setMounted(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!mounted) return;
    try {
      const stateToPersist = {
        products,
        categories,
        vendors,
        cart,
        orders,
        coupons,
        wishlist,
        compareList,
        reviews,
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (err) {
      console.error('Failed to persist Kinetic Gear state:', err);
    }
  }, [mounted, products, categories, vendors, cart, orders, coupons, wishlist, compareList, reviews, settings]);

  // Toast Helpers
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  }, [dismissToast]);

  // Theme Toggle
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('kinetic_gear_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('kinetic_gear_theme', 'light');
      }
      return next;
    });
  }, []);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minSpend && subtotal < appliedCoupon.minSpend) return 0;
    if (appliedCoupon.discountPercent) {
      return (subtotal * appliedCoupon.discountPercent) / 100;
    }
    if (appliedCoupon.discountAmount) {
      return Math.min(appliedCoupon.discountAmount, subtotal);
    }
    return 0;
  }, [subtotal, appliedCoupon]);

  const isFreeShippingViaCoupon = appliedCoupon?.freeShipping === true;
  const isFreeShippingViaThreshold = subtotal >= settings.freeShippingThreshold;

  const shipping = useMemo(() => {
    if (cart.length === 0) return 0;
    if (isFreeShippingViaCoupon || isFreeShippingViaThreshold) return 0;
    return settings.standardShippingFee;
  }, [cart.length, isFreeShippingViaCoupon, isFreeShippingViaThreshold, settings.standardShippingFee]);

  const tax = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - discount);
    return (taxableAmount * settings.taxRatePercent) / 100;
  }, [subtotal, discount, settings.taxRatePercent]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discount) + shipping + tax;
  }, [subtotal, discount, shipping, tax]);

  const freeShippingProgress = useMemo(() => {
    const threshold = settings.freeShippingThreshold;
    if (subtotal >= threshold || isFreeShippingViaCoupon) {
      return { eligible: true, remaining: 0, percent: 100 };
    }
    const remaining = Math.max(0, threshold - subtotal);
    const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
    return { eligible: false, remaining, percent };
  }, [subtotal, settings.freeShippingThreshold, isFreeShippingViaCoupon]);

  // Cart Actions
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    const cartItemId = `${product.id}__${variant.id}`;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          variantId: variant.id,
          title: product.title,
          variantName: variant.name,
          colorHex: variant.colorHex,
          unitPrice: variant.price,
          compareAtPrice: variant.compareAtPrice,
          thumbnail: variant.image || product.primaryImage,
          quantity,
          maxStock: variant.inventory,
          vendorName: product.vendorName,
        },
      ];
    });
    setIsCartOpen(true);
    showToast(`Added to Cart`, `${product.title} (${variant.name})`, 'success');
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed', 'Product removed from your cart.', 'info');
  };

  const clearCart = () => setCart([]);

  // Coupon Actions
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed);
    if (!found) {
      return { success: false, message: 'Invalid promo code. Please check and try again.' };
    }
    if (!found.isActive) {
      return { success: false, message: 'This promo code is currently inactive or expired.' };
    }
    if (found.minSpend && subtotal < found.minSpend) {
      return {
        success: false,
        message: `This coupon requires a minimum subtotal of $${found.minSpend}.00`,
      };
    }
    setAppliedCoupon(found);
    showToast('Coupon Applied', `Code ${found.code} applied successfully!`, 'success');
    return { success: true, message: `Promo code ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Promo code removed from your order.', 'info');
  };

  const toggleCouponActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Order Placement
  const placeOrder = (customerData: {
    customerName: string;
    customerEmail: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    shippingMethod: string;
  }): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `KG-2026-${randomSuffix}`;
    const trackingNumber = `KG-TRK-${trackingSuffix}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      trackingNumber,
      date: new Date().toISOString(),
      customerName: customerData.customerName,
      customerEmail: customerData.customerEmail,
      phone: customerData.phone,
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      postalCode: customerData.postalCode,
      country: customerData.country,
      shippingMethod: customerData.shippingMethod,
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
      shipping,
      tax,
      discount,
      total: grandTotal,
      couponCode: appliedCoupon?.code,
      status: 'Confirmed',
      estimatedDelivery: 'Oct 04, 2026',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    showToast('Order Placed Successfully', `Order #${orderNumber} is confirmed!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast('Order Status Updated', `Order status changed to ${status}.`, 'info');
  };

  const getOrderByIdOrTracking = (query: string): Order | undefined => {
    const q = query.trim().toUpperCase();
    return orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === q ||
        o.trackingNumber.toUpperCase() === q ||
        o.id.toUpperCase() === q
    );
  };

  // Wishlist & Compare
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Wishlist Updated', 'Item removed from your wishlist.', 'info');
        return prev.filter((id) => id !== productId);
      }
      showToast('Saved to Wishlist', 'Item added to your saved wishlist.', 'success');
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Compare Updated', 'Removed from comparison list.', 'info');
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        showToast('Compare Limit Reached', 'You can compare up to 4 items at once.', 'warning');
        return prev;
      }
      showToast('Added to Compare', 'Added to hardware comparison matrix.', 'success');
      return [...prev, productId];
    });
  };

  const isInCompare = (productId: string) => compareList.includes(productId);

  // Product Management (Admin <-> Storefront Sync)
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProducts((prev) => [product, ...prev]);
    showToast('Product Created', `${product.title} has been added to the catalog.`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product Updated', 'Changes saved and synced to storefront.', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product Deleted', 'Product removed from catalog.', 'info');
  };

  const adjustStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  const toggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
  };

  const toggleSponsored = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSponsored: !p.isSponsored } : p))
    );
  };

  // Categories
  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  // Vendors
  const approveVendor = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Active', verified: true } : v))
    );
    showToast('Vendor Approved', 'Merchant is now verified and active on the marketplace.', 'success');
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Approved',
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Review Submitted', 'Thank you for your feedback!', 'success');
  };

  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Settings Saved', 'Store configuration updated.', 'success');
  };

  // Modals & Navigation
  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openMobileNav = () => setIsMobileNavOpen(true);
  const closeMobileNav = () => setIsMobileNavOpen(false);

  // Reset Data to Initial
  const resetAllData = () => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setVendors(initialVendors);
    setCart([]);
    setOrders(initialOrders);
    setCoupons(initialCoupons);
    setReviews(initialReviews);
    setSettings(initialSettings);
    setWishlist([]);
    setCompareList([]);
    setAppliedCoupon(null);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Reset Complete', 'Restored default demo data.', 'info');
  };

  const value = {
    isDark,
    toggleTheme,
    settings,
    updateSettings,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    toggleFeatured,
    toggleSponsored,
    categories,
    updateCategory,
    vendors,
    approveVendor,
    updateVendor,
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
    tax,
    grandTotal,
    freeShippingProgress,
    coupons,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    toggleCouponActive,
    orders,
    placeOrder,
    updateOrderStatus,
    getOrderByIdOrTracking,
    wishlist,
    toggleWishlist,
    isInWishlist,
    compareList,
    toggleCompare,
    isInCompare,
    locationFilter,
    setLocationFilter,
    isLocationModalOpen,
    openLocationModal,
    closeLocationModal,
    quickViewProduct,
    openQuickView,
    closeQuickView,
    isMobileNavOpen,
    openMobileNav,
    closeMobileNav,
    articles,
    reviews,
    addReview,
    updateReviewStatus,
    searchQuery,
    setSearchQuery,
    categoryScope,
    setCategoryScope,
    toasts,
    showToast,
    dismissToast,
    resetAllData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
