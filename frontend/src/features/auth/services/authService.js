import { request } from '../../../shared/services/apiClient';
import { normalizeUser } from './userService';

export const authService = {
  signUp: async (name, email, password) => {
    const response = await request('/auth/cadastrar', {
      method: 'POST',
      body: JSON.stringify({ nome: name, email, senha: password })
    });

    return {
      ...response,
      data: {
        token: response.dados?.token,
        user: normalizeUser(response.dados?.usuario),
      },
    };
  },
  
  login: async (email, password) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha: password })
    });

    return {
      ...response,
      data: {
        token: response.dados?.token,
        user: normalizeUser(response.dados?.usuario),
      },
    };
  }
};
