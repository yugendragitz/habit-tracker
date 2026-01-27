/**
 * Habit definitions with icons and colors
 */

export const HABITS = [
  {
    id: 'sleep',
    name: 'Sleep',
    description: '7+ hours',
    icon: '🌙',
    color: '#a78bfa', // Purple
  },
  {
    id: 'clean-food',
    name: 'Clean Food',
    description: 'Healthy eating',
    icon: '🥗',
    color: '#34d399', // Green
  },
  {
    id: 'water',
    name: 'Water Intake',
    description: '3L minimum',
    icon: '💧',
    color: '#60a5fa', // Blue
  },
  {
    id: 'gym',
    name: 'Gym',
    description: 'Workout session',
    icon: '💪',
    color: '#f87171', // Red
  },
  {
    id: 'boxing',
    name: 'Boxing',
    description: 'Combat training',
    icon: '🥊',
    color: '#fb923c', // Orange
  },
  {
    id: 'study',
    name: 'Study',
    description: 'Learning time',
    icon: '📚',
    color: '#fbbf24', // Yellow
  },
  {
    id: 'skill-building',
    name: 'Skill Building',
    description: 'Practice & improve',
    icon: '🎯',
    color: '#00ffc8', // Accent
  },
  {
    id: 'self-care',
    name: 'Self Care',
    description: 'Mind & body',
    icon: '🧘',
    color: '#f472b6', // Pink
  },
];

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

// Get a random motivational quote
export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
};

// Get quote based on day of year (consistent daily quote)
export const getDailyQuote = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
};
