import { Request, Response } from "express";
import { mediaService } from "./service.js";

export const mediaController = {
  async upload(req: Request, res: Response) {
    const media = await mediaService.upload(req.tenantId!, req.file!, req.body.folder);
    res.status(201).json({ success: true, data: media });
  },
  async delete(req: Request, res: Response) {
    await mediaService.delete(req.tenantId!, req.params.id);
    res.json({ success: true, data: { message: "Media deleted" } });
  },
  async list(req: Request, res: Response) {
    const result = await mediaService.list(req.tenantId!, req.query as any);
    res.json({ success: true, data: result.items, meta: result.meta });
  },
};
