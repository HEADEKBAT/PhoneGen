/**
 * Platform Registry — global registry for all GenCore products and tools.
 *
 * This is the CENTRAL source of truth for the platform. Every product and
 * tool registers itself here. The registry then drives:
 *   - Routing (via Page Factory)
 *   - SEO metadata generation
 *   - Sitemap generation
 *   - Navigation (header, product grids)
 *   - Related-tool recommendations
 *   - Search (Ctrl+K)
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 *
 *   import { defineTool } from '@/core';
 *
 *   export const myTool = defineTool({ ... });
 *   // defineTool auto-registers the tool.
 *
 * ── Backward compatibility ────────────────────────────────────────────────────
 *
 * Existing configs in `lib/config/products.ts` and `lib/config/generators.ts`
 * remain untouched. The registry supplements them by seeding existing product
 * entries on first access. Once all tools migrate to the manifest format, those
 * configs can derive from the registry.
 */

import type { ToolManifest, ProductManifest } from './types';
import { ALL_PRODUCTS } from '@/lib/config/products';

/* ─────────────────────────────────────────────────────────────────────────────
 *  Registry class
 * ───────────────────────────────────────────────────────────────────────────── */

class PlatformRegistry {
  /* ── Internal stores ─────────────────────────────────────────────────── */

  private readonly _tools = new Map<string, ToolManifest>();
  private readonly _products = new Map<string, ProductManifest>();

  /* ── Registration ────────────────────────────────────────────────────── */

  /** Register a tool. Warns on duplicate ID. Returns the same reference. */
  registerTool(tool: ToolManifest): ToolManifest {
    if (this._tools.has(tool.id)) {
      if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.warn(`[Core] Tool "${tool.id}" already registered — overwriting`);
      }
    }
    this._tools.set(tool.id, tool);
    return tool;
  }

  /** Register a product. Warns on duplicate ID. */
  registerProduct(product: ProductManifest): ProductManifest {
    if (this._products.has(product.id)) {
      if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.warn(`[Core] Product "${product.id}" already registered — overwriting`);
      }
    }
    this._products.set(product.id, product);
    return product;
  }

  /* ── Lookups ─────────────────────────────────────────────────────────── */

  /** Get a tool by its unique ID. */
  getTool(id: string): ToolManifest | undefined {
    return this._tools.get(id);
  }

  /** Get a product by its unique ID. */
  getProduct(id: string): ProductManifest | undefined {
    return this._products.get(id);
  }

  /** Get a product by its URL slug. */
  getProductBySlug(slug: string): ProductManifest | undefined {
    for (const product of this._products.values()) {
      if (product.slug === slug) return product;
    }
    return undefined;
  }

  /** All registered products (sorted by name). */
  getAllProducts(): ProductManifest[] {
    return Array.from(this._products.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  /** Active products (status = active or beta). */
  getActiveProducts(): ProductManifest[] {
    return this.getAllProducts().filter(
      (p) => p.status === 'active' || p.status === 'beta',
    );
  }

  /** All registered tools (sorted by name). */
  getAllTools(): ToolManifest[] {
    return Array.from(this._tools.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  /** Active tools (status check delegated to product — all registered tools are active). */
  getActiveTools(): ToolManifest[] {
    return this.getAllTools();
  }

  /** Get all tools belonging to a product. */
  getToolsByProduct(productId: string): ToolManifest[] {
    return this.getAllTools().filter((t) => t.product === productId);
  }

  /** Get tools filtered by product category. */
  getToolsByCategory(category: string): ToolManifest[] {
    return this.getAllTools().filter((t) => {
      const product = this.getProduct(t.product);
      return product?.category === category;
    });
  }

  /** Get tools related to a given tool (same product, excluding self). */
  getRelatedTools(toolId: string): ToolManifest[] {
    const tool = this.getTool(toolId);
    if (!tool) return [];
    return this.getToolsByProduct(tool.product).filter((t) => t.id !== toolId);
  }

  /* ── Registration helpers ────────────────────────────────────────────── */

  /** Register multiple tools at once. */
  registerTools(tools: ToolManifest[]): void {
    for (const tool of tools) {
      this.registerTool(tool);
    }
  }

  /** Register multiple products at once. */
  registerProducts(products: ProductManifest[]): void {
    for (const product of products) {
      this.registerProduct(product);
    }
  }

  /* ── Seeding from existing configs ────────────────────────────────────── */

  /**
   * Seed the registry from the existing `lib/config/products.ts` entries.
   * This ensures backward compatibility while we migrate to manifests.
   */
  seedFromExistingProducts(
    products: Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
      icon: string;
      category: string;
      status: string;
      featured: boolean;
      supportedLocales: string[];
      hasCountries: boolean;
      seoPriority: number;
      themeColor?: string;
    }>,
  ): void {
    for (const p of products) {
      if (this._products.has(p.id)) continue; // don't overwrite manifest-registered
      this._products.set(p.id, {
        id: p.id,
        slug: p.slug,
        name: p.title,
        description: p.description,
        icon: p.icon,
        category: p.category,
        status: p.status as ProductManifest['status'],
        featured: p.featured,
        supportedLocales: p.supportedLocales,
        hasCountries: p.hasCountries,
        seoPriority: p.seoPriority,
        themeColor: p.themeColor,
      });
    }
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
 *  Singleton instance
 * ───────────────────────────────────────────────────────────────────────────── */

export const registry = new PlatformRegistry();

/* ─────────────────────────────────────────────────────────────────────────────
 *  Helper functions
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * Create a validated ToolManifest and auto-register it.
 * Throws during dev if required fields are missing.
 */
export function defineTool(config: ToolManifest): ToolManifest {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    if (!config.id) throw new Error('[Core] Tool manifest must have an id');
    if (!config.product) throw new Error(`[Core] Tool "${config.id}" must have a product`);
    if (!config.name) throw new Error(`[Core] Tool "${config.id}" must have a name`);
    if (!config.seo?.meta?.en) throw new Error(`[Core] Tool "${config.id}" must have English SEO metadata`);
    if (!config.ui?.component) throw new Error(`[Core] Tool "${config.id}" must have a UI component`);
    if (!config.ui?.icon) throw new Error(`[Core] Tool "${config.id}" must have a UI icon`);
  }
  registry.registerTool(config);
  return config;
}

/**
 * Create a validated ProductManifest.
 */
export function defineProduct(config: ProductManifest): ProductManifest {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    if (!config.id) throw new Error('[Core] Product manifest must have an id');
    if (!config.slug) throw new Error('[Core] Product manifest must have a slug');
    if (!config.name) throw new Error('[Core] Product manifest must have a name');
  }
  return config;
}

/* ─────────────────────────────────────────────────────────────────────────────
 *  Module-level init — seed existing products from legacy configs
 *  so tools registered via defineTool() can resolve their parent product.
 * ───────────────────────────────────────────────────────────────────────────── */

// Seed eagerly on first import — products are needed before tools register
registry.seedFromExistingProducts(ALL_PRODUCTS);
