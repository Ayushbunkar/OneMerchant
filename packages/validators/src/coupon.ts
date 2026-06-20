import { z } from "zod";

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20)
    .regex(/^[A-Z0-9]+$/, "Coupon code must be uppercase alphanumeric"),
  description: z.string().max(500).optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(0.01, "Discount value must be positive"),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(1).optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
