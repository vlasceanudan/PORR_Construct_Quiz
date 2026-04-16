import styles from './ProgressBar.module.css';

export default function ProgressBar({ current, total, label, meta }) {
  const percent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div className={styles.label}>{label}</div>
        <div className={styles.label}>{meta}</div>
      </div>
      <div
        aria-label={label}
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={current}
        className={styles.bar}
        role="progressbar"
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
