// app/api/[transport]/route.ts
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import { ApiClient, Options, ModelField } from '@agility/management-sdk'
import { getAvailableInstances } from "@/lib/handlers/available-instances";
import { getModels } from "@/lib/handlers/get-models";
import { getComponents } from "@/lib/handlers/get-components";
import { ModelSchema, saveModel } from "@/lib/handlers/save-model";

// Create your handler as normal
const handler = createMcpHandler(
	(server) => {
		server.tool(
			"get_available_instances",
			"Get a list of available Agility instances.",
			async (extra) => {
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

		server.tool(
			"get_content_models",
			"Get a list of Agility content models for a particular instance.",
			{
				instanceGuid: z.string(),
			},
			async ({ instanceGuid }, extra) => {
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

		server.tool(
			"get_component_models",
			"Get a list of Agility components for a particular instance.",
			{
				instanceGuid: z.string(),
			},
			async ({ instanceGuid }, extra) => {
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

		server.tool(
			"save_content_model",
			"Save a new or existing Agility content model.",
			{
				instanceGuid: z.string(),
				model: ModelSchema,
			},
			async ({ instanceGuid, model }, extra) => {
				const token = extra?.authInfo?.token;

				const modelToSave: any = {};
				modelToSave.id = model.id;
				modelToSave.displayName = model.displayName;
				modelToSave.referenceName = model.referenceName;
				modelToSave.description = model.description || null;
				modelToSave.contentDefinitionTypeID = 1; //Assume this is a LIST
				modelToSave.fields = model.fields.map((field) => {
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

		server.tool(
			"save_component_model",
			`Save a new or existing Agility component model.`,
			{
				instanceGuid: z.string(),
				model: ModelSchema,
			},
			async ({ instanceGuid, model }, extra) => {
				const token = extra?.authInfo?.token;

				const modelToSave: any = {};
				modelToSave.id = model.id;
				modelToSave.displayName = model.displayName;
				modelToSave.referenceName = model.referenceName;
				modelToSave.description = model.description || null;
				modelToSave.contentDefinitionTypeID = 2; //Assume this is a COMPONENT
				modelToSave.fields = model.fields.map((field) => {
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
					content: [{ type: "text", text: `Component model saved successfully: ${updatedModel.displayName} (${updatedModel.referenceName} - ${updatedModel.id})` }],
					structuredContent: { model: updatedModel }
				};

			}
		);
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

// Wrap your handler with authorization
const verifyToken = async (
	req: Request,
	bearerToken?: string
): Promise<AuthInfo | undefined> => {
	if (!bearerToken) return undefined;


	const options = new Options()
	options.token = bearerToken
	options.baseUrl = 'https://mgmt.aglty.io'

	const agilityClient = new ApiClient(options)
	try {
		const user = await agilityClient.serverUserMethods.me("")
		if (!user) {
			console.warn("User not found!");
			return undefined;
		}

		return {
			token: bearerToken,
			scopes: [], // Add relevant scopes
			clientId: `AgilityUser-${user.userID}`, // Add user/client identifier
			extra: {
				// Optional extra information
				userId: user.userID,
			},
		};
	} catch (error) {
		console.error("Error verifying token:", error);
		return undefined;
	}
};

// Make authorization required
const authHandler = withMcpAuth(handler, verifyToken, {
	required: true, // Make auth required for all requests
	//requiredScopes: ["offline_access"], // Optional: Require specific scopes
	resourceMetadataPath: "/.well-known/oauth-protected-resource", // Optional: Custom metadata path
});

export { authHandler as GET, authHandler as POST };

