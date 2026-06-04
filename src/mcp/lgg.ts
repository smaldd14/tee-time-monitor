// Thin client for the Java (Spring Boot) API, reached over the Cloudflare tunnel.
// All calls use the shared LGG_API_KEY bearer; the per-user identity travels as the `email`
// resolved from the user's MCP token.

export interface LggEnv {
  LGG_API_URL: string;
  LGG_API_KEY: string;
}

export interface TokenResolution {
  email: string;
  subscriptionActive: boolean;
}

async function lggFetch(env: LggEnv, path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${env.LGG_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.LGG_API_KEY}`,
      ...(init?.headers ?? {}),
    },
  });
}

// Resolves a raw user token to {email, subscriptionActive}. Returns null when the token is
// unknown or revoked (Java responds 401).
export async function resolveToken(env: LggEnv, token: string): Promise<TokenResolution | null> {
  const response = await lggFetch(env, '/api/mcp/tokens/resolve', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error(`Token resolve failed: ${response.status}`);
  }
  return (await response.json()) as TokenResolution;
}

export interface SearchCriteria {
  latitude: number;
  longitude: number;
  radiusMiles: number;
  searchDate: string;
  numberOfPlayers: number;
  preferredTimeStart: number | null;
  preferredTimeEnd: number | null;
  priorityCourseIds: number[];
  maxPrice: number | null;
  hotDealsOnly: boolean;
  holes: number;
  checkIntervalMinutes: number;
}

export async function searchFacilities(
  env: LggEnv,
  body: { latitude: number; longitude: number; radiusMiles: number; searchDate: string },
): Promise<unknown> {
  const response = await lggFetch(env, '/api/facilities/search', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Facility search failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

export interface CreateMonitorResult {
  status: number;
  body: unknown;
}

export async function createMonitor(
  env: LggEnv,
  email: string,
  searchCriteria: SearchCriteria,
  replace: boolean,
): Promise<CreateMonitorResult> {
  const response = await lggFetch(env, `/api/monitors?replace=${replace}`, {
    method: 'POST',
    body: JSON.stringify({ email, searchCriteria }),
  });
  const text = await response.text();
  const body = text ? safeJson(text) : null;
  return { status: response.status, body };
}

export async function listMonitors(env: LggEnv, email: string): Promise<unknown> {
  const response = await lggFetch(env, `/api/user/searches?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error(`List monitors failed: ${response.status}`);
  }
  return response.json();
}

export async function getMonitor(env: LggEnv, id: string): Promise<{ email: string } & Record<string, unknown>> {
  const response = await lggFetch(env, `/api/user/searches/${id}`);
  if (!response.ok) {
    throw new Error(`Get monitor failed: ${response.status}`);
  }
  return (await response.json()) as { email: string } & Record<string, unknown>;
}

export async function cancelMonitor(env: LggEnv, id: string): Promise<void> {
  const response = await lggFetch(env, `/api/user/searches/${id}`, { method: 'DELETE' });
  if (!response.ok && response.status !== 204) {
    throw new Error(`Cancel monitor failed: ${response.status}`);
  }
}

export interface SubscriptionStatus {
  active: boolean;
  status: string;
  currentPeriodEnd: string | null;
}

export async function getSubscriptionStatus(env: LggEnv, email: string): Promise<SubscriptionStatus> {
  const response = await lggFetch(env, `/api/subscription/status?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error(`Subscription status failed: ${response.status}`);
  }
  return (await response.json()) as SubscriptionStatus;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
