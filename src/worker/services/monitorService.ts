import { Client } from 'pg';
import type { DbSearchCriteria, UserSearchPreference } from '../../types/monitor';

export class MonitorService {
	constructor(private client: Client) {}

	/**
	 * Finds or creates search criteria
	 * Uses ON CONFLICT to handle duplicate criteria
	 */
	async upsertSearchCriteria(criteria: DbSearchCriteria): Promise<string> {
		const query = `
			INSERT INTO search_criteria (
				latitude, longitude, radius_miles, search_date,
				number_of_players, preferred_time_start, preferred_time_end,
				max_price, hot_deals_only, holes
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			ON CONFLICT ON CONSTRAINT unique_search_criteria
			DO UPDATE SET latitude = EXCLUDED.latitude
			RETURNING id
		`;

		const values = [
			criteria.latitude,
			criteria.longitude,
			criteria.radiusMiles,
			criteria.searchDate,
			criteria.numberOfPlayers,
			criteria.preferredTimeStart,
			criteria.preferredTimeEnd,
			criteria.maxPrice || null,
			criteria.hotDealsOnly,
			criteria.holes,
		];

		const result = await this.client.query(query, values);
		return result.rows[0].id;
	}

	/**
	 * Inserts priority courses for a search criteria
	 * Clears existing priority courses first
	 */
	async upsertPriorityCourses(searchCriteriaId: string, facilityIds: number[]): Promise<void> {
		// Delete existing priority courses
		await this.client.query('DELETE FROM priority_courses WHERE search_criteria_id = $1', [searchCriteriaId]);

		if (facilityIds.length === 0) {
			return;
		}

		// Insert new priority courses
		const values = facilityIds.map((_facilityId, i) => `($1, $${i + 2})`).join(', ');
		const params = [searchCriteriaId, ...facilityIds];

		const query = `
			INSERT INTO priority_courses (search_criteria_id, facility_id)
			VALUES ${values}
			ON CONFLICT ON CONSTRAINT unique_priority_course DO NOTHING
		`;

		await this.client.query(query, params);
	}

	/**
	 * Creates or updates user search preference
	 */
	async upsertUserSearchPreference(preference: UserSearchPreference): Promise<string> {
		const query = `
			INSERT INTO user_search_preferences (
				email, search_criteria_id, payment_enabled, notify_enabled,
				schedule_interval, active
			) VALUES ($1, $2, $3, $4, $5, $6)
			ON CONFLICT ON CONSTRAINT unique_user_search
			DO UPDATE SET
				payment_enabled = EXCLUDED.payment_enabled,
				notify_enabled = EXCLUDED.notify_enabled,
				schedule_interval = EXCLUDED.schedule_interval,
				active = EXCLUDED.active,
				updated_at = NOW()
			RETURNING id
		`;

		const values = [
			preference.email,
			preference.searchCriteriaId,
			preference.paymentEnabled,
			preference.notifyEnabled,
			preference.scheduleInterval,
			preference.active,
		];

		const result = await this.client.query(query, values);
		return result.rows[0].id;
	}

	/**
	 * Gets user search preference by ID
	 */
	async getUserSearchPreference(id: string): Promise<UserSearchPreference | null> {
		const query = `
			SELECT * FROM user_search_preferences WHERE id = $1
		`;

		const result = await this.client.query(query, [id]);

		if (result.rows.length === 0) {
			return null;
		}

		const row = result.rows[0];
		return {
			id: row.id,
			email: row.email,
			searchCriteriaId: row.search_criteria_id,
			paymentEnabled: row.payment_enabled,
			notifyEnabled: row.notify_enabled,
			scheduleId: row.schedule_id,
			scheduleInterval: row.schedule_interval,
			active: row.active,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		};
	}

	/**
	 * Updates the schedule ID for a user search preference
	 */
	async updateScheduleId(userSearchPreferenceId: string, scheduleId: string): Promise<void> {
		const query = `
			UPDATE user_search_preferences
			SET schedule_id = $1, updated_at = NOW()
			WHERE id = $2
		`;

		await this.client.query(query, [scheduleId, userSearchPreferenceId]);
	}
}
