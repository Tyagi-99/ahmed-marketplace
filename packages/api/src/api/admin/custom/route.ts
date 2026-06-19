import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { listProducts } from "../../../lib/product-store";
import {
  energyCategories,
  fulfillmentStatuses,
  launchRegion,
  productFilters,
  rfqLifecycle,
  serviceLifecycle,
  vendorOnboarding,
} from "../../energy-marketplace";

export async function GET(
  _req: MedusaRequest,
  res: MedusaResponse
) {
  res.json({
    marketplace: {
      name: "Tyagi Energy Marketplace",
      model: "multi-vendor_b2b_b2c",
      launch_region: launchRegion,
      fulfillment_owner: "platform_managed",
      payment_provider: "razorpay",
    },
    vendor_onboarding: vendorOnboarding,
    operations: {
      rfq_lifecycle: rfqLifecycle,
      service_lifecycle: serviceLifecycle,
      fulfillment_statuses: fulfillmentStatuses,
      admin_controls: [
        "vendor_approval",
        "vendor_commission",
        "rfq_assignment",
        "quote_approval",
        "payout_hold",
        "returns",
        "warranty_claims",
        "service_escalations",
      ],
    },
    catalog: {
      categories: energyCategories,
      filters: productFilters,
      products: listProducts(),
      product_count: listProducts().length,
    },
  });
}
