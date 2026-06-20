import { prisma } from "../../config/database.js";
import { AppError } from "../../middleware/errorHandler.js";
import { invalidateCache } from "../../config/redis.js";

export const supplierService = {
  async list(tenantId: string, params: { page?: number; limit?: number; search?: string }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { company: { contains: params.search, mode: "insensitive" } },
      ];
    }
    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.supplier.count({ where }),
    ]);
    return { items: suppliers, meta: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 } };
  },

  async get(tenantId: string, id: string) {
    const supplier = await prisma.supplier.findFirst({ where: { id, tenantId }, include: { purchaseOrders: { take: 10, orderBy: { createdAt: "desc" } } } });
    if (!supplier) throw new AppError("Supplier not found", 404, "NOT_FOUND");
    return supplier;
  },

  async create(tenantId: string, data: any) {
    return prisma.supplier.create({ data: { tenantId, ...data } });
  },

  async update(tenantId: string, id: string, data: any) {
    const existing = await prisma.supplier.findFirst({ where: { id, tenantId } });
    if (!existing) throw new AppError("Supplier not found", 404, "NOT_FOUND");
    return prisma.supplier.update({ where: { id }, data });
  },

  async createPurchaseOrder(tenantId: string, data: any) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `PO-${dateStr}-${rand}`;

    let totalAmount = 0;
    const items = data.items.map((item: any) => {
      const total = item.quantity * item.unitCost;
      totalAmount += total;
      return { productId: item.productId, quantity: item.quantity, unitCost: item.unitCost, totalCost: total };
    });

    const po = await prisma.purchaseOrder.create({
      data: {
        tenantId, supplierId: data.supplierId, orderNumber, totalAmount,
        expectedDeliveryAt: data.expectedDeliveryAt ? new Date(data.expectedDeliveryAt) : undefined,
        notes: data.notes,
        items: { create: items },
      },
      include: { supplier: true, items: { include: { product: true } } },
    });

    await prisma.supplier.update({ where: { id: data.supplierId }, data: { totalOrders: { increment: 1 } } });
    return po;
  },

  async receivePurchaseOrder(tenantId: string, poId: string, receivedItems: { itemId: string; receivedQuantity: number }[]) {
    const po = await prisma.purchaseOrder.findFirst({ where: { id: poId, tenantId }, include: { items: true } });
    if (!po) throw new AppError("Purchase order not found", 404, "NOT_FOUND");

    await prisma.$transaction(async (tx) => {
      for (const ri of receivedItems) {
        const poItem = po.items.find((i) => i.id === ri.itemId);
        if (!poItem) continue;
        await tx.purchaseOrderItem.update({ where: { id: ri.itemId }, data: { receivedQuantity: ri.receivedQuantity } });
        await tx.product.update({ where: { id: poItem.productId }, data: { stockQuantity: { increment: ri.receivedQuantity } } });
        await tx.stockMovement.create({
          data: { tenantId, productId: poItem.productId, type: "PURCHASE", quantity: ri.receivedQuantity, reference: po.orderNumber },
        });
      }

      const allReceived = po.items.every((item) => {
        const ri = receivedItems.find((r) => r.itemId === item.id);
        return ri && ri.receivedQuantity >= item.quantity;
      });

      await tx.purchaseOrder.update({
        where: { id: poId },
        data: { status: allReceived ? "RECEIVED" : "PARTIALLY_RECEIVED", receivedAt: allReceived ? new Date() : undefined },
      });
    });

    await invalidateCache(`cache:${tenantId}:products:*`);
    return prisma.purchaseOrder.findFirst({ where: { id: poId }, include: { items: { include: { product: true } } } });
  },
};
