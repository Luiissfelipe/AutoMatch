import { useState, useEffect } from 'react';
import useAuthStore, { useAuthActions } from '../../../store/useAuthStore';
import { userService } from '../services/userService';

export function useInitialization() {
  const [isInitializing, setIsInitializing] = useState(true);
  
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const { setAuth, clearUser } = useAuthActions();

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setIsInitializing(false);
        return;
      }

      if (token && userId) {
        setIsInitializing(false);
        return;
      }

      try {
        const user = await userService.getProfile();

        setAuth(user.id, token, user.name, user.roles || [], user.interestTags || [], user.needsOnboarding);
      } catch (error) {
        console.error("Sessão inválida ou expirada:", error);
        clearUser(); 
      } finally {
        setIsInitializing(false);
      }
    };

    verifySession();
  }, [token, userId, setAuth, clearUser]);

  return { isInitializing };
}
