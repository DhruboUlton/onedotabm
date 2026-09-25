/**
 * Shared types for the WebApp Demo showcase.
 *
 * These describe demos to the showcase (listing pages, metadata, routing).
 * They deliberately say nothing about how a demo is built — each demo owns its
 * own components, data and visual language.
 */

export interface DemoCategory {
  /** URL segment, e.g. "ecommerce" -> /webapp-demo/ecommerce */
  slug: string;
  name: string;
  /** One line, shown on the category card. Keep it short. */
  description: string;
  /** lucide-react icon name, resolved by the showcase UI. */
  icon: DemoIconName;
}

/**
 * Icons the showcase can render. Kept as a union rather than an open string so
 * a typo in a registry entry is a build error, not a blank card.
 */
export type DemoIconName =
  | 'shopping-bag'
  | 'users'
  | 'pen-tool'
  | 'building'
  | 'layout-grid'
  | 'graduation-cap'
  | 'utensils'
  | 'calendar'
  | 'cloud'
  | 'shapes';

export interface DemoMeta {
  /** URL segment within the category, e.g. "demo-01" */
  slug: string;
  /** Category slug this demo belongs to. */
  category: string;
  /** Fictional business name shown in the showcase and inside the demo. */
  name: string;
  /** One or two lines for the demo card. */
  description: string;
  /** Short feature labels, e.g. ["Cart", "Search", "Admin"]. */
  tags: string[];
  /** Whether /admin exists for this demo. Drives the "View Admin Panel" CTA. */
  hasAdmin: boolean;
  /**
   * The card preview. `from`/`to` are the gradient behind the device, and are
   * always required so a demo without a screenshot still gets a distinct card.
   * `image` is a screenshot of the demo's home page, shown inside a laptop
   * frame; it lives in /public and is referenced by absolute path, e.g.
   * "/demo-assets/ecommerce/demo-01-preview.jpg".
   */
  preview: { from: string; to: string; image?: string };
}
