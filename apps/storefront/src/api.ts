import type { ProductResponse, ProductsResponse } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function fetchProducts(category?: string): Promise<ProductsResponse> {
  const params = category ? `?category=${category}` : "";
  const response = await fetch(`${API_BASE}/energy/products${params}`);

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json();
}

export async function fetchProduct(id: string): Promise<ProductResponse> {
  const response = await fetch(`${API_BASE}/energy/products/${id}`);

  if (!response.ok) {
    throw new Error("Product not found");
  }

  return response.json();
}

export async function submitRfq(payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}/energy/rfq`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "rfq", ...payload }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to submit quote request");
  }

  return data;
}