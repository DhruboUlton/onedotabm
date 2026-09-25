export interface ProductVariant {
  id: string;
  name: string; // e.g. "Space Black", "Titanium Silver"
  colorHex: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  subCategory?: string;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  variants: ProductVariant[];
  basePrice: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isSponsored?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  badge?: 'Pre-Order' | 'Sale' | 'New' | 'Popular' | 'Hot';
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  stock: number;
  primaryImage: string;
  galleryImages: string[];
  locationCity?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  image: string;
  itemCount: number;
  subcategories: string[];
  featured?: boolean;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  logo: string;
  banner: string;
  rating: number;
  salesCount: number;
  priceCategory: '$' | '$$' | '$$$';
  bio: string;
  verified: boolean;
  status: 'Active' | 'Pending' | 'Suspended';
  productCount: number;
  location: string;
}

export interface CartItem {
  id: string; // unique combo of productId_variantId
  productId: string;
  variantId: string;
  title: string;
  variantName: string;
  colorHex: string;
  unitPrice: number;
  compareAtPrice?: number;
  thumbnail: string;
  quantity: number;
  maxStock: number;
  vendorName: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  title: string;
  variantName: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export type OrderStatus = 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "KG-2026-4821"
  trackingNumber: string; // e.g. "KG-TRK-840291"
  date: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  shippingMethod: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  estimatedDelivery: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  freeShipping?: boolean;
  minSpend?: number;
  usageCount: number;
  isActive: boolean;
  expiryDate: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  status: 'Approved' | 'Pending' | 'Hidden';
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  taxRatePercent: number;
  currencySymbol: string;
  currencyCode: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
