import { Profile } from '@/lib/types/Profile'
import NextAuth, { Account, AuthOptions, JWT, User } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'


declare module 'next-auth' {
	interface Session {
		accessToken?: string
		refreshToken?: string
		instanceGuid?: string
	}

	interface JWT {
		accessToken?: string
		refreshToken?: string
		instanceGuid?: string
	}
}

const config: AuthOptions = {
	providers: [
		{
			id: 'agility',
			name: 'Agility CMS',
			type: 'oauth' as const,
			authorization: {
				url: 'https://mgmt.aglty.io/oauth/authorize',
				params: {
					scope: 'openid',
					response_type: 'code',
				},
			},
			token: 'https://mgmt.aglty.io/oauth/token',
			userinfo: 'https://mgmt.aglty.io/api/v1/users/me',
			clientId: process.env.AGILITY_CLIENT_ID,
			clientSecret: process.env.AGILITY_CLIENT_SECRET,
			profile(profile: Profile) {
				return {
					id: profile.userID?.toString() || '',
					name: `${profile.firstName} ${profile.lastName}`.trim(),
					email: profile.emailAddress,
					image: `https://mgmt.aglty.io/api/v1/users/Avatar?userId=${profile.userID}`,
				}
			},
		},
	],
	callbacks: {
		async jwt({ token, user, account, profile }) {
			// Store access token and refresh token from OAuth provider during sign in
			if (account) {
				token.accessToken = account.access_token
				token.refreshToken = account.refresh_token
			}

			return token
		},
		async session({ session, token }) {
			// Send properties to the client
			session.accessToken = token.accessToken as string
			session.refreshToken = token.refreshToken as string

			return session
		},
	},
	pages: {
		signIn: '/auth/signin',
		error: '/auth/error',
	},
}

const handler = NextAuth(config)
export { handler as GET, handler as POST }
