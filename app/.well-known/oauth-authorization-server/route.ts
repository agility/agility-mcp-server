import { NextResponse } from 'next/server'

// Simple JWKS endpoint for OAuth compatibility
// In a real implementation, you'd generate and manage actual keys
export async function GET() {

	console.log("GET /oauth-authorization-server")

	const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

	return NextResponse.json({
		"issuer": baseUrl,
		"authorization_endpoint": `${baseUrl}/api/auth/authorize`,
		"token_endpoint": `${baseUrl}/api/auth/token`,
		"registration_endpoint": `${baseUrl}/api/auth/register`,
		"jwks_uri": `${baseUrl}/api/auth/jwks`,
		"response_types_supported": [
			"code"
		],
		"grant_types_supported": [
			"authorization_code",
			"refresh_token"
		],
		"id_token_signing_alg_values_supported": [
			"RS256"
		],
		"token_endpoint_auth_methods_supported": [
			"none"
		],
		"code_challenge_methods_supported": [
			"S256"
		],
		"scopes_supported": [
			"offline_access"
		],
		"service_documentation": "https://agilitycms.com/docs",
		"op_policy_uri": "https://agilitycms.com/privacy-policy",
		"op_tos_uri": "https://agilitycms.com/customer-agreement"
	})
}
