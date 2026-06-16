import { CarCard } from './CarCard';
import styles from './CarFeed.module.css';

export function CarFeed({
  title,
  cars,
  isLoading,
  error,
  loadingText = 'Carregando veículos...',
  emptyText = 'Nenhum veículo encontrado.',
  columns = 4
}) {
  const gridClassName = columns === 3 ? styles.threeColumnCarGrid : styles.fourColumnCarGrid;

  return (
    <section className={styles.feed}>
      <div className={styles.feedHeader}>
        <h2>{title}</h2>
        <span className={styles.resultCount}>
          {cars.length} veículos nessa página
        </span>
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>
          <p>{loadingText}</p>
        </div>
      ) : (
        <div className={gridClassName}>
          {error && (
            <div className={styles.emptyState}>
              {error}
            </div>
          )}

          {!error && cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}

          {!error && cars.length === 0 && (
            <div className={styles.emptyState}>
              {emptyText}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
