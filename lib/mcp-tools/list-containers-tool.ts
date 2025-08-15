import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from "zod";
import { getContainers } from '../handlers/get-containers';

export function registerContainerListingTool(server: McpServer) {
	server.tool(
		"get_containers",
		"Gets the list of Agility containers (content lists and single items) for a particular instance.",
		{
			instanceGuid: z.string(),
		},
		async ({ instanceGuid }: { instanceGuid: string }, extra: any) => {
			const token = extra?.authInfo?.token;

			const containers = await getContainers({ token, instanceGuid });

			if (!containers || containers.length === 0) {
				return {
					content: [{ type: "text", text: `No containers found for instance ${instanceGuid}.` }],
				};
			}

			//generate a markdown string that lists the containers, grouped and sorted by contentViewCategoryName and then sorted by contentViewName

			const groupedContainers = containers.reduce((acc, container) => {
				const category = container.categoryName || "Uncategorized";
				if (!acc[category]) {
					acc[category] = [];
				}
				acc[category].push(container);
				return acc;
			}, {} as Record<string, typeof containers>);

			const sortedCategories = Object.keys(groupedContainers).sort();
			const markdown = sortedCategories.map(category => {
				const containersInCategory = groupedContainers[category];
				containersInCategory.sort((a, b) => (`${a.displayName}`.localeCompare(`${b.displayName}`)));
				return `### ${category}\n` + containersInCategory.map(container => `- ${container.displayName} (${container.ID})`).join("\n");
			}).join("\n\n");

			return {
				content: [{ type: "text", text: `Containers:\n${markdown}` }],
				structuredContent: { containers }
			};
		}
	);
}
