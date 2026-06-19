import { Link } from "react-router-dom";
import type { EnergyProduct } from "../types";

const actionLabels = {
  buy_now: "Buy Now",
  request_quote: "Request Quote",
  request_installation: "Request Installation",
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

type ProductCardProps = {
  product: EnergyProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      {product.image_url ? (
        <img
          className="product-thumb product-thumb-image"
          src={product.image_url}
          alt={product.title}
        />
      ) : (
        <div
          className="product-thumb"
          style={{ background: product.thumbnail_color }}
          aria-hidden="true"
        >
          {product.category_label.slice(0, 1)}
        </div>
      )}

      <div className="product-body">
        <div className="product-meta">
          {product.brand} · {product.vendor}
        </div>
        <h2>{product.title}</h2>
        <div className="rating">
          ★ {product.rating.toFixed(1)} ({product.review_count} reviews)
        </div>
        <div className={product.price_inr ? "price" : "price muted"}>
          {formatPrice(product.price_inr)}
        </div>
        <div className="tags">
          <span className="tag">{product.category_label}</span>
          <span className="tag">{product.use_case}</span>
          {product.installation_available && (
            <span className="tag">Installation available</span>
          )}
        </div>
        <div className="card-actions">
          <Link className="btn btn-primary" to={`/products/${product.id}`}>
            {actionLabels[product.primary_action]}
          </Link>
          <Link className="btn btn-ghost" to={`/products/${product.id}`}>
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}