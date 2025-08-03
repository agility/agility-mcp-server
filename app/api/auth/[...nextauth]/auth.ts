import NextAuth from 'next-auth'

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

const config = {
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
			profile(profile: any) {
				return {
					id: profile.userID?.toString() || '',
					name: `${profile.firstName} ${profile.lastName}`.trim(),
					email: profile.emailAddress,
					image: null,
				}
			},
		},
	],
	callbacks: {
		async jwt({ token, account, profile }: any) {
			if (account) {
				token.accessToken = account.access_token
				token.refreshToken = account.refresh_token

				// Get instance GUID from user profile
				if (profile && profile.websiteAccess && profile.websiteAccess.length > 0) {
					token.instanceGuid = profile.websiteAccess[0].guid
				}
			}
			return token
		},
		async session({ session, token }: any) {
			session.accessToken = token.accessToken
			session.refreshToken = token.refreshToken
			session.instanceGuid = token.instanceGuid
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
