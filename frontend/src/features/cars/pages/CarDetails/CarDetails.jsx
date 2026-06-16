import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  Heart,
  Info,
  MessageCircle,
  Tag
} from 'lucide-react';
import { Header } from '../../../../shared/layout/Header/Header';
import { useCarFavorite } from '../../hooks/useCarFavorite';
import { carService } from '../../services/carService';
import styles from './CarDetails.module.css';

export function CarDetails() {
  const { id: carId } = useParams();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorited, isRequesting, toggleFavorite } = useCarFavorite(car?.id, car?.favorito);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);

      try {
        const carData = await carService.getById(carId);
        setCar(carData);
      } catch (error) {
        console.error('Erro ao buscar detalhes do veiculo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (carId) fetchDetails();
  }, [carId]);

  const handleFavorite = (event) => {
    event.stopPropagation();
    toggleFavorite();
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando detalhes do veiculo...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className={styles.loadingContainer}>
        <p>Veiculo não encontrado.</p>
      </div>
    );
  }

  const isVendido = car.status === 'VENDIDO';

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.mainContainer}>
        <button
          className={styles.backButton}
          onClick={() => window.history.back()}
          type="button"
        >
          <ChevronLeft size={20} />
          Voltar para as buscas
        </button>

        {isVendido && (
          <div className={styles.soldBanner}>
            <Info size={24} color="#B91C1C" />
            <div className={styles.soldText}>
              <h3>Veiculo Indisponível</h3>
              <p>Este veiculo já foi vendido!</p>
            </div>
          </div>
        )}

        <div className={styles.contentGrid}>
          <div className={styles.imageSection}>
            <div className={`${styles.mainImage} ${isVendido ? styles.imageGrayscale : ''}`}>
              {car.imageUrl ? (
                <img
                  src={car.imageUrl}
                  alt={car.model}
                  className={styles.carImage}
                />
              ) : (
                <span className={styles.imagePlaceholder}>Sem Foto Disponível</span>
              )}
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.headerInfo}>
              <h1>{car.model}</h1>
              <button
                className={styles.favoriteButton}
                onClick={handleFavorite}
                disabled={isRequesting}
                aria-label={isFavorited ? 'Remover dos favoritos' : 'Favoritar'}
                type="button"
              >
                <Heart
                  size={28}
                  color={isFavorited ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
                  fill={isFavorited ? 'var(--color-accent)' : 'none'}
                />
              </button>
            </div>

            <p className={styles.price}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(car.price)}
            </p>

            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <Calendar size={20} className={styles.featureIcon} />
                <span>
                  Ano <strong>{car.year}</strong>
                </span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle size={20} className={styles.featureIcon} />
                <span>
                  Status <strong>{car.status}</strong>
                </span>
              </div>
            </div>

            {car.tags && car.tags.length > 0 && (
              <div className={styles.tagsContainer}>
                <h3>Caracteristicas</h3>
                <div className={styles.tagsGrid}>
                  {car.tags.map((tag, index) => (
                    <span key={`${tag}-${index}`} className={styles.tag}>
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button className={styles.primaryActionButton} disabled={isVendido} type="button">
              {isVendido ? (
                'Indisponivel para compra'
              ) : (
                <>
                  <MessageCircle size={20} />
                  Entrar em Contato
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
