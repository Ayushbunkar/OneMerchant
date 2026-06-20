import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { prisma } from "../config/database.js";

const connection = redis;

// ---- Order Processing Worker ----
const orderWorker = new Worker("order-processing", async (job) => {
  const { tenantId, orderId, orderNumber } = job.data;
  console.log(`Processing order ${orderNumber}...`);

  // Create notification for order confirmation
  const owners = await prisma.user.findMany({ where: { tenantId, role: "OWNER" } });
  for (const owner of owners) {
    await prisma.notification.create({
      data: {
        tenantId, userId: owner.id, type: "ORDER_UPDATE",
        title: "New Order Received",
        message: `Order ${orderNumber} has been placed.`,
        data: { orderId },
      },
    });
  }
}, { connection, concurrency: 5 });

// ---- Inventory Sync Worker ----
const inventoryWorker = new Worker("inventory-sync", async (job) => {
  const { tenantId, productId, productName, stockQuantity, stockStatus } = job.data;
  console.log(`Low stock alert: ${productName} (${stockQuantity} remaining)`);

  const owners = await prisma.user.findMany({ where: { tenantId, role: { in: ["OWNER", "MANAGER"] } } });
  for (const owner of owners) {
    await prisma.notification.create({
      data: {
        tenantId, userId: owner.id, type: "LOW_STOCK",
        title: `Low Stock: ${productName}`,
        message: `${productName} has only ${stockQuantity} units left (${stockStatus}).`,
        data: { productId },
      },
    });
  }
}, { connection, concurrency: 3 });

// ---- Notification Worker ----
const notificationWorker = new Worker("notifications", async (job) => {
  const { tenantId, type, title, message, userId } = job.data;
  console.log(`Sending notification: ${title}`);

  if (userId) {
    await prisma.notification.create({
      data: { tenantId, userId, type: type || "SYSTEM", title, message },
    });
  } else {
    const owners = await prisma.user.findMany({ where: { tenantId, role: "OWNER" } });
    for (const owner of owners) {
      await prisma.notification.create({
        data: { tenantId, userId: owner.id, type: type || "SYSTEM", title, message },
      });
    }
  }
}, { connection, concurrency: 5 });

// ---- Analytics Aggregation Worker ----
const analyticsWorker = new Worker("analytics-aggregation", async (job) => {
  const { tenantId } = job.data;
  console.log(`Aggregating analytics for tenant ${tenantId}...`);
  // Future: compute and cache daily/weekly/monthly aggregates
}, { connection, concurrency: 1 });

// Error handling for all workers
[orderWorker, inventoryWorker, notificationWorker, analyticsWorker].forEach((worker) => {
  worker.on("completed", (job) => console.log(`✅ Job ${job.id} completed on ${worker.name}`));
  worker.on("failed", (job, err) => console.error(`❌ Job ${job?.id} failed on ${worker.name}:`, err.message));
});

export function startWorkers() {
  console.log("🔄 BullMQ workers started");
  console.log("  - order-processing (concurrency: 5)");
  console.log("  - inventory-sync (concurrency: 3)");
  console.log("  - notifications (concurrency: 5)");
  console.log("  - analytics-aggregation (concurrency: 1)");
}
