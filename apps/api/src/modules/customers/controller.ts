import { Request, Response } from "express";
import { customerService } from "./service.js";

export const customerController = {
  async list(req: Request, res: Response) {
    const result = await customerService.list(req.tenantId!, req.query as any);
    res.json({ success: true, data: result.items, meta: result.meta });
  },
  async get(req: Request, res: Response) {
    const customer = await customerService.get(req.tenantId!, req.params.id);
    res.json({ success: true, data: customer });
  },
  async create(req: Request, res: Response) {
    const customer = await customerService.create(req.tenantId!, req.body);
    res.status(201).json({ success: true, data: customer });
  },
  async update(req: Request, res: Response) {
    const customer = await customerService.update(req.tenantId!, req.params.id, req.body);
    res.json({ success: true, data: customer });
  },
  async getHistory(req: Request, res: Response) {
    const orders = await customerService.getHistory(req.tenantId!, req.params.id);
    res.json({ success: true, data: orders });
  },
  async getSegments(req: Request, res: Response) {
    const segments = await customerService.getSegments(req.tenantId!);
    res.json({ success: true, data: segments });
  },
};
