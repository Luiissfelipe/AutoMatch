import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import styles from './TagSelector.module.css';

export function TagSelector({
  label,
  categories,
  selectedTags,
  onToggleTag,
  minSelected = 1,
  emptyText = 'Nenhuma tag disponivel.',
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const selectedSet = useMemo(() => new Set(selectedTags), [selectedTags]);

  const filteredCategories = useMemo(() => {
    return categories
      .map((category) => ({
        ...category,
        tags: category.tags.filter((tag) => tag.toLowerCase().includes(normalizedSearch)),
      }))
      .filter((category) => category.tags.length > 0);
  }, [categories, normalizedSearch]);

  return (
    <section className={styles.selector}>
      <div className={styles.header}>
        <div>
          <label className={styles.label}>{label}</label>
          <span className={styles.helper}>
            {selectedTags.length} selecionada(s)
            {minSelected > 1 ? `, minimo ${minSelected}` : ''}
          </span>
        </div>
      </div>

      <div className={styles.searchBox}>
        <Search size={18} />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar tag..."
        />
      </div>

      <div className={styles.selectedRail}>
        {selectedTags.length === 0 ? (
          <span className={styles.placeholder}>Nenhuma tag selecionada</span>
        ) : (
          selectedTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={styles.selectedChip}
              onClick={() => onToggleTag(tag)}
              title={`Remover ${tag}`}
            >
              {tag}
              <X size={14} />
            </button>
          ))
        )}
      </div>

      <div className={styles.optionsPanel}>
        {filteredCategories.length === 0 ? (
          <div className={styles.emptyState}>{emptyText}</div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className={styles.categoryGroup}>
              <div className={styles.categoryTitle}>{category.name}</div>
              <div className={styles.optionGrid}>
                {category.tags.map((tag) => {
                  const isSelected = selectedSet.has(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onToggleTag(tag)}
                      className={`${styles.optionChip} ${isSelected ? styles.optionChipSelected : ''}`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
