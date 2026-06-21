import { Request, Response } from "express";
import { whatsappService } from "./service.js";

export const whatsappController = {
  async sendMessage(req: Request, res: Response) {
    const { to, message } = req.body;
    const result = await whatsappService.sendMessage(req.tenantId!, to, message);
    res.json({ success: true, data: result });
  },

  async syncCatalog(req: Request, res: Response) {
    const result = await whatsappService.syncCatalog(req.tenantId!);
    res.json({ success: true, data: result });
  },
};
