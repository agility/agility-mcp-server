import {
	protectedResourceHandler,
	metadataCorsOptionsRequestHandler,

} from "mcp-handler";
import { NextResponse } from "next/server";

const handler = protectedResourceHandler({
	// Specify the Issuer URL of the associated Authorization Server
	authServerUrls: [`${process.env.BASE_URL || 'http://localhost:3000'}/`]
});

const getHandler = async () => {

	console.log("GET /oauth-authorization-server")

	const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

	return NextResponse.json({
		"resource": `${baseUrl}/api/mcp`,
		"authorization_servers": [
			baseUrl
		]
	})
}

export { getHandler as GET, metadataCorsOptionsRequestHandler as OPTIONS };