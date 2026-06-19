declare const __BACKEND_URL__: string;

export type EnergyProductInput = {
  id: string;
  title: string;
  slug: string;
  category: string;
  brand: string;
  vendor: string;
  price_inr: number | null;
  rating: number;
  review_count: number;
  buying_modes: string[];
  primary_action: string;
  availability: string;
  use_case: string;
  thumbnail_color: string;
  image_url?: string;
  description: string;
  specs: Record<string, string | number>;
  installation_available: boolean;
  warranty_years: number;
};

const baseUrl = __BACKEND_URL__;

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data.message === "string" ? data.message : "Request failed"
    );
  }

  return data as T;
}

export async function uploadProductImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${baseUrl}/admin/energy/products/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return parseResponse<{ url: string; filename: string }>(response);
}

export async function createEnergyProduct(
  payload: Record<string, unknown>
) {
  const response = await fetch(`${baseUrl}/admin/energy/products`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ product: EnergyProductInput }>(response);
}

export async function deleteEnergyProduct(id: string) {
  const response = await fetch(`${baseUrl}/admin/energy/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return parseResponse<{ id: string; deleted: boolean }>(response);
}