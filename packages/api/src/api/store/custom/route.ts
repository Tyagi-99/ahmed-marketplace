import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { listProducts } from "../../../lib/product-store";
import {
  energyCategories,
  fulfillmentStatuses,
  launchRegion,
  makeReference,
  missingFields,
  productFilters,
  rfqLifecycle,
  rfqRequiredFields,
  serviceLifecycle,
  serviceRequiredFields,
} from "../../energy-marketplace";

export async function GET(
  _req: MedusaRequest,
  res: MedusaResponse
) {
  res.json({
    marketplace: {
      name: "Tyagi Energy Marketplace",
      launch_region: launchRegion,
      customer_segments: ["b2c", "b2b"],
      buying_modes: ["direct_checkout", "rfq", "installation_survey"],
    },
    catalog: {
      categories: energyCategories,
      filters: productFilters,
      products: listProducts(),
      product_count: listProducts().length,
    },
    workflows: {
      rfq: rfqLifecycle,
      service: serviceLifecycle,
      fulfillment: fulfillmentStatuses,
    },
  });
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const requestType = body.type;

  if (requestType === "rfq") {
    const missing = missingFields(body, rfqRequiredFields);

    if (missing.length) {
      res.status(400).json({
        message: "Missing required RFQ fields",
        missing,
      });
      return;
    }

    res.status(202).json({
      rfq: {
        id: makeReference("RFQ"),
        status: "submitted",
        lifecycle: rfqLifecycle,
        next_step:
          "Admin reviews the request, assigns matching vendors, and prepares the customer quote.",
        submitted: body,
      },
    });
    return;
  }

  if (requestType === "service_request") {
    const missing = missingFields(body, serviceRequiredFields);

    if (missing.length) {
      res.status(400).json({
        message: "Missing required service request fields",
        missing,
      });
      return;
    }

    res.status(202).json({
      service_request: {
        id: makeReference("SRV"),
        status: "submitted",
        lifecycle: serviceLifecycle,
        next_step:
          "Operations team schedules survey, installation, repair, or warranty support.",
        submitted: body,
      },
    });
    return;
  }

  res.status(400).json({
    message: "Unsupported request type",
    supported_types: ["rfq", "service_request"],
  });
}
