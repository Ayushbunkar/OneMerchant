import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

// Route imports
import authRoutes from "./modules/auth/routes.js";
import inventoryRoutes from "./modules/inventory/routes.js";
import orderRoutes from "./modules/orders/routes.js";
import customerRoutes from "./modules/customers/routes.js";
import supplierRoutes from "./modules/suppliers/routes.js";
import paymentRoutes from "./modules/payments/routes.js";
import analyticsRoutes from "./modules/analytics/routes.js";
import marketingRoutes from "./modules/marketing/routes.js";
import notificationRoutes from "./modules/notifications/routes.js";
import mediaRoutes from "./modules/media/routes.js";
import aiRoutes from "./modules/ai/routes.js";
import whatsappRoutes from "./modules/whatsapp/routes.js";

const app = express();

// ---- Global Middleware ----
app.use(helmet());
app.use(cors({ origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", credentials: true }));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter());

// ---- Health Check ----
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "onemerchant-api", timestamp: new Date().toISOString() });
});

// ---- API Routes ----
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/suppliers", supplierRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/marketing", marketingRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/whatsapp", whatsappRoutes);

// ---- 404 Handler ----
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Route not found" } });
});

// ---- Global Error Handler ----
app.use(errorHandler);

export default app;
