import { PLAYER_DEFAULT_NAMES } from './i18n';
import { normalizeText } from './questionUtils';

const UI_SETTINGS_STORAGE_KEY = 'porr-quiz-ui-settings-v1';
const ALLOWED_GAME_MODES = new Set(['single', 'multi']);

export function persistUiSettings({ gameMode, player1Name, player2Name }) {
  try {
    localStorage.setItem(
      UI_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        gameMode: ALLOWED_GAME_MODES.has(gameMode) ? gameMode : 'single',
        player1Name: normalizeText(player1Name) || PLAYER_DEFAULT_NAMES.player1,
        player2Name: normalizeText(player2Name) || PLAYER_DEFAULT_NAMES.player2,
      }),
    );
  } catch (error) {
    console.warn('Persistarea preferințelor de interfață a eșuat.', error);
  }
}

export function loadUiSettings() {
  try {
    const rawValue = localStorage.getItem(UI_SETTINGS_STORAGE_KEY);
    if (!rawValue) return null;

    const parsedValue = JSON.parse(rawValue);
    const gameMode = ALLOWED_GAME_MODES.has(parsedValue.gameMode) ? parsedValue.gameMode : 'single';

    return {
      gameMode,
      player1Name: normalizeText(parsedValue.player1Name) || PLAYER_DEFAULT_NAMES.player1,
      player2Name: normalizeText(parsedValue.player2Name) || PLAYER_DEFAULT_NAMES.player2,
    };
  } catch {
    return null;
  }
}
