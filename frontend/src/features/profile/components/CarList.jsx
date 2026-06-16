import { Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../styles/Profile.module.css';

export function CarList({
  isLoading,
  items,
  deleteCar, 
  emptyIcon: Icon,
  emptyTitle,
  emptyDesc,
}) {
  if (isLoading) {
    return (
      <div className={styles.emptyState}>
        <p>Carregando seus anúncios...</p>
      </div>
    );
  }

  if (items.length > 0) {
    return (
      <ul className={styles.adList}>
        {items.map((car) => (
          <li key={car.id} className={styles.adListItem}>
            <Link to={`/edit-ad/${car.id}`} className={styles.adListTitle}>
              <span className={styles.carName}>{car.model}</span>
              <span className={styles.carInfo}>
                {car.year} • R$ {Number(car.price).toLocaleString('pt-BR')}
              </span>
            </Link>

            <div className={styles.adListActions}>
              <Link to={`/edit-ad/${car.id}`} className={styles.editButton}>
                <Edit size={18} />
              </Link>
              
              <button 
                onClick={() => deleteCar(car.id)} 
                className={styles.deleteButton}
                title="Apagar anúncio"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.emptyState}>
      <Icon size={48} color="#CBD5E1" />
      <h3>{emptyTitle}</h3>
      <p>{emptyDesc}</p>
    </div>
  );
}
