import { ApiClient } from "@agility/management-sdk/dist/apiClient";
import { Options } from "@agility/management-sdk/dist/models/options";

interface Params {
	token?: string;
	instanceGuid: string;
}

export async function getModels({ token, instanceGuid }: Params) {
	const includeDefaults = false
	const includeModules = false



	if (!instanceGuid || !token) {
		throw new Error('instanceGuid and token are required')
	}

	try {
		const options = new Options()
		options.token = token

		const agilityClient = new ApiClient(options)

		const models = await agilityClient.modelMethods.getContentModules(
			includeDefaults,
			instanceGuid,
			includeModules
		)

		return models
	} catch (error) {
		throw new Error(`Failed to list models: ${error}`)
	}
}