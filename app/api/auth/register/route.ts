import { NextRequest, NextResponse } from 'next/server'

// Simple client registration for MCP compatibility
// In production, you might want to store these in a database
const registeredClients = new Map<string, Record<string, unknown>>()

export async function POST(request: NextRequest) {
	try {

		const body = await request.json()

		// Generate a simple client ID for MCP compatibility
		const clientId = `mcp-client-${Date.now()}`
		const clientSecret = `secret-${Math.random().toString(36).substring(2)}`

		const client = {
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uris: body.redirect_uris || ['http://localhost:3000/auth/callback'],
			client_name: body.client_name || 'MCP Client',
			...body
		}

		registeredClients.set(clientId, client)

		return NextResponse.json({
			client_id: clientId,
			client_secret: clientSecret,
			client_name: client.client_name,
			redirect_uris: client.redirect_uris
		})
	} catch (error) {
		console.error('Client registration error:', error)
		return NextResponse.json(
			{ error: 'invalid_client_metadata' },
			{ status: 400 }
		)
	}
}

export async function GET() {
	// Return registration endpoint info
	return NextResponse.json({
		registration_endpoint: `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/register`,
		supported_methods: ['POST']
	})
}
