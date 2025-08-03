'use client'

import { signIn, getSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { useEffect, useState } from 'react'

export default function SignIn() {
	const [session, setSession] = useState<Session | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getSession().then((session) => {
			setSession(session)
			setLoading(false)
		})
	}, [])

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		)
	}

	if (session) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
					<h1 className="text-2xl font-bold text-center mb-6">
						Agility CMS MCP Server
					</h1>
					<div className="text-center">
						<p className="text-green-600 mb-4">✓ Successfully authenticated!</p>
						<p className="text-gray-600 mb-2">
							Welcome, {session.user?.name || session.user?.email}
						</p>
						<p className="text-sm text-gray-500 mb-6">
							Instance GUID: {session.instanceGuid}
						</p>
						<div className="bg-gray-100 p-4 rounded-lg text-left">
							<h3 className="font-semibold mb-2">Available MCP Tools:</h3>
							<ul className="text-sm space-y-1">
								<li>• list_models - List all content models</li>
								<li>• list_page_modules - List all page modules</li>
								<li>• create_model - Create a new content model</li>
								<li>• get_model - Get a specific model</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
				<h1 className="text-2xl font-bold text-center mb-6">
					Agility CMS MCP Server
				</h1>
				<p className="text-gray-600 text-center mb-6">
					Sign in with your Agility CMS account to access the MCP server
				</p>
				<button
					onClick={() => signIn('agility')}
					className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
				>
					Sign in with Agility CMS
				</button>
			</div>
		</div>
	)
}
