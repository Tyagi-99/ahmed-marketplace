import fs from "fs";
import path from "path";
import type { SampleProduct } from "../data/sample-products";
import { sampleProducts as seedProducts } from "../data/sample-products";

const productsFile = path.join(process.cwd(), "src/data/products.json");

function ensureStore() {
  if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(
      productsFile,
      JSON.stringify({ products: seedProducts }, null, 2),
      "utf-8"
    );
  }
}

function readStore(): SampleProduct[] {
  ensureStore();
  const raw = fs.readFileSync(productsFile, "utf-8");
  const parsed = JSON.parse(raw) as { products: SampleProduct[] };
  return parsed.products;
}

function writeStore(products: SampleProduct[]) {
  ensureStore();
  fs.writeFileSync(
    productsFile,
    JSON.stringify({ products }, null, 2),
    "utf-8"
  );
}

export function listProducts(category?: string) {
  const products = readStore();

  if (!category) {
    return products;
  }

  return products.filter((product) => product.category === category);
}

export function getProduct(id: string) {
  return readStore().find(
    (product) => product.id === id || product.slug === id
  );
}

export function createProduct(product: SampleProduct) {
  const products = readStore();

  if (products.some((item) => item.id === product.id)) {
    throw new Error("A product with this id already exists");
  }

  products.push(product);
  writeStore(products);
  return product;
}

export function deleteProduct(id: string) {
  const products = readStore();
  const index = products.findIndex(
    (product) => product.id === id || product.slug === id
  );

  if (index === -1) {
    return null;
  }

  const [removed] = products.splice(index, 1);
  writeStore(products);
  return removed;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function makeProductId(title: string) {
  return `prod-${slugify(title)}`;
}