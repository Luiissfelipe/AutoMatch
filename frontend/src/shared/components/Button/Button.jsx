import React from 'react';
import styles from './Button.module.css';

export function Button({ 
  children, 
  isLoading, 
  loadingText, 
  type = 'button', 
  disabled, 
  className = '',
  ...props 
}) {
  return (
    <button 
      type={type} 
      className={`${styles.submitButton} ${className}`} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}