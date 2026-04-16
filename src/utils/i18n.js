export const MODE_COPY = {
  single: {
    intro: 'Alege modul și pornește runda.',
    description: 'Modul clasic, cu un singur scor pentru toată runda.',
    howItWorks: 'Apasă pe „Începe quiz-ul”, parcurge cele 5 întrebări ale rundei și vezi scorul final la sfârșit. Poți relua runda oricând sau te poți întoarce la ecranul de start.',
    startLabel: 'Începe quiz-ul',
  },
  multi: {
    intro: 'Alege modul și pornește runda.',
    description: 'Doi oameni joacă pe rând pe același ecran, cu scor separat pentru fiecare.',
    howItWorks: 'Introdu numele jucătorilor, apasă pe „Începe duelul”, apoi pentru fiecare întrebare selectează cine răspunde. Runda păstrează structura fixă de 2 întrebări ESG și 3 PORR.',
    startLabel: 'Începe duelul',
  },
};

export const PLAYER_DEFAULT_NAMES = {
  player1: 'Player 1',
  player2: 'Player 2',
};

export function pluralize(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function formatAssignedQuestionText(count) {
  return pluralize(count, 'întrebare atribuită', 'întrebări atribuite');
}

export function formatCorrectAnswerText(count) {
  return pluralize(count, 'răspuns corect', 'răspunsuri corecte');
}
