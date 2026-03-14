export type QuizOption = {
  label: string;
  value: string;
};

export type QuizQuestion = {
  id: string;
  icon: string;
  question: string;
  options: QuizOption[];
};

// Modern skincare quiz questions (text-only)
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'skin_type',
    icon: '💧',
    question: 'What is your skin type?',
    options: [
      { label: 'Dry', value: 'Dry' },
      { label: 'Oily', value: 'Oily' },
      { label: 'Combination', value: 'Combination' },
      { label: 'Sensitive', value: 'Sensitive' },
      { label: 'Normal', value: 'Normal' },
    ],
  },
  {
    id: 'concern',
    icon: '✨',
    question: 'What is your biggest skin concern?',
    options: [
      { label: 'Dull Skin', value: 'Dull Skin' },
      { label: 'Dark Spots', value: 'Dark Spots / Pigmentation' },
      { label: 'Sun Damage', value: 'Sun Damage' },
      { label: 'Uneven Skin Tone', value: 'Uneven Skin Tone' },
      { label: 'Dryness', value: 'Dryness' },
    ],
  },
  {
    id: 'sun_exposure',
    icon: '☀️',
    question: 'How often are you exposed to the sun?',
    options: [
      { label: 'Very Often', value: 'Very often' },
      { label: 'Sometimes', value: 'Sometimes' },
      { label: 'Rarely', value: 'Rarely' },
    ],
  },
  {
    id: 'goal',
    icon: '🌟',
    question: 'What result do you want for your skin?',
    options: [
      { label: 'Brighter Skin', value: 'Brighter Skin' },
      { label: 'Glass Glow Skin', value: 'Glass Glow Skin' },
      { label: 'Sun Protection', value: 'Sun Protection' },
      { label: 'Hydrated Skin', value: 'Hydrated Skin' },
    ],
  },
  {
    id: 'routine',
    icon: '🧴',
    question: 'How many skincare products do you prefer?',
    options: [
      { label: 'Simple Routine', value: 'Simple Routine' },
      { label: 'Advanced Routine', value: 'Advanced Routine' },
    ],
  },
];

export type QuizAnswers = Record<string, string>;
