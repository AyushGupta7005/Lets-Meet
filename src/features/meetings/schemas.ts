import { z } from "zod";

export const meetingCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  agentId: z.string().min(1, "Agent ID is required"),
});
export const meetingUpdateSchema = meetingCreateSchema.extend({
  id: z.string().min(1, "ID is required"),
});
