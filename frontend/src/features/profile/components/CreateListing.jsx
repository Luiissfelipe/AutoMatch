import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Car,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { carService } from "../../cars/services/carService";
import { TagSelector } from "../../cars/components/TagSelector";
import { InputField } from "../../../shared/components/InputField/InputField";
import { Button } from "../../../shared/components/Button/Button";
import styles from "./CreateListing.module.css";

function groupTagsByCategory(tags) {
  return tags.reduce((accumulator, currentTag) => {
    const category = currentTag.category ?? currentTag.categoria ?? "OUTROS";
    const tagId = currentTag.id;

    if (!tagId) return accumulator;

    if (!accumulator[category]) {
      accumulator[category] = {
        id: category,
        name: category,
        tags: [],
      };
    }

    accumulator[category].tags.push(tagId);
    return accumulator;
  }, {});
}

export function CreateListing({ tags }) {
  const navigate = useNavigate();

  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (Array.isArray(tags)) {
      setApiCategories(Object.values(groupTagsByCategory(tags)));
    }
  }, [tags]);

  const toggleTag = (tag) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!model.trim() || !year || !price || !imageUrl.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (selectedTags.length < 5) {
      setError("Selecione pelo menos 5 tags.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await carService.create(
        model.trim(),
        Number(year),
        Number(price),
        selectedTags,
        imageUrl.trim(),
      );

      setSuccessMessage("Anúncio criado com sucesso!");

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar anúncio:", error);
      setError(error.message || "Não foi possivel criar o anúncio. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageLayout}>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.headerSection}>
            <h1>Anunciar Novo Veiculo</h1>
            <p>Preencha os detalhes abaixo para anunciar seu veículo.</p>
          </div>

          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}
          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <InputField
              id="model"
              label="Modelo do Veiculo *"
              type="text"
              placeholder="Ex: Honda Civic 2.0 EXL"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              icon={Car}
              required
            />

            <InputField
              id="imageUrl"
              label="URL da Imagem *"
              type="url"
              placeholder="Ex: https://site.com/imagem-do-carro.jpg"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              icon={ImageIcon}
              required
            />

            <div className={styles.rowGrid}>
              <InputField
                id="year"
                label="Ano de Fabricacao *"
                type="number"
                placeholder="Ex: 2020"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                icon={Calendar}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
              />

              <InputField
                id="price"
                label="Preco (R$) *"
                type="number"
                placeholder="Ex: 85000"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                icon={DollarSign}
                required
                min="1"
              />
            </div>

            <TagSelector
              label="Tags do anúncio"
              categories={apiCategories}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
              minSelected={5}
            />

            <Button
              type="submit"
              className={styles.submitButton}
              isLoading={isLoading}
              loadingText="Publicando anúncio..."
            >
              Publicar Anúncio
              <ArrowRight size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
