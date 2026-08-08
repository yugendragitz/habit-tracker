/**
 * analyticsUtils.js - Analytics & Streak Engine for MOMENTUM
 */

// Calculate deterministic daily score (0 - 100) based on active habit completion
export const calculateDailyScore = (habitsCompletedMap = {}, activeHabits = []) => {
  if (!activeHabits || activeHabits.length === 0) return 0;
  
  let totalWeight = 0;
  let completedWeight = 0;

  activeHabits.forEach(habit => {
    totalWeight += 1;
    if (habitsCompletedMap[habit.id]) {
      completedWeight += 1;
    }
  });

  if (totalWeight === 0) return 0;
  return Math.round((completedWeight / totalWeight) * 100);
};

// Calculate streak data (current streak, longest streak, active days count)
export const calculateStreaks = (dailyRecordsMap = {}, activeHabits = [], todayStr) => {
  const dates = Object.keys(dailyRecordsMap).sort();
  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 };
  }

  let totalActiveDays = 0;
  let longestStreak = 0;

  // We consider a day "successful" if completion percentage is >= 50%
  const isDaySuccessful = (dateStr) => {
    const record = dailyRecordsMap[dateStr];
    if (!record || !record.habits) return false;
    const score = record.score !== undefined 
      ? record.score 
      : calculateDailyScore(record.habits, activeHabits);
    return score >= 50;
  };

  // Calculate streaks iteratively over sorted historical dates
  const today = new Date(todayStr || new Date());
  
  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayFormatted = formatDate(today);
  const todaySuccessful = isDaySuccessful(todayFormatted);

  // If today isn't done yet, check if yesterday was done to preserve active streak
  let startDate = new Date(today);
  if (!todaySuccessful) {
    startDate.setDate(startDate.getDate() - 1);
  }

  let currentStreak = 0;
  let cursor = new Date(startDate);
  // Prevent infinite loop safety check (max 3650 days)
  for (let i = 0; i < 3650; i++) {
    const formatted = formatDate(cursor);
    if (isDaySuccessful(formatted)) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate overall longest streak across all recorded history
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
        : calculateDailyScore(record.habits, activeHabits);
      totalEarnedScore += score;
    }
  }

  return totalPossibleScore > 0 ? Math.round((totalEarnedScore / totalPossibleScore) * 100) : 0;
};

// Calculate Heatmap intensity level (0 to 5) based on daily score
export const getHeatmapLevel = (score) => {
  if (score === 0 || score === undefined || score === null) return 0; // Empty / 0%
  if (score <= 25) return 1;  // 1-25% (Weak)
  if (score <= 50) return 2;  // 26-50% (Average)
  if (score <= 75) return 3;  // 51-75% (Good)
  if (score < 100) return 4;  // 76-99% (Great)
  return 5;                   // 100% (Perfect)
};

// Color mapping for Heatmap levels & Calendar badges
export const HEATMAP_COLORS = {
  0: 'bg-white/5 border-white/5',
  1: 'bg-emerald-950/60 border-emerald-800/40 text-emerald-300',
  2: 'bg-emerald-800/60 border-emerald-600/40 text-emerald-200',
  3: 'bg-emerald-600/70 border-emerald-500/50 text-emerald-100',
  4: 'bg-accent-primary/80 border-accent-primary/60 text-dark-900 font-bold',
  5: 'bg-accent-primary border-accent-primary text-dark-900 shadow-glow font-bold',
};
