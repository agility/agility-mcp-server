import { z } from "zod";

export const ContentFieldSchema = z.object({
	type: z.literal("Content"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	contentDefinition: z.string().min(1),
	contentView: z.string().optional(),
	renderAs: z.enum(["dropdown", "checkbox", "searchlistbox", "grid"]).optional(),
	linkedContentDropdownTextField: z.string().optional(),
	linkedContentDropdownValueField: z.string().optional(),
	displayColumnAttributeName: z.string().optional(),
	sort: z.string().optional(),
	sortDirection: z.enum(["asc", "desc"]).optional(),
	sortIDFieldName: z.string().optional(),
	defaultColumns: z.string().optional()
});

export type ContentField = z.infer<typeof ContentFieldSchema>;
