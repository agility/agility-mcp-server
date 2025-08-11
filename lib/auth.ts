import { cookies } from 'next/headers'

export interface User {
	id: string
	name: string
	email: string
	image: string
}

export interface Session {
	user: User
	accessToken: string
	refreshToken: string
	instanceGuid: string
	expiresAt: number
}

export interface AgilityProfile {
	userID: number
	firstName: string
	lastName: string
	emailAddress: string
}

const AGILITY_OAUTH_BASE = 'https://mgmt.aglty.io/oauth'
const AGILITY_API_BASE = 'https://mgmt.aglty.io/api/v1'

interface AuthUrlProps {
	state?: string
	redirect_uri?: string
	scope?: string
}

export class AuthService {
	private clientId: string
	private clientSecret: string
	private redirectUri: string

	constructor() {
		this.clientId = "abc"
		this.clientSecret = "123"
		this.redirectUri = `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/callback`
	}

	generateAuthUrl({ state, redirect_uri, scope }: AuthUrlProps): string {
		const params = new URLSearchParams({
			client_id: this.clientId,
			response_type: 'code',
			scope: scope || 'offline_access',
			redirect_uri: redirect_uri || this.redirectUri,
			...(state && { state })
		})

		return `${AGILITY_OAUTH_BASE}/authorize?${params.toString()}`
	}

	async exchangeCodeForTokens(code: string): Promise<{
		access_token: string
		refresh_token: string
		expires_in: number
	}> {
		const response = await fetch(`${AGILITY_OAUTH_BASE}/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: this.redirectUri
			})
		})

		if (!response.ok) {
			const error = await response.text()
			throw new Error(`Token exchange failed: ${error}`)
		}

		return response.json()
	}

	async getUserProfile(accessToken: string): Promise<AgilityProfile> {
		const response = await fetch(`${AGILITY_API_BASE}/users/me`, {
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		})

		if (!response.ok) {
			throw new Error('Failed to fetch user profile')
		}

		return response.json()
	}

	async refreshAccessToken(refreshToken: string): Promise<{
		access_token: string
		refresh_token: string
		expires_in: number
	}> {
		const response = await fetch(`${AGILITY_OAUTH_BASE}/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
			},
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			})
		})

		if (!response.ok) {
			throw new Error('Token refresh failed')
		}

		return response.json()
	}

	async setSession(session: Session) {
		const cookieStore = await cookies()
		cookieStore.set('auth-session', JSON.stringify(session), {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000))
		})
	}

	async getSession(): Promise<Session | null> {
		try {
			const cookieStore = await cookies()
			const sessionCookie = cookieStore.get('auth-session')

			if (!sessionCookie?.value) {
				return null
			}

			const session: Session = JSON.parse(sessionCookie.value)

			// Check if session is expired
			if (Date.now() > session.expiresAt) {
				await this.clearSession()
				return null
			}

			return session
		} catch {
			return null
		}
	}

	async clearSession() {
		const cookieStore = await cookies()
		cookieStore.delete('auth-session')
	}

	async createSession(code: string): Promise<Session> {
		// Exchange code for tokens
		const tokens = await this.exchangeCodeForTokens(code)

		// Get user profile
		const profile = await this.getUserProfile(tokens.access_token)

		// Create session
		const session: Session = {
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
			user: {
				id: profile.userID.toString(),
				name: `${profile.firstName} ${profile.lastName}`.trim(),
				email: profile.emailAddress,
				image: `${AGILITY_API_BASE}/users/Avatar?userId=${profile.userID}`
			},
			instanceGuid: '', // Will be populated from user's instance selection or default
			expiresAt: Date.now() + (tokens.expires_in * 1000)
		}

		await this.setSession(session)
		return session
	}
}

export const authService = new AuthService()
