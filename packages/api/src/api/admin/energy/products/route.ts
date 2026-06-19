import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import type { BuyingMode, EnergyProductCategory } from "../../../energy-marketplace";
import type { SampleProduct } from "../../../../data/sample-products";
import {
  createProduct,
  listProducts,
  makeProductId,
  slugify,
} from "../../../../lib/product-store";

const categories: Record<EnergyProductCategory, string> = {
  battery: "Batteries",
  solar_panel: "Solar Panels",
  inverter: "Inverters",
  ev_charger: "EV Chargers",
  accessory: "Energy Accessories",
  bundle: "Solar + Backup Bundles",
};

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  const products = listProducts();
  res.json({ count: products.length, products });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body ?? {}) as Record<string, unknown>;

  const title = String(body.title ?? "").trim();
  const category = body.category as EnergyProductCategory;

  if (!title || !category || !categories[category]) {
    res.status(400).json({
      message: "title and a valid category are required",
    });
    return;
  }

  const slug = slugify(String(body.slug || title));
  const id = String(body.id || makeProductId(title));

  const product: SampleProduct = {
    id,
    title,
    slug,
    category,
    category_label: categories[category],
    brand: String(body.brand ?? "Generic"),
    vendor: String(body.vendor ?? "Platform Vendor"),
    price_inr:
      body.price_inr === null || body.price_inr === ""
        ? null
        : Number(body.price_inr),
    rating: Number(body.rating ?? 4),
    review_count: Number(body.review_count ?? 0),
    buying_modes: (body.buying_modes as BuyingMode[]) ?? ["rfq"],
    primary_action:
      (body.primary_action as SampleProduct["primary_action"]) ?? "request_quote",
    availability:
      (body.availability as SampleProduct["availability"]) ?? "rfq_only",
    use_case: String(body.use_case ?? "General"),
    thumbnail_color: String(body.thumbnail_color ?? "#334155"),
    image_url: body.image_url ? String(body.image_url) : undefined,
    description: String(body.description ?? ""),
    specs:
      typeof body.specs === "object" && body.specs !== null
        ? (body.specs as Record<string, string | number>)
        : {},
    installation_available: Boolean(body.installation_available),
    warranty_years: Number(body.warranty_years ?? 1),
  };

  try {
    const created = createProduct(product);
    res.status(201).json({ product: created });
  } catch (error) {
    res.status(409).json({
      message: error instanceof Error ? error.message : "Could not create product",
    });
  }
}