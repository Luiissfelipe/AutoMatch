import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, CarFront } from 'lucide-react';

import { useSignUp } from '../hooks/useSignUp';
import { InputField } from '../../../shared/components/InputField/InputField';
import { Button } from '../../../shared/components/Button/Button';
import styles from '../styles/AuthForm.module.css';

function validateSignUpForm({ name, email, password }) {
  const errors = {};
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName) {
    errors.name = 'O nome é obrigatório.';
  } else if (trimmedName.length < 3) {
    errors.name = 'Informe pelo menos 3 caracteres.';
  }

  if (!trimmedEmail) {
    errors.email = 'O e-mail é obrigatório.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (!password) {
    errors.password = 'A senha é obrigatória.';
  } else if (password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.';
  }

  return errors;
}

export function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { signUp, isLoading, error, clearError } = useSignUp();

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateSignUpForm({ name, email, password });
    setValidationErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    signUp(name.trim(), email.trim().toLowerCase(), password);
  };

  const clearFieldError = (field) => {
    setValidationErrors((current) => ({ ...current, [field]: undefined }));
    clearError();
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    if (validationErrors.name || error) clearFieldError('name');
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (validationErrors.email || error) clearFieldError('email');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (validationErrors.password || error) clearFieldError('password');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={`${styles.card} ${styles.cardMedium}`}>
        <div className={styles.header}>
          <CarFront color="#FF6600" size={48} />
          <h1>Crie sua conta</h1>
          <p>Junte-se ao AutoMatch e encontre seu proximo veiculo.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          <InputField
            id="name"
            label="Nome"
            type="text"
            placeholder="Ex: Seu Nome"
            value={name}
            onChange={handleNameChange}
            icon={User}
            hasError={Boolean(validationErrors.name)}
            errorMessage={validationErrors.name}
            autoComplete="name"
          />

          <InputField
            id="email"
            label="E-mail"
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={handleEmailChange}
            icon={Mail}
            hasError={Boolean(validationErrors.email)}
            errorMessage={validationErrors.email}
            autoComplete="email"
          />

          <InputField
            id="password"
            label="Senha"
            type="password"
            placeholder="Minimo de 6 caracteres"
            value={password}
            onChange={handlePasswordChange}
            icon={Lock}
            hasError={Boolean(validationErrors.password)}
            errorMessage={validationErrors.password}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Criando conta..."
          >
            Cadastrar
            <UserPlus size={20} />
          </Button>
        </form>

        <div className={styles.footer}>
          <p>Ja possui uma conta? <Link to="/login">Faca login</Link></p>
        </div>
      </div>
    </div>
  );
}
