import { prisma } from "../../config/database.js";
import { AppError } from "../../middleware/errorHandler.js";

export const paymentService = {
  async list(tenantId: string, params: { page?: number; limit?: number; status?: string; method?: string }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;
    const where: any = { tenantId };
    if (params.status) where.status = params.status;
    if (params.method) where.method = params.method;
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: { order: true } }),
      prisma.payment.count({ where }),
    ]);
    return { items: payments, meta: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 } };
  },

  async recordPayment(tenantId: string, data: { orderId: string; amount: number; method: string; transactionId?: string }) {
    const order = await prisma.order.findFirst({ where: { id: data.orderId, tenantId } });
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    const payment = await prisma.payment.create({
      data: { tenantId, orderId: data.orderId, amount: data.amount, method: data.method as any, status: "CAPTURED", transactionId: data.transactionId },
    });

    await prisma.order.update({ where: { id: data.orderId }, data: { paymentStatus: "CAPTURED" } });
    return payment;
  },

  async getSummary(tenantId: string) {
    const [totalCaptured, totalPending, methodBreakdown] = await Promise.all([
      prisma.payment.aggregate({ where: { tenantId, status: "CAPTURED" }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { tenantId, status: "PENDING" }, _sum: { amount: true } }),
      prisma.payment.groupBy({ by: ["method"], where: { tenantId, status: "CAPTURED" }, _sum: { amount: true }, _count: true }),
    ]);
    return {
      totalCollected: totalCaptured._sum.amount || 0,
      totalPending: totalPending._sum.amount || 0,
      byMethod: methodBreakdown.map((m) => ({ method: m.method, total: m._sum.amount || 0, count: m._count })),
    };
  },
};
