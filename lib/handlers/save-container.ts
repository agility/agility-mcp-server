import { Container } from "@agility/management-sdk";
import { ApiClient } from "@agility/management-sdk/dist/apiClient";
import { Options } from "@agility/management-sdk/dist/models/options";
import { ZodContainer, zodContainerToContainer } from "../types/zod-container";

interface Params {
	token?: string;
	instanceGuid: string;
	container: ZodContainer;
}

export async function saveContainer({ token, instanceGuid, container }: Params) {

	if (!instanceGuid || !token) {
		throw new Error('instanceGuid and token are required')
	}

	try {
		const options = new Options()
		options.token = token

		const agilityClient = new ApiClient(options)

		// Convert ZodContainer to SDK Container
		const sdkContainer = zodContainerToContainer(container);

		const result = await agilityClient.containerMethods.saveContainer(
			sdkContainer,
			instanceGuid
		)

		return result
	} catch (error) {
		throw new Error(`Failed to save container: ${error}`)
	}
}