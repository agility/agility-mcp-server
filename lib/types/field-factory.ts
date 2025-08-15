import { z } from "zod";
import { Field } from "./field-types/base-field";
import {
	TextField,
	LongTextField,
	HtmlField,
	IntegerField,
	DecimalField,
	BooleanField,
	DateField,
	DropdownListField,
	FileAttachmentField,
	ImageAttachmentField,
	LinkField,
	ContentField,
	type DropdownChoice
} from "./field-types";
import { EnhancedFieldSchema } from "./field-schema";

// Factory function to create field instances from schema data
export function createFieldFromSchema(fieldData: z.infer<typeof EnhancedFieldSchema>): Field {
	switch (fieldData.type) {
		case "Text":
			return new TextField(
				fieldData.name,
				fieldData.label,
				fieldData.description,
				fieldData.required,
				fieldData.unique,
				fieldData.defaultValue,
				fieldData.length
			);
		case "LongText":
			return new LongTextField(
				fieldData.name,
				fieldData.label,
				fieldData.description,
				fieldData.required,
				fieldData.unique,
				fieldData.defaultValue,
				fieldData.length
			);
		case "Html":
			return new HtmlField(
				fieldData.name,
				fieldData.label,
				fieldData.description,
				fieldData.required,
				fieldData.unique,
				fieldData.defaultValue,
				fieldData.length
			);
		case "Integer":
			return new IntegerField(
				fieldData.name,
				fieldData.label,
				fieldData.description,
				fieldData.required,
				fieldData.unique,
				fieldData.defaultValue
			);
		case "Decimal":
			return new DecimalField(
				fieldData.name,
				fieldData.label,
				fieldData.description,
				fieldData.required,
				fieldData.unique,
				fieldData.defaultValue
			);
		case "Boolean":
			return new BooleanField(
				fieldData.name,
				fieldData.label,
				fieldData.description,
				fieldData.required,
				fieldData.defaultValue
			);
		case "Date":
			return new DateField(
				fieldData.name,
				fieldData.label,
				fieldData.description,
				fieldData.required,
				fieldData.showTime
			);
		case "DropdownList":
			return new DropdownListField(
				fieldData.name,
				fieldData.label,
				fieldData.choices,
				fieldData.description,
				fieldData.required,
				fieldData.defaultValue
			);
		case "FileAttachment":
			return new FileAttachmentField(
				fieldData.name,
				fieldData.label,
				fieldData.description,
				fieldData.required
			);
		case "ImageAttachment":
			return new ImageAttachmentField(
				fieldData.name,
				fieldData.label,
				fieldData.description,
				fieldData.required
			);
		case "Link":
			return new LinkField(
				fieldData.name,
				fieldData.label,
				fieldData.description,
				fieldData.required
			);
		case "Content":
			const contentField = new ContentField(
				fieldData.name,
				fieldData.label,
				fieldData.contentDefinition,
				fieldData.description,
				fieldData.required,
				fieldData.contentView,
				fieldData.renderAs
			);

			if (fieldData.linkedContentDropdownTextField && fieldData.linkedContentDropdownValueField && fieldData.displayColumnAttributeName) {
				contentField.withDropdownSettings(
					fieldData.linkedContentDropdownTextField,
					fieldData.linkedContentDropdownValueField,
					fieldData.displayColumnAttributeName
				);
			}

			if (fieldData.sort) {
				contentField.withGridSettings(
					fieldData.sort,
					fieldData.sortDirection,
					fieldData.defaultColumns,
					fieldData.sortIDFieldName
				);
			}

			return contentField;
		default:
			throw new Error(`Unknown field type: ${(fieldData as any).type}`);
	}
}
