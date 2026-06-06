import { resolveToken } from './lgg';
import type { McpEnv } from './agent';

function renderForm(error?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connect to Tee Time Monitor</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 420px; margin: 80px auto; padding: 0 20px; color: #1a1a1a; }
    h1 { font-size: 1.4rem; margin-bottom: 8px; }
    p { color: #555; font-size: 0.9rem; margin-bottom: 24px; }
    label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; }
    input[type="text"] { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; }
    button { margin-top: 12px; width: 100%; padding: 11px; background: #16a34a; color: #fff; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; }
    button:hover { background: #15803d; }
    .error { color: #dc2626; font-size: 0.85rem; margin-top: 10px; }
    a { color: #16a34a; font-size: 0.85rem; }
  </style>
</head>
<body>
  <h1>Connect to Tee Time Monitor</h1>
  <p>Paste your MCP token below. You can find it on the <a href="https://app.teetimemonitor.com/connect" target="_blank">connect page</a>.</p>
  <form method="POST">
    <label for="token">MCP Token</label>
    <input type="text" id="token" name="token" placeholder="ttm_..." autocomplete="off" required>
    <button type="submit">Connect</button>
    ${error ? `<p class="error">${error}</p>` : ''}
  </form>
</body>
</html>`;
}

export const AuthHandler = {
  async fetch(request: Request, env: McpEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== '/authorize') {
      return new Response('Not found', { status: 404 });
    }

    if (request.method === 'GET') {
      return new Response(renderForm(), { headers: { 'Content-Type': 'text/html' } });
    }

    if (request.method === 'POST') {
      const body = await request.formData();
      const token = (body.get('token') as string | null)?.trim() ?? '';

      if (!token) {
        return new Response(renderForm('Token is required.'), {
          status: 400,
          headers: { 'Content-Type': 'text/html' },
        });
      }

      const resolved = await resolveToken(env, token);
      if (!resolved) {
        return new Response(renderForm('Invalid token. Check the connect page and try again.'), {
          status: 401,
          headers: { 'Content-Type': 'text/html' },
        });
      }

      const oauthReq = await env.OAUTH_PROVIDER.parseAuthRequest(request);
      const { redirectTo } = await env.OAUTH_PROVIDER.completeAuthorization({
        request: oauthReq,
        userId: resolved.email,
        metadata: { email: resolved.email },
        scope: oauthReq.scope,
        props: {
          email: resolved.email,
          subscriptionActive: resolved.subscriptionActive,
        },
      });

      return Response.redirect(redirectTo, 302);
    }

    return new Response('Method not allowed', { status: 405 });
  },
};
