import { Request, Response } from "express";
import { marketingService } from "./service.js";

export const marketingController = {
  async listCampaigns(req: Request, res: Response) {
    const result = await marketingService.listCampaigns(req.tenantId!, req.query as any);
    res.json({ success: true, data: result.items, meta: result.meta });
  },
  async createCampaign(req: Request, res: Response) {
    const campaign = await marketingService.createCampaign(req.tenantId!, req.body);
    res.status(201).json({ success: true, data: campaign });
  },
  async updateCampaign(req: Request, res: Response) {
    const campaign = await marketingService.updateCampaign(req.tenantId!, req.params.id, req.body);
    res.json({ success: true, data: campaign });
  },
  async listCoupons(req: Request, res: Response) {
    const coupons = await marketingService.listCoupons(req.tenantId!);
    res.json({ success: true, data: coupons });
  },
  async createCoupon(req: Request, res: Response) {
    const coupon = await marketingService.createCoupon(req.tenantId!, req.body);
    res.status(201).json({ success: true, data: coupon });
  },
  async validateCoupon(req: Request, res: Response) {
    const result = await marketingService.validateCoupon(req.tenantId!, req.body.code, req.body.orderAmount);
    res.json({ success: true, data: result });
  },
};
