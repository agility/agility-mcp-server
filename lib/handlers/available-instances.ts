import { ApiClient, Options } from "@agility/management-sdk";

export async function getAvailableInstances(token?: string) {

	if (!token) {
		throw new Error("Token is required to get available instances.");
	}
	try {

		const options = new Options()
		options.token = token

		const agilityClient = new ApiClient(options)

		const user = await agilityClient.serverUserMethods.me('');

		// Extract instance information from WebsiteAccess
		const instances = user.websiteAccess?.map((access) => ({
			guid: access.guid,
			name: access.displayName || access.websiteName || "Unnamed Instance",
			org: access.orgName || "Unknown Org"
		})) || []

		//sort the instances by org and name
		instances.sort((a, b) => {
			if (a.org === b.org) {
				return a.name.localeCompare(b.name);
			}
			return a.org.localeCompare(b.org);
		});

		return instances

	} catch (error) {
		throw new Error(`Failed to get available instances: ${error instanceof Error ? error.message : String(error)}`)
	}
}