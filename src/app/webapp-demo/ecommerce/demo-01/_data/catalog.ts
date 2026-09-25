/**
 * Mock data for the Kaya Supply demo. Static, fictional, and scoped to this
 * demo only — no other demo imports from here.
 */

export interface Product {
  slug: string;
  name: string;
  category: ProductCategorySlug;
  price: number;
  /** Shown struck through when present. */
  compareAt?: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  blurb: string;
  description: string;
  details: string[];
  /** Drives the generated product visual. */
  tone: { from: string; to: string };
}

export type ProductCategorySlug = 'kitchen' | 'lighting' | 'storage' | 'textiles';

export interface ProductCategory {
  slug: ProductCategorySlug;
  name: string;
  tagline: string;
}

export const storeName = 'Kaya Supply';
export const storeTagline = 'Everyday objects, made properly.';

export const productCategories: ProductCategory[] = [
  { slug: 'kitchen', name: 'Kitchen', tagline: 'Tools that earn their drawer space' },
  { slug: 'lighting', name: 'Lighting', tagline: 'Warm light, honest materials' },
  { slug: 'storage', name: 'Storage', tagline: 'Keep things where they belong' },
  { slug: 'textiles', name: 'Textiles', tagline: 'Woven to be washed a hundred times' },
];

export const products: Product[] = [
  {
    slug: 'stoneware-pour-over',
    name: 'Stoneware Pour-Over',
    category: 'kitchen',
    price: 3400,
    compareAt: 3900,
    stock: 24,
    status: 'active',
    blurb: 'Single-cup brewer in unglazed stoneware.',
    description:
      'A single-cup pour-over cone thrown in unglazed stoneware. The thicker wall holds heat through the brew, so the last pour lands at the same temperature as the first.',
    details: ['Unglazed stoneware', 'Fits standard #2 filters', 'Dishwasher safe', '340ml capacity'],
    tone: { from: '#C9BBA8', to: '#8A7968' },
  },
  {
    slug: 'brass-measuring-set',
    name: 'Brass Measuring Set',
    category: 'kitchen',
    price: 2600,
    stock: 8,
    status: 'active',
    blurb: 'Four nesting cups, solid brass.',
    description:
      'Four nesting measures turned from solid brass. Heavy enough to sit flat on a counter, and they patina instead of peeling.',
    details: ['Solid brass', 'Set of four', 'Hand wash', 'Stamped markings'],
    tone: { from: '#D8B872', to: '#9A7B34' },
  },
  {
    slug: 'linen-apron',
    name: 'Washed Linen Apron',
    category: 'textiles',
    price: 4200,
    stock: 0,
    status: 'active',
    blurb: 'Cross-back cut in heavyweight linen.',
    description:
      'A cross-back apron in heavyweight washed linen. No neck strap, so the weight sits on your shoulders instead of your spine.',
    details: ['100% washed linen', 'Cross-back straps', 'Two front pockets', 'Machine washable'],
    tone: { from: '#B4BFC4', to: '#6E7C84' },
  },
  {
    slug: 'ceramic-table-lamp',
    name: 'Ceramic Table Lamp',
    category: 'lighting',
    price: 8900,
    compareAt: 10500,
    stock: 12,
    status: 'active',
    blurb: 'Hand-thrown base, linen shade.',
    description:
      'A hand-thrown ceramic base under a linen shade. Weighted so a passing cable pulls the cord, not the lamp.',
    details: ['Hand-thrown base', 'Linen shade', 'E27 fitting', 'Inline dimmer switch'],
    tone: { from: '#E4D9C8', to: '#A8927A' },
  },
  {
    slug: 'oak-wall-shelf',
    name: 'Oak Wall Shelf',
    category: 'storage',
    price: 6400,
    stock: 15,
    status: 'active',
    blurb: 'Solid oak, hidden bracket.',
    description:
      'Solid oak with a concealed steel bracket, so the shelf reads as a single plank. Rated to hold a full run of hardbacks.',
    details: ['Solid European oak', 'Concealed bracket', '80cm x 20cm', 'Holds 15kg'],
    tone: { from: '#C2A178', to: '#7D6141' },
  },
  {
    slug: 'canvas-storage-bin',
    name: 'Canvas Storage Bin',
    category: 'storage',
    price: 2200,
    stock: 41,
    status: 'active',
    blurb: 'Structured canvas, leather handles.',
    description:
      'Waxed canvas with a structured base that holds its shape empty. Leather handles instead of cut-outs, so it survives being dragged.',
    details: ['Waxed cotton canvas', 'Leather handles', '40 x 30 x 28cm', 'Folds flat'],
    tone: { from: '#CFC6B4', to: '#8C8271' },
  },
  {
    slug: 'wool-throw',
    name: 'Lambswool Throw',
    category: 'textiles',
    price: 7600,
    stock: 6,
    status: 'active',
    blurb: 'Lambswool, woven in a herringbone.',
    description:
      'A lambswool throw in a tight herringbone weave. Heavy enough to stay where you put it on a sofa.',
    details: ['100% lambswool', 'Herringbone weave', '130 x 180cm', 'Dry clean'],
    tone: { from: '#A9B3A0', to: '#5F6B58' },
  },
  {
    slug: 'pendant-light-small',
    name: 'Small Pendant Light',
    category: 'lighting',
    price: 5400,
    stock: 0,
    status: 'draft',
    blurb: 'Spun aluminium shade in matte black.',
    description:
      'A spun aluminium pendant with a matte finish inside and out, so the bulb never shows a hotspot on the ceiling.',
    details: ['Spun aluminium', '22cm diameter', '2m braided cable', 'E27 fitting'],
    tone: { from: '#7E8286', to: '#33373B' },
  },
];

export const featuredSlugs = ['stoneware-pour-over', 'ceramic-table-lamp', 'oak-wall-shelf'];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/** Only `active` products are shown in the storefront. Admin sees everything. */
export function getStorefrontProducts(): Product[] {
  return products.filter((product) => product.status === 'active');
}

export function formatPrice(amountInMinor: number): string {
  return `৳${(amountInMinor / 100).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

// ── Admin-only mock data ────────────────────────────────────────────────────

export interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: 'paid' | 'processing' | 'shipped' | 'refunded';
  placedAt: string;
}

export const orders: Order[] = [
  {
    id: 'KS-2041',
    customer: 'Nasrin Akter',
    email: 'nasrin@example.com',
    items: 3,
    total: 12400,
    status: 'paid',
    placedAt: '2026-09-21',
  },
  {
    id: 'KS-2040',
    customer: 'Tanvir Hasan',
    email: 'tanvir@example.com',
    items: 1,
    total: 8900,
    status: 'processing',
    placedAt: '2026-09-21',
  },
  {
    id: 'KS-2039',
    customer: 'Priya Rahman',
    email: 'priya@example.com',
    items: 2,
    total: 6000,
    status: 'shipped',
    placedAt: '2026-09-20',
  },
  {
    id: 'KS-2038',
    customer: 'Arif Chowdhury',
    email: 'arif@example.com',
    items: 5,
    total: 21800,
    status: 'shipped',
    placedAt: '2026-09-19',
  },
  {
    id: 'KS-2037',
    customer: 'Meherun Nesa',
    email: 'meherun@example.com',
    items: 1,
    total: 4200,
    status: 'refunded',
    placedAt: '2026-09-18',
  },
  {
    id: 'KS-2036',
    customer: 'Shakib Alam',
    email: 'shakib@example.com',
    items: 2,
    total: 9800,
    status: 'paid',
    placedAt: '2026-09-18',
  },
];

export const dashboardStats = {
  revenue: 486200,
  orders: orders.length,
  unitsSold: 74,
  returningRate: 38,
  /** Last 12 weeks, newest last. Drives the dashboard sparkline. */
  weeklyRevenue: [21, 26, 24, 31, 29, 36, 34, 41, 38, 46, 44, 52],
};
