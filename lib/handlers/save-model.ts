import { ApiClient, Model, ModelField, Options } from "@agility/management-sdk";
import { z } from "zod";

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

export const ModelSchema = z.object({
	id: z.number().describe("The system-generated ID of this model.  Use -1 to indicate a new model."),
	displayName: z.string().min(2).describe("The display name of the model, used in the UI."),
	referenceName: z.string().min(2).describe("The reference name of the model, used in code and APIs."),
	description: z.string().optional().describe("A brief description of the model, used in the UI."),
	fields: z.array(FieldSchema).min(0).describe("The fields of the model, used to define the structure of the content. Each field has a name, label, type, and optional settings."),
});

interface Params {
	token?: string;
	instanceGuid: string;
	model: Model;
}

export async function saveModel({ token, instanceGuid, model }: Params) {
	if (!instanceGuid || !token || !model) {
		throw new Error('instanceGuid, token, and model are required');
	}

	try {

		const options = new Options()
		options.token = token

		const agilityClient = new ApiClient(options)

		const createdModel = await agilityClient.modelMethods.saveModel(model, instanceGuid as string)

		return createdModel

	} catch (error) {
		throw new Error(`Failed to save model: ${error}`)
	}
}