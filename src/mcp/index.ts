import { OAuthProvider } from '@cloudflare/workers-oauth-provider';
import { TeeTimeMcpAgent, type McpEnv } from './agent';
import { AuthHandler } from './authorize';

export { TeeTimeMcpAgent };

// Routes /mcp and /sse to the appropriate McpAgent handler after OAuthProvider validates the token.
// ctx.props is populated by OAuthProvider from the encrypted props stored during authorization.
const McpHandler = {
  async fetch(request: Request, env: McpEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/sse') {
      return TeeTimeMcpAgent.serveSSE('/sse').fetch(request, env, ctx);
    }
    return TeeTimeMcpAgent.serve('/mcp').fetch(request, env, ctx);
  },
};

export default new OAuthProvider<McpEnv>({
  apiRoute: ['/mcp', '/sse'],
  apiHandler: McpHandler,
  defaultHandler: AuthHandler,
  authorizeEndpoint: '/authorize',
  tokenEndpoint: '/oauth/token',
  clientRegistrationEndpoint: '/oauth/register',
  accessTokenTTL: 7 * 24 * 60 * 60, // 7 days — long-lived so Claude mobile doesn't re-auth constantly
});
