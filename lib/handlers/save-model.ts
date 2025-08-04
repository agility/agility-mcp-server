import { ApiClient, Model, ModelField, Options } from "@agility/management-sdk";
import { NextResponse } from "next/server";
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
	]).describe("The type of the field, used to determine how the field is rendered and stored. The 'Content' type is special, used for storing a link other content. The value of this field will be a content reference name."),
	settings: z.record(z.string()).optional(),
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