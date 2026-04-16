import { useEffect, useRef } from 'react';
import AppShell from './components/layout/AppShell';
import QuizScreen from './components/screens/QuizScreen';
import ResultScreen from './components/screens/ResultScreen';
import StartScreen from './components/screens/StartScreen';
import { GameProvider } from './context/GameContext';
import DEFAULT_QUESTION_SET from './data/defaultQuestions';
import { useGameReducer } from './hooks/useGameReducer';
import { loadUiSettings, persistUiSettings } from './utils/localStorage';

export default function App() {
  const initialUiSettingsRef = useRef(null);

  if (initialUiSettingsRef.current === null) {
    initialUiSettingsRef.current = loadUiSettings();
  }

  const [state, dispatch] = useGameReducer(DEFAULT_QUESTION_SET, initialUiSettingsRef.current);

  useEffect(() => {
    persistUiSettings({
      gameMode: state.gameMode,
      player1Name: state.players.player1.name,
      player2Name: state.players.player2.name,
    });
  }, [state.gameMode, state.players.player1.name, state.players.player2.name]);

  let screen = <StartScreen />;

  if (state.screen === 'quiz') {
    screen = <QuizScreen />;
  } else if (state.screen === 'result') {
    screen = <ResultScreen />;
  }

  return (
    <GameProvider state={state} dispatch={dispatch}>
      <AppShell screen={state.screen}>{screen}</AppShell>
    </GameProvider>
  );
}
