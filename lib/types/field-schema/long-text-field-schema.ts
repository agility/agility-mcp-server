import { z } from "zod";

export const LongTextFieldSchema = z.object({
	type: z.literal("LongText"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	unique: z.boolean().optional(),
	defaultValue: z.string().optional(),
	length: z.number().positive().optional()
});

export type LongTextField = z.infer<typeof LongTextFieldSchema>;
