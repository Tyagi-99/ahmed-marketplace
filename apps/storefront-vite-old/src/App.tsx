import { Route, Routes } from "react-router-dom";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductPage } from "./pages/ProductPage";

export function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/">
          <strong>Tyagi Energy Marketplace</strong>
          <span>Batteries · Solar · Inverters · EV · Bundles</span>
        </a>
        <nav className="header-links">
          <a href="/">Shop</a>
          <a href="http://localhost:7000/dashboard" target="_blank" rel="noreferrer">
            Admin
          </a>
          <a href="http://localhost:7001/seller" target="_blank" rel="noreferrer">
            Vendor
          </a>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
}