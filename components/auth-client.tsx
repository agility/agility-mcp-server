'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface UserSession {
	accessToken: string
	user: {
		id: string
		name: string
		email: string
		image?: string
	}
	instanceGuid?: string
}

interface AuthContextType {
	session: UserSession | null
	loading: boolean
	signIn: () => void
	signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<UserSession | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		checkSession()
	}, [])

	const checkSession = async () => {
		try {
			const response = await fetch('/api/auth/session')
			if (response.ok) {
				const sessionData = await response.json()
				setSession(sessionData)
			}
		} catch (error) {
			console.error('Failed to check session:', error)
		} finally {
			setLoading(false)
		}
	}

	const signIn = () => {
		window.location.href = '/api/auth/authorize'
	}

	const signOut = async () => {
		try {
			await fetch('/api/auth/signout', { method: 'POST' })
			setSession(null)
			window.location.href = '/auth/signin'
		} catch (error) {
			console.error('Failed to sign out:', error)
		}
	}

	return (
		<AuthContext.Provider value={{ session, loading, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
