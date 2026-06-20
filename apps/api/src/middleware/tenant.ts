import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler.js";

export function tenantMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required");
  }
  if (!req.user.tenantId) {
    throw ApiError.badRequest("Tenant context is missing");
  }
  req.tenantId = req.user.tenantId;
  next();
}
