import { z } from "zod";

export const HtmlFieldSchema = z.object({
	type: z.literal("Html"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	unique: z.boolean().optional(),
	defaultValue: z.string().optional(),
	length: z.number().positive().optional()
});

export type HtmlField = z.infer<typeof HtmlFieldSchema>;
