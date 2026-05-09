import { useQuery } from '@tanstack/react-query';
import { getAllPlants, getPlantById } from '../utils/plantsApi';
import type { PlantFilters } from '../types';

export const PLANTS_QUERY_KEY = 'plants';

// Filters are part of the key so each unique filter combination is cached separately
export const usePlants = (filters?: PlantFilters) =>
  useQuery({
    queryKey: [PLANTS_QUERY_KEY, filters],
    queryFn: () => getAllPlants(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

// enabled: !!id — don't fetch until we have a plant ID (e.g. when the route loads)
export const usePlant = (id: string) =>
  useQuery({
    queryKey: [PLANTS_QUERY_KEY, id],
    queryFn: () => getPlantById(id),
    enabled: !!id,
  });