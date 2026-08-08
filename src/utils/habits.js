/**
 * habits.js - Default habit definitions and category definitions for MOMENTUM
 */

export const HABIT_CATEGORIES = [
  { id: 'Health', name: 'Health & Wellness', color: '#34d399', icon: '🥗' },
  { id: 'Fitness', name: 'Fitness & Physical', color: '#f87171', icon: '💪' },
  { id: 'Mind', name: 'Mindset & Mental', color: '#a78bfa', icon: '🧘' },
  { id: 'Productivity', name: 'Study & Skill', color: '#fbbf24', icon: '📚' },
  { id: 'Personal', name: 'Personal Growth', color: '#00ffc8', icon: '🎯' },
];

export const DEFAULT_HABITS = [
  {
    id: 'sleep',
    name: 'Sleep',
    description: '7+ hours of deep rest',
    icon: '🌙',
    color: '#a78bfa',
    category: 'Health',
    frequency: 'daily',
    target: 1,
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'clean-food',
    name: 'Clean Food',
    description: 'Healthy whole foods & nutrition',
    icon: '🥗',
    color: '#34d399',
    category: 'Health',
    frequency: 'daily',
    target: 1,
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'water',
    name: 'Water Intake',
    description: '4 Liters minimum (Creatine support)',
    icon: '💧',
    color: '#60a5fa',
    category: 'Health',
    frequency: 'daily',
    target: 1,
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'gym',
    name: 'Gym Workout',
    description: 'Strength or cardio session',
    icon: '💪',
    color: '#f87171',
    category: 'Fitness',
    frequency: 'daily',
    target: 1,
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'boxing',
    name: 'Boxing Training',
    description: 'Combat sports & conditioning',
    icon: '🥊',
    color: '#fb923c',
    category: 'Fitness',
    frequency: 'daily',
    target: 1,
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'study',
    name: 'Focused Study',
    description: 'Deep work & learning session',
    icon: '📚',
    color: '#fbbf24',
    category: 'Productivity',
    frequency: 'daily',
    target: 1,
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'skill-building',
    name: 'Skill Building',
    description: 'Practice & master your craft',
    icon: '🎯',
    color: '#00ffc8',
    category: 'Productivity',
    frequency: 'daily',
    target: 1,
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'self-care',
    name: 'Self Care',
    description: 'Mindfulness & recovery',
    icon: '🧘',
    color: '#f472b6',
    category: 'Mind',
    frequency: 'daily',
    target: 1,
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const HABITS = DEFAULT_HABITS;

export const MOTIVATIONAL_QUOTES = [
  "Discipline is the bridge between goals and accomplishment.",
  "Small daily improvements lead to stunning results.",
  "The secret of your success is found in your daily routine.",
  "Champions keep playing until they get it right.",
  "Excellence is not a destination but a continuous journey.",
  "Your future is created by what you do today.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Be stronger than your excuses.",
  "Every day is a chance to get better.",
  "Consistency is what transforms average into excellence.",
];

export const getDailyQuote = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
};
