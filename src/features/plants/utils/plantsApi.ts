import axiosInstance from '../../../api/axiosInstance';
import type { PlantFilters, PlantResponse, PlantsResponse } from '../types';

export const getAllPlants = (filters?: PlantFilters): Promise<PlantsResponse> =>
  // Keep the API layer thin and let React Query own the caching behavior.
  axiosInstance
    .get<PlantsResponse>('/api/plants', { params: filters })
    .then((r) => r.data);

export const getPlantById = (id: string): Promise<PlantResponse> =>
  // Detail screens reuse the same HTTP client as the list screen.
  axiosInstance
    .get<PlantResponse>(`/api/plants/${id}`)
    .then((r) => r.data);
