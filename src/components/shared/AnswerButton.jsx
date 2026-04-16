import styles from './AnswerButton.module.css';

export default function AnswerButton({
  prefix,
  text,
  state = 'default',
  disabled,
  disabledReason = '',
  onClick,
}) {
  const classNames = [
    styles.btn,
    state !== 'default' && styles[state],
    disabledReason && styles[disabledReason],
  ].filter(Boolean).join(' ');

  return (
    <button
      aria-label={prefix ? `${prefix}. ${text}` : text}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {prefix && <span className={styles.prefix}>{prefix}</span>}
      <span className={styles.text}>{text}</span>
    </button>
  );
}
