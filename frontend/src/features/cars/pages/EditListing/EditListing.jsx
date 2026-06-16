import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Car,
  CheckCircle,
  ChevronLeft,
  DollarSign,
  Image as ImageIcon,
  Save,
} from "lucide-react";
import { Header } from "../../../../shared/layout/Header/Header";
import { InputField } from "../../../../shared/components/InputField/InputField";
import { Button } from "../../../../shared/components/Button/Button";
import { TagSelector } from "../../components/TagSelector";
import { useEditListing } from "../../hooks/useEditListing";
import styles from "./EditListing.module.css";

export function EditListing() {
  const { id: carId } = useParams();
  const navigate = useNavigate();

  const {
    model, setModel,
    price, setPrice,
    year, setYear,
    imageUrl, setImageUrl,
    status,
    selectedTags,
    tagCategories,
    toggleTag,
    isLoading,
    isSaving,
    successMessage,
    error,
    saveListing,
    markAsSold,
  } = useEditListing(carId);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando dados do anuncio...</p>
      </div>
    );
  }

  const isSold = status === "VENDIDO";

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.mainContainer}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          type="button"
        >
          <ChevronLeft size={20} />
          Voltar
        </button>

        {successMessage && <div className={styles.successBanner}>{successMessage}</div>}
        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={saveListing} className={styles.editForm}>
          <section className={styles.mediaCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h1>Editar Anuncio</h1>
                <p>Atualize a imagem, informacoes principais e tags do veiculo.</p>
              </div>
            </div>

            <div className={`${styles.mainImage} ${isSold ? styles.imageGrayscale : ""}`}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Pre-visualizacao do veiculo"
                  className={styles.carImage}
                />
              ) : (
                <span className={styles.imagePlaceholder}>Sem Foto Disponivel</span>
              )}
            </div>

            <div className={styles.imageInputWrapper}>
              <InputField
                id="imageUrl"
                label="Alterar URL da Imagem"
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                icon={ImageIcon}
              />
            </div>
          </section>

          <section className={styles.formCard}>
            <div className={styles.formGroup}>
              <div className={styles.primaryFieldsGrid}>
                <InputField
                  id="model"
                  label="Modelo do Veiculo"
                  type="text"
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  icon={Car}
                  required
                />

                <InputField
                  id="price"
                  label="Preco (R$)"
                  type="number"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  icon={DollarSign}
                  required
                />
              </div>

              <div className={styles.secondaryFieldsGrid}>
                <InputField
                  id="year"
                  label="Ano"
                  type="number"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  icon={Calendar}
                  required
                />

                <div className={styles.statusSection}>
                  <label className={styles.sectionLabel}>Status do Anuncio</label>
                  <div className={styles.statusDisplay}>
                    <CheckCircle size={20} color={isSold ? "#10B981" : "#F59E0B"} />
                    <strong>{status}</strong>

                    {!isSold && (
                      <button
                        type="button"
                        onClick={markAsSold}
                        className={styles.markSoldButton}
                      >
                        Marcar como Vendido
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <TagSelector
                label="Tags do anuncio"
                categories={tagCategories}
                selectedTags={selectedTags}
                onToggleTag={toggleTag}
                minSelected={1}
                emptyText="Nenhuma tag disponivel para edicao."
              />
            </div>

            <div className={styles.actionButtons}>
              <Button
                type="submit"
                className={styles.primaryActionButton}
                isLoading={isSaving}
                loadingText="Salvando..."
              >
                <Save size={20} />
                Salvar Alteracoes
              </Button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
