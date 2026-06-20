import { Request, Response } from "express";
import { supplierService } from "./service.js";

export const supplierController = {
  async list(req: Request, res: Response) {
    const result = await supplierService.list(req.tenantId!, req.query as any);
    res.json({ success: true, data: result.items, meta: result.meta });
  },
  async get(req: Request, res: Response) {
    const supplier = await supplierService.get(req.tenantId!, req.params.id);
    res.json({ success: true, data: supplier });
  },
  async create(req: Request, res: Response) {
    const supplier = await supplierService.create(req.tenantId!, req.body);
    res.status(201).json({ success: true, data: supplier });
  },
  async update(req: Request, res: Response) {
    const supplier = await supplierService.update(req.tenantId!, req.params.id, req.body);
    res.json({ success: true, data: supplier });
  },
  async createPO(req: Request, res: Response) {
    const po = await supplierService.createPurchaseOrder(req.tenantId!, req.body);
    res.status(201).json({ success: true, data: po });
  },
  async receivePO(req: Request, res: Response) {
    const po = await supplierService.receivePurchaseOrder(req.tenantId!, req.params.id, req.body.items);
    res.json({ success: true, data: po });
  },
};
