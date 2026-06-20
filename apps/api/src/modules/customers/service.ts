import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { AppError } from "../../middleware/errorHandler.js";

export const customerService = {
  async list(tenantId: string, params: { page?: number; limit?: number; search?: string }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;
    const where: Prisma.CustomerWhereInput = { tenantId };
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { phone: { contains: params.search } },
        { email: { contains: params.search, mode: "insensitive" } },
      ];
    }
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.customer.count({ where }),
    ]);
    return { items: customers, meta: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 } };
  },

  async get(tenantId: string, id: string) {
    const customer = await prisma.customer.findFirst({ where: { id, tenantId } });
    if (!customer) throw new AppError("Customer not found", 404, "NOT_FOUND");
    return customer;
  },

  async create(tenantId: string, data: any) {
    const existing = await prisma.customer.findFirst({ where: { tenantId, phone: data.phone } });
    if (existing) throw new AppError("Customer with this phone already exists", 409, "PHONE_EXISTS");
    return prisma.customer.create({ data: { tenantId, ...data } });
  },

  async update(tenantId: string, id: string, data: any) {
    const existing = await prisma.customer.findFirst({ where: { id, tenantId } });
    if (!existing) throw new AppError("Customer not found", 404, "NOT_FOUND");
    return prisma.customer.update({ where: { id }, data });
  },

  async getHistory(tenantId: string, customerId: string) {
    return prisma.order.findMany({
      where: { tenantId, customerId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { items: { include: { product: true } } },
    });
  },

  async getSegments(tenantId: string) {
    const customers = await prisma.customer.findMany({ where: { tenantId } });
    const segments = { vip: 0, regular: 0, inactive: 0, new: 0 };
    const now = Date.now();
    for (const c of customers) {
      if (c.totalSpent.toNumber() > 50000) segments.vip++;
      else if (c.lastOrderAt && now - c.lastOrderAt.getTime() > 90 * 24 * 3600 * 1000) segments.inactive++;
      else if (c.totalOrders > 3) segments.regular++;
      else segments.new++;
    }
    return segments;
  },
};
