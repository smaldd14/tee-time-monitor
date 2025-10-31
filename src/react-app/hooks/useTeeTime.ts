import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FacilitySearchParams,
  FacilitySearchResponse,
  MonitorRequest,
  MonitorResponse,
} from '@/types';
import { teeTimeService } from '../services/tee-time.service';

// Hook for searching facilities
export function useFacilitySearch() {
  return useMutation({
    mutationFn: async (params: FacilitySearchParams) => {
      const response = await teeTimeService.searchFacilities(params);

      if (!response.success) {
        throw new Error(response.error || 'Failed to search facilities');
      }

      return response.data as FacilitySearchResponse;
    },
    retry: 1,
  });
}

// Hook for creating a monitor (stub for now - will integrate checkout later)
export function useCreateMonitor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MonitorRequest) => {
      const response = await teeTimeService.createMonitor(request);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create monitor');
      }

      return response.data as MonitorResponse;
    },
    onSuccess: () => {
      // Invalidate monitors queries when new monitor is created
      queryClient.invalidateQueries({ queryKey: ['monitors'] });
    },
    retry: 1,
  });
}
