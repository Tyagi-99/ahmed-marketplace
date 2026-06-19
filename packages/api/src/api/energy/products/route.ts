import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { launchRegion } from "../../energy-marketplace";
import { listProducts } from "../../../lib/product-store";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const category = req.query.category as string | undefined;
  const products = listProducts(category);

  res.json({
    count: products.length,
    marketplace: {
      name: "Tyagi Energy Marketplace",
      launch_region: launchRegion,
    },
    products,
  });
}