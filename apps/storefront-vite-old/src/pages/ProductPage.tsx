import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProduct, submitRfq } from "../api";
import type { EnergyProduct } from "../types";

const actionLabels = {
  buy_now: "Buy Now",
  request_quote: "Request Quote",
  request_installation: "Request Installation Survey",
} as const;

const formatPrice = (price: number | null) => {
  if (price === null) {
    return "Price on quote";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<EnergyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rfqStatus, setRfqStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchProduct(id);
        if (!cancelled) {
          setProduct(response.product);
        }
      } catch {
        if (!cancelled) {
          setError("Product not found.");
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
  }, [id]);

  async function handleRfqSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    setRfqStatus(null);

    try {
      const result = await submitRfq({
        customer_name: formData.get("customer_name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        customer_type: formData.get("customer_type"),
        product_category: product.category,
        product_id: product.id,
        product_title: product.title,
        quantity: Number(formData.get("quantity")),
        delivery_city: formData.get("delivery_city"),
        delivery_pincode: formData.get("delivery_pincode"),
        installation_required: formData.get("installation_required") === "yes",
        notes: formData.get("notes"),
      });

      setRfqStatus(
        `Quote request ${result.rfq.id} submitted. ${result.rfq.next_step}`
      );
      event.currentTarget.reset();
    } catch (submitError) {
      setRfqStatus(
        submitError instanceof Error
          ? submitError.message
          : "Could not submit quote request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="page"><div className="loading-box">Loading product…</div></main>;
  }

  if (error || !product) {
    return (
      <main className="page">
        <div className="error-box">{error ?? "Product not found."}</div>
        <Link className="btn btn-secondary" to="/">Back to catalog</Link>
      </main>
    );
  }

  const showRfqForm =
    product.primary_action !== "buy_now" || product.buying_modes.includes("rfq");

  return (
    <main className="page detail-layout">
      <Link to="/">← Back to catalog</Link>

      <section className="detail-hero">
        {product.image_url ? (
          <img
            className="detail-thumb product-thumb-image"
            src={product.image_url}
            alt={product.title}
          />
        ) : (
          <div
            className="detail-thumb"
            style={{ background: product.thumbnail_color }}
            aria-hidden="true"
          >
            {product.category_label.slice(0, 1)}
          </div>
        )}

        <div className="detail-copy">
          <div className="product-meta">
            {product.brand} · Sold by {product.vendor}
          </div>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <div className="rating">
            ★ {product.rating.toFixed(1)} ({product.review_count} reviews)
          </div>
          <div className={product.price_inr ? "price" : "price muted"}>
            {formatPrice(product.price_inr)}
          </div>
          <div className="tags">
            <span className="tag">{product.category_label}</span>
            <span className="tag">{product.use_case}</span>
            <span className="tag">{product.availability.replaceAll("_", " ")}</span>
            <span className="tag">{product.warranty_years} yr warranty</span>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" type="button">
              {actionLabels[product.primary_action]}
            </button>
            {product.buying_modes.includes("direct_checkout") && (
              <button className="btn btn-secondary" type="button">
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Technical specifications</h2>
        <div className="spec-grid">
          {Object.entries(product.specs).map(([key, value]) => (
            <div className="spec-item" key={key}>
              <span>{key.replaceAll("_", " ")}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      {showRfqForm && (
        <section className="panel">
          <h2>Request a quote</h2>
          <form className="form-grid" onSubmit={handleRfqSubmit}>
            <label>
              Full name
              <input name="customer_name" required placeholder="Rahul Shah" />
            </label>
            <label>
              Phone
              <input name="phone" required placeholder="+91 98765 43210" />
            </label>
            <label>
              Email
              <input name="email" type="email" required placeholder="you@email.com" />
            </label>
            <label>
              Customer type
              <select name="customer_type" defaultValue="b2c">
                <option value="b2c">Individual (B2C)</option>
                <option value="b2b">Business (B2B)</option>
              </select>
            </label>
            <label>
              Quantity
              <input name="quantity" type="number" min="1" defaultValue="1" required />
            </label>
            <label>
              Delivery city
              <input name="delivery_city" defaultValue="Meerut" required />
            </label>
            <label>
              Pincode
              <input name="delivery_pincode" defaultValue="380001" required />
            </label>
            <label>
              Installation required?
              <select
                name="installation_required"
                defaultValue={product.installation_available ? "yes" : "no"}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label>
              Notes
              <textarea
                name="notes"
                rows={3}
                placeholder="Roof size, backup hours needed, preferred install date…"
              />
            </label>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit quote request"}
            </button>
          </form>
          {rfqStatus && <p className="status-box">{rfqStatus}</p>}
        </section>
      )}
    </main>
  );
}