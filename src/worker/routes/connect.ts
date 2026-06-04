import { Hono } from 'hono';
import { StripeService } from '../services/stripeService';

// Onboarding / account endpoints backing the /connect page.
//
// Identity is the Stripe checkout session_id carried in the post-checkout redirect and the
// setup email. Possession of the session_id proves the subscriber; we exchange it for the
// customer's email/customer-id via the Stripe API, then talk to the Java API with LGG_API_KEY.

const connectRoutes = new Hono<{ Bindings: Env }>();

async function emailFromSession(stripe: StripeService, sessionId: string) {
  const session = await stripe.getCheckoutSession(sessionId);
  if (session.mode !== 'subscription' || session.payment_status !== 'paid') {
    return null;
  }
  const email = session.customer_details?.email ?? session.customer_email;
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
  return email ? { email, customerId } : null;
}

// GET /api/connect?session_id=... -> { token, mcpUrl }
// Rotates and returns a fresh MCP token for the verified subscriber.
connectRoutes.get('/', async (c) => {
  const sessionId = c.req.query('session_id');
  if (!sessionId) {
    return c.json({ error: 'session_id is required' }, 400);
  }

  const stripe = new StripeService(c.env.STRIPE_SECRET_KEY);
  const resolved = await emailFromSession(stripe, sessionId);
  if (!resolved) {
    return c.json({ error: 'No paid subscription found for this session' }, 404);
  }

  const res = await fetch(`${c.env.LGG_API_URL}/api/mcp/tokens/issue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${c.env.LGG_API_KEY}`,
    },
    body: JSON.stringify({ email: resolved.email }),
  });

  if (!res.ok) {
    return c.json({ error: 'Could not issue access token' }, res.status === 402 ? 402 : 502);
  }

  const { token } = (await res.json()) as { token: string };
  return c.json({ token, mcpUrl: c.env.MCP_CONNECTOR_URL });
});

// POST /api/connect/resend { email } -> generic 200 (proxies to Java; no enumeration)
connectRoutes.post('/resend', async (c) => {
  const { email } = (await c.req.json()) as { email?: string };

  await fetch(`${c.env.LGG_API_URL}/api/connect/resend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${c.env.LGG_API_KEY}`,
    },
    body: JSON.stringify({ email: email ?? '' }),
  });

  return c.json({ message: "If you have an active subscription, we've emailed your setup link." });
});

// POST /api/billing-portal { session_id } -> { url } (Stripe-hosted portal)
const billingRoutes = new Hono<{ Bindings: Env }>();

billingRoutes.post('/', async (c) => {
  const { session_id: sessionId } = (await c.req.json()) as { session_id?: string };
  if (!sessionId) {
    return c.json({ error: 'session_id is required' }, 400);
  }

  const stripe = new StripeService(c.env.STRIPE_SECRET_KEY);
  const resolved = await emailFromSession(stripe, sessionId);
  if (!resolved?.customerId) {
    return c.json({ error: 'No subscription found for this session' }, 404);
  }

  const origin = new URL(c.req.url).origin;
  const returnUrl = `${origin}/connect?session_id=${encodeURIComponent(sessionId)}`;
  const url = await stripe.createBillingPortalSession(resolved.customerId, returnUrl);
  return c.json({ url });
});

export { connectRoutes, billingRoutes };
