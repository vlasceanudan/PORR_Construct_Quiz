import { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { GAME_MODES, PLAYER_KEYS } from '../../hooks/useGameReducer';
import AnswerButton from '../shared/AnswerButton';
import Button from '../shared/Button';
import PlayerScoreCard from '../shared/PlayerScoreCard';
import ProgressBar from '../shared/ProgressBar';
import styles from './QuizScreen.module.css';

function getAnswerState(answerIndex, selectedAnswerIndex, correctIndex, answered) {
  if (!answered) return 'default';
  if (answerIndex === selectedAnswerIndex && answerIndex === correctIndex) return 'correct';
  if (answerIndex === selectedAnswerIndex) return 'wrong';
  if (answerIndex === correctIndex) return 'revealCorrect';
  return 'default';
}

function getFeedbackMessage(isMultiMode, answered, selectedAnswerIndex, correctIndex, selectedPlayerName) {
  if (!answered) {
    return { text: '', type: '' };
  }

  if (selectedAnswerIndex === correctIndex) {
    return {
      text: isMultiMode ? `Răspuns corect pentru ${selectedPlayerName}.` : 'Răspuns corect.',
      type: 'correct',
    };
  }

  return {
    text: isMultiMode ? `Răspuns greșit pentru ${selectedPlayerName}.` : 'Răspuns greșit.',
    type: 'wrong',
  };
}

export default function QuizScreen() {
  const { state, dispatch } = useGame();
  const {
    gameMode,
    roundQuestions,
    currentQuestionIndex,
    answered,
    selectedAnswerIndex,
    players,
    selectedPlayerKey,
  } = state;
  const questionRegionRef = useRef(null);

  const currentQuestion = roundQuestions[currentQuestionIndex];
  const isMultiMode = gameMode === GAME_MODES.MULTI;
  const totalQuestions = roundQuestions.length;
  const currentStep = currentQuestionIndex + 1;
  const progressValue = answered ? currentStep : currentQuestionIndex;
  const selectedPlayerName = selectedPlayerKey ? players[selectedPlayerKey].name : '';
  const message = currentQuestion
    ? getFeedbackMessage(
        isMultiMode,
        answered,
        selectedAnswerIndex,
        currentQuestion.correctIndex,
        selectedPlayerName,
      )
    : { text: '', type: '' };
  const messageClassName = [styles.message, message.type && styles[message.type]].filter(Boolean).join(' ');
  const requiresPlayerSelection = isMultiMode && !selectedPlayerKey && !answered;
  const turnPanelClassName = [
    styles.turnPanel,
    requiresPlayerSelection && styles.awaitingSelection,
    answered && selectedPlayerKey && styles.lockedSelection,
  ].filter(Boolean).join(' ');
  const nextLabel = answered && currentStep === totalQuestions ? 'Vezi rezultatele' : 'Următoarea întrebare';
  const turnTitle = answered && selectedPlayerKey
    ? `${selectedPlayerName} a primit întrebarea curentă.`
    : selectedPlayerKey
      ? `${selectedPlayerName} răspunde acum.`
      : 'Alege jucătorul care răspunde la întrebarea curentă.';

  const answerButtons = currentQuestion
    ? currentQuestion.answers.map((answer, answerIndex) => ({
        answer,
        answerIndex,
      }))
    : [];

  useEffect(() => {
    questionRegionRef.current?.focus();
  }, [currentQuestionIndex]);

  function handleRestart() {
    if (!window.confirm('Sigur vrei să reîncepi runda curentă? Progresul acestei runde va fi pierdut.')) {
      return;
    }

    dispatch({
      type: 'START_ROUND',
      payload: isMultiMode
        ? { player1Name: players.player1.name, player2Name: players.player2.name }
        : undefined,
    });
  }

  if (!currentQuestion) {
    return (
      <div className={styles.emptyState}>
        <h2>Runda nu este disponibilă</h2>
        <p>Nu există o întrebare activă. Revino la start și pornește o rundă nouă.</p>
        <Button onClick={() => dispatch({ type: 'GO_TO_START' })}>Înapoi la start</Button>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar
        current={progressValue}
        total={totalQuestions}
        label={`Întrebarea ${currentStep} din ${totalQuestions}`}
        meta={`Rundă de ${totalQuestions} întrebări`}
      />

      {isMultiMode && (
        <>
          <div className={styles.multiplayerStrip}>
            <PlayerScoreCard
              name={players.player1.name}
              score={players.player1.score}
              questionCount={players.player1.questionCount}
              isActive={selectedPlayerKey === PLAYER_KEYS.PLAYER_1}
            />
            <PlayerScoreCard
              name={players.player2.name}
              score={players.player2.score}
              questionCount={players.player2.questionCount}
              isActive={selectedPlayerKey === PLAYER_KEYS.PLAYER_2}
            />
          </div>

          <div className={turnPanelClassName}>
            <div className={styles.meta}>Atribuire întrebare</div>
            <strong>{turnTitle}</strong>
            <div className={styles.turnButtons}>
              <button
                className={`${styles.playerSelectBtn} ${selectedPlayerKey === PLAYER_KEYS.PLAYER_1 ? styles.selected : ''}`}
                disabled={answered}
                onClick={() => dispatch({ type: 'SELECT_PLAYER', payload: PLAYER_KEYS.PLAYER_1 })}
                type="button"
              >
                {players.player1.name}
              </button>
              <button
                className={`${styles.playerSelectBtn} ${selectedPlayerKey === PLAYER_KEYS.PLAYER_2 ? styles.selected : ''}`}
                disabled={answered}
                onClick={() => dispatch({ type: 'SELECT_PLAYER', payload: PLAYER_KEYS.PLAYER_2 })}
                type="button"
              >
                {players.player2.name}
              </button>
            </div>
            <div className={`${styles.turnNote} ${requiresPlayerSelection ? styles.warningNote : ''}`}>
              {answered && selectedPlayerKey
                ? 'Selecția este blocată până la întrebarea următoare.'
                : selectedPlayerKey
                  ? 'Poți selecta acum unul dintre răspunsuri.'
                  : 'Selectează mai întâi jucătorul. Răspunsurile rămân blocate până atunci.'}
            </div>
          </div>
        </>
      )}

      <div
        aria-label={`Întrebarea ${currentStep}`}
        className={styles.questionStage}
        ref={questionRegionRef}
        tabIndex={-1}
      >
        <div className={styles.questionNumber}>Întrebarea {currentStep}</div>
        <div className={styles.questionText}>{currentQuestion.question}</div>
      </div>

      <div className={styles.answers}>
        {answerButtons.map(({ answer, answerIndex }) => (
          <AnswerButton
            key={`${currentQuestion.id}-${answerIndex}`}
            disabled={answered || requiresPlayerSelection}
            disabledReason={requiresPlayerSelection ? 'awaitingPlayer' : ''}
            onClick={() => dispatch({ type: 'SELECT_ANSWER', payload: { answerIndex } })}
            state={getAnswerState(answerIndex, selectedAnswerIndex, currentQuestion.correctIndex, answered)}
            text={answer}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <div aria-atomic="true" aria-live="polite" className={messageClassName} role="status">
          {message.text}
        </div>
        <div className={styles.controls}>
          <Button variant="secondary" onClick={handleRestart}>
            Reîncepe
          </Button>
          <Button className={answered ? styles.nextReady : ''} disabled={!answered} onClick={() => dispatch({ type: 'NEXT_QUESTION' })}>
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
