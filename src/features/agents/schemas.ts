import { z } from "zod";

export const agentCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  instructions: z.string().min(1, "Instructions are required"),
});
export const agentUpdateSchema = agentCreateSchema.extend({
  id: z.string().min(1, "ID is required"),
});
