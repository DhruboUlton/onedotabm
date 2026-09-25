export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  bengaliName?: string;
  sku: string;
  category: string;
  categoryName: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: ProductStatus;
  badge?: string;
  isFeatured?: boolean;
  isTopSelling?: boolean;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  specifications: ProductSpecification[];
  images: string[];
  brand: string;
  weight?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  bengaliName?: string;
  iconName: string;
  image?: string;
  productCount: number;
  order: number;
  isActive: boolean;
  description: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Called'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight?: string;
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
  paymentStatus: 'Paid' | 'Pending';
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
}

export interface Banner {
  id: string;
  title: string;
  bengaliTitle?: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  image: string;
  order: number;
  isActive: boolean;
  type: 'hero_main' | 'hero_secondary' | 'mid_promo';
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
}
