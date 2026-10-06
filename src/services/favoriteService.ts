import { apiClient as api } from '@/api';

interface PropertyHistory {
  propertyId: string;
  viewedAt: string;
  [key: string]: unknown;
}

export const favoriteService = {
  async getFavorites(): Promise<string[]> {
    const res = await api.get('/favoritos');
    return res.data.data;
  },
  async addFavorite(propertyId: string) {
    await api.post('/favoritos', { propertyId });
  },
  async removeFavorite(propertyId: string) {
    await api.delete(`/favoritos/${propertyId}`);
  },
  async getHistory(limit = 20): Promise<PropertyHistory[]> {
    const res = await api.get('/favoritos/history', { params: { limit } });
    return res.data.data;
  },
  async getPropertyHistory(propertyId: string): Promise<PropertyHistory[]> {
    const res = await api.get(`/favoritos/history/${propertyId}`);
    return res.data.data;
  },
};
