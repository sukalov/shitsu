import { useCallback, useSyncExternalStore } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import type { Category, OrderStatus } from "./types";

const AUTH_KEY = "adminToken";

function subscribeToAuth(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === AUTH_KEY) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getAuthSnapshot() {
  return localStorage.getItem(AUTH_KEY);
}

export function useAuth() {
  return useSyncExternalStore(subscribeToAuth, getAuthSnapshot, () => null);
}

export function useSetAuth() {
  return useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem(AUTH_KEY, token);
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
    // Dispatch storage event for same-tab reactivity
    window.dispatchEvent(
      new StorageEvent("storage", { key: AUTH_KEY, newValue: token }),
    );
  }, []);
}

// Products
export function useProducts(category?: Category, isSold?: boolean) {
  return useQuery(api.products.listProducts, { category, isSold });
}

export function useMerchProductsBySubcategory(subcategorySlug: string | null) {
  return useQuery(
    api.merchSubcategories.listMerchProductsBySubcategory,
    subcategorySlug ? { subcategorySlug } : "skip",
  );
}

export function useProduct(id: string | undefined) {
  return useQuery(
    api.products.getProduct,
    id ? { id: id as Id<"products"> } : "skip",
  );
}

export function useProductsBySeries(seriesId: string) {
  return useQuery(api.products.getProductsBySeries, { seriesId });
}

export function useAllSeries() {
  return useQuery(api.products.getAllSeries);
}

export function useCreateProduct() {
  return useMutation(api.products.createProduct);
}

export function useUpdateProduct() {
  return useMutation(api.products.updateProduct);
}

export function useDeleteProduct() {
  return useMutation(api.products.deleteProduct);
}

export function useGenerateUploadUrl() {
  return useMutation(api.products.generateUploadUrl);
}

export function useDeleteImage() {
  return useMutation(api.products.deleteImage);
}

// Merch subcategories
export function useMerchSubcategories() {
  return useQuery(api.merchSubcategories.listMerchSubcategories, {});
}

export function useCreateMerchSubcategory() {
  return useMutation(api.merchSubcategories.createMerchSubcategory);
}

export function useDeleteMerchSubcategory() {
  return useMutation(api.merchSubcategories.deleteMerchSubcategory);
}

// Orders
export function useCreateOrder() {
  return useMutation(api.orders.createOrder);
}

export function useOrders(status?: string) {
  return useQuery(api.orders.listOrders, {
    status: status as OrderStatus | undefined,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery(
    api.orders.getOrder,
    id ? { id: id as Id<"orders"> } : "skip",
  );
}

export function useUpdateOrderStatus() {
  return useMutation(api.orders.updateOrderStatus);
}

export function useDeleteOrder() {
  return useMutation(api.orders.deleteOrder);
}

export function useOrderCount() {
  return useQuery(api.orders.getOrderCount);
}

// Admin
export function useAdminExists() {
  return useQuery(api.admin.checkAdminExists);
}

export function useLogin() {
  return useMutation(api.admin.login);
}

export function useSetupAdmin() {
  return useMutation(api.admin.setupAdmin);
}

export function useChangePassword() {
  return useMutation(api.admin.changePassword);
}
