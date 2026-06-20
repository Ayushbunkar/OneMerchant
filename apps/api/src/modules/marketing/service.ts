import { prisma } from "../../config/database.js";
import { AppError } from "../../middleware/errorHandler.js";

export const marketingService = {
  async listCampaigns(tenantId: string, params: { page?: number; limit?: number; status?: string }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const where: any = { tenantId };
    if (params.status) where.status = params.status;
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.campaign.count({ where }),
    ]);
    return { items: campaigns, meta: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 } };
  },

  async createCampaign(tenantId: string, data: any) {
    return prisma.campaign.create({ data: { tenantId, ...data, scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined } });
  },

  async updateCampaign(tenantId: string, id: string, data: any) {
    const existing = await prisma.campaign.findFirst({ where: { id, tenantId } });
    if (!existing) throw new AppError("Campaign not found", 404, "NOT_FOUND");
    return prisma.campaign.update({ where: { id }, data });
  },

  async listCoupons(tenantId: string) {
    return prisma.coupon.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } });
  },

  async createCoupon(tenantId: string, data: any) {
    const existing = await prisma.coupon.findFirst({ where: { tenantId, code: data.code } });
    if (existing) throw new AppError("Coupon code already exists", 409, "CODE_EXISTS");
    return prisma.coupon.create({
      data: { tenantId, ...data, validFrom: new Date(data.validFrom), validUntil: new Date(data.validUntil) },
    });
  },

  async validateCoupon(tenantId: string, code: string, orderAmount: number) {
    const coupon = await prisma.coupon.findFirst({ where: { tenantId, code, isActive: true } });
    if (!coupon) throw new AppError("Invalid coupon code", 404, "INVALID_COUPON");
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) throw new AppError("Coupon has expired", 400, "COUPON_EXPIRED");
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new AppError("Coupon usage limit reached", 400, "COUPON_LIMIT");
    if (coupon.minOrderAmount && orderAmount < Number(coupon.minOrderAmount)) {
      throw new AppError(`Minimum order amount is ₹${coupon.minOrderAmount}`, 400, "MIN_ORDER_NOT_MET");
    }
    let discount = coupon.discountType === "PERCENTAGE" ? orderAmount * Number(coupon.discountValue) / 100 : Number(coupon.discountValue);
    if (coupon.maxDiscountAmount) discount = Math.min(discount, Number(coupon.maxDiscountAmount));
    return { valid: true, discount, coupon };
  },
};
