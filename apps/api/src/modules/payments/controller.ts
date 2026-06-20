import { Request, Response } from "express";
import { paymentService } from "./service.js";

export const paymentController = {
  async list(req: Request, res: Response) {
    const result = await paymentService.list(req.tenantId!, req.query as any);
    res.json({ success: true, data: result.items, meta: result.meta });
  },
  async record(req: Request, res: Response) {
    const payment = await paymentService.recordPayment(req.tenantId!, req.body);
    res.status(201).json({ success: true, data: payment });
  },
  async summary(req: Request, res: Response) {
    const summary = await paymentService.getSummary(req.tenantId!);
    res.json({ success: true, data: summary });
  },
};
