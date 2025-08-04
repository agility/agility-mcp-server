import { NextResponse } from 'next/server'
import { authService } from '@/lib/auth'

export async function POST() {
	try {
		await authService.clearSession()
		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Signout error:', error)
		return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 })
	}
}
