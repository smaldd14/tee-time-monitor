import { Context, Next } from 'hono';

/**
 * Rate limiting middleware using Cloudflare's Rate Limiting API
 * Limits requests per IP address to prevent abuse
 */
export const rateLimiter = (config: {
  limit: number;
  window: number; // in seconds
  keyPrefix: string;
}) => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const { keyPrefix } = config;

    // Get client IP address
    const clientIP = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
    const key = `${keyPrefix}:${clientIP}`;

    if (!c.env.RATE_LIMITER) {
      // local environment, pass thru
      await next();
      return;
    }

    try {
      // Use Cloudflare's Rate Limiting API
      const { success } = await c.env.RATE_LIMITER.limit({ key });

      if (!success) {
        return c.json(
          {
            success: false,
            error: 'Too many requests. Please try again later.',
          },
          429
        );
      }

      await next();
    } 
    catch (error) {
      // If rate limiter fails, log error but allow request to proceed
      console.error('Rate limiter error:', error);
      await next();
    }
  };
};

/**
 * Facility search rate limiter - 10 requests per hour per IP
 */
export const facilitySearchRateLimiter = rateLimiter({
  limit: 10,
  window: 3600, // 1 hour
  keyPrefix: 'facility_search',
});

/**
 * Monitor creation rate limiter - 5 requests per hour per IP
 */
export const monitorCreationRateLimiter = rateLimiter({
  limit: 5,
  window: 3600, // 1 hour
  keyPrefix: 'monitor_creation',
});
