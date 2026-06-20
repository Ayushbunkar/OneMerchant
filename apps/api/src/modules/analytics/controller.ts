import { Request, Response } from "express";
import { analyticsService } from "./service.js";

export const analyticsController = {
  async dashboard(req: Request, res: Response) {
    const stats = await analyticsService.getDashboardStats(req.tenantId!);
    res.json({ success: true, data: stats });
  },
  async revenue(req: Request, res: Response) {
    const days = parseInt(req.query.days as string) || 30;
    const data = await analyticsService.getRevenueOverTime(req.tenantId!, days);
    res.json({ success: true, data });
  },
  async topProducts(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await analyticsService.getTopProducts(req.tenantId!, limit);
    res.json({ success: true, data });
  },
  async salesByCategory(req: Request, res: Response) {
    const data = await analyticsService.getSalesByCategory(req.tenantId!);
    res.json({ success: true, data });
  },
};
