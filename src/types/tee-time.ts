// Tee time monitoring types

export interface SearchCriteria {
  zipCode?: string; // User-facing input (converted to lat/long on backend)
  latitude: number;
  longitude: number;
  radiusMiles: number;
  searchDate: string; // Format: "Oct 25 2025"
  numberOfPlayers: number;
  preferredTimeStart: number; // Hour in 24-hour format (e.g., 8 for 8 AM)
  preferredTimeEnd: number; // Hour in 24-hour format (e.g., 14 for 2 PM)
  maxPrice?: number;
  hotDealsOnly: boolean;
  holes: number; // 1 = 9 holes, 2 = 18 holes
}

export interface Facility {
  id: number;
  name: string;
  imageUrl: string;
  address: string;
  distance: number;
  formattedDistance: string;
  averageRating: number;
  numberOfReviews: number;
  availableTimeRange: string;
  priceRange: string;
  hasHotDeal: boolean;
}

export interface FacilitySearchParams {
  zipCode: string;
  radiusMiles: number;
  searchDate: string;
}

export type FacilitySearchResponse = Facility[];

export interface MonitorRequest {
  searchCriteria: SearchCriteria;
  priorityCourses: number[]; // Array of facility IDs (max 5)
}

export interface MonitorResponse {
  checkoutUrl: string;
  searchCriteriaId: string;
}

export interface UserSearchPreference {
  id: number;
  email: string;
  searchCriteria: SearchCriteria;
  priorityCourses: number[];
  paymentEnabled: boolean;
  notifyEnabled: boolean;
  scheduleInterval: string; // ISO 8601 duration (e.g., "PT5M")
  createdAt: string;
  updatedAt: string;
}
