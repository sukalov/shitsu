import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const encoder = new TextEncoder();

async function hashPassword(password: string): Promise<string> {
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export const setupAdmin = mutation({
  args: { password: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const existingAdmins = await ctx.db.query("admins").collect();
    if (existingAdmins.length > 0) {
      throw new Error("Admin already exists. Use login to authenticate.");
    }

    const passwordHash = await hashPassword(args.password);
    await ctx.db.insert("admins", {
      passwordHash,
      createdAt: Date.now(),
    });
    return true;
  },
});

export const login = mutation({
  args: { password: v.string() },
  returns: v.object({
    success: v.boolean(),
    token: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const admins = await ctx.db.query("admins").collect();
    if (admins.length === 0) {
      return { success: false };
    }

    const admin = admins[0];
    const isValid = await verifyPassword(args.password, admin.passwordHash);

    if (isValid) {
      const token = await hashPassword(args.password + Date.now());
      return { success: true, token };
    }

    return { success: false };
  },
});

export const changePassword = mutation({
  args: { currentPassword: v.string(), newPassword: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const admins = await ctx.db.query("admins").collect();
    if (admins.length === 0) {
      throw new Error("No admin exists. Run setup first.");
    }

    const admin = admins[0];
    const isValid = await verifyPassword(
      args.currentPassword,
      admin.passwordHash,
    );

    if (!isValid) {
      throw new Error("Current password is incorrect.");
    }

    const newHash = await hashPassword(args.newPassword);
    await ctx.db.patch("admins", admin._id, { passwordHash: newHash });
    return true;
  },
});

export const checkAdminExists = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const admins = await ctx.db.query("admins").collect();
    return admins.length > 0;
  },
});
