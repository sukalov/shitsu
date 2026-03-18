import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { resolveMerchSubcategorySlug } from "./products";

export const listMerchSubcategories = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("merchSubcategories"),
      _creationTime: v.number(),
      name: v.string(),
      slug: v.string(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("merchSubcategories").order("desc").collect();
  },
});

export const createMerchSubcategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  returns: v.id("merchSubcategories"),
  handler: async (ctx, args) => {
    const normalizedSlug = args.slug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    const existing = await ctx.db
      .query("merchSubcategories")
      .withIndex("by_slug")
      .filter((q) => q.eq(q.field("slug"), normalizedSlug))
      .unique();

    if (existing) {
      throw new Error("Подкатегория с таким slug уже существует");
    }

    const id = await ctx.db.insert("merchSubcategories", {
      name: args.name,
      slug: normalizedSlug,
      createdAt: Date.now(),
    });

    return id;
  },
});

export const deleteMerchSubcategory = mutation({
  args: {
    id: v.id("merchSubcategories"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const subcategory = await ctx.db.get(args.id);
    if (!subcategory) {
      return null;
    }

    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", "merch"))
      .collect();

    for (const product of products) {
      if (product.merchSubcategorySlug === subcategory.slug) {
        await ctx.db.patch(product._id, { merchSubcategorySlug: undefined });
      }
    }

    await ctx.db.delete(args.id);
    return null;
  },
});

export const listMerchProductsBySubcategory = query({
  args: {
    subcategorySlug: v.string(),
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
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", "merch"))
      .collect();

    return products
      .filter(
        (product) =>
          resolveMerchSubcategorySlug(ctx, product) === args.subcategorySlug,
      )
      .map((p) => {
        const { merchSubcategoryId: _id, ...rest } = p;
        return {
          ...rest,
          merchSubcategorySlug: resolveMerchSubcategorySlug(ctx, p),
        };
      });
  },
});

