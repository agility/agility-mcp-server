import { z } from "zod";

export const DropdownChoiceSchema = z.object({
	label: z.string(),
	value: z.string()
});

export const DropdownListFieldSchema = z.object({
	type: z.literal("DropdownList"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	defaultValue: z.string().optional(),
	choices: z.array(DropdownChoiceSchema).min(1)
});

export type DropdownChoice = z.infer<typeof DropdownChoiceSchema>;
export type DropdownListField = z.infer<typeof DropdownListFieldSchema>;
