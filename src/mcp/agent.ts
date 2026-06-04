import { McpAgent } from 'agents/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { geocodeZipCode } from '../worker/utils/geocode';
import {
  cancelMonitor,
  createMonitor,
  getMonitor,
  getSubscriptionStatus,
  listMonitors,
  searchFacilities,
  type LggEnv,
  type SearchCriteria,
} from './lgg';

// Extends the generated Cloudflare Env (which already declares LGG_API_URL / LGG_API_KEY) so it
// satisfies the McpAgent generic constraint, plus the MCP-specific var.
export interface McpEnv extends Env, LggEnv {
  SUBSCRIPTION_CHECKOUT_URL: string;
}

// Identity is derived from the user's token (resolved in the fetch handler), never from the client.
export type Props = {
  email: string;
  subscriptionActive: boolean;
  [key: string]: unknown;
};

const DATE_HINT = "Date format must be 'MMM d yyyy', e.g. 'Oct 11 2025'.";

function text(value: unknown) {
  const body = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return { content: [{ type: 'text' as const, text: body }] };
}

export class TeeTimeMcpAgent extends McpAgent<McpEnv, unknown, Props> {
  server = new McpServer({ name: 'tee-time-monitor', version: '1.0.0' });

  private get email() {
    return this.props!.email;
  }

  async init() {
    this.server.tool(
      'search_facilities',
      `Find golf courses near a ZIP code on a given date. Use this to resolve a course name ` +
        `(e.g. "Preakness") to a facility id before creating a monitor. ${DATE_HINT}`,
      {
        zipCode: z.string().describe('US ZIP code to search around'),
        radiusMiles: z.number().int().positive().default(25),
        searchDate: z.string().describe(`Date to search. ${DATE_HINT}`),
      },
      async ({ zipCode, radiusMiles, searchDate }) => {
        const { latitude, longitude } = await geocodeZipCode(zipCode);
        const facilities = await searchFacilities(this.env, { latitude, longitude, radiusMiles, searchDate });
        return text(facilities);
      },
    );

    this.server.tool(
      'get_subscription_status',
      'Check whether your subscription is active. If inactive, returns a signup link.',
      {},
      async () => {
        const status = await getSubscriptionStatus(this.env, this.email);
        if (!status.active) {
          return text({
            active: false,
            status: status.status,
            message: 'No active subscription. Subscribe to create monitors.',
            signupUrl: this.env.SUBSCRIPTION_CHECKOUT_URL,
          });
        }
        return text(status);
      },
    );

    this.server.tool(
      'create_monitor',
      `Create a tee-time monitor that checks repeatedly and emails you when matching tee times appear. ` +
        `Requires an active subscription. You can run one monitor at a time; pass replaceExisting=true to ` +
        `replace your current monitor. First call search_facilities to get priorityCourseIds for specific courses. ${DATE_HINT}`,
      {
        zipCode: z.string(),
        radiusMiles: z.number().int().positive().default(25),
        searchDate: z.string().describe(`Date to monitor. ${DATE_HINT}`),
        numberOfPlayers: z.number().int().min(1).max(4).default(2),
        preferredTimeStart: z.number().int().min(0).max(23).default(5).describe('Earliest hour, 24h (e.g. 8 = 8am)'),
        preferredTimeEnd: z.number().int().min(0).max(23).default(21).describe('Latest hour, 24h (e.g. 14 = 2pm)'),
        maxPrice: z.number().int().positive().optional().describe('Max price per round in dollars'),
        hotDealsOnly: z.boolean().default(false),
        holes: z.number().int().min(1).max(3).default(3).describe('1 = 9 holes, 2 = 18 holes, 3 = either'),
        priorityCourseIds: z.array(z.number().int()).default([]).describe('Facility ids from search_facilities'),
        checkIntervalMinutes: z.number().int().min(1).default(5).describe('How often to check, in minutes'),
        replaceExisting: z.boolean().default(false).describe('Replace your current active monitor'),
      },
      async (args) => {
        const { latitude, longitude } = await geocodeZipCode(args.zipCode);
        const searchCriteria: SearchCriteria = {
          latitude,
          longitude,
          radiusMiles: args.radiusMiles,
          searchDate: args.searchDate,
          numberOfPlayers: args.numberOfPlayers,
          preferredTimeStart: args.preferredTimeStart,
          preferredTimeEnd: args.preferredTimeEnd,
          priorityCourseIds: args.priorityCourseIds,
          maxPrice: args.maxPrice ?? null,
          hotDealsOnly: args.hotDealsOnly,
          holes: args.holes,
          checkIntervalMinutes: args.checkIntervalMinutes,
        };

        const result = await createMonitor(this.env, this.email, searchCriteria, args.replaceExisting);

        if (result.status === 201) {
          return text({ created: true, monitor: result.body });
        }
        if (result.status === 402) {
          return text({
            created: false,
            reason: 'no_active_subscription',
            message: 'You need an active subscription to create a monitor.',
            signupUrl: this.env.SUBSCRIPTION_CHECKOUT_URL,
          });
        }
        if (result.status === 409) {
          return text({
            created: false,
            reason: 'monitor_exists',
            message: 'You already have an active monitor. Call create_monitor again with replaceExisting=true to replace it.',
          });
        }
        return text({ created: false, status: result.status, body: result.body });
      },
    );

    this.server.tool('list_monitors', 'List your active tee-time monitors.', {}, async () => {
      return text(await listMonitors(this.env, this.email));
    });

    this.server.tool(
      'get_monitor',
      'Get details for one of your monitors by id.',
      { id: z.string().describe('Monitor (search preference) UUID') },
      async ({ id }) => {
        const monitor = await getMonitor(this.env, id);
        if (monitor.email !== this.email) {
          return text({ error: 'not_found' });
        }
        return text(monitor);
      },
    );

    this.server.tool(
      'cancel_monitor',
      'Cancel one of your monitors by id (stops its schedule).',
      { id: z.string().describe('Monitor (search preference) UUID') },
      async ({ id }) => {
        const monitor = await getMonitor(this.env, id);
        if (monitor.email !== this.email) {
          return text({ error: 'not_found' });
        }
        await cancelMonitor(this.env, id);
        return text({ cancelled: true, id });
      },
    );
  }
}
