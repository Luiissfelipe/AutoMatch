import { request } from '../../../shared/services/apiClient';

function normalizeTags(tags = []) {
  return Array.isArray(tags)
    ? tags.map((tag) => (typeof tag === 'string' ? tag : tag?.id)).filter(Boolean)
    : [];
}

export function normalizeCar(car) {
  if (!car) return null;

  return {
    ...car,
    model: car.modelo ?? car.model,
    year: car.ano ?? car.year,
    price: car.preco ?? car.price,
    imageUrl: car.urlImagem ?? car.imageUrl,
    tags: normalizeTags(car.tags),
  };
}

function normalizeCars(cars = []) {
  return Array.isArray(cars) ? cars.map(normalizeCar) : [];
}

export const carService = {
  getAll: async () => {
    const response = await request('/carros', { method: 'GET' });
    return normalizeCars(response.dados || response);
  },

  search: async (term, tagsArray = [], page = 1, limit = 12) => {
    const params = new URLSearchParams();
    
    if (term) params.append('termo', term);
    if (tagsArray && tagsArray.length > 0) {
      params.append('tags', tagsArray.join(',')); 
    }

    params.append('page', page); 
    params.append('limit', limit); 

    const endpoint = `/carros?${params.toString()}`;
    const response = await request(endpoint, { method: 'GET' });
    const pagination = response.paginacao
      ? {
          currentPage: response.paginacao.paginaAtual,
          totalPages: response.paginacao.totalPaginas,
        }
      : null;

    return {
      cars: normalizeCars(response.dados || []),
      pagination,
    };
  },

  getById: async (id) => {
    const response = await request(`/carros/${id}`, { method: 'GET' });
    return normalizeCar(response.dados || response);
  },

  getMyListings: async () => {
    const response = await request('/carros/meus-anuncios', { method: 'GET' });
    return normalizeCars(response.dados || response || []);
  },

  create: async (model, year, price, tags, imageUrl) => {
    const response = await request('/carros', {
      method: 'POST',
      body: JSON.stringify({ modelo: model, ano: year, preco: price, tags, urlImagem: imageUrl })
    });
    return normalizeCar(response.dados || response);
  },

  update: async (id, data) => {
    const payload = {
      ...(data.model !== undefined ? { modelo: data.model } : {}),
      ...(data.year !== undefined ? { ano: data.year } : {}),
      ...(data.price !== undefined ? { preco: data.price } : {}),
      ...(data.imageUrl !== undefined ? { urlImagem: data.imageUrl } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.tags !== undefined ? { tags: data.tags } : {}),
    };

    const response = await request(`/carros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return normalizeCar(response.dados || response);
  },

  markAsSold: async (id) => {
    return request(`/carros/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'VENDIDO' })
    });
  },

  deleteCar: async (id) => {
    return request(`/carros/${id}`, { method: 'DELETE' });
  }
};
