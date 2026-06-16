import { useCallback } from 'react';
import { Header } from '../../../../shared/layout/Header/Header';
import { userService } from '../../../auth/services/userService';
import { CarFeed } from '../../components/CarFeed';
import { useCarFeed } from '../../hooks/useCarFeed';
import pageStyles from '../FeedPage.module.css';

export function Favorites() {
  const fetchFavorites = useCallback(() => userService.getFavorites(), []);
  const selectFavorites = useCallback((response) => response || [], []);

  const { cars, isLoading, error } = useCarFeed({
    fetcher: fetchFavorites,
    selectData: selectFavorites,
    errorMessage: 'Erro ao buscar favoritos:'
  });

  return (
    <div className={pageStyles.layout}>
      <Header />

      <main className={pageStyles.mainContainer}>
        <CarFeed
          title="Meus Favoritos"
          cars={cars}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
}
