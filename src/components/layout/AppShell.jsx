import styles from './AppShell.module.css';

const SCREEN_LABELS = {
  start: 'Pregătire rundă',
  quiz: 'Rundă live',
  result: 'Rezultate',
};

export default function AppShell({ children, screen = 'start' }) {
  const cardClassName = [styles.card, styles[screen]].filter(Boolean).join(' ');

  return (
    <div className={styles.app}>
      <div className={cardClassName}>
        <div className={styles.topBar} />
        <div className={styles.brand}>
          <div className={styles.brandLeft}>
            <div className={styles.brandCopy}>
              <div className={styles.screenBadge}>{SCREEN_LABELS[screen] || SCREEN_LABELS.start}</div>
              <h1>Quiz PORR Construct</h1>
              <div className={styles.brandMeta}>
                Ediția a X-a <span className={styles.brandMetaHighlight}>ConstructFEST 2026</span>
              </div>
            </div>
            <div className={styles.brandLogos}>
              <div className={styles.logoWrap}>
                <img src="Porr-Logo_v2.png" alt="PORR Logo" />
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
