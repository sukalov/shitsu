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
      order: v.optional(v.number()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const rows = await ctx.db.query("merchSubcategories").collect();
    return rows.sort((a, b) => {
      const ao = a.order ?? Number.POSITIVE_INFINITY;
      const bo = b.order ?? Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;
      return (a.createdAt ?? 0) - (b.createdAt ?? 0);
    });
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
      .withIndex("by_slug", (q) => q.eq("slug", normalizedSlug))
      .unique();

    if (existing) {
      throw new Error("Подкатегория с таким slug уже существует");
    }

    const existingRows = await ctx.db.query("merchSubcategories").collect();
    const maxOrder = existingRows.reduce(
      (acc, row) => Math.max(acc, row.order ?? -1),
      -1,
    );

    const id = await ctx.db.insert("merchSubcategories", {
      name: args.name,
      slug: normalizedSlug,
      order: maxOrder + 1,
      createdAt: Date.now(),
    });

    return id;
  },
});

export const updateMerchSubcategoryOrder = mutation({
  args: {
    orderedIds: v.array(v.id("merchSubcategories")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    for (let i = 0; i < args.orderedIds.length; i++) {
      const id = args.orderedIds[i];
      if (!id) continue;
      await ctx.db.patch("merchSubcategories", id, { order: i });
    }
    return null;
  },
});

export const deleteMerchSubcategory = mutation({
  args: {
    id: v.id("merchSubcategories"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const subcategory = await ctx.db.get("merchSubcategories", args.id);
    if (!subcategory) {
      return null;
    }

    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", "merch"))
      .collect();

    for (const product of products) {
      if (product.merchSubcategorySlug === subcategory.slug) {
        await ctx.db.patch("products", product._id, {
          merchSubcategorySlug: undefined,
        });
      }
    }

    await ctx.db.delete("merchSubcategories", args.id);
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
      .withIndex("by_category_and_merchSubcategorySlug", (q) =>
        q.eq("category", "merch").eq("merchSubcategorySlug", args.subcategorySlug),
      )
      .order("desc")
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

