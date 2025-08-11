import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from "zod";
import { getComponents } from "@/lib/handlers/get-components";

export function registerComponentModelsTool(server: McpServer) {
	server.tool(
		"get_component_models",
		"Get a list of Agility components for a particular instance.",
		{
			instanceGuid: z.string(),
		},
		async ({ instanceGuid }: { instanceGuid: string }, extra: any) => {
			const token = extra?.authInfo?.token;

			const components = await getComponents({ token, instanceGuid });

			if (!components || components.length === 0) {
				return {
					content: [{ type: "text", text: `No components found for instance ${instanceGuid}.` }],
				};
			}
			return {
				content: [{ type: "text", text: `Components:\n${components.map(component => `- ${component.displayName} (${component.id})`).join("\n")}` }],
				structuredContent: { components }
			};
		}
	);
}
