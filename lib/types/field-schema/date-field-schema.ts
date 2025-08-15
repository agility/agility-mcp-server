import { z } from "zod";

export const DateFieldSchema = z.object({
	type: z.literal("Date"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	showTime: z.boolean().optional()
});

export type DateField = z.infer<typeof DateFieldSchema>;
