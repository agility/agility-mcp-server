import { z } from "zod";

export const LinkFieldSchema = z.object({
	type: z.literal("Link"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional()
});

export type LinkField = z.infer<typeof LinkFieldSchema>;
