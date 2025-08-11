import { createMcpHandler } from "mcp-handler";
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
	registerAvailableInstancesTool,
	registerContentModelsTool,
	registerComponentModelsTool,
	registerSaveContentModelTool,
	registerSaveComponentModelTool
} from "@/lib/mcp-tools";

export const handler = createMcpHandler(
	(server: McpServer) => {
		// Register all tools
		registerAvailableInstancesTool(server);
		registerContentModelsTool(server);
		registerComponentModelsTool(server);
		registerSaveContentModelTool(server);
		registerSaveComponentModelTool(server);
	},
	{
		// Optional server options
		instructions: "Use the tools to interact with Agility CMS content models and components.",
	},
	{
		basePath: "/api", // this needs to match where the [transport] is located.
		maxDuration: 60,
		verboseLogs: true,
	}
);
