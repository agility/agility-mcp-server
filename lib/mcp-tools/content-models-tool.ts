import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from "zod";
import { getModels } from "@/lib/handlers/get-models";

export function registerContentModelsTool(server: McpServer) {
	server.tool(
		"get_content_models",
		"Get a list of Agility content models for a particular instance.",
		{
			instanceGuid: z.string(),
		},
		async ({ instanceGuid }: { instanceGuid: string }, extra: any) => {
			const token = extra?.authInfo?.token;

			const models = await getModels({ token, instanceGuid });

			if (!models || models.length === 0) {
				return {
					content: [{ type: "text", text: `No models found for instance ${instanceGuid}.` }],
				};
			}

			return {
				content: [{ type: "text", text: `Models:\n${models.map(model => `- ${model.displayName} (${model.id})`).join("\n")}` }],
				structuredContent: { models }
			};
		}
	);
}
