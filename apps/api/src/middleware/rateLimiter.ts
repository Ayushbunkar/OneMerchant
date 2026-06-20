import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis.js";
import { env } from "../config/env.js";
import { AppError } from "./errorHandler.js";

/** Redis-based sliding window rate limiter */
export const rateLimiter = (maxRequests?: number, windowSeconds?: number) => {
  const max = maxRequests || env.RATE_LIMIT_MAX;
  const window = windowSeconds || env.RATE_LIMIT_WINDOW;

  return async (req: Request, _res: Response, next: NextFunction) => {
    const identifier = req.user?.userId || req.ip || "anonymous";
    const key = `ratelimit:${identifier}:${req.path}`;

    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, window);
      }

      if (current > max) {
        throw new AppError(
          `Rate limit exceeded. Try again in ${window} seconds.`,
          429,
          "RATE_LIMITED"
        );
      }
      next();
    } catch (err) {
      if (err instanceof AppError) throw err;
      // If Redis is down, let the request through
      next();
    }
  };
};
