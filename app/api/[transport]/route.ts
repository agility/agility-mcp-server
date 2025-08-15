// app/api/[transport]/route.ts
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
	registerAvailableInstancesTool,
	registerContentModelsTool,
	registerComponentModelsTool,
	registerSaveContentModelTool,
	registerSaveComponentModelTool
} from "@/lib/mcp-tools";
import { verifyToken } from "@/lib/mcp-auth";
import { registerContainerListingTool } from "@/lib/mcp-tools/list-containers-tool";

// Create the MCP handler with all registered tools
const handler = createMcpHandler(
	(server: McpServer) => {
		// Register all tools
		registerAvailableInstancesTool(server);
		registerContentModelsTool(server);
		registerComponentModelsTool(server);
		registerContainerListingTool(server);
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

// Make authorization required
const authHandler = withMcpAuth(handler, verifyToken, {
	required: true, // Make auth required for all requests
	//requiredScopes: ["offline_access"], // Optional: Require specific scopes
	resourceMetadataPath: "/.well-known/oauth-protected-resource", // Optional: Custom metadata path
});

export { authHandler as GET, authHandler as POST };

