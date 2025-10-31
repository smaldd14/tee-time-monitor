// Tee time monitoring API service

import {
  ApiResponse,
  FacilitySearchParams,
  FacilitySearchResponse,
  MonitorRequest,
  MonitorResponse,
  UserSearchPreference,
} from '@/types';
import { apiClient } from './api-client';

export class TeeTimeService {
  // Search for golf facilities based on location and date
  async searchFacilities(
    params: FacilitySearchParams
  ): Promise<ApiResponse<FacilitySearchResponse>> {
    return apiClient.post<FacilitySearchResponse>('/facilities/search', params);
  }

  // Create a new tee time monitoring request and get Stripe checkout URL
  async createMonitor(
    request: MonitorRequest
  ): Promise<ApiResponse<MonitorResponse>> {
    return apiClient.post<MonitorResponse>('/monitor', request);
  }

  // Get user's active monitors (for future use)
  async getUserMonitors(email: string): Promise<ApiResponse<UserSearchPreference[]>> {
    return apiClient.get<UserSearchPreference[]>(`/monitor?email=${encodeURIComponent(email)}`);
  }

  // Delete a monitor (for future use)
  async deleteMonitor(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/monitor/${id}`);
  }
}

export const teeTimeService = new TeeTimeService();
