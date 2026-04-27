import { useQuery } from '@tanstack/react-query';
import { getAllPlants, getPlantById } from '../utils/plantsApi';
import type { PlantFilters } from '../types';

export const PLANTS_QUERY_KEY = 'plants';

export const usePlants = (filters?: PlantFilters) =>
  // Query keys include filters so different browse states cache independently.
  useQuery({
    queryKey: [PLANTS_QUERY_KEY, filters],
    queryFn: () => getAllPlants(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const usePlant = (id: string) =>
  // Detail requests are disabled until the route param is present.
  useQuery({
    queryKey: [PLANTS_QUERY_KEY, id],
    queryFn: () => getPlantById(id),
    enabled: !!id,
  });