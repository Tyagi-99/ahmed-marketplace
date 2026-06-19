import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import fs from "fs";
import path from "path";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const file = (req as MedusaRequest & { file?: { originalname: string; buffer: Buffer } }).file;

  if (!file) {
    res.status(400).json({ message: "No image file uploaded" });
    return;
  }

  const imagesDir = path.join(
    process.cwd(),
    "../../apps/storefront/public/images/products"
  );

  fs.mkdirSync(imagesDir, { recursive: true });

  const safeName = file.originalname
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const filename = `${Date.now()}-${safeName || "product.jpg"}`;
  const targetPath = path.join(imagesDir, filename);

  fs.writeFileSync(targetPath, file.buffer);

  res.status(201).json({
    url: `/images/products/${filename}`,
    filename,
  });
}