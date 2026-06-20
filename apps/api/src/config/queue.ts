import { Queue } from "bullmq";
import { redis } from "./redis.js";

const defaultOpts = { connection: redis };

export const orderQueue = new Queue("order-processing", defaultOpts);
export const inventoryQueue = new Queue("inventory-sync", defaultOpts);
export const emailQueue = new Queue("email-campaigns", defaultOpts);
export const notificationQueue = new Queue("notifications", defaultOpts);
export const analyticsQueue = new Queue("analytics-aggregation", defaultOpts);
export const aiQueue = new Queue("ai-predictions", defaultOpts);
export const mediaQueue = new Queue("media-processing", defaultOpts);
export const webhookQueue = new Queue("webhook-delivery", defaultOpts);

export const queues = {
  order: orderQueue,
  inventory: inventoryQueue,
  email: emailQueue,
  notification: notificationQueue,
  analytics: analyticsQueue,
  ai: aiQueue,
  media: mediaQueue,
  webhook: webhookQueue,
};
