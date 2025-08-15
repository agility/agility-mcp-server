import { z } from "zod";

export const IntegerFieldSchema = z.object({
	type: z.literal("Integer"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	unique: z.boolean().optional(),
	defaultValue: z.number().optional()
});

export type IntegerField = z.infer<typeof IntegerFieldSchema>;
