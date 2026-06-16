import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carService } from '../services/carService';
import { tagService } from '../services/tagService';

function normalizeTagId(tag) {
  if (typeof tag === 'string') return tag;
  return tag?.id ?? tag?.tagId ?? tag?.nome ?? '';
}

function groupTagsByCategory(tags = []) {
  return tags.reduce((accumulator, tag) => {
    const category = tag.categoria ?? tag.category ?? 'OUTROS';
    const tagId = normalizeTagId(tag);

    if (!tagId) return accumulator;

    if (!accumulator[category]) {
      accumulator[category] = {
        id: category,
        name: category,
        tags: [],
      };
    }

    accumulator[category].tags.push(tagId);
    return accumulator;
  }, {});
}

export function useEditListing(carId) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [year, setYear] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('DISPONIVEL');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagCategories, setTagCategories] = useState([]);

  const loadListing = useCallback(async () => {
    if (!carId) return;

    setIsLoading(true);
    setError('');

    try {
      const carData = await carService.getById(carId);

      setModel(carData.model || '');
      setPrice(carData.price || '');
      setYear(carData.year || '');
      setImageUrl(carData.imageUrl || '');
      setStatus(carData.status || 'DISPONIVEL');
      setSelectedTags(Array.isArray(carData.tags) ? carData.tags.map(normalizeTagId).filter(Boolean) : []);
    } catch (error) {
      console.error('Erro ao buscar detalhes do veiculo:', error);
      setError('Nao foi possivel carregar os dados do veiculo.');
    } finally {
      setIsLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await tagService.getAll();
        const realTags = response.dados || response || [];
        const categories = Object.values(groupTagsByCategory(Array.isArray(realTags) ? realTags : []));

        setTagCategories(categories);
      } catch (error) {
        console.error('Erro ao carregar tags do anuncio:', error);
        setError('Nao foi possivel carregar as tags para edicao.');
      }
    };

    loadTags();
  }, []);

  const toggleTag = (tagId) => {
    setSelectedTags((current) => (
      current.includes(tagId)
        ? current.filter((tag) => tag !== tagId)
        : [...current, tagId]
    ));
  };

  const saveListing = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    if (selectedTags.length === 0) {
      setIsSaving(false);
      setError('Selecione pelo menos uma tag para o anuncio.');
      return;
    }

    try {
      await carService.update(carId, {
        model,
        price: Number(price),
        year: Number(year),
        imageUrl,
        tags: selectedTags,
      });

      setSuccessMessage('Anuncio atualizado com sucesso!');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (error) {
      console.error('Erro ao atualizar anuncio:', error);
      setError(error.message || 'Erro ao salvar as alteracoes.');
    } finally {
      setIsSaving(false);
    }
  };

  const markAsSold = async () => {
    try {
      await carService.markAsSold(carId);
      setStatus('VENDIDO');
      setSuccessMessage('Veiculo marcado como vendido!');

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Erro ao marcar como vendido.');
    }
  };

  return {
    model, setModel,
    price, setPrice,
    year, setYear,
    imageUrl, setImageUrl,
    status,
    selectedTags,
    tagCategories,
    toggleTag,
    isLoading,
    isSaving,
    successMessage,
    error,
    saveListing,
    markAsSold,
  };
}
