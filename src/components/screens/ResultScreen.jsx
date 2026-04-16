import { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { GAME_MODES } from '../../hooks/useGameReducer';
import { formatAssignedQuestionText, formatCorrectAnswerText } from '../../utils/i18n';
import Button from '../shared/Button';
import styles from './ResultScreen.module.css';

function getSinglePlayerSummary(score, totalQuestions) {
  const percent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  if (percent === 100) {
    return {
      text: 'Excelent. Ai răspuns corect la toate întrebările.',
      percent,
    };
  }

  if (percent >= 60) {
    return {
      text: 'Foarte bine. Ai răspuns corect la majoritatea întrebărilor.',
      percent,
    };
  }

  return {
    text: 'Runda s-a încheiat. Mai încearcă pentru un scor mai bun.',
    percent,
  };
}

function getMultiplayerSummary(player1, player2) {
  if (player1.score === player2.score) {
    return {
      hasWinner: false,
      banner: `Egalitate între ${player1.name} și ${player2.name}.`,
      bannerClassName: `${styles.winnerBanner} ${styles.tie}`,
      text: 'Niciun jucător nu s-a desprins la scor. Poți relua duelul pentru departajare.',
    };
  }

  const winnerName = player1.score > player2.score ? player1.name : player2.name;

  return {
    hasWinner: true,
    banner: `${winnerName} este câștigătorul rundei.`,
    bannerClassName: styles.winnerBanner,
    text: `${winnerName} a acumulat cel mai mare scor în această rundă.`,
  };
}

function FireworksLayer() {
  const bursts = [
    { left: '10%', top: '22%', delay: '0s', colorClass: styles.gold, size: '0.9' },
    { left: '22%', top: '10%', delay: '0.55s', colorClass: styles.blue, size: '1.15' },
    { left: '38%', top: '18%', delay: '0.22s', colorClass: styles.white, size: '0.82' },
    { left: '50%', top: '8%', delay: '0.9s', colorClass: styles.gold, size: '1.3' },
    { left: '66%', top: '16%', delay: '0.35s', colorClass: styles.blue, size: '0.95' },
    { left: '80%', top: '9%', delay: '1.15s', colorClass: styles.white, size: '1.18' },
    { left: '90%', top: '24%', delay: '0.62s', colorClass: styles.gold, size: '0.88' },
  ];
  const confettiPieces = [
    { left: '6%', delay: '0.15s', duration: '3.8s', colorClass: styles.gold, rotate: '-16deg' },
    { left: '13%', delay: '1.25s', duration: '4.3s', colorClass: styles.white, rotate: '14deg' },
    { left: '20%', delay: '0.6s', duration: '4.1s', colorClass: styles.blue, rotate: '-8deg' },
    { left: '29%', delay: '1.75s', duration: '3.6s', colorClass: styles.gold, rotate: '18deg' },
    { left: '36%', delay: '0.05s', duration: '4.6s', colorClass: styles.blue, rotate: '-14deg' },
    { left: '45%', delay: '1.1s', duration: '3.9s', colorClass: styles.white, rotate: '10deg' },
    { left: '54%', delay: '0.42s', duration: '4.5s', colorClass: styles.gold, rotate: '-20deg' },
    { left: '62%', delay: '1.95s', duration: '3.7s', colorClass: styles.blue, rotate: '16deg' },
    { left: '71%', delay: '0.82s', duration: '4.2s', colorClass: styles.white, rotate: '-10deg' },
    { left: '79%', delay: '1.4s', duration: '3.85s', colorClass: styles.gold, rotate: '22deg' },
    { left: '88%', delay: '0.28s', duration: '4.4s', colorClass: styles.blue, rotate: '-12deg' },
    { left: '95%', delay: '1.68s', duration: '3.95s', colorClass: styles.white, rotate: '12deg' },
  ];

  return (
    <div aria-hidden="true" className={styles.fireworksLayer}>
      {bursts.map((burst, index) => (
        <div
          key={index}
          className={`${styles.burst} ${burst.colorClass}`}
          style={{
            left: burst.left,
            top: burst.top,
            animationDelay: burst.delay,
            '--burst-scale': burst.size,
          }}
        >
          <span className={styles.flashCore} />
          <span className={styles.ring} />
          {Array.from({ length: 12 }).map((_, sparkIndex) => (
            <span
              key={sparkIndex}
              className={styles.spark}
              style={{ '--spark-angle': `${sparkIndex * 30}deg` }}
            />
          ))}
        </div>
      ))}
      <div className={styles.confettiLayer}>
        {confettiPieces.map((piece, index) => (
          <span
            key={index}
            className={`${styles.confetti} ${piece.colorClass}`}
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              '--confetti-rotate': piece.rotate,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ResultScreen() {
  const { state, dispatch } = useGame();
  const { gameMode, roundQuestions, score, players } = state;
  const isMultiMode = gameMode === GAME_MODES.MULTI;
  const totalQuestions = roundQuestions.length;
  const scoreRef = useRef(null);

  const singleSummary = getSinglePlayerSummary(score, totalQuestions);
  const multiplayerSummary = getMultiplayerSummary(players.player1, players.player2);
  const showFireworks = isMultiMode ? multiplayerSummary.hasWinner : singleSummary.percent >= 60;

  useEffect(() => {
    scoreRef.current?.focus();
  }, []);

  function handlePlayAgain() {
    dispatch({
      type: 'START_ROUND',
      payload: isMultiMode
        ? { player1Name: players.player1.name, player2Name: players.player2.name }
        : undefined,
    });
  }

  return (
    <div className={styles.result}>
      {showFireworks && <FireworksLayer />}
      <div className={styles.meta}>{isMultiMode ? 'Duel finalizat' : 'Rundă finalizată'}</div>
      <div className={styles.resultScore} ref={scoreRef} tabIndex={-1}>
        {isMultiMode ? `${players.player1.score} - ${players.player2.score}` : `${score} / ${totalQuestions}`}
      </div>
      <p className={styles.description}>{isMultiMode ? multiplayerSummary.text : singleSummary.text}</p>

      {!isMultiMode && (
        <div className={styles.summary}>
          <div className={styles.tile}>
            <strong>{score}</strong>
            <span>Răspunsuri corecte</span>
          </div>
          <div className={styles.tile}>
            <strong>{totalQuestions - score}</strong>
            <span>Răspunsuri greșite</span>
          </div>
          <div className={styles.tile}>
            <strong>{singleSummary.percent}%</strong>
            <span>Scor final</span>
          </div>
        </div>
      )}

      {isMultiMode && (
        <>
          <div className={multiplayerSummary.bannerClassName}>{multiplayerSummary.banner}</div>
          <div className={styles.playerGrid}>
            <div className={styles.playerCard}>
              <strong>{players.player1.name}</strong>
              <div className={styles.playerScore}>{players.player1.score}</div>
              <div className={styles.playerMeta}>
                {formatAssignedQuestionText(players.player1.questionCount)} • {formatCorrectAnswerText(players.player1.score)}
              </div>
            </div>
            <div className={styles.playerCard}>
              <strong>{players.player2.name}</strong>
              <div className={styles.playerScore}>{players.player2.score}</div>
              <div className={styles.playerMeta}>
                {formatAssignedQuestionText(players.player2.questionCount)} • {formatCorrectAnswerText(players.player2.score)}
              </div>
            </div>
          </div>
        </>
      )}

      <div className={styles.controls}>
        <Button onClick={handlePlayAgain}>Joacă din nou</Button>
        <Button variant="outline" onClick={() => dispatch({ type: 'GO_TO_START' })}>
          Înapoi la start
        </Button>
      </div>
    </div>
  );
}
