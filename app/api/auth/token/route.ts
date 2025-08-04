import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth'

// This endpoint is for MCP clients to get current session tokens
// We're no longer acting as an OAuth provider, just proxying to Agility CMS
export async function POST(request: NextRequest) {
	try {

		//get the "code" from the request body
		const body = await request.formData()
		const code = body.get('code')

		if (!code || typeof code !== 'string') {
			return NextResponse.json(
				{ error: 'Invalid request' },
				{ status: 400 }
			)
		}

		const tokens = await authService.exchangeCodeForTokens(code)

		// Return tokens in OAuth format for MCP compatibility
		return NextResponse.json({
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			token_type: 'Bearer',
			expires_in: Math.max(0, Math.floor((tokens.expires_in - Date.now()) / 1000)),
			scope: 'openid agility:read agility:write'
		})
	} catch (error) {
		console.error('Token endpoint error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
