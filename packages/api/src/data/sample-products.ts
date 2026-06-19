import type { BuyingMode, EnergyProductCategory } from "../api/energy-marketplace";

export type SampleProduct = {
  id: string;
  title: string;
  slug: string;
  category: EnergyProductCategory;
  category_label: string;
  brand: string;
  vendor: string;
  price_inr: number | null;
  rating: number;
  review_count: number;
  buying_modes: BuyingMode[];
  primary_action: "buy_now" | "request_quote" | "request_installation";
  availability: "in_stock" | "made_to_order" | "rfq_only";
  use_case: string;
  thumbnail_color: string;
  image_url?: string;
  description: string;
  specs: Record<string, string | number>;
  installation_available: boolean;
  warranty_years: number;
};

export const sampleProducts: SampleProduct[] = [
  {
    id: "prod-battery-luminous-5kwh",
    title: "Luminous Li-ON 5kWh Home Battery",
    slug: "luminous-li-on-5kwh-home-battery",
    category: "battery",
    category_label: "Batteries",
    brand: "Luminous",
    vendor: "PowerZone Ahmedabad",
    price_inr: 89999,
    rating: 4.6,
    review_count: 128,
    buying_modes: ["direct_checkout", "rfq", "installation_survey"],
    primary_action: "buy_now",
    availability: "in_stock",
    use_case: "Home backup",
    thumbnail_color: "#1e3a5f",
    image_url: "/images/products/luminous-battery.jpg",
    description:
      "Compact lithium battery for home backup with fast charging and long cycle life. Ideal for apartments and small offices in Ahmedabad.",
    specs: {
      capacity_kwh: 5,
      voltage: "48V",
      chemistry: "LiFePO4",
      backup_time_hours: 6,
      cycle_life: 6000,
      warranty_years: 5,
    },
    installation_available: true,
    warranty_years: 5,
  },
  {
    id: "prod-solar-tata-540w",
    title: "Tata Power Solar 540W Mono PERC Panel",
    slug: "tata-power-solar-540w-mono-perc",
    category: "solar_panel",
    category_label: "Solar Panels",
    brand: "Tata Power Solar",
    vendor: "SunGrid Gujarat",
    price_inr: null,
    rating: 4.8,
    review_count: 214,
    buying_modes: ["rfq", "installation_survey"],
    primary_action: "request_quote",
    availability: "rfq_only",
    use_case: "Rooftop solar",
    thumbnail_color: "#0f766e",
    image_url: "/images/products/tata-solar-540w.jpg",
    description:
      "High-efficiency mono PERC panel for residential rooftops. Quote includes delivery and optional installation survey.",
    specs: {
      wattage: 540,
      panel_type: "Mono PERC",
      efficiency_percent: 21.2,
      dimensions: "2278 x 1134 x 35 mm",
      warranty_years: 25,
    },
    installation_available: true,
    warranty_years: 25,
  },
  {
    id: "prod-inverter-microtek-3_5kva",
    title: "Microtek Hybrid 3.5 KVA Inverter",
    slug: "microtek-hybrid-3-5-kva-inverter",
    category: "inverter",
    category_label: "Inverters",
    brand: "Microtek",
    vendor: "ElectroMart Ahmedabad",
    price_inr: 24999,
    rating: 4.4,
    review_count: 89,
    buying_modes: ["direct_checkout", "rfq", "installation_survey"],
    primary_action: "buy_now",
    availability: "in_stock",
    use_case: "Home + small shop",
    thumbnail_color: "#7c3aed",
    image_url: "/images/products/microtek-inverter.jpg",
    description:
      "Hybrid inverter with battery compatibility for homes and small commercial loads. Supports grid and solar input.",
    specs: {
      capacity_kva: 3.5,
      phase: "Single phase",
      battery_compatibility: "48V LiFePO4 / Tubular",
      warranty_years: 2,
    },
    installation_available: true,
    warranty_years: 2,
  },
  {
    id: "prod-ev-bolt-7_4kw",
    title: "Bolt Earth 7.4kW Type 2 AC Charger",
    slug: "bolt-earth-7-4kw-type-2-charger",
    category: "ev_charger",
    category_label: "EV Chargers",
    brand: "Bolt Earth",
    vendor: "EV Charge Hub",
    price_inr: null,
    rating: 4.5,
    review_count: 56,
    buying_modes: ["rfq", "installation_survey"],
    primary_action: "request_installation",
    availability: "made_to_order",
    use_case: "Home EV charging",
    thumbnail_color: "#b45309",
    image_url: "/images/products/bolt-ev-charger.jpg",
    description:
      "Wall-mounted AC charger for home parking with installation survey and wiring assessment included in quote flow.",
    specs: {
      connector_type: "Type 2",
      power_kw: 7.4,
      phase: "Single phase",
      warranty_years: 3,
    },
    installation_available: true,
    warranty_years: 3,
  },
  {
    id: "prod-bundle-ahmedabad-home-kit",
    title: "Ahmedabad Home Solar + Backup Kit",
    slug: "ahmedabad-home-solar-backup-kit",
    category: "bundle",
    category_label: "Solar + Backup Bundles",
    brand: "Marketplace Bundle",
    vendor: "Platform Curated",
    price_inr: null,
    rating: 4.9,
    review_count: 42,
    buying_modes: ["rfq", "installation_survey"],
    primary_action: "request_quote",
    availability: "rfq_only",
    use_case: "Complete home energy",
    thumbnail_color: "#0369a1",
    image_url: "/images/products/ahmedabad-bundle.jpg",
    description:
      "Curated bundle: 3kW solar array, 5kWh battery, and 3.5 KVA inverter with site survey and installation coordination.",
    specs: {
      panel_capacity_kw: 3,
      battery_capacity_kwh: 5,
      inverter_capacity_kva: 3.5,
      installation_required: "Yes",
    },
    installation_available: true,
    warranty_years: 10,
  },
];

export function getSampleProduct(id: string) {
  return sampleProducts.find(
    (product) => product.id === id || product.slug === id
  );
}