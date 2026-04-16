import { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { GAME_MODES } from '../../hooks/useGameReducer';
import { MODE_COPY } from '../../utils/i18n';
import Button from '../shared/Button';
import styles from './StartScreen.module.css';

export default function StartScreen() {
  const { state, dispatch } = useGame();
  const headingRef = useRef(null);

  const { gameMode, questionSet, players, startError } = state;
  const copy = MODE_COPY[gameMode];
  const totalQuestions = questionSet.questions.length;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function setGameMode(mode) {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
  }

  function handleStart() {
    dispatch({
      type: 'START_ROUND',
      payload:
        gameMode === GAME_MODES.MULTI
          ? { player1Name: players.player1.name, player2Name: players.player2.name }
          : undefined,
    });
  }

  return (
    <div className={styles.startBox}>
      <h2 ref={headingRef} tabIndex={-1}>Quiz PORR Construct</h2>
      <p>{copy.intro}</p>

      <div className={styles.modePanel}>
        <strong>Mod de joc</strong>
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${gameMode === GAME_MODES.SINGLE ? styles.active : ''}`}
            onClick={() => setGameMode(GAME_MODES.SINGLE)}
            type="button"
          >
            <strong>Quiz normal</strong>
            <span>Experiența clasică, cu un singur jucător și scor unic pentru toată runda.</span>
          </button>
          <button
            className={`${styles.modeBtn} ${gameMode === GAME_MODES.MULTI ? styles.active : ''}`}
            onClick={() => setGameMode(GAME_MODES.MULTI)}
            type="button"
          >
            <strong>Quiz 2 jucători</strong>
            <span>Operatorul decide pentru fiecare întrebare cine răspunde, iar scorul rămâne separat.</span>
          </button>
        </div>
      </div>

      {gameMode === GAME_MODES.MULTI && (
        <div className={styles.playerSetup}>
          <div className={styles.playerField}>
            <label htmlFor="player1Input">Nume jucător 1</label>
            <input
              id="player1Input"
              type="text"
              maxLength={32}
              placeholder="Player 1"
              value={players.player1.name === 'Player 1' ? '' : players.player1.name}
              onChange={(e) => dispatch({ type: 'SET_PLAYER_NAME', payload: { key: 'player1', name: e.target.value } })}
            />
          </div>
          <div className={styles.playerField}>
            <label htmlFor="player2Input">Nume jucător 2</label>
            <input
              id="player2Input"
              type="text"
              maxLength={32}
              placeholder="Player 2"
              value={players.player2.name === 'Player 2' ? '' : players.player2.name}
              onChange={(e) => dispatch({ type: 'SET_PLAYER_NAME', payload: { key: 'player2', name: e.target.value } })}
            />
          </div>
        </div>
      )}

      {startError && (
        <div className={`${styles.statusBanner} ${styles.error}`} role="alert">
          <strong>Configurație invalidă</strong>
          <span>{startError}</span>
        </div>
      )}

      <Button disabled={totalQuestions === 0} onClick={handleStart}>
        {copy.startLabel}
      </Button>
    </div>
  );
}
