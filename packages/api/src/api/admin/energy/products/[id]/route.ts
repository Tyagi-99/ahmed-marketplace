import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { deleteProduct, getProduct } from "../../../../../lib/product-store";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;
  const product = getProduct(id);

  if (!product) {
    res.status(404).json({ message: "Product not found", id });
    return;
  }

  res.json({ product });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;
  const removed = deleteProduct(id);

  if (!removed) {
    res.status(404).json({ message: "Product not found", id });
    return;
  }

  res.json({
    id: removed.id,
    deleted: true,
  });
}