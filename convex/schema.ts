import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  products: defineTable({
    name: v.string(),
    price: v.number(),
    category: v.union(v.literal("originals"), v.literal("merch")),
    subcategory: v.optional(v.string()),
    images: v.array(v.string()),
    description: v.string(),
    isSold: v.boolean(),
    seriesId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_series", ["seriesId"])
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
