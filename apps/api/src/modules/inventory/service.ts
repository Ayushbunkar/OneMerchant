import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { getOrSetCache, invalidateCache } from "../../config/redis.js";
import { inventoryQueue } from "../../config/queue.js";
import { AppError } from "../../middleware/errorHandler.js";

export const inventoryService = {
  // ---- PRODUCTS ----
  async listProducts(tenantId: string, params: {
    page?: number; limit?: number; search?: string;
    categoryId?: string; stockStatus?: string; sortBy?: string; sortOrder?: string;
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = { tenantId, isActive: true };
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { sku: { contains: params.search, mode: "insensitive" } },
        { barcode: { contains: params.search, mode: "insensitive" } },
      ];
    }
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.stockStatus) where.stockStatus = params.stockStatus as any;

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    const sortField = params.sortBy || "createdAt";
    (orderBy as any)[sortField] = params.sortOrder || "desc";

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, skip, take: limit, orderBy,
        include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: products,
      meta: {
        page, limit, total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  },

  async getProduct(tenantId: string, productId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, tenantId },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
    });
    if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
    return product;
  },

  async createProduct(tenantId: string, data: any) {
    const existingSku = await prisma.product.findFirst({
      where: { tenantId, sku: data.sku },
    });
    if (existingSku) throw new AppError("SKU already exists", 409, "SKU_EXISTS");

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 80) + "-" + Date.now().toString(36);

    const stockStatus = data.stockQuantity === 0 ? "OUT_OF_STOCK"
      : data.stockQuantity <= (data.lowStockThreshold || 10) ? "LOW_STOCK" : "IN_STOCK";

    const product = await prisma.product.create({
      data: {
        tenantId,
        name: data.name,
        slug,
        description: data.description,
        sku: data.sku,
        barcode: data.barcode,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        sellingPrice: data.sellingPrice,
        costPrice: data.costPrice,
        taxRate: data.taxRate || 0,
        unit: data.unit || "pcs",
        stockQuantity: data.stockQuantity,
        lowStockThreshold: data.lowStockThreshold || 10,
        stockStatus,
        variants: data.variants ? {
          create: data.variants.map((v: any) => ({
            name: v.name,
            sku: v.sku,
            price: v.price,
            stockQuantity: v.stockQuantity,
            attributes: v.attributes || {},
          })),
        } : undefined,
      },
      include: { category: true, images: true, variants: true },
    });

    await invalidateCache(`cache:${tenantId}:products:*`);
    return product;
  },

  async updateProduct(tenantId: string, productId: string, data: any) {
    const existing = await prisma.product.findFirst({ where: { id: productId, tenantId } });
    if (!existing) throw new AppError("Product not found", 404, "NOT_FOUND");

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        sellingPrice: data.sellingPrice,
        costPrice: data.costPrice,
        taxRate: data.taxRate,
        unit: data.unit,
        lowStockThreshold: data.lowStockThreshold,
      },
      include: { category: true, images: true, variants: true },
    });

    await invalidateCache(`cache:${tenantId}:products:*`);
    return product;
  },

  async deleteProduct(tenantId: string, productId: string) {
    const existing = await prisma.product.findFirst({ where: { id: productId, tenantId } });
    if (!existing) throw new AppError("Product not found", 404, "NOT_FOUND");

    await prisma.product.update({ where: { id: productId }, data: { isActive: false } });
    await invalidateCache(`cache:${tenantId}:products:*`);
  },

  async updateStock(tenantId: string, data: { productId: string; quantity: number; type: string; reason?: string }) {
    const product = await prisma.product.findFirst({ where: { id: data.productId, tenantId } });
    if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");

    let newQuantity: number;
    let movementType: string;

    switch (data.type) {
      case "ADD":
        newQuantity = product.stockQuantity + data.quantity;
        movementType = "PURCHASE";
        break;
      case "REMOVE":
        newQuantity = Math.max(0, product.stockQuantity - data.quantity);
        movementType = "ADJUSTMENT";
        break;
      case "SET":
        newQuantity = data.quantity;
        movementType = "ADJUSTMENT";
        break;
      default:
        throw new AppError("Invalid stock update type", 400, "INVALID_TYPE");
    }

    const stockStatus = newQuantity === 0 ? "OUT_OF_STOCK"
      : newQuantity <= product.lowStockThreshold ? "LOW_STOCK" : "IN_STOCK";

    const [updated] = await prisma.$transaction([
      prisma.product.update({
        where: { id: data.productId },
        data: { stockQuantity: newQuantity, stockStatus },
      }),
      prisma.stockMovement.create({
        data: {
          tenantId,
          productId: data.productId,
          type: movementType as any,
          quantity: data.type === "REMOVE" ? -data.quantity : data.quantity,
          reason: data.reason || `Stock ${data.type.toLowerCase()}`,
        },
      }),
    ]);

    // Queue low stock alert if needed
    if (stockStatus === "LOW_STOCK" || stockStatus === "OUT_OF_STOCK") {
      await inventoryQueue.add("low-stock-alert", {
        tenantId,
        productId: data.productId,
        productName: product.name,
        stockQuantity: newQuantity,
        stockStatus,
      });
    }

    await invalidateCache(`cache:${tenantId}:products:*`);
    return updated;
  },

  async getLowStockProducts(tenantId: string) {
    return prisma.product.findMany({
      where: { tenantId, isActive: true, stockStatus: { in: ["LOW_STOCK", "OUT_OF_STOCK"] } },
      include: { category: true },
      orderBy: { stockQuantity: "asc" },
      take: 50,
    });
  },

  // ---- CATEGORIES ----
  async listCategories(tenantId: string) {
    return getOrSetCache(`cache:${tenantId}:categories`, () =>
      prisma.category.findMany({
        where: { tenantId, isActive: true },
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      600
    );
  },

  async createCategory(tenantId: string, data: { name: string; description?: string; parentId?: string }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 80);
    const category = await prisma.category.create({
      data: { tenantId, name: data.name, slug, description: data.description, parentId: data.parentId },
    });
    await invalidateCache(`cache:${tenantId}:categories`);
    return category;
  },
};
