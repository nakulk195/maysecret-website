export type QuizOption = {
  label: string;
  value: string;
  image: string;
};

export type QuizQuestion = {
  id: string;
  title: string;
  subtitle?: string;
  options: QuizOption[];
};

// Editable quiz data
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'skin_type',
    title: 'What is your skin type?',
    subtitle: '당신의 피부 타입은 무엇인가요?',
    options: [
      { label: 'Dry', value: 'Dry', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400' },
      { label: 'Oily', value: 'Oily', image: 'https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?q=80&w=400' },
      { label: 'Combination', value: 'Combination', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400' },
      { label: 'Sensitive', value: 'Sensitive', image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=400' },
      { label: 'Normal', value: 'Normal', image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=400' },
    ],
  },
  {
    id: 'concern',
    title: 'What is your biggest skin concern?',
    subtitle: '가장 큰 피부 고민은 무엇인가요?',
    options: [
      { label: 'Dull Skin', value: 'Dull Skin', image: 'https://images.unsplash.com/photo-1505575972945-2802f3549b16?q=80&w=400' },
      { label: 'Dark Spots / Pigmentation', value: 'Dark Spots / Pigmentation', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400' },
      { label: 'Sun Damage', value: 'Sun Damage', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400' },
      { label: 'Uneven Skin Tone', value: 'Uneven Skin Tone', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400' },
      { label: 'Dryness', value: 'Dryness', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400' },
    ],
  },
  {
    id: 'sun_exposure',
    title: 'How often are you exposed to the sun?',
    subtitle: '햇빛에 얼마나 자주 노출되나요?',
    options: [
      { label: 'Very often (Outdoor lifestyle)', value: 'Very often', image: 'https://images.unsplash.com/photo-1505575972945-2802f3549b16?q=80&w=400' },
      { label: 'Sometimes', value: 'Sometimes', image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=400' },
      { label: 'Rarely', value: 'Rarely', image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=400' },
    ],
  },
  {
    id: 'goal',
    title: 'What result do you want for your skin?',
    subtitle: '피부에 어떤 결과를 원하시나요?',
    options: [
      { label: 'Brighter Skin', value: 'Brighter Skin', image: 'https://images.unsplash.com/photo-1556229010-aa3ed4e3308c?q=80&w=400' },
      { label: 'Hydrated Skin', value: 'Hydrated Skin', image: 'https://images.unsplash.com/photo-1505575972945-2802f3549b16?q=80&w=400' },
      { label: 'Sun Protection', value: 'Sun Protection', image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=400' },
      { label: 'Glass Glow Skin', value: 'Glass Glow Skin', image: 'https://images.unsplash.com/photo-1556229010-aa3ed4e3308c?q=80&w=400' },
    ],
  },
  {
    id: 'routine',
    title: 'What skincare routine do you prefer?',
    subtitle: '어떤 스킨케어 루틴을 선호하시나요?',
    options: [
      { label: 'Simple routine', value: 'Simple routine', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400' },
      { label: 'Advanced routine', value: 'Advanced routine', image: 'https://images.unsplash.com/photo-1556229010-aa3ed4e3308c?q=80&w=400' },
    ],
  },
];

export type QuizAnswers = Record<string, string>;
