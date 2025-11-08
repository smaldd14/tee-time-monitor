import { Hono } from 'hono';
import '../types/hono';
import { getDbClient, closeDbClient } from '../db';
import { MonitorService } from '../services/monitorService';
import { StripeService } from '../services/stripeService';
import type { MonitorRequest } from '../../types/monitor';
import { geocodeZipCode } from '../utils/geocode';
import { monitorCreationRateLimiter } from '../middleware/rateLimiter';


const monitorRoutes = new Hono<{ Bindings: Env }>();

// Create monitor - saves search criteria and returns Stripe checkout URL
monitorRoutes.post('/', monitorCreationRateLimiter, async (c) => {
  const client = await getDbClient(c.env);

  try {
    const body = await c.req.json() as MonitorRequest;

    // Validate required fields
    if (!body.searchCriteria?.zipCode || !body.searchCriteria?.searchDate) {
      return c.json({
        success: false,
        error: 'ZIP code and search date are required',
      }, 400);
    }

    const { searchCriteria, priorityCourses } = body;

    // Convert ZIP code to lat/long
    const coordinates = await geocodeZipCode(searchCriteria.zipCode);

    // Initialize services
    const monitorService = new MonitorService(client);
    const stripeService = new StripeService(c.env.STRIPE_SECRET_KEY);

    // Step 1: Upsert search criteria
    const searchCriteriaId = await monitorService.upsertSearchCriteria({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      radiusMiles: searchCriteria.radiusMiles || 25,
      searchDate: searchCriteria.searchDate,
      numberOfPlayers: searchCriteria.numberOfPlayers || 2,
      preferredTimeStart: searchCriteria.preferredTimeStart || 5,
      preferredTimeEnd: searchCriteria.preferredTimeEnd || 21,
      maxPrice: searchCriteria.maxPrice,
      hotDealsOnly: searchCriteria.hotDealsOnly || false,
      holes: searchCriteria.holes || 3,
    });

    // Step 2: Upsert priority courses if provided
    if (priorityCourses && priorityCourses.length > 0) {
      await monitorService.upsertPriorityCourses(searchCriteriaId, priorityCourses);
    }

    // Step 3: Create Stripe checkout session
    const checkoutUrl = await stripeService.createMonitorCheckoutSession(
      searchCriteriaId,
      c.env.STRIPE_PRICE_ID,
      c.env.STRIPE_SUCCESS_URL,
      c.env.STRIPE_CANCEL_URL
    );

    // Return checkout URL
    return c.json({
      success: true,
      data: {
        checkoutUrl,
        searchCriteriaId,
      },
    });
  } catch (error) {
    console.error('Monitor create error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create monitor',
    }, 500);
  } finally {
    await closeDbClient(client);
  }
});
  
  // Get user's monitors (for future use)
  monitorRoutes.get('/', async (c) => {
    const email = c.req.query('email');
  
    if (!email) {
      return c.json({
        success: false,
        error: 'Email parameter is required',
      });
    }
  
    const response = await fetch(
      `${c.env.LGG_API_URL}/api/user/searches?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${c.env.LGG_API_KEY}`,
        },
      }
    );
  
    if (!response.ok) {
      return c.json({
        success: false,
        error: `API error: ${response.statusText}`,
      });
    }
  
    const data = await response.json();
    return c.json({ success: true, data });
  });
  
  // Delete monitor (for future use)
  monitorRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id');
  
    const response = await fetch(`${c.env.LGG_API_URL}/api/user/searches/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${c.env.LGG_API_KEY}`,
      },
    });
  
    if (!response.ok) {
      return c.json({
        success: false,
        error: `API error: ${response.statusText}`,
      });
    }
  
    return c.json({ success: true });
  });

export default monitorRoutes;