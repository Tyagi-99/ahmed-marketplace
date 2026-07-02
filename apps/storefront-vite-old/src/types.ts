export type BuyingMode =
  | "direct_checkout"
  | "rfq"
  | "installation_survey";

export type EnergyProduct = {
  id: string;
  title: string;
  slug: string;
  category: string;
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

export type ProductsResponse = {
  count: number;
  marketplace: {
    name: string;
    launch_region: {
      operating_city: string;
      launch_market: string;
      currency_code: string;
    };
  };
  products: EnergyProduct[];
};

export type ProductResponse = {
  product: EnergyProduct;
};