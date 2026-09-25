export type OrderStatus =
  | 'Pending'
  | 'Called'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface ProductSizeOption {
  id: string;
  label: string;
  dimensions: string;
  price: number;
  compareAtPrice: number;
}

export interface ProductDesignOption {
  id: string;
  label: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  description: string;
  shortBlurb: string;
  price: number;
  compareAtPrice: number;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  status: 'active' | 'archived' | 'draft';
  isFeatured: boolean;
  badge?: 'Best Seller' | 'Trending' | 'New Arrival' | 'Limited Edition' | 'Save ৳230';
  images: string[];
  sizeOptions: ProductSizeOption[];
  designOptions: ProductDesignOption[];
  finish?: string;
  mounting?: string;
  specifications?: Record<string, string>;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  image: string;
  productCount: number;
  isVisible: boolean;
  order: number;
  description?: string;
}

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedDesign?: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Card';
  paymentStatus: 'Pending' | 'Paid';
  status: OrderStatus;
  notes?: string;
  timeline: OrderTimeline[];
  fraudRisk?: 'Low' | 'Medium' | 'High';
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  originalPrice: number;
  discount: number;
  finalPrice: number;
  isActive: boolean;
  image: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  usedCount: number;
  usageLimit: number;
  isActive: boolean;
  expiresAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  isVisible: boolean;
  avatar?: string;
  location?: string;
  photoUrl?: string;
}

export interface Banner {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  image: string;
  order: number;
  isActive: boolean;
  type: 'hero_main' | 'feature_highlight' | 'curated_strip';
}

export interface PopupSettings {
  isEnabled: boolean;
  badge: string;
  headline: string;
  description: string;
  couponCode: string;
  ctaText: string;
  ctaUrl: string;
  dismissText: string;
  disclaimer: string;
  image: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'meta_pixel' | 'gtm' | 'tiktok_pixel' | 'ga4' | 'custom';
  placement: 'head' | 'body_start' | 'body_end';
  code: string;
  isEnabled: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  area: 'Products' | 'Orders' | 'Inventory' | 'Categories' | 'Combos' | 'Coupons' | 'Banners' | 'Popups' | 'Reviews' | 'Staff' | 'Settings';
  entity: string;
  details: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  currency: string;
  announcementEnabled: boolean;
  announcementText: string;
  phone: string;
  email: string;
  address: string;
  freeShippingThreshold: number;
  insideDhakaShippingFee: number;
  outsideDhakaShippingFee: number;
  sessionTimeoutMinutes: number;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  dimensions: string;
  fileSize: string;
  fileType: string;
  altText: string;
  usageCount: number;
  uploadedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: ProductSizeOption;
  selectedDesign: ProductDesignOption;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}
