export interface ProductVariant {
  id: string;
  name: string; // e.g. "Age 2-3 yrs", "Natural Beechwood", "Standard Set"
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  image?: string;
  attributes?: Record<string, string>;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  ageRange: string; // e.g. "2-4 Years", "4-6 Years", "6+ Years"
  material: string; // e.g. "Natural Beechwood", "Organic Silicone"
  type: string; // e.g. "Educational Toy", "STEM Kit", "Activity Board"
  description: string;
  shortDescription: string;
  basePrice: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  status: 'Active' | 'Draft' | 'Archived';
  badge?: string;
  primaryImage: string;
  secondaryImage?: string;
  galleryImages: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  bestSeller?: boolean;
  variants: ProductVariant[];
  educationalBenefits: string[];
  specs: Record<string, string>;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  isVisible: boolean;
  displayOrder: number;
}

export interface CartItem {
  id: string; // composite productId_variantId
  productId: string;
  variantId: string;
  title: string;
  variantName: string;
  unitPrice: number;
  compareAtPrice?: number;
  thumbnail: string;
  quantity: number;
  maxStock: number;
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
  variantId: string;
  title: string;
  variantName: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "WS-2026-4821"
  date: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  statusHistory: Array<{ status: OrderStatus; timestamp: string; note?: string }>;
  notes?: string;
  fraudRisk: 'Low' | 'Medium' | 'High';
  fraudScore: number; // 0 - 100
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number; // e.g. 20 for 20%
  discountType: 'percentage' | 'fixed';
  fixedAmount?: number;
  minSpend: number;
  usageCount: number;
  maxUsage?: number;
  isActive: boolean;
  createdAt: string;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  author: string;
  rating: number; // 1-5
  date: string;
  title: string;
  content: string;
  isVerified: boolean;
  isVisible: boolean;
  avatar?: string;
  city?: string;
}

export interface ComboBundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  includedProductIds: string[];
  originalPrice: number;
  discountPercent: number;
  bundlePrice: number;
  image: string;
  isActive: boolean;
  badge?: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
  imageDesktop: string;
  imageMobile: string;
  isActive: boolean;
  displayOrder: number;
  accentBadge?: string;
}

export interface PopupConfig {
  isEnabled: boolean;
  badge: string;
  title: string;
  description: string;
  couponCode: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Order Manager' | 'Inventory Manager' | 'Marketing Manager';
  status: 'Active' | 'Inactive';
  avatar: string;
  lastLogin: string;
  createdAt: string;
}

export interface RolePermissions {
  role: string;
  description: string;
  permissions: {
    PRODUCTS_VIEW: boolean;
    PRODUCTS_CREATE: boolean;
    PRODUCTS_EDIT: boolean;
    PRODUCTS_ARCHIVE: boolean;
    ORDERS_VIEW: boolean;
    ORDERS_EDIT: boolean;
    ORDERS_STATUS_CHANGE: boolean;
    ORDERS_CANCEL: boolean;
    INVENTORY_VIEW: boolean;
    INVENTORY_ADJUST: boolean;
    CATEGORIES_VIEW: boolean;
    CATEGORIES_MANAGE: boolean;
    BANNER_VIEW: boolean;
    BANNER_MANAGE: boolean;
    REVIEWS_VIEW: boolean;
    REVIEWS_MANAGE: boolean;
    STAFF_VIEW: boolean;
    STAFF_MANAGE: boolean;
    SETTINGS_VIEW: boolean;
    SETTINGS_MANAGE: boolean;
  };
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  area:
    | 'Products'
    | 'Orders'
    | 'Inventory'
    | 'Coupons'
    | 'Categories'
    | 'Banners'
    | 'Reviews'
    | 'Settings'
    | 'Staff'
    | 'Combos'
    | 'Popups';
  entity: string;
  details: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  provider: 'GTM' | 'Meta' | 'TikTok' | 'Webhook' | 'Custom';
  trackingId: string;
  isEnabled: boolean;
  lastSync: string;
  description: string;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  supportPhone: string;
  supportEmail: string;
  address: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  announcementEnabled: boolean;
  announcementText: string;
  faviconText: string;
  browserTabTitle: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp?: number;
}
