# Agility CMS MCP Server

A Model Context Protocol (MCP) server for Agility CMS management API, built with Next.js and OAuth authentication.

## Features

- OAuth authentication with Agility CMS
- List content models and page modules
- Create new content models
- Get model details by reference name
- Both HTTP API and standalone MCP server

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file with:

```env
# Agility CMS OAuth Configuration
AGILITY_CLIENT_ID=your_client_id
AGILITY_CLIENT_SECRET=your_client_secret
AGILITY_REDIRECT_URI=http://localhost:3000/api/auth/callback/agility

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here

# MCP Server Configuration
MCP_SERVER_PORT=3001
```

### 3. Get Agility CMS OAuth Credentials

1. Log into your Agility CMS organization
2. Go to Settings > Integrations
3. Create a new OAuth application
4. Set redirect URL to: `http://localhost:3000/api/auth/callback/agility`
5. Copy the Client ID and Client Secret to your `.env.local`

## Usage

### Web Interface (with OAuth)

1. Start the development server:

```bash
npm run dev
```

2. Open http://localhost:3000
3. Sign in with your Agility CMS account
4. Use the web interface or make API calls to `/api/mcp`

### Standalone MCP Server

Run the MCP server directly:

```bash
npm run mcp
```

This starts a stdio-based MCP server that can be integrated with MCP clients.

## Available Tools

### `list_models`

List all content models in your Agility CMS instance.

**Parameters:**

- `includeDefaults` (boolean, optional): Include default models (default: true)
- `includeModules` (boolean, optional): Include page modules (default: false)

### `list_components`

List all page modules in your Agility CMS instance.

**Parameters:**

- `includeDefaults` (boolean, optional): Include default modules (default: false)

### `create_model`

Create a new content model.

**Parameters:**

- `displayName` (string, required): Display name for the model
- `referenceName` (string, required): Reference name (unique identifier)
- `description` (string, optional): Description of the model
- `fields` (array, required): Array of field definitions

**Field Definition:**

```json
{
	"name": "field_name",
	"label": "Field Label",
	"type": "Text",
	"description": "Field description",
	"settings": {}
}
```

### `get_model`

Get details of a specific content model.

**Parameters:**

- `referenceName` (string, required): Reference name of the model

## API Endpoints

### POST `/api/mcp`

HTTP endpoint for MCP tool calls. Requires authentication.

**Request Body:**

```json
{
	"method": "list_models",
	"params": {
		"includeDefaults": true
	}
}
```

**Response:**

```json
{
  "success": true,
  "data": [...]
}
```

## Authentication Flow

1. User visits the web interface
2. Redirected to Agility CMS OAuth
3. User authorizes the application
4. OAuth callback receives authorization code
5. Code exchanged for access token
6. Token stored in session for API calls

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts    # NextAuth configuration
│   │   └── mcp/route.ts                   # HTTP MCP endpoints
│   ├── auth/
│   │   ├── signin/page.tsx                # Sign-in page
│   │   └── error/page.tsx                 # Error page
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # Home page
│   └── providers.tsx                      # Session provider
├── server/
│   └── mcp-server.ts                      # Standalone MCP server
└── .env.local                             # Environment variables
```

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

### Debugging

Enable debug mode by setting:

```env
DEBUG=mcp:*
```

## Supported Field Types

- Text
- TextArea
- Number
- Boolean
- Date
- DateTime
- Image
- File
- URL
- HTML
- RichText
- Reference
- MultipleReferences

## Error Handling

The MCP server includes comprehensive error handling:

- Authentication errors
- API request failures
- Invalid parameters
- Network timeouts

## Security

- OAuth 2.0 flow for secure authentication
- Session-based token storage
- Environment variable protection
- Request validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
