import { useQuery, useMutation } from "convex/react";
import { useSyncExternalStore } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

function getAdminToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("adminToken")
    : null;
}

const emptySubscribe = () => () => {};

export function useAuth() {
  return useSyncExternalStore(emptySubscribe, getAdminToken, () => null);
}

export type Category = "originals" | "merch";

export interface Product {
  _id: Id<"products">;
  _creationTime: number;
  name: string;
  price: number;
  category: Category;
  subcategory?: string;
  images: string[];
  description: string;
  isSold: boolean;
  seriesId?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function useProducts(category?: Category, isSold?: boolean) {
  return useQuery(api.products.listProducts, { category, isSold });
}

export function useProduct(id: Id<"products"> | string | undefined) {
  return useQuery(api.products.getProduct, { id: id as Id<"products"> });
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

export function useCreateOrder() {
  return useMutation(api.orders.createOrder);
}

export function useOrders(status?: string) {
  return useQuery(api.orders.listOrders, {
    status: status as
      | "pending"
      | "confirmed"
      | "shipped"
      | "delivered"
      | "cancelled"
      | undefined,
  });
}

export function useOrder(id: Id<"orders"> | string | undefined) {
  return useQuery(api.orders.getOrder, { id: id as Id<"orders"> });
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

export function useGenerateUploadUrl() {
  return useMutation(api.products.generateUploadUrl);
}
