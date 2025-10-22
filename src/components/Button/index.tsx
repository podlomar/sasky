import { ReactNode } from 'react';
import styles from './styles.module.css';

interface Props {
  id?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  href?: string;
  target?: string;
}

export const Button = ({
  id,
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = '',
  href,
  target
}: Props) => {
  const buttonClasses = [
    styles.btn,
    styles[variant],
    styles[size],
    disabled ? styles.disabled : '',
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');

  if (href !== undefined) {
    return (
      <a href={href} target={target} className={buttonClasses}>
        {children}
      </a>
    );
  }

  return (
    <button
      id={id}
      type={type}
      className={buttonClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
