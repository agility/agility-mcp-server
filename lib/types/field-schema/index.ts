// Re-export all field schemas and their types
export * from "./text-field-schema";
export * from "./long-text-field-schema";
export * from "./html-field-schema";
export * from "./integer-field-schema";
export * from "./decimal-field-schema";
export * from "./boolean-field-schema";
export * from "./date-field-schema";
export * from "./dropdown-list-field-schema";
export * from "./file-attachment-field-schema";
export * from "./image-attachment-field-schema";
export * from "./link-field-schema";
export * from "./content-field-schema";

// Import all schemas for the discriminated union
import { z } from "zod";
import { TextFieldSchema } from "./text-field-schema";
import { LongTextFieldSchema } from "./long-text-field-schema";
import { HtmlFieldSchema } from "./html-field-schema";
import { IntegerFieldSchema } from "./integer-field-schema";
import { DecimalFieldSchema } from "./decimal-field-schema";
import { BooleanFieldSchema } from "./boolean-field-schema";
import { DateFieldSchema } from "./date-field-schema";
import { DropdownListFieldSchema } from "./dropdown-list-field-schema";
import { FileAttachmentFieldSchema } from "./file-attachment-field-schema";
import { ImageAttachmentFieldSchema } from "./image-attachment-field-schema";
import { LinkFieldSchema } from "./link-field-schema";
import { ContentFieldSchema } from "./content-field-schema";

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

// Export the union type
export type EnhancedField = z.infer<typeof EnhancedFieldSchema>;
