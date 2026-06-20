import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database.js";
import { env } from "../../config/env.js";
import { redis } from "../../config/redis.js";
import { AppError } from "../../middleware/errorHandler.js";
import type { JwtPayload } from "../../middleware/auth.js";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50) + "-" + Date.now().toString(36);
}

function generateTokens(payload: JwtPayload) {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY });
  return { accessToken, refreshToken, expiresIn: 900 };
}

export const authService = {
  async register(data: { name: string; email: string; password: string; businessName: string; phone: string }) {
    const existing = await prisma.user.findFirst({ where: { email: data.email } });
    if (existing) {
      throw new AppError("Email already registered", 409, "EMAIL_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_ROUNDS);
    const slug = generateSlug(data.businessName);

    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: data.businessName,
          slug,
          email: data.email,
          phone: data.phone,
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          role: "OWNER",
        },
      });

      return { user, tenant };
    });

    const payload: JwtPayload = {
      userId: result.user.id,
      tenantId: result.tenant.id,
      email: result.user.email,
      role: result.user.role,
    };

    const tokens = generateTokens(payload);

    // Store refresh token in Redis
    await redis.setex(`refresh:${result.user.id}`, 7 * 24 * 3600, tokens.refreshToken);

    return {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        tenantId: result.tenant.id,
        avatarUrl: result.user.avatarUrl,
      },
      tokens,
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        slug: result.tenant.slug,
        plan: result.tenant.plan,
      },
    };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: { email },
      include: { tenant: true },
    });

    if (!user || !user.isActive) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    // Update last login
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const payload: JwtPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(payload);
    await redis.setex(`refresh:${user.id}`, 7 * 24 * 3600, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        avatarUrl: user.avatarUrl,
      },
      tokens,
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug,
        plan: user.tenant.plan,
      },
    };
  },

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
      const stored = await redis.get(`refresh:${decoded.userId}`);

      if (!stored || stored !== token) {
        throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { tenant: true },
      });

      if (!user || !user.isActive) {
        throw new AppError("User not found or inactive", 401, "USER_INACTIVE");
      }

      const payload: JwtPayload = {
        userId: user.id,
        tenantId: user.tenantId,
        email: user.email,
        role: user.role,
      };

      const tokens = generateTokens(payload);
      await redis.setex(`refresh:${user.id}`, 7 * 24 * 3600, tokens.refreshToken);

      return { tokens };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }
  },

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true },
      omit: { password: true },
    });
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");
    return user;
  },

  async logout(userId: string) {
    await redis.del(`refresh:${userId}`);
  },
};
