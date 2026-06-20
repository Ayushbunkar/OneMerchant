import { prisma } from "../../config/database.js";

export const notificationService = {
  async list(tenantId: string, userId: string, params: { page?: number; limit?: number; unreadOnly?: boolean }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 50);
    const where: any = { tenantId, userId };
    if (params.unreadOnly) where.isRead = false;
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { tenantId, userId, isRead: false } }),
    ]);
    return {
      items: notifications, unreadCount,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 },
    };
  },

  async markAsRead(tenantId: string, userId: string, notificationId: string) {
    await prisma.notification.updateMany({ where: { id: notificationId, tenantId, userId }, data: { isRead: true } });
  },

  async markAllAsRead(tenantId: string, userId: string) {
    await prisma.notification.updateMany({ where: { tenantId, userId, isRead: false }, data: { isRead: true } });
  },

  async create(tenantId: string, userId: string, data: { type: string; title: string; message: string; data?: any }) {
    return prisma.notification.create({
      data: { tenantId, userId, type: data.type as any, title: data.title, message: data.message, data: data.data },
    });
  },
};
