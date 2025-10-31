import { Hono } from 'hono';
import '../types/hono';
import { geocodeZipCode } from '../utils/geocode';

const teeTimeRoutes = new Hono<{ Bindings: Env }>();

// Search for golf facilities
// Converts ZIP code to lat/long, then proxies request to Spring Boot API
teeTimeRoutes.post('/facilities/search', async (c) => {
  try {
    const body = await c.req.json();
    const { zipCode, radiusMiles, searchDate } = body;

    if (!zipCode) {
      return c.json({
        success: false,
        error: 'ZIP code is required',
      }, 400);
    }

    // Convert ZIP code to lat/long
    const coordinates = await geocodeZipCode(zipCode);

    // Build request for Spring Boot API
    const springBootRequest = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      radiusMiles,
      searchDate,
    };

    const response = await fetch(`${c.env.LGG_API_URL}/api/facilities/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(springBootRequest),
    });

    if (!response.ok) {
      return c.json({
        success: false,
        error: `Spring Boot API error: ${response.statusText}`,
      });
    }

    const data = await response.json();
    return c.json({ success: true, data });
  } catch (error) {
    console.error('Facility search error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search facilities',
    }, 500);
  }
});



export default teeTimeRoutes;
