import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api";
import { ProductCard } from "../components/ProductCard";
import type { EnergyProduct } from "../types";

const categories = [
  { id: "all", label: "All products" },
  { id: "battery", label: "Batteries" },
  { id: "solar_panel", label: "Solar panels" },
  { id: "inverter", label: "Inverters" },
  { id: "ev_charger", label: "EV chargers" },
  { id: "bundle", label: "Bundles" },
];

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";
  const [products, setProducts] = useState<EnergyProduct[]>([]);
  const [marketplaceName, setMarketplaceName] = useState("Tyagi Energy Marketplace");
  const [city, setCity] = useState("Meerut");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchProducts(
          activeCategory === "all" ? undefined : activeCategory
        );

        if (!cancelled) {
          setProducts(response.products);
          setMarketplaceName(response.marketplace.name);
          setCity(response.marketplace.launch_region.operating_city);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load the catalog. Make sure the API is running on port 9000.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const subtitle = useMemo(() => {
    if (activeCategory === "all") {
      return "Browse batteries, solar, inverters, EV chargers, and curated bundles.";
    }

    return categories.find((category) => category.id === activeCategory)?.label ?? "";
  }, [activeCategory]);

  return (
    <main className="page">
      <section className="hero">
        <h1>{marketplaceName}</h1>
        <p>
          Amazon-like energy marketplace for {city}. Compare products, buy simple items
          online, or request quotes and installation surveys for configured systems.
        </p>
        <div className="hero-badges">
          <span>B2C + B2B</span>
          <span>Razorpay ready</span>
          <span>5 launch products</span>
          <span>Platform-managed fulfillment</span>
        </div>
      </section>

      <div className="filters">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`filter-chip ${activeCategory === category.id ? "active" : ""}`}
            onClick={() => {
              if (category.id === "all") {
                setSearchParams({});
              } else {
                setSearchParams({ category: category.id });
              }
            }}
          >
            {category.label}
          </button>
        ))}
      </div>

      <p>{subtitle}</p>

      {loading && <div className="loading-box">Loading products…</div>}
      {error && <div className="error-box">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="empty-box">No products found in this category.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <section className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}