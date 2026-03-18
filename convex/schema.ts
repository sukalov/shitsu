import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  products: defineTable({
    name: v.string(),
    price: v.number(),
    category: v.union(v.literal("originals"), v.literal("merch")),
    images: v.array(v.string()),
    description: v.string(),
    isSold: v.boolean(),
    seriesId: v.optional(v.string()),
    merchSubcategorySlug: v.optional(v.string()),
    // Legacy: kept optional so existing docs validate; clear when updating (use slug only)
    merchSubcategoryId: v.optional(v.id("merchSubcategories")),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_series", ["seriesId"])
    .index("by_created", ["createdAt"]),

  merchSubcategories: defineTable({
    name: v.string(),
    slug: v.string(),
    order: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"])
    .index("by_created", ["createdAt"]),

  orders: defineTable({
    customerName: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    deliveryMethod: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      }),
    ),
    total: v.number(),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("shipped"),
        v.literal("delivered"),
        v.literal("cancelled"),
      ),
    ),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  admins: defineTable({
    passwordHash: v.string(),
    createdAt: v.number(),
  }),
});
