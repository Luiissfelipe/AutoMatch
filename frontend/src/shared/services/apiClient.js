import useAuthStore from '../../store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details || [];
  }
}

export async function request(endpoint, options = {}) {
  const token = useAuthStore.getState().token;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new ApiError('Nao foi possivel conectar ao servidor. Tente novamente em instantes.');
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().actions.clearUser();
      window.location.href = '/login';
    }

    const details = Array.isArray(data?.detalhes)
      ? data.detalhes.map(item => item.mensagem || item).join(' ')
      : '';

    throw new ApiError(data?.mensagem || data?.erro || details || `Erro HTTP: ${response.status}`, {
      status: response.status,
      details: Array.isArray(data?.detalhes) ? data.detalhes : [],
    });
  }

  return data;
}
