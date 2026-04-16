const ESG_QUESTIONS_PER_ROUND = 2;
const PORR_QUESTIONS_PER_ROUND = 3;
const TOTAL_QUESTIONS_PER_ROUND = ESG_QUESTIONS_PER_ROUND + PORR_QUESTIONS_PER_ROUND;

export function shuffleArray(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

export function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function cloneQuestionSet(questionSet) {
  return {
    version: questionSet.version,
    questions: questionSet.questions.map((question) => ({
      id: question.id,
      category: question.category,
      question: question.question,
      answers: [...question.answers],
      correctIndex: question.correctIndex,
    })),
  };
}

export function prepareQuestion(question) {
  const shuffledAnswers = question.answers.map((answer, index) => ({
    text: answer,
    isCorrect: index === question.correctIndex,
  }));

  const mixedAnswers = shuffleArray(shuffledAnswers);
  const newCorrectIndex = mixedAnswers.findIndex((answer) => answer.isCorrect);

  return {
    id: question.id,
    category: question.category,
    question: question.question,
    answers: mixedAnswers.map((answer) => answer.text),
    correctIndex: newCorrectIndex,
  };
}

export function buildRoundQuestions(questionSet, questionsPerRound) {
  const questions = Array.isArray(questionSet?.questions) ? questionSet.questions : [];
  const esgQuestions = questions.filter((question) => question.category === 'esg');
  const porrQuestions = questions.filter((question) => question.category === 'porr');

  if (esgQuestions.length < ESG_QUESTIONS_PER_ROUND || porrQuestions.length < PORR_QUESTIONS_PER_ROUND) {
    throw new Error('Configurația quiz-ului este invalidă. Sunt necesare cel puțin 2 întrebări ESG și 3 întrebări PORR.');
  }

  if (questionsPerRound && questionsPerRound !== TOTAL_QUESTIONS_PER_ROUND) {
    throw new Error('Configurația quiz-ului este invalidă. O rundă trebuie să conțină exact 5 întrebări.');
  }

  const selectedQuestions = [
    ...shuffleArray(esgQuestions).slice(0, ESG_QUESTIONS_PER_ROUND),
    ...shuffleArray(porrQuestions).slice(0, PORR_QUESTIONS_PER_ROUND),
  ];

  return shuffleArray(selectedQuestions).map(prepareQuestion);
}
