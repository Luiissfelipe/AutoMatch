import { useCallback } from 'react';
import { Header } from '../../../../shared/layout/Header/Header';
import { userService } from '../../../auth/services/userService';
import { CarFeed } from '../../components/CarFeed';
import { useCarFeed } from '../../hooks/useCarFeed';
import pageStyles from '../FeedPage.module.css';

export function Recommended() {
  const fetchRecommendations = useCallback(() => userService.getRecommendations(), []);
  const selectRecommendations = useCallback((response) => {
    return response.recommendations || [];
  }, []);

  const { cars, isLoading, error } = useCarFeed({
    fetcher: fetchRecommendations,
    selectData: selectRecommendations,
    errorMessage: 'Erro ao buscar recomendações:'
  });

  return (
    <div className={pageStyles.layout}>
      <Header />

      <main className={pageStyles.mainContainer}>
        <CarFeed
          title="Recomendados para Você"
          cars={cars}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
}
