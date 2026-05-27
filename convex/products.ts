import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

export function resolveMerchSubcategorySlug(
  _ctx: QueryCtx,
  p: Doc<"products">,
): string | undefined {
  return p.merchSubcategorySlug ?? undefined;
}

const productReturnValidator = v.object({
  _id: v.id("products"),
  _creationTime: v.number(),
  name: v.string(),
  price: v.number(),
  category: v.union(v.literal("originals"), v.literal("merch")),
  images: v.array(v.string()),
  description: v.string(),
  isSold: v.boolean(),
  seriesId: v.optional(v.string()),
  merchSubcategorySlug: v.optional(v.string()),
  createdAt: v.number(),
});

export const listProducts = query({
  args: {
    category: v.optional(v.union(v.literal("originals"), v.literal("merch"))),
    isSold: v.optional(v.boolean()),
  },
  returns: v.array(
    v.object({
      _id: v.id("products"),
      _creationTime: v.number(),
      name: v.string(),
      price: v.number(),
      category: v.union(v.literal("originals"), v.literal("merch")),
      images: v.array(v.string()),
      description: v.string(),
      isSold: v.boolean(),
      seriesId: v.optional(v.string()),
      merchSubcategorySlug: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    // Use indexes to avoid full table scans + large payloads.
    let products;
    if (args.category && args.isSold !== undefined) {
      products = await ctx.db
        .query("products")
        .withIndex("by_category_and_isSold", (q) =>
          q.eq("category", args.category!).eq("isSold", args.isSold!),
        )
        .order("desc")
        .collect();
    } else if (args.category) {
      products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .collect();
      if (args.isSold !== undefined) {
        products = products.filter((p) => p.isSold === args.isSold);
      }
    } else if (args.isSold !== undefined) {
      products = await ctx.db
        .query("products")
        .withIndex("by_isSold", (q) => q.eq("isSold", args.isSold!))
        .order("desc")
        .collect();
    } else {
      products = await ctx.db.query("products").order("desc").collect();
    }

    return products.map((p) => {
      const { merchSubcategoryId: _id, ...rest } = p;
      return {
        ...rest,
        merchSubcategorySlug: resolveMerchSubcategorySlug(ctx, p),
      };
    });
  },
});

export const getProduct = query({
  args: { id: v.string() },
  returns: v.union(v.null(), productReturnValidator),
  handler: async (ctx, args) => {
    const productId = ctx.db.normalizeId("products", args.id);
    if (!productId) return null;

    const p = await ctx.db.get("products", productId);
    if (!p) return null;
    const { merchSubcategoryId: _id, ...rest } = p;
    return {
      ...rest,
      merchSubcategorySlug: resolveMerchSubcategorySlug(ctx, p),
    };
  },
});

export const getProductsBySeries = query({
  args: { seriesId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("products"),
      _creationTime: v.number(),
      name: v.string(),
      price: v.number(),
      category: v.union(v.literal("originals"), v.literal("merch")),
      images: v.array(v.string()),
      description: v.string(),
      isSold: v.boolean(),
      seriesId: v.optional(v.string()),
      merchSubcategorySlug: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_series", (q) => q.eq("seriesId", args.seriesId))
      .collect();
    return products.map((p) => {
      const { merchSubcategoryId: _id, ...rest } = p;
      return {
        ...rest,
        merchSubcategorySlug: resolveMerchSubcategorySlug(ctx, p),
      };
    });
  },
});

export const createProduct = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    category: v.union(v.literal("originals"), v.literal("merch")),
    images: v.array(v.string()),
    description: v.string(),
    isSold: v.boolean(),
    seriesId: v.optional(v.string()),
    merchSubcategorySlug: v.optional(v.string()),
  },
  returns: v.id("products"),
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("products", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.union(v.literal("originals"), v.literal("merch"))),
    images: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    isSold: v.optional(v.boolean()),
    seriesId: v.optional(v.string()),
    merchSubcategorySlug: v.optional(v.string()),
  },
  returns: v.id("products"),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    // Clear legacy field so we use slug only
    await ctx.db.patch("products", id, {
      ...updates,
      merchSubcategoryId: undefined,
    });
    return id;
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const product = await ctx.db.get("products", args.id);
    if (product) {
      for (const image of product.images) {
        if (!image.startsWith("http")) {
          await ctx.storage.delete(image as Id<"_storage">);
        }
      }
    }
    await ctx.db.delete("products", args.id);
    return null;
  },
});

export const getImageUrls = query({
  args: { storageIds: v.array(v.string()) },
  returns: v.array(v.string()),
  handler: async (ctx, args) => {
    const urls: string[] = [];
    for (const storageId of args.storageIds) {
      if (storageId.startsWith("http")) {
        urls.push(storageId);
      } else {
        const url = await ctx.storage.getUrl(storageId as Id<"_storage">);
        urls.push(url || "");
      }
    }
    return urls;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const deleteImage = mutation({
  args: { storageId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (!args.storageId.startsWith("http")) {
      await ctx.storage.delete(args.storageId as Id<"_storage">);
    }
    return null;
  },
});

export const getAllSeries = query({
  args: {},
  returns: v.array(
    v.object({
      seriesId: v.string(),
      products: v.array(
        v.object({
          _id: v.id("products"),
          name: v.string(),
        }),
      ),
    }),
  ),
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const seriesMap = new Map<string, typeof products>();

    for (const product of products) {
      if (product.seriesId) {
        const existing = seriesMap.get(product.seriesId) || [];
        existing.push(product);
        seriesMap.set(product.seriesId, existing);
      }
    }

    return Array.from(seriesMap.entries()).map(([seriesId, products]) => ({
      seriesId,
      products: products.map((p) => ({ _id: p._id, name: p.name })),
    }));
  },
});
