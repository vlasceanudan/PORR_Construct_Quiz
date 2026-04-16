import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  disabled,
  onClick,
  children,
  type = 'button',
  className = '',
}) {
  const resolvedClassName = [styles.btn, styles[variant], className].filter(Boolean).join(' ');

  return (
    <button className={resolvedClassName} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
