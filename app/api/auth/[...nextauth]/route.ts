import NextAuth, { AuthOptions } from 'next-auth'

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

interface AgilityProfile {
	userID: number;
	firstName: string;
	lastName: string;
	emailAddress: string;
	websiteAccess: Array<{
		guid: string;
		websiteName: string;
	}>;
}

const config: AuthOptions = {
	providers: [
		{
			id: 'agility',
			name: 'Agility CMS',
			type: 'oauth',
			authorization: {
				url: 'https://mgmt.aglty.io/oauth/authorize',
				params: {
					scope: 'offline_access',
					response_type: 'code',
				},
			},
			token: 'https://mgmt.aglty.io/oauth/token',
			userinfo: 'https://mgmt.aglty.io/api/v1/users/me',
			clientId: process.env.AGILITY_CLIENT_ID,
			clientSecret: process.env.AGILITY_CLIENT_SECRET,
			profile(profile: AgilityProfile) {
				return {
					id: profile.userID?.toString() || '',
					name: `${profile.firstName} ${profile.lastName}`.trim(),
					email: profile.emailAddress || null,
					image: null,
				}
			},
		},
	],
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account) {
				token.accessToken = account.access_token
				token.refreshToken = account.refresh_token

				// Get instance GUID from user profile
				if (profile && 'websiteAccess' in profile && Array.isArray((profile as AgilityProfile).websiteAccess) && (profile as AgilityProfile).websiteAccess.length > 0) {
					token.instanceGuid = (profile as AgilityProfile).websiteAccess[0].guid
				}
			}
			return token
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken as string
			session.refreshToken = token.refreshToken as string
			session.instanceGuid = token.instanceGuid as string
			return session
		},
	},
	pages: {
		signIn: '/auth/signin',
	},
	secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(config)
export { handler as GET, handler as POST }
