import React from 'react';
import { Sparkles, Check, ChevronRight } from 'lucide-react';
import { useOnboarding } from '../hooks/useOnboarding';
import styles from '../styles/Onboarding.module.css';

export function Onboarding({ onComplete }) {
  const { 
    groupedTags, 
    selectedTags, 
    isLoading, 
    isSubmitting, 
    error,
    LIMITE_TAGS, 
    toggleTag, 
    handleFinalizar 
  } = useOnboarding(onComplete);

  if (isLoading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Preparando sua experiência...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.onboardingCard}>
        
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Sparkles color="#FF6600" size={32} />
          </div>
          <h1>O que você está buscando?</h1>
          <p>Selecione até <strong>{LIMITE_TAGS} características</strong> para personalizarmos as suas recomendações de veículos.</p>
        </div>

        <div className={styles.tagsContainer}>
          {Object.entries(groupedTags).map(([category, tags]) => (
            <div key={category} className={styles.categorySection}>
              <h3 className={styles.categoryTitle}>
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </h3>
              
              <div className={styles.tagsGrid}>
                {tags.map(tagId => {
                  const isSelected = selectedTags.includes(tagId);
                  const isMaxReached = !isSelected && selectedTags.length >= LIMITE_TAGS;

                  return (
                    <button
                      type="button"
                      key={tagId}
                      onClick={() => toggleTag(tagId)}
                      disabled={isMaxReached}
                      aria-pressed={isSelected}
                      className={`${styles.tagPill} ${isSelected ? styles.tagSelected : ''} ${isMaxReached ? styles.tagDisabled : ''}`}
                    >
                      {tagId}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerStatus}>
            <div className={styles.counter}>
              <span className={styles.counterNumber}>{selectedTags.length}</span>
              <span className={styles.counterText}>/ {LIMITE_TAGS} selecionadas</span>
            </div>
            {error && (
              <p className={styles.errorMessage} role="alert">
                {error}
              </p>
            )}
          </div>

          <button 
            type="button"
            onClick={handleFinalizar}
            disabled={selectedTags.length === 0 || isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Salvando...' : (
              <>
                Salvar Preferências
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
