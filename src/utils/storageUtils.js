/**
 * storageUtils.js - LocalStorage Persistence & Migration Engine for MOMENTUM
 */
import { DEFAULT_HABITS } from './habits';
import { calculateDailyScore } from './analyticsUtils';

const STORAGE_KEY = 'momentum_data';
const LEGACY_STORAGE_KEY = 'habitTracker';

// Default empty schema for MOMENTUM
const createInitialData = () => ({
  habits: DEFAULT_HABITS,
  dailyRecords: {},
  goals: [
    {
      id: 'goal-gym-consistency',
      title: 'Build Consistent Workout Routine',
      category: 'Fitness',
      targetDays: 20,
      linkedHabitId: 'gym',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal-study-mastery',
      title: 'Master Skill & Daily Study',
      category: 'Productivity',
      targetDays: 25,
      linkedHabitId: 'study',
      completed: false,
      createdAt: new Date().toISOString(),
    }
  ],
  // Future Phase 2 / Phase 3 placeholders
  workoutLogs: {},
  nutritionLogs: {},
  aiCoachData: {},
});

// Load all MOMENTUM data from LocalStorage with automatic legacy migration
export const getMomentumData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.habits || parsed.habits.length === 0) {
        parsed.habits = DEFAULT_HABITS;
      }
      if (!parsed.dailyRecords) parsed.dailyRecords = {};
      if (!parsed.goals) parsed.goals = [];
      return parsed;
    }

    // Check for legacy storage format
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    const initialData = createInitialData();

    if (legacyRaw) {
      const legacyData = JSON.parse(legacyRaw);
      // Migrate legacy YYYY-MM-DD records
      Object.entries(legacyData).forEach(([dateStr, habitsMap]) => {
        initialData.dailyRecords[dateStr] = {
          habits: habitsMap,
          score: calculateDailyScore(habitsMap, DEFAULT_HABITS),
          updatedAt: new Date().toISOString()
        };
      });
      saveMomentumData(initialData);
    }

    return initialData;
  } catch (error) {
    console.error('Error reading momentum data from localStorage:', error);
    return createInitialData();
  }
};

// Save entire MOMENTUM data tree to LocalStorage
export const saveMomentumData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving momentum data:', error);
    return false;
  }
};

// Helper: Save updated habits list
export const saveHabitsList = (habitsList) => {
  const data = getMomentumData();
  data.habits = habitsList;
  saveMomentumData(data);
  return data;
};

// Helper: Save daily record for a date
export const saveDailyRecord = (dateStr, habitsMap, morningFocus = null, eveningReflection = null) => {
  const data = getMomentumData();
  const existingRecord = data.dailyRecords[dateStr] || {};
  
  const updatedHabits = habitsMap !== null ? habitsMap : (existingRecord.habits || {});
  const activeHabits = (data.habits || DEFAULT_HABITS).filter(h => h.active !== false);
  const score = calculateDailyScore(updatedHabits, activeHabits);

  data.dailyRecords[dateStr] = {
    ...existingRecord,
    habits: updatedHabits,
    score,
    morningFocus: morningFocus !== null ? morningFocus : existingRecord.morningFocus,
    eveningReflection: eveningReflection !== null ? eveningReflection : existingRecord.eveningReflection,
    updatedAt: new Date().toISOString(),
  };

  saveMomentumData(data);
  return data;
};

// Helper: Add or edit a Goal
export const saveGoal = (goal) => {
  const data = getMomentumData();
  const index = data.goals.findIndex(g => g.id === goal.id);
  if (index >= 0) {
    data.goals[index] = { ...data.goals[index], ...goal };
  } else {
    data.goals.push(goal);
  }
  saveMomentumData(data);
  return data;
};

// Helper: Delete a Goal
export const deleteGoal = (goalId) => {
  const data = getMomentumData();
  data.goals = data.goals.filter(g => g.id !== goalId);
  saveMomentumData(data);
  return data;
};

// Backward compatibility helpers for existing components
export const getAllData = () => {
  const data = getMomentumData();
  const legacyMap = {};
  Object.entries(data.dailyRecords).forEach(([date, rec]) => {
    legacyMap[date] = rec.habits || {};
  });
  return legacyMap;
};

export const getHabitsForDate = (dateStr) => {
  const data = getMomentumData();
  return data.dailyRecords[dateStr]?.habits || {};
};

export const saveHabitsForDate = (dateStr, habitsMap) => {
  saveDailyRecord(dateStr, habitsMap);
  return true;
};

export const getHabitsForMonth = (year, month) => {
  const allData = getAllData();
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthData = {};
  Object.keys(allData).forEach((date) => {
    if (date.startsWith(monthPrefix)) {
      monthData[date] = allData[date];
    }
  });
  return monthData;
};

export const getHabitsForYear = (year) => {
  const allData = getAllData();
  const yearPrefix = `${year}-`;
  const yearData = {};
  Object.keys(allData).forEach((date) => {
    if (date.startsWith(yearPrefix)) {
      yearData[date] = allData[date];
    }
  });
  return yearData;
};

export const getMonthlyStats = (year, month, habitList = []) => {
  const monthData = getHabitsForMonth(year, month);
  const totalHabits = habitList.length;
  const daysTracked = Object.keys(monthData).length;
  let totalCompleted = 0;
  let totalPossible = 0;
  const habitStats = {};
  habitList.forEach(habit => {
    habitStats[habit.id] = { completed: 0, total: daysTracked };
  });
  Object.entries(monthData).forEach(([date, habits]) => {
    totalPossible += totalHabits;
    Object.entries(habits).forEach(([habitId, completed]) => {
      if (completed) {
        totalCompleted++;
        if (habitStats[habitId]) {
          habitStats[habitId].completed++;
        }
      }
    });
  });
  return {
    daysTracked,
    totalCompleted,
    totalPossible,
    percentage: totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0,
    habitStats
  };
};

export const getYearlyStats = (year, habitList = []) => {
  const yearData = getHabitsForYear(year);
  const totalHabits = habitList.length;
  const daysTracked = Object.keys(yearData).length;
  let totalCompleted = 0;
  const monthlyProgress = new Array(12).fill(0);
  const monthlyDays = new Array(12).fill(0);
  Object.entries(yearData).forEach(([date, habits]) => {
    const month = parseInt(date.split('-')[1], 10) - 1;
    const completedCount = Object.values(habits).filter(Boolean).length;
    totalCompleted += completedCount;
    if (month >= 0 && month < 12) {
      monthlyProgress[month] += completedCount;
      monthlyDays[month]++;
    }
  });
  const monthlyPercentages = monthlyProgress.map((progress, i) => {
    const possible = monthlyDays[i] * totalHabits;
    return possible > 0 ? (progress / possible) * 100 : 0;
  });
  return {
    daysTracked,
    totalCompleted,
    totalPossible: daysTracked * totalHabits,
    percentage: daysTracked > 0 ? (totalCompleted / (daysTracked * totalHabits)) * 100 : 0,
    monthlyPercentages
  };
};
