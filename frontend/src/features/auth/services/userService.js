import { request } from '../../../shared/services/apiClient';
import { normalizeCar } from '../../cars/services/carService';

export function normalizeUser(user) {
  if (!user) return null;

  return {
    ...user,
    name: user.nome ?? user.name,
    interestTags: user.tagsInteresse ?? user.interestTags ?? [],
    needsOnboarding: user.precisaOnboarding ?? user.needsOnboarding ?? false,
  };
}

export const userService = {
  getProfile: async () => {
    const response = await request('/usuarios/me', { method: 'GET' });
    return normalizeUser(response.dados || response);
  },

  updateProfile: async (name, role) => {
    const response = await request('/usuarios/me', {
      method: 'PUT',
      body: JSON.stringify({ nome: name, role })
    });
    return normalizeUser(response.dados || response);
  },

  becomeSeller: async () => {
    const response = await request('/usuarios/virar-vendedor', {
      method: 'PATCH'
    });
    return {
      ...normalizeUser(response.dados || response),
      token: response.token
    };
  },

  sendColdStart: async (tags) => {
    const response = await request('/usuarios/cold-start', {
      method: 'POST',
      body: JSON.stringify({ tags })
    });
    return response.dados || response;
  },

  getFavorites: async () => {
    const response = await request('/usuarios/favoritos', { method: 'GET' });
    return (response.dados || response || []).map(normalizeCar);
  },

  getRecommendations: async (limit = 8) => {
    const response = await request(`/usuarios/recomendacoes?limite=${limit}`, { method: 'GET' });
    return {
      ...response,
      recommendations: (response.recomendacoes || response.recommendations || []).map(normalizeCar),
    };
  }
};
