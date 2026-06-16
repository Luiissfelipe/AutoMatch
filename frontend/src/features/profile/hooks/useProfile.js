import { useCallback, useEffect, useState } from 'react';
import { carService } from '../../cars/services/carService';
import { userService } from '../../auth/services/userService';
import { useAuthActions } from '../../../store/useAuthStore';
import { tagService } from '../../cars/services/tagService';

export function useProfile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [roles, setRoles] = useState(['COMPRADOR']);
  const [activeTab, setActiveTab] = useState('settings');
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tagList, setTagList] = useState([]);
  const [error, setError] = useState('');
  const { setProfile, setToken } = useAuthActions();

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const userData = await userService.getProfile();
      const userRoles = userData.roles || [];

      setUser(userData);
      setName(userData.name || '');
      setRoles(userRoles);
      setProfile(userData.name || '', userRoles);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError(error.message || 'Nao foi possivel carregar seu perfil.');
    } finally {
      setIsLoading(false);
    }
  }, [setProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = setTimeout(() => setSuccessMessage(''), 3000);
    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagService.getAll();
        const realTags = response.dados || response || [];
        const normalizedTags = Array.isArray(realTags)
          ? realTags.map(tag => ({ ...tag, category: tag.categoria ?? tag.category }))
          : [];
        setTagList(normalizedTags);
      } catch (error) {
        console.error('Erro ao carregar tags:', error);
      }
    };

    fetchTags();
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();

    const normalizedName = name.trim();
    if (!normalizedName) {
      setError('Informe seu nome antes de salvar.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedData = await userService.updateProfile(normalizedName);
      const updatedRoles = updatedData.roles || roles;

      setUser(updatedData);
      setName(updatedData.name || normalizedName);
      setRoles(updatedRoles);
      setProfile(updatedData.name || normalizedName, updatedRoles);
      setSuccessMessage('Profile atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError(error.message || 'Nao foi possivel atualizar seu perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const becomeSeller = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const data = await userService.becomeSeller();
      const { token, ...updatedData } = data;
      const nextRoles = updatedData.roles || ['COMPRADOR', 'VENDEDOR'];

      setUser(updatedData);
      setRoles(nextRoles);
      setProfile(updatedData.name || name, nextRoles);
      if (token) {
        setToken(token);
      }
      setSuccessMessage('Parabéns! Agora você é um vendedor e já pode anunciar veículos.');
    } catch (error) {
      console.error('Erro ao virar vendedor:', error);
      setError(error.message || 'Não foi possível alterar seu perfil para vendedor. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadListings = useCallback(async () => {
    setIsLoadingListings(true);

    try {
      const listings = await carService.getMyListings();
      setListings(listings || []);
    } catch (error) {
      console.error('Erro ao carregar listings:', error);
      setListings([]);
    } finally {
      setIsLoadingListings(false);
    }
  }, []);

  const selectTab = (nextTab) => {
    setActiveTab(nextTab);

    if (nextTab === 'listings' && listings.length === 0) {
      loadListings();
    }
  };

  const deleteCar = async (carId) => {
    setIsLoadingListings(true);
    setError('');

    try {
      await carService.deleteCar(carId);
      setListings(prev => prev.filter(car => car.id !== carId));
    } catch (error) {
      console.error('Erro ao apagar car:', error);
      setError(error.message || 'Não foi possível apagar o anúncio.');
    } finally {
      setIsLoadingListings(false);
    }
  };

  return {
    user,
    name,
    roles,
    activeTab,
    listings,
    isLoading,
    isSaving,
    isLoadingListings,
    successMessage,
    error,
    setName,
    becomeSeller,
    saveProfile,
    selectTab,
    deleteCar,
    tagList
  };
}
