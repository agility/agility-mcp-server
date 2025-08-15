import { z } from "zod";

export const DecimalFieldSchema = z.object({
	type: z.literal("Decimal"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	unique: z.boolean().optional(),
	defaultValue: z.number().optional()
});

export type DecimalField = z.infer<typeof DecimalFieldSchema>;
