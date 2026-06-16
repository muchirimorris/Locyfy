import apiClient from './apiClient';
import type { Venue } from '../types/venue';

export const venueService = {
  // Fetch all venues
  getVenues: async (): Promise<Venue[]> => {
    const response = await apiClient.get<Venue[]>('/venues/');
    return response.data;
  },

  // Fetch a single venue by ID
  getVenueById: async (id: string): Promise<Venue> => {
    const response = await apiClient.get<Venue>(`/venues/${id}/`);
    return response.data;
  },
};
