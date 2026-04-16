import { useReducer } from 'react';
import DEFAULT_QUESTION_SET from '../data/defaultQuestions';
import { PLAYER_DEFAULT_NAMES } from '../utils/i18n';
import { buildRoundQuestions, cloneQuestionSet, normalizeText } from '../utils/questionUtils';

const QUESTIONS_PER_ROUND = 5;

export const GAME_MODES = {
  SINGLE: 'single',
  MULTI: 'multi',
};

export const PLAYER_KEYS = {
  PLAYER_1: 'player1',
  PLAYER_2: 'player2',
};

function createInitialState(questionSet, uiSettings) {
  return {
    screen: 'start',
    gameMode: uiSettings?.gameMode || GAME_MODES.SINGLE,
    questionsPerRound: QUESTIONS_PER_ROUND,
    questionSet: cloneQuestionSet(questionSet || DEFAULT_QUESTION_SET),
    roundQuestions: [],
    currentQuestionIndex: 0,
    answered: false,
    selectedAnswerIndex: null,
    score: 0,
    players: {
      player1: { name: uiSettings?.player1Name || PLAYER_DEFAULT_NAMES.player1, score: 0, questionCount: 0 },
      player2: { name: uiSettings?.player2Name || PLAYER_DEFAULT_NAMES.player2, score: 0, questionCount: 0 },
    },
    selectedPlayerKey: null,
    startError: '',
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.payload };

    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload, startError: '' };

    case 'SET_PLAYER_NAME': {
      const { key, name } = action.payload;
      return {
        ...state,
        players: {
          ...state.players,
          [key]: { ...state.players[key], name: normalizeText(name) || PLAYER_DEFAULT_NAMES[key] },
        },
      };
    }

    case 'START_ROUND': {
      let roundQuestions;

      try {
        roundQuestions = buildRoundQuestions(state.questionSet, state.questionsPerRound);
      } catch (error) {
        return {
          ...state,
          screen: 'start',
          startError: error.message || 'Configurația quiz-ului nu permite pornirea rundei.',
        };
      }

      if (roundQuestions.length === 0) {
        return {
          ...state,
          screen: 'start',
          startError: 'Configurația quiz-ului nu conține suficiente întrebări pentru a porni runda.',
        };
      }

      const resolvedPlayers = state.gameMode === GAME_MODES.MULTI
        ? {
            player1: {
              name: normalizeText(action.payload?.player1Name) || state.players.player1.name || PLAYER_DEFAULT_NAMES.player1,
              score: 0,
              questionCount: 0,
            },
            player2: {
              name: normalizeText(action.payload?.player2Name) || state.players.player2.name || PLAYER_DEFAULT_NAMES.player2,
              score: 0,
              questionCount: 0,
            },
          }
        : {
            player1: { ...state.players.player1, score: 0, questionCount: 0 },
            player2: { ...state.players.player2, score: 0, questionCount: 0 },
          };

      return {
        ...state,
        screen: 'quiz',
        roundQuestions,
        currentQuestionIndex: 0,
        answered: false,
        selectedAnswerIndex: null,
        score: 0,
        players: resolvedPlayers,
        selectedPlayerKey: null,
        startError: '',
      };
    }

    case 'SELECT_PLAYER':
      if (state.answered) return state;
      return { ...state, selectedPlayerKey: action.payload };

    case 'SELECT_ANSWER': {
      if (state.answered) return state;
      if (state.gameMode === GAME_MODES.MULTI && !state.selectedPlayerKey) return state;

      const { answerIndex } = action.payload;
      const currentQuestion = state.roundQuestions[state.currentQuestionIndex];
      const isCorrect = answerIndex === currentQuestion.correctIndex;
      const playerKey = state.selectedPlayerKey;

      let newScore = state.score;
      let newPlayers = state.players;

      if (state.gameMode === GAME_MODES.MULTI && playerKey) {
        const player = state.players[playerKey];
        newPlayers = {
          ...state.players,
          [playerKey]: {
            ...player,
            score: isCorrect ? player.score + 1 : player.score,
            questionCount: player.questionCount + 1,
          },
        };
      } else {
        newScore = isCorrect ? state.score + 1 : state.score;
      }

      return {
        ...state,
        answered: true,
        selectedAnswerIndex: answerIndex,
        score: newScore,
        players: newPlayers,
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestionIndex + 1;
      if (nextIndex >= state.roundQuestions.length) {
        return { ...state, screen: 'result' };
      }
      return {
        ...state,
        currentQuestionIndex: nextIndex,
        answered: false,
        selectedAnswerIndex: null,
        selectedPlayerKey: null,
      };
    }

    case 'GO_TO_START':
      return {
        ...state,
        screen: 'start',
        roundQuestions: [],
        currentQuestionIndex: 0,
        answered: false,
        selectedAnswerIndex: null,
        score: 0,
        players: {
          player1: { ...state.players.player1, score: 0, questionCount: 0 },
          player2: { ...state.players.player2, score: 0, questionCount: 0 },
        },
        selectedPlayerKey: null,
        startError: '',
      };

    default:
      return state;
  }
}

export function useGameReducer(initialQuestionSet, initialUiSettings) {
  return useReducer(gameReducer, createInitialState(initialQuestionSet, initialUiSettings));
}
