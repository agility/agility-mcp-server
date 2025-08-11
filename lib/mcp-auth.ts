import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { ApiClient, Options } from '@agility/management-sdk';

export const verifyToken = async (
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
