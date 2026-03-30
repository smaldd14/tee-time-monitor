import { tool } from "ai";
import { z } from "zod/v3";
import { geocodeZipCode } from "../utils/geocode";
import { getDbClient, closeDbClient } from "../db";
import { MonitorService } from "../services/monitorService";
import { StripeService } from "../services/stripeService";

export function createTools(env: Env) {
  return {
    searchFacilities: tool({
      description:
        "Search for golf facilities near a ZIP code. Returns a list of courses with tee time availability.",
      inputSchema: z.object({
        zipCode: z.string().describe("US ZIP code to search near"),
        radiusMiles: z.number().default(25).describe("Search radius in miles"),
        searchDate: z
          .string()
          .describe('Date to search for tee times, format: "Oct 11 2025"'),
      }),
      execute: async ({ zipCode, radiusMiles, searchDate }) => {
        const coordinates = await geocodeZipCode(zipCode);

        const response = await fetch(
          `${env.LGG_API_URL}/api/facilities/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.LGG_API_KEY}`,
            },
            body: JSON.stringify({
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              radiusMiles,
              searchDate,
            }),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          return { error: `API error: ${response.statusText} - ${text}` };
        }

        const data = await response.json();
        return { facilities: data };
      },
    }),

    createMonitor: tool({
      description:
        "Create a tee time monitor. Saves search criteria and priority courses to the database, then returns a Stripe checkout URL for payment.",
      inputSchema: z.object({
        zipCode: z.string().describe("US ZIP code"),
        radiusMiles: z.number().default(25),
        searchDate: z
          .string()
          .describe('Date to monitor, format: "Oct 11 2025"'),
        numberOfPlayers: z.number().default(2),
        preferredTimeStart: z
          .number()
          .default(5)
          .describe("Start hour in 24h format"),
        preferredTimeEnd: z
          .number()
          .default(21)
          .describe("End hour in 24h format"),
        maxPrice: z.number().optional(),
        hotDealsOnly: z.boolean().default(false),
        holes: z
          .number()
          .default(3)
          .describe("1=9 holes, 2=18 holes, 3=both"),
        priorityCourses: z
          .array(z.number())
          .default([])
          .describe("Array of facility IDs to prioritize"),
      }),
      execute: async (params) => {
        const coordinates = await geocodeZipCode(params.zipCode);
        const client = await getDbClient(env);

        try {
          const monitorService = new MonitorService(client);
          const stripeService = new StripeService(env.STRIPE_SECRET_KEY);

          const searchCriteriaId = await monitorService.upsertSearchCriteria({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            radiusMiles: params.radiusMiles,
            searchDate: params.searchDate,
            numberOfPlayers: params.numberOfPlayers,
            preferredTimeStart: params.preferredTimeStart,
            preferredTimeEnd: params.preferredTimeEnd,
            maxPrice: params.maxPrice,
            hotDealsOnly: params.hotDealsOnly,
            holes: params.holes,
          });

          if (params.priorityCourses.length > 0) {
            await monitorService.upsertPriorityCourses(
              searchCriteriaId,
              params.priorityCourses
            );
          }

          const checkoutUrl =
            await stripeService.createMonitorCheckoutSession(
              searchCriteriaId,
              env.STRIPE_PRICE_ID,
              env.STRIPE_SUCCESS_URL,
              env.STRIPE_CANCEL_URL
            );

          return { checkoutUrl, searchCriteriaId };
        } finally {
          await closeDbClient(client);
        }
      },
    }),
  };
}
