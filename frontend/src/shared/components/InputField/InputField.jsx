import React from 'react';
import styles from './InputField.module.css';

export function InputField({ 
  id, 
  label, 
  icon: Icon, 
  hasError, 
  errorMessage,
  ...props
}) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>{label}</label>
      <div className={`${styles.inputWrapper} ${hasError ? styles.inputError : ''}`}>
        {Icon && <Icon className={styles.inputIcon} size={20} />}
        <input
          id={id}
          {...props}
        />
      </div>
      {hasError && <span className={styles.feedbackMessage}>{errorMessage}</span>}
    </div>
  );
}