import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthActions } from '../../../store/useAuthStore';

function getSignUpErrorMessage(error) {
  if (error?.status === 409) {
    return 'Este e-mail ja esta em uso. Tente fazer login ou use outro endereco.';
  }

  if (error?.status === 400 && error.details?.length > 0) {
    return error.details
      .map((item) => item.mensagem || item.message || item)
      .filter(Boolean)
      .join(' ');
  }

  if (error?.status === 400) {
    return 'Revise os dados informados e tente novamente.';
  }

  if (error?.status >= 500) {
    return 'Nao foi possivel criar sua conta agora. Tente novamente em instantes.';
  }

  return error?.message || 'Ocorreu um erro ao criar a conta.';
}

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setAuth } = useAuthActions();

  const signUp = async (name, email, password) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.signUp(name, email, password);

      if (response.sucesso === false) {
        throw new Error(response.message || 'Erro ao criar conta');
      }

      const payload = response.data || response;
      const user = payload.user;

      const {
        id,
        name: userName,
        roles = [],
        interestTags = [],
        needsOnboarding = false
      } = user;
      const { token } = payload;

      setAuth(id, token, userName, roles, interestTags, needsOnboarding);

      navigate('/search');
    } catch (err) {
      console.error('Erro capturado no SignUp:', err);
      setError(getSignUpErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError('');

  return { signUp, isLoading, error, clearError };
}
