import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from "zod";
import { ModelField } from '@agility/management-sdk';
import { ModelSchema, saveModel } from "@/lib/handlers/save-model";

export function registerSaveContentModelTool(server: McpServer) {
	server.tool(
		"save_content_model",
		"Save a new or existing Agility content model.",
		{
			instanceGuid: z.string(),
			model: ModelSchema,
		},
		async ({ instanceGuid, model }: { instanceGuid: string, model: any }, extra: any) => {
			const token = extra?.authInfo?.token;

			const modelToSave: any = {};
			modelToSave.id = model.id;
			modelToSave.displayName = model.displayName;
			modelToSave.referenceName = model.referenceName;
			modelToSave.description = model.description || null;
			modelToSave.contentDefinitionTypeID = 1; //Assume this is a LIST
			modelToSave.fields = model.fields.map((field: any) => {
				const newField = new ModelField();
				newField.name = field.name;
				newField.label = field.label;
				newField.type = field.type;
				newField.settings = field.settings || {};
				return newField;
			});

			const updatedModel = await saveModel(
				{ token, instanceGuid, model: modelToSave }
			);

			return {
				content: [{ type: "text", text: `Content model saved successfully: ${updatedModel.displayName} (${updatedModel.referenceName} - ${updatedModel.id})` }],
				structuredContent: { model: updatedModel }
			};
		}
	);
}
