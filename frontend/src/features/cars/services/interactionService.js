import { request } from "../../../shared/services/apiClient";

export const interactionService = {
  view: async (carId) => {
    return request("/interacoes/visualizar", {
      method: "POST",
      body: JSON.stringify({ carroId: carId }),
    });
  },

  favorite: async (carId) => {
    return request("/interacoes/favoritar", {
      method: "POST",
      body: JSON.stringify({ carroId: carId }),
    });
  },

  removeFavorite: async (carId) => {
    return await request(`/interacoes/favoritar/${carId}`, {
      method: "DELETE",
    });
  },
};
