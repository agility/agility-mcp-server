import { z } from "zod";

// Enhanced Zod schemas for each field type with proper validation

export const TextFieldSchema = z.object({
	type: z.literal("Text"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	unique: z.boolean().optional(),
	defaultValue: z.string().optional(),
	length: z.number().positive().optional()
});

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

export const IntegerFieldSchema = z.object({
	type: z.literal("Integer"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	unique: z.boolean().optional(),
	defaultValue: z.number().optional()
});

export const DecimalFieldSchema = z.object({
	type: z.literal("Decimal"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	unique: z.boolean().optional(),
	defaultValue: z.number().optional()
});

export const BooleanFieldSchema = z.object({
	type: z.literal("Boolean"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	defaultValue: z.boolean().optional()
});

export const DateFieldSchema = z.object({
	type: z.literal("Date"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional(),
	showTime: z.boolean().optional()
});

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

export const FileAttachmentFieldSchema = z.object({
	type: z.literal("FileAttachment"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional()
});

export const ImageAttachmentFieldSchema = z.object({
	type: z.literal("ImageAttachment"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional()
});

export const LinkFieldSchema = z.object({
	type: z.literal("Link"),
	name: z.string().min(2),
	label: z.string().min(2),
	description: z.string().optional(),
	required: z.boolean().optional()
});

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

// Union type for all field types
export const EnhancedFieldSchema = z.discriminatedUnion("type", [
	TextFieldSchema,
	LongTextFieldSchema,
	HtmlFieldSchema,
	IntegerFieldSchema,
	DecimalFieldSchema,
	BooleanFieldSchema,
	DateFieldSchema,
	DropdownListFieldSchema,
	FileAttachmentFieldSchema,
	ImageAttachmentFieldSchema,
	LinkFieldSchema,
	ContentFieldSchema
]);
