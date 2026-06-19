import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  makeReference,
  missingFields,
  rfqLifecycle,
  rfqRequiredFields,
} from "../../energy-marketplace";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body ?? {}) as Record<string, unknown>;
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
}