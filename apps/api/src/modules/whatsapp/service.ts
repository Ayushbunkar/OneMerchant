import { prisma } from "../../config/database.js";
import { AppError } from "../../middleware/errorHandler.js";

export const whatsappService = {
  async sendMessage(tenantId: string, to: string, message: string) {
    // In a real implementation, this would call the WhatsApp Cloud API
    console.log(`[WhatsApp Mock] Sending to ${to} for tenant ${tenantId}: ${message}`);
    return { success: true, messageId: "mock-message-id-" + Date.now() };
  },

  async syncCatalog(tenantId: string) {
    // In a real implementation, this would sync products to WhatsApp catalog
    console.log(`[WhatsApp Mock] Syncing catalog for tenant ${tenantId}`);
    const products = await prisma.product.findMany({ where: { tenantId, isActive: true } });
    return { success: true, syncedCount: products.length };
  },
};
