import { Request, Response } from "express";
import { orderService } from "./service.js";

export const orderController = {
  async list(req: Request, res: Response) {
    const result = await orderService.listOrders(req.tenantId!, req.query as any);
    res.json({ success: true, data: result.items, meta: result.meta });
  },
  async get(req: Request, res: Response) {
    const order = await orderService.getOrder(req.tenantId!, req.params.id);
    res.json({ success: true, data: order });
  },
  async create(req: Request, res: Response) {
    const order = await orderService.createOrder(req.tenantId!, req.body);
    res.status(201).json({ success: true, data: order });
  },
  async updateStatus(req: Request, res: Response) {
    const order = await orderService.updateStatus(req.tenantId!, req.params.id, req.body);
    res.json({ success: true, data: order });
  },
};
