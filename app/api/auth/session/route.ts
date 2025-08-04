import { NextResponse } from 'next/server'
import { authService } from '@/lib/auth'

export async function GET() {
	try {
		const session = await authService.getSession()

		if (!session) {
			return NextResponse.json(null, { status: 401 })
		}

		return NextResponse.json(session)
	} catch (error) {
		console.error('Session check error:', error)
		return NextResponse.json(null, { status: 500 })
	}
}
