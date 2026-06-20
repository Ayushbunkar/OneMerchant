import { Request, Response } from "express";
import { notificationService } from "./service.js";

export const notificationController = {
  async list(req: Request, res: Response) {
    const result = await notificationService.list(req.tenantId!, req.user!.userId, req.query as any);
    res.json({ success: true, data: result.items, meta: result.meta, unreadCount: result.unreadCount });
  },
  async markAsRead(req: Request, res: Response) {
    await notificationService.markAsRead(req.tenantId!, req.user!.userId, req.params.id);
    res.json({ success: true, data: { message: "Marked as read" } });
  },
  async markAllAsRead(req: Request, res: Response) {
    await notificationService.markAllAsRead(req.tenantId!, req.user!.userId);
    res.json({ success: true, data: { message: "All marked as read" } });
  },
};
