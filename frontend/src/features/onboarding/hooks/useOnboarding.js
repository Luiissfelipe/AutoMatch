import { useCallback, useEffect, useMemo, useState } from 'react';

import { tagService } from '../../cars/services/tagService';
import { userService } from '../../auth/services/userService';
import { useAuthActions } from '../../../store/useAuthStore';

const TAG_LIMIT = 5;

export function useOnboarding(onComplete) {
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { setTags } = useAuthActions();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await tagService.getAll();

        const realTags = response.dados || response;
        const normalizedTags = Array.isArray(realTags)
          ? realTags.map(tag => ({ ...tag, category: tag.categoria ?? tag.category }))
          : [];
        setAvailableTags(normalizedTags);
      } catch (error) {
        console.error('Erro ao buscar tags:', error);
        setError('Nao foi possivel carregar as tags. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const groupedTags = useMemo(() => availableTags.reduce((acc, tag) => {
    if (!acc[tag.category]) acc[tag.category] = [];
    acc[tag.category].push(tag.id);
    return acc;
  }, {}), [availableTags]);

  const toggleTag = useCallback((tagId) => {
    setError('');

    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(t => t !== tagId);
      }

      if (prev.length >= TAG_LIMIT) {
        setError(`Selecione no maximo ${TAG_LIMIT} tags.`);
        return prev;
      }

      return [...prev, tagId];
    });
  }, []);

  const handleFinalizar = useCallback(async () => {
    if (selectedTags.length === 0) {
      setError('Selecione pelo menos uma preferencia.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await userService.sendColdStart(selectedTags);
      setTags(selectedTags);

      if (onComplete) onComplete(selectedTags);
    } catch (error) {
      console.error('Erro ao salvar preferencias', error);
      setError(error.message || 'Nao foi possivel salvar suas preferencias. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [onComplete, selectedTags, setTags]);

  return {
    groupedTags,
    selectedTags,
    isLoading,
    isSubmitting,
    error,
    LIMITE_TAGS: TAG_LIMIT,
    toggleTag,
    handleFinalizar
  };
}
