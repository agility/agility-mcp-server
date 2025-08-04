'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { Session } from './auth'

interface AuthContextType {
	session: Session | null
	status: 'loading' | 'authenticated' | 'unauthenticated'
	signIn: () => void
	signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

class ClientAuthService {
	private session: Session | null = null
	private status: 'loading' | 'authenticated' | 'unauthenticated' = 'loading'
	private listeners: Set<() => void> = new Set()

	constructor() {
		if (typeof window !== 'undefined') {
			this.checkSession()
		}
	}

	private async checkSession() {
		try {
			const response = await fetch('/api/auth/session')
			if (response.ok) {
				const session = await response.json()
				this.session = session
				this.status = 'authenticated'
			} else {
				this.session = null
				this.status = 'unauthenticated'
			}
		} catch (error) {
			console.error('Error checking session:', error)
			this.session = null
			this.status = 'unauthenticated'
		}
		this.notifyListeners()
	}

	private notifyListeners() {
		this.listeners.forEach(listener => listener())
	}

	public subscribe(listener: () => void) {
		this.listeners.add(listener)
		return () => this.listeners.delete(listener)
	}

	public getSession(): Session | null {
		return this.session
	}

	public getStatus(): 'loading' | 'authenticated' | 'unauthenticated' {
		return this.status
	}

	public async signIn() {
		window.location.href = '/api/auth/authorize'
	}

	public async signOut() {
		try {
			await fetch('/api/auth/signout', { method: 'POST' })
			this.session = null
			this.status = 'unauthenticated'
			this.notifyListeners()
			window.location.href = '/auth/signin'
		} catch (error) {
			console.error('Error signing out:', error)
		}
	}

	public async refreshSession() {
		await this.checkSession()
	}
}

export const clientAuthService = new ClientAuthService()

export function AuthProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<Session | null>(null)
	const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

	useEffect(() => {
		const updateState = () => {
			setSession(clientAuthService.getSession())
			setStatus(clientAuthService.getStatus())
		}

		updateState()
		const unsubscribe = clientAuthService.subscribe(updateState)

		return () => {
			unsubscribe()
		}
	}, [])

	const value: AuthContextType = {
		session,
		status,
		signIn: clientAuthService.signIn.bind(clientAuthService),
		signOut: clientAuthService.signOut.bind(clientAuthService)
	}

	return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>
}

// React hook for using auth in components
export function useAuth(): AuthContextType {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
