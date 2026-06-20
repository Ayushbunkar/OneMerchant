import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(200),
  description: z.string().max(1000).optional(),
  channel: z.enum(["EMAIL", "SMS", "WHATSAPP", "PUSH"]),
  content: z.string().max(5000).optional(),
  targetAudience: z.record(z.string(), z.unknown()).optional(),
  scheduledAt: z.string().datetime().optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
