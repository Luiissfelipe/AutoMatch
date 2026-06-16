import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthActions } from '../../../store/useAuthStore';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { setAuth } = useAuthActions();

  const login = async (email, password) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      
      if (!response.sucesso) {
        throw new Error(response.message || 'Erro ao fazer login');
      }

      const { id, name, roles = [], interestTags = [], needsOnboarding = false } = response.data.user;
      const { token } = response.data;
      
      setAuth(id, token, name, roles, interestTags, needsOnboarding);

      navigate('/search');

    } catch (err) {
      console.error('Erro capturado no Login:', err);
      setError(err.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
