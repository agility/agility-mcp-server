import { NextResponse } from 'next/server'

// Simple JWKS endpoint for OAuth compatibility
// In a real implementation, you'd generate and manage actual keys
export async function GET() {
	return NextResponse.json({
		keys: [
			{
				kty: 'RSA',
				use: 'sig',
				kid: 'agility-mcp-key',
				alg: 'RS256',
				n: 'example_modulus_placeholder',
				e: 'AQAB'
			}
		]
	})
}
