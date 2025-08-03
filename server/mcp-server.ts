import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
	CallToolRequestSchema,
	ErrorCode,
	ListToolsRequestSchema,
	McpError,
} from '@modelcontextprotocol/sdk/types.js'
import { ApiClient } from '@agility/management-sdk'

interface McpTool {
	name: string
	description: string
	inputSchema: {
		type: 'object'
		properties: Record<string, any>
		required?: string[]
	}
}

class AgilityMcpServer {
	private server: Server
	private agilityClient: ApiClient | null = null

	constructor() {
		this.server = new Server(
			{
				name: 'agility-mcp-server',
				version: '1.0.0',
			},
			{
				capabilities: {
					tools: {},
				},
			}
		)

		this.setupToolHandlers()
	}

	private setupToolHandlers() {
		this.server.setRequestHandler(ListToolsRequestSchema, async () => {
			return {
				tools: this.getAvailableTools(),
			}
		})

		this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
			const { name, arguments: args } = request.params

			if (!this.agilityClient) {
				throw new McpError(
					ErrorCode.InvalidRequest,
					'Agility client not initialized. Please authenticate first.'
				)
			}

			try {
				switch (name) {
					case 'authenticate':
						return await this.authenticate(args)
					case 'list_models':
						return await this.listModels(args)
					case 'list_page_modules':
						return await this.listPageModules(args)
					case 'create_model':
						return await this.createModel(args)
					case 'get_model':
						return await this.getModel(args)
					default:
						throw new McpError(
							ErrorCode.MethodNotFound,
							`Unknown tool: ${name}`
						)
				}
			} catch (error) {
				throw new McpError(
					ErrorCode.InternalError,
					`Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
				)
			}
		})
	}

	private getAvailableTools(): McpTool[] {
		return [
			{
				name: 'authenticate',
				description: 'Authenticate with Agility CMS using access token and instance GUID',
				inputSchema: {
					type: 'object',
					properties: {
						accessToken: {
							type: 'string',
							description: 'OAuth access token from Agility CMS',
						},
						instanceGuid: {
							type: 'string',
							description: 'Instance GUID of the Agility CMS website',
						},
					},
					required: ['accessToken', 'instanceGuid'],
				},
			},
			{
				name: 'list_models',
				description: 'List all content models in the Agility CMS instance',
				inputSchema: {
					type: 'object',
					properties: {
						includeDefaults: {
							type: 'boolean',
							description: 'Include default models',
							default: true,
						},
						includeModules: {
							type: 'boolean',
							description: 'Include page modules',
							default: false,
						},
					},
				},
			},
			{
				name: 'list_page_modules',
				description: 'List all page modules in the Agility CMS instance',
				inputSchema: {
					type: 'object',
					properties: {
						includeDefaults: {
							type: 'boolean',
							description: 'Include default modules',
							default: false,
						},
					},
				},
			},
			{
				name: 'create_model',
				description: 'Create a new content model',
				inputSchema: {
					type: 'object',
					properties: {
						displayName: {
							type: 'string',
							description: 'Display name for the model',
						},
						referenceName: {
							type: 'string',
							description: 'Reference name for the model (unique identifier)',
						},
						description: {
							type: 'string',
							description: 'Description of the model',
						},
						fields: {
							type: 'array',
							description: 'Array of field definitions',
							items: {
								type: 'object',
								properties: {
									name: { type: 'string' },
									label: { type: 'string' },
									type: { type: 'string' },
									settings: { type: 'object' },
									description: { type: 'string' },
								},
								required: ['name', 'label', 'type'],
							},
						},
					},
					required: ['displayName', 'referenceName', 'fields'],
				},
			},
			{
				name: 'get_model',
				description: 'Get a specific content model by reference name',
				inputSchema: {
					type: 'object',
					properties: {
						referenceName: {
							type: 'string',
							description: 'Reference name of the model to retrieve',
						},
					},
					required: ['referenceName'],
				},
			},
		]
	}

	private async authenticate(args: any) {
		const { accessToken, instanceGuid } = args

		if (!accessToken || !instanceGuid) {
			throw new Error('Access token and instance GUID are required')
		}

		const options = new (require('@agility/management-sdk').Options)()
		options.token = accessToken
		options.baseUrl = 'https://mgmt.aglty.io'

		this.agilityClient = new ApiClient(options)

		// Test the connection
		try {
			const user = await this.agilityClient.serverUserMethods.me(instanceGuid)
			return {
				content: [
					{
						type: 'text',
						text: `Successfully authenticated as ${user.firstName} ${user.lastName} (${user.emailAddress})`,
					},
				],
			}
		} catch (error) {
			this.agilityClient = null
			throw new Error(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	private async listModels(args: any) {
		if (!this.agilityClient) {
			throw new Error('Not authenticated')
		}

		const { includeDefaults = true, includeModules = false } = args

		try {
			// Get the instance GUID - this would need to be stored during authentication
			const instanceGuid = process.env.AGILITY_INSTANCE_GUID || args.instanceGuid
			if (!instanceGuid) {
				throw new Error('Instance GUID not available')
			}

			const models = await this.agilityClient.modelMethods.getContentModules(
				includeDefaults,
				instanceGuid,
				includeModules
			)

			return {
				content: [
					{
						type: 'text',
						text: `Found ${models.length} content models:\n\n${models
							.map(
								(model: any) =>
									`- **${model.displayName}** (${model.referenceName})\n  ${model.description || 'No description'}\n  Fields: ${model.fields?.length || 0}`
							)
							.join('\n\n')}`,
					},
				],
			}
		} catch (error) {
			throw new Error(`Failed to list models: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	private async listPageModules(args: any) {
		if (!this.agilityClient) {
			throw new Error('Not authenticated')
		}

		const { includeDefaults = false } = args

		try {
			const instanceGuid = process.env.AGILITY_INSTANCE_GUID || args.instanceGuid
			if (!instanceGuid) {
				throw new Error('Instance GUID not available')
			}

			const modules = await this.agilityClient.modelMethods.getPageModules(
				includeDefaults,
				instanceGuid
			)

			return {
				content: [
					{
						type: 'text',
						text: `Found ${modules.length} page modules:\n\n${modules
							.map(
								(module: any) =>
									`- **${module.displayName}** (${module.referenceName})\n  ${module.description || 'No description'}\n  Fields: ${module.fields?.length || 0}`
							)
							.join('\n\n')}`,
					},
				],
			}
		} catch (error) {
			throw new Error(`Failed to list page modules: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	private async createModel(args: any) {
		if (!this.agilityClient) {
			throw new Error('Not authenticated')
		}

		const { displayName, referenceName, description, fields } = args

		try {
			const instanceGuid = process.env.AGILITY_INSTANCE_GUID || args.instanceGuid
			if (!instanceGuid) {
				throw new Error('Instance GUID not available')
			}

			const Model = require('@agility/management-sdk').Model
			const ModelField = require('@agility/management-sdk').ModelField

			const modelData = new Model()
			modelData.displayName = displayName
			modelData.referenceName = referenceName
			modelData.description = description
			modelData.fields = fields.map((field: any, index: number) => {
				const modelField = new ModelField()
				modelField.name = field.name
				modelField.label = field.label
				modelField.type = field.type
				modelField.settings = field.settings || {}
				modelField.description = field.description
				modelField.itemOrder = index + 1
				return modelField
			})

			const createdModel = await this.agilityClient.modelMethods.saveModel(
				modelData,
				instanceGuid
			)

			return {
				content: [
					{
						type: 'text',
						text: `Successfully created content model "${displayName}" with reference name "${referenceName}"\nModel ID: ${createdModel.id}`,
					},
				],
			}
		} catch (error) {
			throw new Error(`Failed to create model: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	private async getModel(args: any) {
		if (!this.agilityClient) {
			throw new Error('Not authenticated')
		}

		const { referenceName } = args

		try {
			const instanceGuid = process.env.AGILITY_INSTANCE_GUID || args.instanceGuid
			if (!instanceGuid) {
				throw new Error('Instance GUID not available')
			}

			const model = await this.agilityClient.modelMethods.getModelByReferenceName(
				referenceName,
				instanceGuid
			)

			const fieldsInfo = model.fields
				?.map(
					(field: any) =>
						`  - **${field.label}** (${field.name}): ${field.type}\n    ${field.description || 'No description'}`
				)
				.join('\n') || 'No fields'

			return {
				content: [
					{
						type: 'text',
						text: `**${model.displayName}** (${model.referenceName})\n\n${model.description || 'No description'}\n\n**Fields:**\n${fieldsInfo}`,
					},
				],
			}
		} catch (error) {
			throw new Error(`Failed to get model: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	async run() {
		const transport = new StdioServerTransport()
		await this.server.connect(transport)
		console.error('Agility MCP Server running on stdio')
	}
}

const server = new AgilityMcpServer()
server.run().catch(console.error)
