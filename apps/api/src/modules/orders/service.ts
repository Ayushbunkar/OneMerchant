import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { orderQueue, notificationQueue } from "../../config/queue.js";
import { invalidateCache } from "../../config/redis.js";
import { AppError } from "../../middleware/errorHandler.js";

function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${rand}`;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "RETURNED"],
  DELIVERED: ["RETURNED", "REFUNDED"],
  RETURNED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export const orderService = {
  async listOrders(tenantId: string, params: {
    page?: number; limit?: number; status?: string;
    customerId?: string; startDate?: string; endDate?: string;
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = { tenantId };
    if (params.status) where.status = params.status as any;
    if (params.customerId) where.customerId = params.customerId;
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: "desc" },
        include: { customer: true, items: { include: { product: true } }, _count: { select: { items: true } } },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      items: orders,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 },
    };
  },

  async getOrder(tenantId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, tenantId },
      include: { customer: true, items: { include: { product: true, variant: true } }, payments: true },
    });
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");
    return order;
  },

  async createOrder(tenantId: string, data: any) {
    const orderNumber = generateOrderNumber();

    const result = await prisma.$transaction(async (tx) => {
      // Fetch all products and validate stock
      let subtotal = new Prisma.Decimal(0);
      const orderItems: any[] = [];

      for (const item of data.items) {
        const product = await tx.product.findFirst({ where: { id: item.productId, tenantId } });
        if (!product) throw new AppError(`Product ${item.productId} not found`, 404, "PRODUCT_NOT_FOUND");
        if (product.stockQuantity < item.quantity) {
          throw new AppError(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`, 400, "INSUFFICIENT_STOCK");
        }

        const unitPrice = product.sellingPrice;
        const totalPrice = unitPrice.mul(item.quantity);
        subtotal = subtotal.add(totalPrice);

        orderItems.push({
          productId: product.id,
          variantId: item.variantId,
          name: product.name,
          sku: product.sku,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });

        // Deduct stock
        const newQty = product.stockQuantity - item.quantity;
        const stockStatus = newQty === 0 ? "OUT_OF_STOCK" : newQty <= product.lowStockThreshold ? "LOW_STOCK" : "IN_STOCK";
        await tx.product.update({
          where: { id: product.id },
          data: { stockQuantity: newQty, stockStatus },
        });

        await tx.stockMovement.create({
          data: { tenantId, productId: product.id, type: "SALE", quantity: -item.quantity, reference: orderNumber },
        });
      }

      const taxAmount = subtotal.mul(0.18); // 18% GST default
      const discountAmount = new Prisma.Decimal(data.discountAmount || 0);
      const totalAmount = subtotal.add(taxAmount).sub(discountAmount);

      const order = await tx.order.create({
        data: {
          tenantId,
          orderNumber,
          customerId: data.customerId,
          subtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          paymentMethod: data.paymentMethod as any,
          notes: data.notes,
          shippingAddress: data.shippingAddress,
          items: { create: orderItems },
        },
        include: { customer: true, items: { include: { product: true } } },
      });

      // Update customer stats if customer exists
      if (data.customerId) {
        await tx.customer.update({
          where: { id: data.customerId },
          data: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: totalAmount },
            lastOrderAt: new Date(),
          },
        });
      }

      return order;
    });

    // Queue background jobs
    await orderQueue.add("process-order", { tenantId, orderId: result.id, orderNumber });
    await notificationQueue.add("order-notification", {
      tenantId,
      type: "ORDER_UPDATE",
      title: "New Order Created",
      message: `Order ${orderNumber} has been placed for ₹${result.totalAmount}`,
    });

    await invalidateCache(`cache:${tenantId}:*`);
    return result;
  },

  async updateStatus(tenantId: string, orderId: string, data: { status: string; notes?: string }) {
    const order = await prisma.order.findFirst({ where: { id: orderId, tenantId } });
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    const allowed = STATUS_TRANSITIONS[order.status] || [];
    if (!allowed.includes(data.status)) {
      throw new AppError(`Cannot transition from ${order.status} to ${data.status}`, 400, "INVALID_STATUS_TRANSITION");
    }

    // If cancelling, restore stock
    if (data.status === "CANCELLED") {
      const items = await prisma.orderItem.findMany({ where: { orderId } });
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });
      }
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: data.status as any, notes: data.notes },
      include: { customer: true, items: true },
    });

    await invalidateCache(`cache:${tenantId}:*`);
    return updated;
  },
};
