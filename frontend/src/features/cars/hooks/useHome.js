import { useState, useEffect } from 'react';
import { carService } from '../services/carService';
import { tagService } from '../services/tagService'; 
import useAuthStore from '../../../store/useAuthStore';

export function useHome() {
  const [cars, setCars] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  
  const [feedTitle, setFeedTitle] = useState('Todos os Veículos');
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const needsOnboarding = useAuthStore((state) => state.needsOnboarding);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagService.getAll();
        const realTags = response.dados || response;
        const normalizedTags = Array.isArray(realTags)
          ? realTags.map(tag => ({ ...tag, category: tag.categoria ?? tag.category }))
          : [];
        setAvailableTags(normalizedTags);
      } catch (error) {
        console.error("Erro ao buscar tags para o filtro:", error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (!needsOnboarding) {
      performSearch('', [], 1);
    } else {
      setIsLoading(false); 
    }
  }, [needsOnboarding]);

  const performSearch = async (term = '', tagArray = [], page = 1) => {
    setIsLoading(true);
    setFeedTitle(term || tagArray.length > 0 ? `Resultados da busca` : 'Todos os Veículos');
    
    try {
      const response = await carService.search(term, tagArray, page, 12);
      
      setCars(response.cars || []);
      
      if (response.pagination) {
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
      } else {
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (tagId) => {
    const nextTags = selectedTags.includes(tagId)
      ? selectedTags.filter(t => t !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(nextTags);
  };

  const applyFilters = (currentSearchTerm) => {
    performSearch(currentSearchTerm, selectedTags, 1); 
  };

  const changePage = (nextPage, currentSearchTerm) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      performSearch(currentSearchTerm, selectedTags, nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const groupedTags = availableTags.reduce((acc, tag) => {
    if (!acc[tag.category]) acc[tag.category] = [];
    acc[tag.category].push(tag);
    return acc;
  }, {});

  return { 
    cars, 
    groupedTags, 
    selectedTags,
    feedTitle,      
    isLoading, 
    currentPage,  
    totalPages,   
    changePage,  
    toggleTag,          
    applyFilters
  };
}
