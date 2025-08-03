import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { ApiClient, Options, Model, ModelField } from '@agility/management-sdk'

interface SessionWithTokens {
	accessToken: string;
	instanceGuid: string;
}

interface McpParams {
	[key: string]: unknown;
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession() as SessionWithTokens | null

		if (!session || !session.accessToken || !session.instanceGuid) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			)
		}

		const body = await request.json()
		const { method, params } = body

		// Initialize Agility client
		const options = new Options()
		options.token = session.accessToken
		options.baseUrl = 'https://mgmt.aglty.io'

		const agilityClient = new ApiClient(options)

		switch (method) {
			case 'list_models':
				return await handleListModels(agilityClient, session.instanceGuid, params)
			case 'list_page_modules':
				return await handleListPageModules(agilityClient, session.instanceGuid, params)
			case 'create_model':
				return await handleCreateModel(agilityClient, session.instanceGuid, params)
			case 'get_model':
				return await handleGetModel(agilityClient, session.instanceGuid, params)
			default:
				return NextResponse.json(
					{ error: `Unknown method: ${method}` },
					{ status: 400 }
				)
		}
	} catch (error) {
		console.error('MCP API Error:', error)
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}

async function handleListModels(client: ApiClient, instanceGuid: string, params: McpParams) {
	const includeDefaults = Boolean(params?.includeDefaults) ?? true
	const includeModules = Boolean(params?.includeModules) ?? false

	try {
		const models = await client.modelMethods.getContentModules(
			includeDefaults,
			instanceGuid,
			includeModules
		)

		return NextResponse.json({
			success: true,
			data: models.map((model: Model) => ({
				id: (model as unknown as Record<string, unknown>).id,
				displayName: model.displayName,
				referenceName: model.referenceName,
				description: model.description,
				fieldsCount: model.fields?.length || 0,
				isPublished: (model as unknown as Record<string, unknown>).isPublished,
			}))
		})
	} catch (error) {
		throw new Error(`Failed to list models: ${error}`)
	}
}

async function handleListPageModules(client: ApiClient, instanceGuid: string, params: McpParams) {
	const includeDefaults = Boolean(params?.includeDefaults) ?? true

	try {
		const modules = await client.modelMethods.getPageModules(
			includeDefaults,
			instanceGuid,
		)

		return NextResponse.json({
			success: true,
			data: modules.map((module: Model) => ({
				id: (module as unknown as Record<string, unknown>).id,
				displayName: module.displayName,
				referenceName: module.referenceName,
				description: module.description,
				fieldsCount: module.fields?.length || 0,
			}))
		})
	} catch (error) {
		throw new Error(`Failed to list page modules: ${error}`)
	}
}

async function handleCreateModel(client: ApiClient, instanceGuid: string, params: McpParams) {
	const { displayName, referenceName, fields } = params

	if (!displayName || !referenceName || !fields) {
		throw new Error('displayName, referenceName, and fields are required')
	}

	try {
		const model = new Model()
		const modelField = new ModelField()

		const modelData = model
		modelData.displayName = displayName as string
		modelData.referenceName = referenceName as string
		modelData.fields = (fields as Array<Record<string, unknown>>).map((field) => {
			const newField = modelField
			newField.name = field.name as string
			newField.type = field.type as string
			newField.settings = (field.settings as Record<string, string>) || {}
			return newField
		})

		const createdModel = await client.modelMethods.saveModel(modelData, instanceGuid)

		return NextResponse.json({
			success: true,
			data: {
				id: (createdModel as unknown as Record<string, unknown>).id,
				displayName: createdModel.displayName,
				referenceName: createdModel.referenceName,
				description: createdModel.description,
				fields: createdModel.fields?.map((field: ModelField) => ({
					name: field.name,
					type: field.type,
					settings: field.settings,
				}))
			}
		})
	} catch (error) {
		throw new Error(`Failed to create model: ${error}`)
	}
}

async function handleGetModel(client: ApiClient, instanceGuid: string, params: McpParams) {
	const { referenceName } = params

	if (!referenceName) {
		throw new Error('referenceName is required')
	}

	try {
		const model = await client.modelMethods.getModelByReferenceName(referenceName as string, instanceGuid)

		return NextResponse.json({
			success: true,
			data: {
				id: (model as unknown as Record<string, unknown>).id,
				displayName: model.displayName,
				referenceName: model.referenceName,
				description: model.description,
				fields: model.fields?.map((field: ModelField) => ({
					name: field.name,
					type: field.type,
					settings: field.settings,
				}))
			}
		})
	} catch (error) {
		throw new Error(`Failed to get model: ${error}`)
	}
}
