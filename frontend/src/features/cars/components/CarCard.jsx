import { Heart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './CarCard.module.css';
import { interactionService } from '../services/interactionService';
import { useCarFavorite } from '../hooks/useCarFavorite';

export function CarCard({ car }) {
  const navigate = useNavigate();
  const { isFavorited, isRequesting, toggleFavorite } = useCarFavorite(car.id, car.favorito);

  const handleFavorite = async (e) => {
    e.stopPropagation(); 
    toggleFavorite();
  };

  const handleView = async () => {
    if (isRequesting) return;
    try {
      await interactionService.view(car.id);
    } catch (error) {
      console.error("Erro ao view car:", error);
    }
    
    navigate(`/car/${car.id}`);
  };

  return (
    <article className={styles.card} onClick={handleView}>
      <div className={styles.imagePlaceholder}>
        <img 
          src={car.imageUrl} 
          alt={car.model} 
          className={styles.carImage} 
        />
        <button 
          className={styles.favoriteButton} 
          onClick={handleFavorite}
          disabled={isRequesting}
          aria-label={isFavorited ? "Remover dos favoritos" : "Favoritar"}
        >
          <Heart 
            size={24} 
            color={isFavorited ? "var(--color-accent)" : "var(--color-text-secondary)"}
            fill={isFavorited ? "var(--color-accent)" : "none"} 
          />
        </button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>{car.model}</h2>
          <span className={styles.year}>{car.year}</span>
        </div>
        
        <p className={styles.price}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price)}
        </p>
        
        <div className={styles.tags}>
          {car.tags?.map((tag, index) => (
            <span key={`${tag}-${index}`} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <button className={styles.actionButton}>
          Ver Detalhes
          <ChevronRight size={18} />
        </button>
      </div>
    </article>
  );
}
