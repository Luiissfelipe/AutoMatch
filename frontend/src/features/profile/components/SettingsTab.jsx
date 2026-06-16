import { User, Mail, Save, Shield } from "lucide-react";
import { InputField } from "../../../shared/components/InputField/InputField";
import { Button } from "../../../shared/components/Button/Button";
import styles from "../styles/Profile.module.css";

export function SettingsTab({
  name,
  setName,
  user,
  isSeller,
  becomeSeller,
  saveProfile,
  isSaving,
  successMessage,
  error,
}) {
  return (
    <div className={styles.settingsCard}>
      <h2>Dados Pessoais</h2>
      <p className={styles.sectionDescription}>
        Mantenha suas informações atualizadas para uma melhor experiência.
      </p>

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={saveProfile} className={styles.form}>
        <InputField
          id="name"
          label="Nome Completo"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          icon={User}
          required
        />

        <InputField
          id="email"
          label="E-mail (não pode ser alterado)"
          type="email"
          value={user.email}
          icon={Mail}
          disabled
        />

        {!isSeller && (
          <div className={styles.sellerToggleSection}>
            <div className={styles.sellerToggleInfo}>
              <Shield size={24} className={styles.sellerIcon} />
              <div>
                <h3>Deseja ser vendedor?</h3>
                <p>
                  Seu perfil atual é <strong>COMPRADOR</strong>. Ao se tornar um
                  VENDEDOR, você poderá anunciar seus carros na plataforma.
                </p>
              </div>
            </div>
            <button
              type="button"
              className={styles.toggleSellerButton}
              onClick={becomeSeller}
            >
              Quero ser vendedor
            </button>
          </div>
        )}

        <Button
          type="submit"
          className={styles.saveButton}
          isLoading={isSaving}
          loadingText={
            <>
              <Save size={20} /> Salvando...
            </>
          }
        >
          <Save size={20} />
          Salvar Alterações
        </Button>
      </form>
    </div>
  );
}
