import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getAvailableInstances } from "@/lib/handlers/available-instances";

export function registerAvailableInstancesTool(server: McpServer) {
	server.tool(
		"get_available_instances",
		"Get a list of available Agility instances.",
		async (extra: any) => {
			const token = extra?.authInfo?.token;

			const data = await getAvailableInstances(token);

			//get a markdown string of the instances, grouped by org
			let instancesMarkdown = ""
			const groupedInstances = data.reduce((acc, instance) => {
				if (!acc[instance.org]) {
					acc[instance.org] = [];
				}
				acc[instance.org].push(instance);
				return acc;
			}, {} as Record<string, typeof data>);

			for (const [org, instances] of Object.entries(groupedInstances)) {
				instancesMarkdown += `### ${org}\n`;
				instancesMarkdown += instances.map(instance => `- ${instance.name} (${instance.guid})`).join("\n");
				instancesMarkdown += "\n\n";
			}
			if (instancesMarkdown === "") {
				instancesMarkdown = "No instances found.";
			}
			return {
				content: [{ type: "text", text: `Available instances: \n${instancesMarkdown}` }],
				structuredContent: { instances: data }
			}
		}
	);
}
