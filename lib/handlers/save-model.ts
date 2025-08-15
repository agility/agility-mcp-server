import { ApiClient, Model, ModelField, Options } from "@agility/management-sdk";
import { z } from "zod";
import {
	EnhancedFieldSchema,
	createFieldFromSchema,
	Field,
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
	type DropdownChoice,
	type ContentRenderAs,
	type SortDirection
} from "@/lib/types";

// Legacy FieldSchema for backward compatibility
export const FieldSchema = z.object({
	name: z.string().min(2).describe("The name of the field, used in code and APIs."),
	label: z.string().min(2).describe("The label of the field, used in the UI."),
	description: z.string().optional().describe("A brief description of the field."),
	type: z.enum([
		"Text",
		"LongText",
		"Integer",
		"Decimal",
		"Boolean",
		"Date",
		"Html",
		"DropdownList",
		"FileAttachment",
		"ImageAttachment",
		"Link",
		"Content"
	]).describe(`The type of the field, used to determine how the field is rendered and stored.
		The 'Content' type is special, used for storing a link other content. The value of a 'Content' field will be a content list's referenceName.`),
	settings: z.record(z.string()).optional().describe(`Additional settings for the field.  Possible values:
		- Required (true, false)
		- Unique (true, false)
		- DefaultValue - string value for text based or DropdownList fields only (Text, LongText, Html)
		- Length - max length of the field for text based fields (number of characters)
		- ShowTime - boolean value to indicate if a Date field should show the time attribute
		- Choices - the choices for a DropdownList field. A string with this format: Choice 1|value1\nChoice 2|value2\nChoice 3|value3
		- Content field type settings:
			- ContentDefinition - for Content fields only. The referenceName or ID of the Content model to link this field to.
			- ContentView - the referenceName of the content list to link to. Use the const value '_newcontent_agility_' to indicate that a NEW list using the model indicated in the ContentDefinition setting should be created when the field is used (nested or child lists).
			- RenderAs - for Content fields only.  How to render the linked list
				- dropdown (single select)
				- checkbox (multiple select)
				- searchlistbox (searchable)
				- grid (show the whole list)
			- LinkedContentDropdownTextField - for RenderAs=dropdown, store the display value in this field.
			- LinkedContentDropdownValueField - for RenderAs=dropdown, store the contentID value of the linked item in this field.
			- DisplayColumnAttributeName - for RenderAs=dropdown, the field name to display in the dropdown list.
			- Sort - for RenderAs=grid. What field to sort this list on.  Use 'ItemOrder' for manual sorting by default.
			- SortDirection - for RenderAs=grid. What direction to sort this list in.  Use 'asc' or 'desc'.
			- SortIDFieldName - for RenderAs=grid. The field name to use for the sort IDs (do NOT use this for nested or child lists - _newcontent_agility_).
			- DefaultColumns - for RenderAs=grid or RenderAs=searchlistbox. The default columns to display in the grid view.

		`),
});

// Enhanced FieldSchema with better validation and type safety
export { EnhancedFieldSchema } from "@/lib/types";


// Enhanced ModelSchema with better field type validation
export const EnhancedModelSchema = z.object({
	id: z.number().describe("The system-generated ID of this model.  Use -1 to indicate a new model."),
	displayName: z.string().min(2).describe("The display name of the model, used in the UI."),
	referenceName: z.string().min(2).describe("The reference name of the model, used in code and APIs."),
	description: z.string().optional().describe("A brief description of the model, used in the UI."),
	fields: z.array(EnhancedFieldSchema).min(0).describe("The fields of the model with enhanced type safety and validation."),
});

// Export the TypeScript type inferred from the schema
export type EnhancedModel = z.infer<typeof EnhancedModelSchema>;

// Helper function to create fields using the class-based approach
export const createField = {
	text: (name: string, label: string, options?: {
		description?: string;
		required?: boolean;
		unique?: boolean;
		defaultValue?: string;
		length?: number;
	}) => new TextField(name, label, options?.description, options?.required, options?.unique, options?.defaultValue, options?.length),

	longText: (name: string, label: string, options?: {
		description?: string;
		required?: boolean;
		unique?: boolean;
		defaultValue?: string;
		length?: number;
	}) => new LongTextField(name, label, options?.description, options?.required, options?.unique, options?.defaultValue, options?.length),

	html: (name: string, label: string, options?: {
		description?: string;
		required?: boolean;
		unique?: boolean;
		defaultValue?: string;
		length?: number;
	}) => new HtmlField(name, label, options?.description, options?.required, options?.unique, options?.defaultValue, options?.length),

	integer: (name: string, label: string, options?: {
		description?: string;
		required?: boolean;
		unique?: boolean;
		defaultValue?: number;
	}) => new IntegerField(name, label, options?.description, options?.required, options?.unique, options?.defaultValue),

	decimal: (name: string, label: string, options?: {
		description?: string;
		required?: boolean;
		unique?: boolean;
		defaultValue?: number;
	}) => new DecimalField(name, label, options?.description, options?.required, options?.unique, options?.defaultValue),

	boolean: (name: string, label: string, options?: {
		description?: string;
		required?: boolean;
		defaultValue?: boolean;
	}) => new BooleanField(name, label, options?.description, options?.required, options?.defaultValue),

	date: (name: string, label: string, options?: {
		description?: string;
		required?: boolean;
		showTime?: boolean;
	}) => new DateField(name, label, options?.description, options?.required, options?.showTime),

	dropdown: (name: string, label: string, choices: DropdownChoice[], options?: {
		description?: string;
		required?: boolean;
		defaultValue?: string;
	}) => new DropdownListField(name, label, choices, options?.description, options?.required, options?.defaultValue),

	file: (name: string, label: string, options?: {
		description?: string;
		required?: boolean;
	}) => new FileAttachmentField(name, label, options?.description, options?.required),

	image: (name: string, label: string, options?: {
		description?: string;
		required?: boolean;
	}) => new ImageAttachmentField(name, label, options?.description, options?.required),

	link: (name: string, label: string, options?: {
		description?: string;
		required?: boolean;
	}) => new LinkField(name, label, options?.description, options?.required),

	content: (name: string, label: string, contentDefinition: string, options?: {
		description?: string;
		required?: boolean;
		contentView?: string;
		renderAs?: ContentRenderAs;
	}) => new ContentField(name, label, contentDefinition, options?.description, options?.required, options?.contentView, options?.renderAs),
};

// Export the field types for direct usage by AI
export {
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
	type DropdownChoice,
	type ContentRenderAs,
	type SortDirection,
	Field,
	createFieldFromSchema
};

interface Params {
	token?: string;
	instanceGuid: string;
	model: Model;
}

// Helper function to convert Field instances to ModelField instances
export function convertFieldsToModelFields(fields: (Field | any)[]): ModelField[] {
	return fields.map((field, index) => {
		const modelField = new ModelField();

		if (field instanceof Field) {
			// Use the enhanced Field class
			const fieldData = field.toModelField();
			modelField.name = fieldData.name;
			modelField.label = fieldData.label;
			modelField.type = fieldData.type;
			modelField.description = fieldData.description || null;
			modelField.settings = fieldData.settings;
		} else {
			// Handle legacy field format
			modelField.name = field.name;
			modelField.label = field.label;
			modelField.type = field.type;
			modelField.description = field.description || null;
			modelField.settings = field.settings || {};
		}

		modelField.itemOrder = index + 1;

		return modelField;
	});
}

// Enhanced function that accepts Field instances
export async function saveModel({
	token,
	instanceGuid,
	id = -1,
	displayName,
	referenceName,
	description,
	fields,
	contentDefinitionTypeID = 1 // 1 for content models, 2 for components
}: {
	token?: string;
	instanceGuid: string;
	id?: number;
	displayName: string;
	referenceName: string;
	description?: string;
	fields: Field[];
	contentDefinitionTypeID?: number;
}) {
	if (!instanceGuid || !token) {
		throw new Error('instanceGuid and token are required');
	}

	try {
		const options = new Options();
		options.token = token;

		const agilityClient = new ApiClient(options);

		// Create the model object
		const model = new Model();
		model.id = id;
		model.displayName = displayName;
		model.referenceName = referenceName;
		model.description = description || null;
		model.fields = convertFieldsToModelFields(fields);

		// Set content definition type if it's a component
		if (contentDefinitionTypeID === 2) {
			(model as any).contentDefinitionTypeID = contentDefinitionTypeID;
		}

		const createdModel = await agilityClient.modelMethods.saveModel(model, instanceGuid as string);

		return createdModel;

	} catch (error) {
		throw new Error(`Failed to save model: ${error}`);
	}
}
