import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { env } from "../../config/env.js";
import { aiQueue } from "../../config/queue.js";
import { prisma } from "../../config/database.js";

const router = Router();
router.use(authenticate);

/** Chat with AI business assistant — proxies to Python FastAPI */
router.post("/chat", asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, conversation_id: conversationId, tenant_id: tenantId, user_id: userId }),
    });

    if (!response.ok) {
      throw new Error(`AI service returned ${response.status}`);
    }

    const data = await response.json();
    res.json({ success: true, data });
  } catch {
    // Fallback if AI service is down
    res.json({
      success: true,
      data: {
        reply: "I'm currently processing your request. The AI service is warming up — please try again in a moment. In the meantime, you can check your dashboard for the latest business insights.",
        conversationId: conversationId || "new",
        insights: [],
        suggestedActions: [
          { label: "View Dashboard", action: "/dashboard" },
          { label: "Check Inventory", action: "/inventory" },
          { label: "View Analytics", action: "/analytics" },
        ],
      },
    });
  }
}));

/** Get AI-generated insights */
router.get("/insights", asyncHandler(async (req, res) => {
  const tenantId = req.tenantId!;

  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/ai/insights/${tenantId}`);
    if (response.ok) {
      const data = await response.json();
      res.json({ success: true, data });
      return;
    }
  } catch { /* fallback below */ }

  // Generate basic insights from database if AI service is unavailable
  const [lowStock, pendingOrders, topCustomer] = await Promise.all([
    prisma.product.count({ where: { tenantId, stockStatus: { in: ["LOW_STOCK", "OUT_OF_STOCK"] } } }),
    prisma.order.count({ where: { tenantId, status: "PENDING" } }),
    prisma.customer.findFirst({ where: { tenantId }, orderBy: { totalSpent: "desc" } }),
  ]);

  const insights = [];
  if (lowStock > 0) {
    insights.push({ type: "reorder", title: "Low Stock Alert", description: `${lowStock} products need restocking`, priority: "high" });
  }
  if (pendingOrders > 0) {
    insights.push({ type: "general", title: "Pending Orders", description: `${pendingOrders} orders awaiting processing`, priority: "medium" });
  }
  if (topCustomer) {
    insights.push({ type: "general", title: "Top Customer", description: `${topCustomer.name} is your highest-value customer with ₹${topCustomer.totalSpent} in purchases`, priority: "low" });
  }

  res.json({ success: true, data: insights });
}));

/** Queue a demand forecast job */
router.post("/forecast", asyncHandler(async (req, res) => {
  const job = await aiQueue.add("demand-forecast", { tenantId: req.tenantId!, ...req.body });
  res.json({ success: true, data: { jobId: job.id, message: "Forecast job queued" } });
}));

export default router;
