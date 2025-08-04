import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
	// Handle .well-known files

	// Handle OPTIONS request
	if (request.method === 'OPTIONS') {

		return new NextResponse(null, {
			status: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				'Access-Control-Max-Age': '86400',
				'Content-Type': 'application/json',
			},
		})
	}

	// Handle GET request - add CORS headers
	if (request.nextUrl.pathname.startsWith('/api/')) {
		const response = NextResponse.next()
		response.headers.set('Access-Control-Allow-Origin', '*')
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
		response.headers.set('Content-Type', 'application/json')
		response.headers.set('Cache-Control', 'public, max-age=3600')
		return response
	}


	return NextResponse.next()
}

export const config = {
	matcher: [
		'/.well-known/:path*',
	],
}
