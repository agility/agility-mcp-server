import { ApiClient } from "@agility/management-sdk/dist/apiClient";
import { Options } from "@agility/management-sdk/dist/models/options";

interface Params {
	token?: string;
	instanceGuid: string;
}

export async function getComponents({ token, instanceGuid }: Params) {
	const includeDefaults = false

	if (!instanceGuid || !token) {
		throw new Error('instanceGuid and token are required')
	}

	try {
		const options = new Options()
		options.token = token

		const agilityClient = new ApiClient(options)

		const components = await agilityClient.modelMethods.getPageModules(
			includeDefaults,
			instanceGuid
		)

		return components
	} catch (error) {
		throw new Error(`Failed to list components: ${error}`)
	}
}