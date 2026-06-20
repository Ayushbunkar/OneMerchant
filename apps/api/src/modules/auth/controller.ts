import { Request, Response } from "express";
import { authService } from "./service.js";

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, data: result });
  },

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, error: { code: "MISSING_TOKEN", message: "Refresh token required" } });
      return;
    }
    const result = await authService.refreshToken(refreshToken);
    res.json({ success: true, data: result });
  },

  async getProfile(req: Request, res: Response) {
    const user = await authService.getProfile(req.user!.userId);
    res.json({ success: true, data: user });
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.user!.userId);
    res.json({ success: true, data: { message: "Logged out successfully" } });
  },
};
