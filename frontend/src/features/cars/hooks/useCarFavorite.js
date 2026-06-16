import { useCallback, useEffect, useState } from 'react';
import { interactionService } from '../services/interactionService';

export function useCarFavorite(carroId, favoritoInicial = false) {
  const [isFavorited, setIsFavorited] = useState(Boolean(favoritoInicial));
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    setIsFavorited(Boolean(favoritoInicial));
  }, [favoritoInicial]);

  const toggleFavorite = useCallback(async () => {
    if (isRequesting || !carroId) return;

    setIsRequesting(true);

    try {
      if (isFavorited) {
        await interactionService.removeFavorite(carroId);
        setIsFavorited(false);
      } else {
        await interactionService.favorite(carroId);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
    } finally {
      setIsRequesting(false);
    }
  }, [carroId, isFavorited, isRequesting]);

  return { isFavorited, isRequesting, toggleFavorite };
}
