import { Request, Response } from "express";
import { inventoryService } from "./service.js";

export const inventoryController = {
  async listProducts(req: Request, res: Response) {
    const result = await inventoryService.listProducts(req.tenantId!, req.query as any);
    res.json({ success: true, data: result.items, meta: result.meta });
  },

  async getProduct(req: Request, res: Response) {
    const product = await inventoryService.getProduct(req.tenantId!, req.params.id);
    res.json({ success: true, data: product });
  },

  async createProduct(req: Request, res: Response) {
    const product = await inventoryService.createProduct(req.tenantId!, req.body);
    res.status(201).json({ success: true, data: product });
  },

  async updateProduct(req: Request, res: Response) {
    const product = await inventoryService.updateProduct(req.tenantId!, req.params.id, req.body);
    res.json({ success: true, data: product });
  },

  async deleteProduct(req: Request, res: Response) {
    await inventoryService.deleteProduct(req.tenantId!, req.params.id);
    res.json({ success: true, data: { message: "Product deleted" } });
  },

  async updateStock(req: Request, res: Response) {
    const product = await inventoryService.updateStock(req.tenantId!, req.body);
    res.json({ success: true, data: product });
  },

  async getLowStock(req: Request, res: Response) {
    const products = await inventoryService.getLowStockProducts(req.tenantId!);
    res.json({ success: true, data: products });
  },

  async listCategories(req: Request, res: Response) {
    const categories = await inventoryService.listCategories(req.tenantId!);
    res.json({ success: true, data: categories });
  },

  async createCategory(req: Request, res: Response) {
    const category = await inventoryService.createCategory(req.tenantId!, req.body);
    res.status(201).json({ success: true, data: category });
  },
};
