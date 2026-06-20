import { prisma } from "../../config/database.js";
import { getOrSetCache } from "../../config/redis.js";

export const analyticsService = {
  async getDashboardStats(tenantId: string) {
    return getOrSetCache(`cache:${tenantId}:dashboard-stats`, async () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 3600 * 1000);

      const [
        currentRevenue, previousRevenue,
        currentOrders, previousOrders,
        totalCustomers, previousCustomers,
        totalProducts, lowStockCount, pendingOrders,
      ] = await Promise.all([
        prisma.order.aggregate({ where: { tenantId, createdAt: { gte: thirtyDaysAgo }, status: { not: "CANCELLED" } }, _sum: { totalAmount: true } }),
        prisma.order.aggregate({ where: { tenantId, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }, status: { not: "CANCELLED" } }, _sum: { totalAmount: true } }),
        prisma.order.count({ where: { tenantId, createdAt: { gte: thirtyDaysAgo }, status: { not: "CANCELLED" } } }),
        prisma.order.count({ where: { tenantId, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }, status: { not: "CANCELLED" } } }),
        prisma.customer.count({ where: { tenantId } }),
        prisma.customer.count({ where: { tenantId, createdAt: { lt: thirtyDaysAgo } } }),
        prisma.product.count({ where: { tenantId, isActive: true } }),
        prisma.product.count({ where: { tenantId, isActive: true, stockStatus: { in: ["LOW_STOCK", "OUT_OF_STOCK"] } } }),
        prisma.order.count({ where: { tenantId, status: "PENDING" } }),
      ]);

      const totalRevenue = Number(currentRevenue._sum.totalAmount || 0);
      const prevRevenue = Number(previousRevenue._sum.totalAmount || 0);
      const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      const orderGrowth = previousOrders > 0 ? ((currentOrders - previousOrders) / previousOrders) * 100 : 0;
      const newCustomers = totalCustomers - previousCustomers;
      const customerGrowth = previousCustomers > 0 ? (newCustomers / previousCustomers) * 100 : 0;

      return {
        totalRevenue, totalOrders: currentOrders, totalCustomers, totalProducts,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        orderGrowth: Math.round(orderGrowth * 10) / 10,
        customerGrowth: Math.round(customerGrowth * 10) / 10,
        averageOrderValue: currentOrders > 0 ? Math.round(totalRevenue / currentOrders) : 0,
        lowStockProducts: lowStockCount,
        pendingOrders,
      };
    }, 300);
  },

  async getRevenueOverTime(tenantId: string, days: number = 30) {
    return getOrSetCache(`cache:${tenantId}:revenue-chart:${days}`, async () => {
      const startDate = new Date(Date.now() - days * 24 * 3600 * 1000);
      const orders = await prisma.order.findMany({
        where: { tenantId, createdAt: { gte: startDate }, status: { not: "CANCELLED" } },
        select: { createdAt: true, totalAmount: true },
        orderBy: { createdAt: "asc" },
      });

      const dailyMap = new Map<string, { revenue: number; orders: number }>();
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 3600 * 1000);
        dailyMap.set(date.toISOString().slice(0, 10), { revenue: 0, orders: 0 });
      }
      for (const order of orders) {
        const date = order.createdAt.toISOString().slice(0, 10);
        const entry = dailyMap.get(date);
        if (entry) {
          entry.revenue += Number(order.totalAmount);
          entry.orders += 1;
        }
      }
      return Array.from(dailyMap.entries()).map(([date, data]) => ({ date, ...data }));
    }, 600);
  },

  async getTopProducts(tenantId: string, limit: number = 10) {
    return getOrSetCache(`cache:${tenantId}:top-products`, async () => {
      const items = await prisma.orderItem.groupBy({
        by: ["productId", "name"],
        where: { order: { tenantId, status: { not: "CANCELLED" } } },
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { totalPrice: "desc" } },
        take: limit,
      });
      return items.map((item) => ({
        productId: item.productId,
        name: item.name,
        totalSold: item._sum.quantity || 0,
        revenue: Number(item._sum.totalPrice || 0),
      }));
    }, 600);
  },

  async getSalesByCategory(tenantId: string) {
    return getOrSetCache(`cache:${tenantId}:sales-by-category`, async () => {
      const products = await prisma.product.findMany({
        where: { tenantId, isActive: true },
        select: { id: true, categoryId: true, category: { select: { name: true } } },
      });
      const productCategoryMap = new Map(products.map((p) => [p.id, p.category?.name || "Uncategorized"]));

      const orderItems = await prisma.orderItem.findMany({
        where: { order: { tenantId, status: { not: "CANCELLED" } } },
        select: { productId: true, totalPrice: true },
      });

      const categoryTotals = new Map<string, number>();
      for (const item of orderItems) {
        const cat = productCategoryMap.get(item.productId) || "Uncategorized";
        categoryTotals.set(cat, (categoryTotals.get(cat) || 0) + Number(item.totalPrice));
      }
      return Array.from(categoryTotals.entries()).map(([name, revenue]) => ({ name, revenue })).sort((a, b) => b.revenue - a.revenue);
    }, 600);
  },
};
