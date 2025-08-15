import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from "zod";

import {
	EnhancedModelSchema,
	saveModel,

	createFieldFromSchema,

} from "@/lib/handlers/save-model";

export function registerSaveContentModelTool(server: McpServer) {
	// Enhanced tool that accepts both legacy and new field formats
	server.tool(
		"save_content_model",
		"Save a new or existing Agility content model with enhanced field types and validation.",
		{
			instanceGuid: z.string(),
			model: EnhancedModelSchema,
		},
		async ({ instanceGuid, model }: { instanceGuid: string, model: any }, extra: any) => {
			const token = extra?.authInfo?.token;

			// Convert enhanced field schema to Field instances
			const fieldInstances = model.fields.map((fieldData: any) => createFieldFromSchema(fieldData));

			const updatedModel = await saveModel({
				token,
				instanceGuid,
				id: model.id,
				displayName: model.displayName,
				referenceName: model.referenceName,
				description: model.description,
				fields: fieldInstances,
				contentDefinitionTypeID: 1 // Content model
			});

			return {
				content: [{ type: "text", text: `Content model saved successfully: ${updatedModel.displayName} (${updatedModel.referenceName} - ${updatedModel.id})` }],
				structuredContent: { model: updatedModel }
			};
		}
	);

}
