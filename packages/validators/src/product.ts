import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  description: z.string().max(2000).optional(),
  sku: z.string().min(1, "SKU is required").max(50),
  barcode: z.string().max(50).optional(),
  categoryId: z.string().optional(),
  basePrice: z.number().min(0, "Base price must be positive"),
  sellingPrice: z.number().min(0, "Selling price must be positive"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  taxRate: z.number().min(0).max(100).default(0),
  unit: z.string().default("pcs"),
  stockQuantity: z.number().int().min(0, "Stock quantity must be non-negative"),
  lowStockThreshold: z.number().int().min(0).default(10),
  images: z.array(z.string().url()).optional(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1),
        sku: z.string().min(1),
        price: z.number().min(0),
        stockQuantity: z.number().int().min(0),
        attributes: z.record(z.string(), z.string()),
      })
    )
    .optional(),
});

export const updateStockSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  type: z.enum(["ADD", "REMOVE", "SET"]),
  reason: z.string().max(500).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
