import { defineMiddlewares } from "@medusajs/medusa";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export default defineMiddlewares({
  routes: [
    {
      matcher: "/energy*",
      middlewares: [
        (req, res, next) => {
          const origin = req.headers.origin;
          const allowed =
            process.env.STORE_CORS?.split(",").map((value) => value.trim()) ??
            [];

          if (origin && allowed.includes(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader(
              "Access-Control-Allow-Headers",
              "Content-Type, Authorization"
            );
            res.setHeader(
              "Access-Control-Allow-Methods",
              "GET, POST, OPTIONS"
            );
          }

          if (req.method === "OPTIONS") {
            res.sendStatus(204);
            return;
          }

          next();
        },
      ],
    },
    {
      method: ["POST"],
      matcher: "/admin/energy/products/upload",
      middlewares: [upload.single("file")],
    },
  ],
});