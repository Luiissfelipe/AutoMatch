import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, CarFront } from 'lucide-react';

import { useLogin } from '../hooks/useLogin';
import { InputField } from '../../../shared/components/InputField/InputField';
import { Button } from '../../../shared/components/Button/Button';
import styles from '../styles/AuthForm.module.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: false, password: false });

  const { login, isLoading, error } = useLogin();

  const handleSubmit = (event) => {
    event.preventDefault();

    const isEmailEmpty = email.trim() === '';
    const isPasswordEmpty = password.trim() === '';

    setValidationErrors({ email: isEmailEmpty, password: isPasswordEmpty });

    if (isEmailEmpty || isPasswordEmpty) return;

    login(email, password);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: false }));
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: false }));
    }
  };

  const friendlyErrorMessage = error.includes('400') || error.includes('401')
    ? 'E-mail ou senha incorretos. Verifique seus dados.'
    : error;

  return (
    <div className={styles.pageContainer}>
      <div className={`${styles.card} ${styles.cardSmall}`}>
        <div className={styles.header}>
          <CarFront color="#FF6600" size={48} />
          <h1>Bem-vindo ao AutoMatch</h1>
          <p>Faça login para encontrar o seu carro ideal.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {friendlyErrorMessage && (
            <div className={styles.errorMessage}>{friendlyErrorMessage}</div>
          )}

          <InputField
            id="email"
            label="E-mail"
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={handleEmailChange}
            icon={Mail}
            hasError={validationErrors.email}
            errorMessage="O e-mail é obrigatório"
          />

          <InputField
            id="password"
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            icon={Lock}
            hasError={validationErrors.password}
            errorMessage="A senha é obrigatória"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Entrando..."
          >
            Entrar na Plataforma
            <LogIn size={20} />
          </Button>
        </form>

        <div className={styles.footer}>
          <p>Ainda não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
        </div>
      </div>
    </div>
  );
}
