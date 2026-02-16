import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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
      subcategory: v.optional(v.string()),
      images: v.array(v.string()),
      description: v.string(),
      isSold: v.boolean(),
      seriesId: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").order("desc").collect();

    if (args.isSold !== undefined) {
      products = products.filter((p) => p.isSold === args.isSold);
    } else if (args.category) {
      products = products.filter((p) => p.category === args.category);
    }

    return products;
  },
});

export const getProduct = query({
  args: { id: v.id("products") },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db.get("products", args.id);
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
      subcategory: v.optional(v.string()),
      images: v.array(v.string()),
      description: v.string(),
      isSold: v.boolean(),
      seriesId: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_series")
      .filter((q) => q.eq(q.field("seriesId"), args.seriesId))
      .collect();
  },
});

export const createProduct = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    category: v.union(v.literal("originals"), v.literal("merch")),
    subcategory: v.optional(v.string()),
    images: v.array(v.string()),
    description: v.string(),
    isSold: v.boolean(),
    seriesId: v.optional(v.string()),
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
    subcategory: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    isSold: v.optional(v.boolean()),
    seriesId: v.optional(v.string()),
  },
  returns: v.id("products"),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch("products", id, updates);
    return id;
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  returns: v.null(),
  handler: async (ctx, args) => {
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

export const deleteImage = internalMutation({
  args: { storageId: v.id("_storage") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
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
