import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: {
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
  },
  returns: v.id("orders"),
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("orders", {
      customerName: args.customerName,
      phone: args.phone,
      email: args.email,
      address: args.address,
      deliveryMethod: args.deliveryMethod,
      items: args.items,
      total: args.total,
      status: "pending",
      createdAt: Date.now(),
    });
    return id;
  },
});

export const listOrders = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("shipped"),
        v.literal("delivered"),
        v.literal("cancelled"),
      ),
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id("orders"),
      _creationTime: v.number(),
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
    }),
  ),
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("orders")
        .withIndex("by_status")
        .filter((q) => q.eq(q.field("status"), args.status))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const getOrder = query({
  args: { id: v.id("orders") },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db.get("orders", args.id);
  },
});

export const updateOrderStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
    ),
  },
  returns: v.id("orders"),
  handler: async (ctx, args) => {
    await ctx.db.patch("orders", args.id, { status: args.status });
    return args.id;
  },
});

export const deleteOrder = mutation({
  args: { id: v.id("orders") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete("orders", args.id);
    return null;
  },
});

export const getOrderCount = query({
  args: {},
  returns: v.object({
    pending: v.number(),
    confirmed: v.number(),
    shipped: v.number(),
    delivered: v.number(),
    cancelled: v.number(),
    total: v.number(),
  }),
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    return {
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      total: orders.length,
    };
  },
});
