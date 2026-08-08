/**
 * exerciseDatabase.js - Default exercise database & category definitions for MOMENTUM
 */

export const EXERCISE_CATEGORIES = [
  { id: 'Chest', name: 'Chest', icon: '🏋️‍♂️', color: '#f87171' },
  { id: 'Back', name: 'Back', icon: '🚣', color: '#60a5fa' },
  { id: 'Shoulders', name: 'Shoulders', icon: '🤸', color: '#fbbf24' },
  { id: 'Biceps', name: 'Biceps', icon: '💪', color: '#34d399' },
  { id: 'Triceps', name: 'Triceps', icon: '⚡', color: '#a78bfa' },
  { id: 'Legs', name: 'Legs', icon: '🦵', color: '#fb923c' },
  { id: 'Core', name: 'Core & Abs', icon: '🧘‍♂️', color: '#f472b6' },
  { id: 'Cardio', name: 'Cardio & Endurance', icon: '🏃‍♂️', color: '#00ffc8' },
];

export const EQUIPMENT_TYPES = [
  'Barbell',
  'Dumbbell',
  'Machine',
  'Cable',
  'Bodyweight',
];

export const DEFAULT_EXERCISES = [
  // Chest
  { id: 'ex-bench-press', name: 'Flat Bench Press', category: 'Chest', equipment: 'Barbell', muscleGroups: ['Chest', 'Triceps', 'Shoulders'] },
  { id: 'ex-incline-db-press', name: 'Incline Dumbbell Press', category: 'Chest', equipment: 'Dumbbell', muscleGroups: ['Upper Chest', 'Triceps'] },
  { id: 'ex-cable-fly', name: 'Chest Cable Fly', category: 'Chest', equipment: 'Cable', muscleGroups: ['Chest'] },
  { id: 'ex-pushups', name: 'Push-Ups', category: 'Chest', equipment: 'Bodyweight', muscleGroups: ['Chest', 'Triceps', 'Core'] },

  // Back
  { id: 'ex-lat-pulldown', name: 'Lat Pulldown', category: 'Back', equipment: 'Cable', muscleGroups: ['Lats', 'Biceps'] },
  { id: 'ex-barbell-row', name: 'Bent-Over Barbell Row', category: 'Back', equipment: 'Barbell', muscleGroups: ['Lats', 'Upper Back'] },
  { id: 'ex-seated-cable-row', name: 'Seated Cable Row', category: 'Back', equipment: 'Cable', muscleGroups: ['Middle Back', 'Biceps'] },
  { id: 'ex-pullups', name: 'Pull-Ups', category: 'Back', equipment: 'Bodyweight', muscleGroups: ['Lats', 'Biceps'] },

  // Shoulders
  { id: 'ex-overhead-press', name: 'Overhead Shoulder Press', category: 'Shoulders', equipment: 'Barbell', muscleGroups: ['Front Delts', 'Triceps'] },
  { id: 'ex-lateral-raise', name: 'Dumbbell Lateral Raise', category: 'Shoulders', equipment: 'Dumbbell', muscleGroups: ['Side Delts'] },
  { id: 'ex-face-pull', name: 'Cable Face Pull', category: 'Shoulders', equipment: 'Cable', muscleGroups: ['Rear Delts', 'Upper Back'] },

  // Biceps
  { id: 'ex-bicep-curl', name: 'Dumbbell Bicep Curl', category: 'Biceps', equipment: 'Dumbbell', muscleGroups: ['Biceps'] },
  { id: 'ex-hammer-curl', name: 'Hammer Curl', category: 'Biceps', equipment: 'Dumbbell', muscleGroups: ['Brachialis', 'Biceps'] },
  { id: 'ex-barbell-curl', name: 'EZ-Bar Bicep Curl', category: 'Biceps', equipment: 'Barbell', muscleGroups: ['Biceps'] },

  // Triceps
  { id: 'ex-tricep-pushdown', name: 'Tricep Rope Pushdown', category: 'Triceps', equipment: 'Cable', muscleGroups: ['Triceps'] },
  { id: 'ex-skullcrusher', name: 'Lying Skullcrusher', category: 'Triceps', equipment: 'Barbell', muscleGroups: ['Triceps'] },
  { id: 'ex-dips', name: 'Tricep Dips', category: 'Triceps', equipment: 'Bodyweight', muscleGroups: ['Triceps', 'Lower Chest'] },

  // Legs
  { id: 'ex-barbell-squat', name: 'Barbell Back Squat', category: 'Legs', equipment: 'Barbell', muscleGroups: ['Quads', 'Glutes', 'Core'] },
  { id: 'ex-leg-press', name: 'Leg Press', category: 'Legs', equipment: 'Machine', muscleGroups: ['Quads', 'Glutes'] },
  { id: 'ex-romanian-deadlift', name: 'Romanian Deadlift', category: 'Legs', equipment: 'Barbell', muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'] },
  { id: 'ex-leg-curl', name: 'Lying Leg Curl', category: 'Legs', equipment: 'Machine', muscleGroups: ['Hamstrings'] },
  { id: 'ex-calf-raise', name: 'Standing Calf Raise', category: 'Legs', equipment: 'Machine', muscleGroups: ['Calves'] },

  // Core
  { id: 'ex-plank', name: 'Abdominal Plank', category: 'Core', equipment: 'Bodyweight', muscleGroups: ['Core', 'Abs'] },
  { id: 'ex-hanging-leg-raise', name: 'Hanging Leg Raise', category: 'Core', equipment: 'Bodyweight', muscleGroups: ['Abs', 'Hip Flexors'] },
  { id: 'ex-cable-crunch', name: 'Kneeling Cable Crunch', category: 'Core', equipment: 'Cable', muscleGroups: ['Abs'] },

  // Cardio
  { id: 'ex-treadmill-run', name: 'Treadmill Running', category: 'Cardio', equipment: 'Machine', muscleGroups: ['Full Body', 'Cardio'] },
  { id: 'ex-cycling', name: 'Stationary Cycling', category: 'Cardio', equipment: 'Machine', muscleGroups: ['Legs', 'Cardio'] },
  { id: 'ex-jump-rope', name: 'Jump Rope Session', category: 'Cardio', equipment: 'Bodyweight', muscleGroups: ['Calves', 'Cardio'] },
];
