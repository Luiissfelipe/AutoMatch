import { useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";

import useAuthStore from "../../../../store/useAuthStore";
import { Header } from "../../../../shared/layout/Header/Header";
import { Onboarding } from "../../../onboarding/components/OnboardingModal";
import { CarCard } from "../../components/CarCard";
import { FilterSidebar } from "../../components/FilterSidebar";
import { useHome } from "../../hooks/useHome";

import styles from "./Search.module.css";

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const needsOnboarding = useAuthStore((state) => state.needsOnboarding);
  const [showOnboarding, setShowOnboarding] = useState(needsOnboarding);

  const {
    cars,
    groupedTags,
    selectedTags,
    feedTitle,
    isLoading,
    currentPage,
    totalPages,
    changePage,
    toggleTag,
    applyFilters,
  } = useHome();

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <div className={styles.layout}>
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      <Header />

      <main className={styles.mainContainer}>
        {filtersOpen && (
          <button
            type="button"
            className={styles.filterBackdrop}
            onClick={() => setFiltersOpen(false)}
            aria-label="Fechar filtros"
          />
        )}

        <button
          className={styles.mobileFilterButton}
          onClick={() => setFiltersOpen((current) => !current)}
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="search-filters"
        >
          {filtersOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
          {filtersOpen ? "Fechar filtros" : "Filtros"}
        </button>

        <FilterSidebar
          filtersOpen={filtersOpen}
          closeFilters={() => setFiltersOpen(false)}
          groupedTags={groupedTags}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          applyFilters={applyFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <section className={styles.feed}>
          <div className={styles.feedHeader}>
            <h2>{feedTitle}</h2>
            <span className={styles.resultCount}>
              {cars.length} veículos nessa página
            </span>
          </div>

          {isLoading ? (
            <div className={styles.loadingState}>
              <p>Carregando veículos...</p>
            </div>
          ) : (
            <>
              <div className={styles.threeColumnCarGrid}>
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}

                {cars.length === 0 && (
                  <div className={styles.emptyState}>
                    Nenhum veículo encontrado.
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => changePage(currentPage - 1, searchTerm)}
                    disabled={currentPage <= 1}
                    className={styles.pageButton}
                  >
                    <ChevronLeft size={20} />
                    <span>Anterior</span>
                  </button>

                  <span className={styles.pageInfo}>
                    Pagina <strong>{currentPage}</strong> de{" "}
                    <strong>{totalPages}</strong>
                  </span>

                  <button
                    onClick={() => changePage(currentPage + 1, searchTerm)}
                    disabled={currentPage >= totalPages}
                    className={styles.pageButton}
                  >
                    <span>Proxima</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
