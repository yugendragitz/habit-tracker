/**
 * analyticsUtils.js - Analytics & Transformation Score Engine for MOMENTUM Phase 2
 */

// Calculate habit completion percentage
export const calculateHabitScore = (habitsCompletedMap = {}, activeHabits = []) => {
  if (!activeHabits || activeHabits.length === 0) return 0;
  let completed = 0;
  activeHabits.forEach(habit => {
    if (habitsCompletedMap[habit.id]) completed++;
  });
  return Math.round((completed / activeHabits.length) * 100);
};

// Calculate Unified Transformation Score (0-100)
export const calculateTransformationScore = ({
  habitsScore = 0,
  workoutCompleted = false,
  nutritionPct = 0,
  waterPct = 0,
  goalsPct = 0,
}) => {
  // Weights: Habits 35%, Fitness 25%, Nutrition 20%, Water 10%, Goals 10%
  const habitWeight = (habitsScore * 0.35);
  const workoutWeight = (workoutCompleted ? 100 : 0) * 0.25;
  const nutritionWeight = (Math.min(100, nutritionPct) * 0.20);
  const waterWeight = (Math.min(100, waterPct) * 0.10);
  const goalsWeight = (Math.min(100, goalsPct) * 0.10);

  const total = habitWeight + workoutWeight + nutritionWeight + waterWeight + goalsWeight;
  return Math.round(total);
};

// Calculate streak data (current streak, longest streak, active days count)
export const calculateStreaks = (dailyRecordsMap = {}, activeHabits = [], todayStr) => {
  const dates = Object.keys(dailyRecordsMap).sort();
  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 };
  }

  let totalActiveDays = 0;
  let longestStreak = 0;

  const isDaySuccessful = (dateStr) => {
    const record = dailyRecordsMap[dateStr];
    if (!record || !record.habits) return false;
    const score = record.score !== undefined 
      ? record.score 
      : calculateHabitScore(record.habits, activeHabits);
    return score >= 50;
  };

  const today = new Date(todayStr || new Date());
  
  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayFormatted = formatDate(today);
  const todaySuccessful = isDaySuccessful(todayFormatted);

  let startDate = new Date(today);
  if (!todaySuccessful) {
    startDate.setDate(startDate.getDate() - 1);
  }

  let currentStreak = 0;
  let cursor = new Date(startDate);
  for (let i = 0; i < 3650; i++) {
    const formatted = formatDate(cursor);
    if (isDaySuccessful(formatted)) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  let running = 0;
  const allRecordedDates = Object.keys(dailyRecordsMap).sort();
  if (allRecordedDates.length > 0) {
    const firstDate = new Date(allRecordedDates[0]);
    const lastDate = new Date();
    
    let iter = new Date(firstDate);
    while (iter <= lastDate) {
      const f = formatDate(iter);
      if (isDaySuccessful(f)) {
        running++;
        totalActiveDays++;
        if (running > longestStreak) {
          longestStreak = running;
        }
      } else {
        running = 0;
      }
      iter.setDate(iter.getDate() + 1);
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalActiveDays,
  };
};

// Calculate consistency percentage for a past N days range
export const calculateRangeConsistency = (dailyRecordsMap = {}, activeHabits = [], days = 30) => {
  const today = new Date();
  let totalPossibleScore = 0;
  let totalEarnedScore = 0;

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const record = dailyRecordsMap[dateStr];
    
    totalPossibleScore += 100;
    if (record) {
      const score = record.score !== undefined 
        ? record.score 
        : calculateHabitScore(record.habits, activeHabits);
      totalEarnedScore += score;
    }
  }

  return totalPossibleScore > 0 ? Math.round((totalEarnedScore / totalPossibleScore) * 100) : 0;
};

// Calculate Heatmap intensity level (0 to 5) based on daily score
export const getHeatmapLevel = (score) => {
  if (score === 0 || score === undefined || score === null) return 0;
  if (score <= 25) return 1;
  if (score <= 50) return 2;
  if (score <= 75) return 3;
  if (score < 100) return 4;
  return 5;
};

export const HEATMAP_COLORS = {
  0: 'bg-white/5 border-white/5',
  1: 'bg-emerald-950/60 border-emerald-800/40 text-emerald-300',
  2: 'bg-emerald-800/60 border-emerald-600/40 text-emerald-200',
  3: 'bg-emerald-600/70 border-emerald-500/50 text-emerald-100',
  4: 'bg-accent-primary/80 border-accent-primary/60 text-dark-900 font-bold',
  5: 'bg-accent-primary border-accent-primary text-dark-900 shadow-glow font-bold',
};

// Backward compatibility alias
export const calculateDailyScore = calculateHabitScore;
