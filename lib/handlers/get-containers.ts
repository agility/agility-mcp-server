import { Container } from "@agility/management-sdk";
import { ApiClient } from "@agility/management-sdk/dist/apiClient";
import { Options } from "@agility/management-sdk/dist/models/options";
import { ContainerSchema, ZodContainer, containerToZodContainer } from "../types/zod-container";

interface Params {
	token?: string;
	instanceGuid: string;
}

export async function getContainers({ token, instanceGuid }: Params): Promise<ZodContainer[]> {

	if (!instanceGuid || !token) {
		throw new Error('instanceGuid and token are required')
	}

	try {
		const options = new Options()
		options.token = token

		const agilityClient = new ApiClient(options)

		let lst = await agilityClient.containerMethods.getContainerList(
			instanceGuid
		)

		//filter out the system lists
		/*
		AgilityCSSFiles - CSS file management
AgilityJavascriptFiles - JavaScript file management
AgilityGlobalCodeTemplates - Global code templates
AgilityModuleCodeTemplates - Module code templates
AgilityPageCodeTemplates - Page code templates
		*/
		lst = lst.filter(container => {

			return ![
				//ignore the system lists
				"AgilityCSSFiles",
				"AgilityJavascriptFiles",
				"AgilityGlobalCodeTemplates",
				"AgilityModuleCodeTemplates",
				"AgilityPageCodeTemplates"
			].includes(container.referenceName || "")
				//only pull shared or dynamic lists
				&& (container.isShared || container.isDynamicPageList)

				//ignore anything not a list of single item
				&& (container.contentDefinitionTypeID || 1) !== 2;
		});

		// Convert the list of Container items to ZodContainer using our conversion function
		return lst.map(containerToZodContainer);



	} catch (error) {
		throw new Error(`Failed to list containers: ${error}`)
	}
}