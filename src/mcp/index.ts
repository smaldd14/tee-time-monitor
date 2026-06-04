import { TeeTimeMcpAgent, type McpEnv } from './agent';
import { resolveToken } from './lgg';

export { TeeTimeMcpAgent };

// Reads the user token from the Authorization header (coding agents) or the ?token= query
// param (Claude mobile app connector URLs, which can't set custom headers).
function extractToken(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (auth?.startsWith('Bearer ')) {
    return auth.slice('Bearer '.length).trim();
  }
  const token = new URL(request.url).searchParams.get('token');
  return token && token.trim() ? token.trim() : null;
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request: Request, env: McpEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== '/mcp' && url.pathname !== '/sse') {
      return new Response('Tee Time MCP server', { status: 404 });
    }

    const token = extractToken(request);
    if (!token) return unauthorized();

    const resolved = await resolveToken(env, token);
    if (!resolved) return unauthorized();

    // McpAgent reads identity from ctx.props.
    (ctx as ExecutionContext & { props: unknown }).props = {
      email: resolved.email,
      subscriptionActive: resolved.subscriptionActive,
    };

    if (url.pathname === '/sse') {
      return TeeTimeMcpAgent.serveSSE('/sse').fetch(request, env, ctx);
    }
    return TeeTimeMcpAgent.serve('/mcp').fetch(request, env, ctx);
  },
};
