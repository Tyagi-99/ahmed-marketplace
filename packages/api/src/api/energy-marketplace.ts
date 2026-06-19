export type EnergyProductCategory =
  | "battery"
  | "solar_panel"
  | "inverter"
  | "ev_charger"
  | "accessory"
  | "bundle";

export type BuyingMode = "direct_checkout" | "rfq" | "installation_survey";

export type RfqStatus =
  | "submitted"
  | "assigned"
  | "vendor_quoted"
  | "admin_review"
  | "customer_approved"
  | "converted_to_order"
  | "closed";

export type ServiceRequestStatus =
  | "submitted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "warranty_active"
  | "closed";

export const launchRegion = {
  country_code: "in",
  currency_code: "inr",
  region_name: "India",
  launch_market: "Uttar Pradesh",
  operating_city: "Meerut",
  payment_provider: "razorpay",
};

export const rfqLifecycle: RfqStatus[] = [
  "submitted",
  "assigned",
  "vendor_quoted",
  "admin_review",
  "customer_approved",
  "converted_to_order",
  "closed",
];

export const serviceLifecycle: ServiceRequestStatus[] = [
  "submitted",
  "scheduled",
  "in_progress",
  "completed",
  "warranty_active",
  "closed",
];

export const energyCategories: Array<{
  handle: EnergyProductCategory;
  name: string;
  buying_modes: BuyingMode[];
  required_specs: string[];
}> = [
  {
    handle: "battery",
    name: "Batteries",
    buying_modes: ["direct_checkout", "rfq", "installation_survey"],
    required_specs: [
      "capacity_kwh",
      "voltage",
      "chemistry",
      "backup_time_hours",
      "cycle_life",
      "warranty_years",
    ],
  },
  {
    handle: "solar_panel",
    name: "Solar Panels",
    buying_modes: ["rfq", "installation_survey"],
    required_specs: [
      "wattage",
      "panel_type",
      "efficiency_percent",
      "dimensions",
      "warranty_years",
    ],
  },
  {
    handle: "inverter",
    name: "Inverters",
    buying_modes: ["direct_checkout", "rfq", "installation_survey"],
    required_specs: [
      "capacity_kva",
      "phase",
      "battery_compatibility",
      "warranty_years",
    ],
  },
  {
    handle: "ev_charger",
    name: "EV Chargers",
    buying_modes: ["rfq", "installation_survey"],
    required_specs: ["connector_type", "power_kw", "phase", "warranty_years"],
  },
  {
    handle: "accessory",
    name: "Energy Accessories",
    buying_modes: ["direct_checkout"],
    required_specs: ["compatibility", "warranty_months"],
  },
  {
    handle: "bundle",
    name: "Solar + Backup Bundles",
    buying_modes: ["rfq", "installation_survey"],
    required_specs: [
      "panel_capacity_kw",
      "battery_capacity_kwh",
      "inverter_capacity_kva",
      "installation_required",
    ],
  },
];

export const productFilters = [
  "brand",
  "price",
  "rating",
  "capacity",
  "warranty",
  "use_case",
  "vendor",
  "availability",
  "installation_available",
];

export const fulfillmentStatuses = [
  "quote_received",
  "payment_pending",
  "packed",
  "dispatched",
  "installed",
  "service_completed",
  "warranty_active",
];

export const vendorOnboarding = {
  mode: "manual_approval",
  required_documents: [
    "business_registration",
    "gst_number",
    "bank_account",
    "brand_authorization_or_distributor_proof",
    "service_coverage_pincodes",
  ],
};

export const rfqRequiredFields = [
  "customer_name",
  "phone",
  "email",
  "customer_type",
  "product_category",
  "quantity",
  "delivery_city",
  "delivery_pincode",
  "installation_required",
];

export const serviceRequiredFields = [
  "customer_name",
  "phone",
  "service_type",
  "product_category",
  "city",
  "pincode",
];

export function missingFields(
  body: Record<string, unknown>,
  requiredFields: string[]
) {
  return requiredFields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === "";
  });
}

export function makeReference(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now()}-${random}`;
}
