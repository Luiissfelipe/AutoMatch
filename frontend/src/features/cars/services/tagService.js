import { request } from '../../../shared/services/apiClient';

export const tagService = {
  getAll: async () => {
    return request('/tags', { method: 'GET' });
  }
};
