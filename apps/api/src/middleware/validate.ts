import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/** Validate request body against a Zod schema */
export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
};

/** Validate query params */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.query);
    next();
  };
};
