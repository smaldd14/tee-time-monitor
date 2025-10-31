// Request types (matches frontend structure)
export interface MonitorRequest {
	searchCriteria: SearchCriteria;
	priorityCourses: number[]; // Array of facility IDs
}

export interface SearchCriteria {
	zipCode: string;
	radiusMiles: number;
	searchDate: string; // Format: "Oct 11 2025"
	numberOfPlayers: number;
	preferredTimeStart: number; // Hour in 24h format (e.g., 10 = 10:00 AM)
	preferredTimeEnd: number; // Hour in 24h format (e.g., 18 = 6:00 PM)
	maxPrice?: number;
	hotDealsOnly: boolean;
	holes: number; // 1=9 holes, 2=18 holes, 3=both
}

// Database types
export interface DbSearchCriteria {
	id?: string;
	latitude: number;
	longitude: number;
	radiusMiles: number;
	searchDate: string;
	numberOfPlayers: number;
	preferredTimeStart: number;
	preferredTimeEnd: number;
	maxPrice?: number;
	hotDealsOnly: boolean;
	holes: number;
	createdAt?: Date;
}

export interface PriorityCourse {
	id?: string;
	searchCriteriaId: string;
	facilityId: number;
}

export interface UserSearchPreference {
	id?: string;
	email: string;
	searchCriteriaId: string;
	paymentEnabled: boolean;
	notifyEnabled: boolean;
	scheduleId?: string;
	scheduleInterval: string;
	active: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}
