import axiosInstance from '../../../api/axiosInstance';
import type { PlantFilters, PlantResponse, PlantsResponse } from '../types';

export const getAllPlants = (filters?: PlantFilters): Promise<PlantsResponse> =>
  axiosInstance.get<PlantsResponse>('/api/plants', { params: filters }).then((r) => r.data);

export const getPlantById = (id: string): Promise<PlantResponse> =>
  axiosInstance.get<PlantResponse>(`/api/plants/${id}`).then((r) => r.data);
