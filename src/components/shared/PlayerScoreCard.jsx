import styles from './PlayerScoreCard.module.css';
import { formatAssignedQuestionText } from '../../utils/i18n';

export default function PlayerScoreCard({ name, score, questionCount, isActive }) {
  const className = [styles.card, isActive && styles.active].filter(Boolean).join(' ');

  return (
    <div className={className}>
      <div className={styles.top}>
        <span className={styles.name}>{name}</span>
        <span className={styles.value}>{score}</span>
      </div>
      <div className={styles.meta}>{formatAssignedQuestionText(questionCount)}</div>
    </div>
  );
}
