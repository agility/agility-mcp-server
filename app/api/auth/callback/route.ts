import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const code = searchParams.get('code')
	const error = searchParams.get('error')

	// Get the base URL from the request
	const baseUrl = new URL(request.url).origin

	if (error) {
		return NextResponse.redirect(`${baseUrl}/auth/error?error=${error}`)
	}

	if (!code) {
		return NextResponse.redirect(`${baseUrl}/auth/error?error=AccessDenied`)
	}

	try {
		await authService.createSession(code)
		return NextResponse.redirect(`${baseUrl}/`)
	} catch (error) {
		console.error('OAuth callback error:', error)
		return NextResponse.redirect(`${baseUrl}/auth/error?error=Configuration`)
	}
}
