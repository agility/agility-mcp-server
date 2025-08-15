import { z } from "zod";

export const BooleanFieldSchema = z.object({
	type: z.literal("Boolean"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	defaultValue: z.boolean().optional()
});

export type BooleanField = z.infer<typeof BooleanFieldSchema>;
