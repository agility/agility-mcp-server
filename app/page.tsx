'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Agility CMS MCP Server
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="text-green-600 mb-2">✓ Successfully authenticated</div>
          <p className="text-gray-600">Welcome, {session.user?.name || session.user?.email}</p>
          <p className="text-sm text-gray-500">Instance GUID: {session.instanceGuid}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Available MCP Tools</h2>
          <div className="grid gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">list_models</h3>
              <p className="text-gray-600 text-sm">List all content models in your Agility CMS instance</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold">list_page_modules</h3>
              <p className="text-gray-600 text-sm">List all page modules in your Agility CMS instance</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold">create_model</h3>
              <p className="text-gray-600 text-sm">Create a new content model with fields</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold">get_model</h3>
              <p className="text-gray-600 text-sm">Get details of a specific content model by reference name</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
          <div className="space-y-2">
            <div className="bg-gray-100 p-3 rounded">
              <code className="text-sm">POST /api/mcp</code>
              <p className="text-sm text-gray-600 mt-1">
                HTTP endpoint for MCP tool calls (requires authentication)
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <code className="text-sm">server/mcp-server.ts</code>
              <p className="text-sm text-gray-600 mt-1">
                Standalone MCP server for stdio transport
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
