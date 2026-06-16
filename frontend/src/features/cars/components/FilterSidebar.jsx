import { Search } from 'lucide-react';
import { Button } from '../../../shared/components/Button/Button';
import { InputField } from '../../../shared/components/InputField/InputField';
import styles from './FilterSidebar.module.css';

export function FilterSidebar({
  filtersOpen,
  closeFilters,
  groupedTags,
  selectedTags,
  toggleTag,
  applyFilters,
  searchTerm,
  setSearchTerm
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    applyFilters(searchTerm);
  };

  return (
    <aside
      id="search-filters"
      className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ''}`}
    >
      <form className={styles.filterContainer} onSubmit={handleSubmit}>
        <div className={styles.mobileHeader}>
          <strong>Filtros</strong>
          <button type="button" onClick={closeFilters} aria-label="Fechar filtros">
            Fechar
          </button>
        </div>

        <div className={styles.filterContent}>
          <div className={styles.searchSection}>
            <InputField
              id="search-name"
              label="Nome do Veiculo"
              placeholder="Ex: Civic, Corolla..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              icon={Search}
            />
          </div>

          <div className={styles.divider}></div>

          {Object.entries(groupedTags).map(([category, tags]) => (
            <div key={category} className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </h3>
              <div className={styles.tagsGrid}>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`${styles.tagPill} ${selectedTags.includes(tag.id) ? styles.tagSelected : ''}`}
                  >
                    {tag.id}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.filterActions}>
          <Button
            type="submit"
            className={styles.applyFilterButton}
          >
            Aplicar Filtros
          </Button>
        </div>
      </form>
    </aside>
  );
}
