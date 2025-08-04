# OAuth Dynamic Client Registration

This implementation provides OAuth 2.0 Dynamic Client Registration as specified in [RFC 7591](https://tools.ietf.org/html/rfc7591).

## Endpoints

### POST /api/auth/register

Register a new OAuth client dynamically.

**Request Body:**

```json
{
	"redirect_uris": ["https://example.com/callback"],
	"client_name": "My Application",
	"client_uri": "https://example.com",
	"logo_uri": "https://example.com/logo.png",
	"scope": "openid profile email agility:read",
	"contacts": ["admin@example.com"],
	"tos_uri": "https://example.com/tos",
	"policy_uri": "https://example.com/privacy",
	"token_endpoint_auth_method": "client_secret_basic",
	"grant_types": ["authorization_code", "refresh_token"],
	"response_types": ["code"]
}
```

**Response:**

```json
{
	"client_id": "abc123...",
	"client_secret": "def456...",
	"client_name": "My Application",
	"redirect_uris": ["https://example.com/callback"],
	"scope": "openid profile email agility:read",
	"token_endpoint_auth_method": "client_secret_basic",
	"grant_types": ["authorization_code", "refresh_token"],
	"response_types": ["code"],
	"client_id_issued_at": 1691234567,
	"client_secret_expires_at": 1722770567
}
```

### GET /auth/authorize

OAuth authorization endpoint.

**Parameters:**

- `client_id`: The client identifier
- `redirect_uri`: Callback URI
- `response_type`: Must be "code"
- `scope`: Requested scopes (optional)
- `state`: State parameter for CSRF protection (recommended)
- `code_challenge`: PKCE code challenge (optional)
- `code_challenge_method`: Must be "S256" if using PKCE

### POST /auth/token

OAuth token endpoint.

**Grant Types Supported:**

- `authorization_code`
- `refresh_token`

**Client Authentication Methods:**

- `client_secret_basic` (HTTP Basic)
- `client_secret_post` (POST body)
- `none` (for public clients)

### GET /.well-known/jwks.json

JSON Web Key Set for JWT verification.

## Usage Example

1. **Register a client:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "redirect_uris": ["https://myapp.com/callback"],
    "client_name": "My App",
    "scope": "openid profile email agility:read"
  }'
```

2. **Start authorization flow:**

```
GET http://localhost:3000/auth/authorize?client_id=abc123&redirect_uri=https://myapp.com/callback&response_type=code&scope=openid%20profile&state=xyz789
```

3. **Exchange code for tokens:**

```bash
curl -X POST http://localhost:3000/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "client_id:client_secret" \
  -d "grant_type=authorization_code&code=auth_code&redirect_uri=https://myapp.com/callback"
```

## Security Considerations

- **HTTPS Only**: In production, all endpoints must use HTTPS
- **Client Storage**: Currently uses in-memory storage. In production, use a proper database
- **Key Management**: JWKS endpoint uses mock keys. Implement proper RSA key generation and management
- **User Authentication**: The authorization endpoint currently simulates user consent. Implement proper user authentication and consent screens
- **Rate Limiting**: Implement rate limiting on registration and token endpoints
- **Client Validation**: Add additional client validation rules as needed

## Production Deployment

Before deploying to production:

1. Replace in-memory storage with a database
2. Implement proper RSA key generation and JWT signing
3. Add user authentication and consent screens
4. Add rate limiting and security headers
5. Implement proper logging and monitoring
6. Add client metadata validation
7. Consider implementing client registration policies
