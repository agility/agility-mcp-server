import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth'

export async function GET(request: NextRequest) {
	// Get the base URL from the request
	const baseUrl = new URL(request.url).origin

	try {

		const redirect_uri = request.nextUrl.searchParams.get('redirect_uri') || `${baseUrl}/api/auth/callback`
		let scope = request.nextUrl.searchParams.get('scope') || 'offline_access'
		const state = request.nextUrl.searchParams.get('state') || undefined
		if (scope && !scope.includes('offline_access')) {
			scope += ' offline_access'
		}
		const authUrl = authService.generateAuthUrl({ redirect_uri, scope, state })

		return NextResponse.redirect(authUrl)
	} catch (error) {
		console.error('Authorization error:', error)
		return NextResponse.redirect(`${baseUrl}/auth/error?error=Configuration`)
	}
}
