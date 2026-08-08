/**
 * storageUtils.js - LocalStorage Persistence & Migration Engine for MOMENTUM Phase 2
 */
import { DEFAULT_HABITS } from './habits';
import { DEFAULT_EXERCISES } from './exerciseDatabase';
import { DEFAULT_NUTRITION_TARGETS } from './nutritionUtils';
import { calculateHabitScore } from './analyticsUtils';
import { detectPersonalRecords } from './fitnessUtils';

const STORAGE_KEY = 'momentum_data_v2';
const LEGACY_STORAGE_KEY_V1 = 'momentum_data';
const LEGACY_STORAGE_KEY_ORIGINAL = 'habitTracker';

// Default initial schema for MOMENTUM Phase 2
const createInitialData = () => ({
  habits: DEFAULT_HABITS,
  dailyRecords: {},
  goals: [
    {
      id: 'goal-gym-consistency',
      title: 'Build Consistent Workout Routine',
      category: 'Fitness',
      targetValue: 20,
      currentValue: 0,
      unit: 'days',
      linkedHabitIds: ['gym'],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'goal-weight-target',
      title: 'Reach Target Body Weight',
      category: 'Fitness',
      targetValue: 65,
      currentValue: 54,
      unit: 'kg',
      linkedHabitIds: ['gym', 'clean-food'],
      completed: false,
      createdAt: new Date().toISOString(),
    }
  ],
  nutritionTargets: DEFAULT_NUTRITION_TARGETS,
  weightGoal: {
    currentWeightKg: 54,
    targetWeightKg: 65,
    targetDate: '2026-12-31',
  },
  exerciseDatabase: DEFAULT_EXERCISES,
  workouts: {},
  foodEntries: {},
  waterLogs: {},
  bodyMeasurements: {},
  personalRecords: {},
});

// Load all MOMENTUM data with automatic multi-version migration
export const getMomentumData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.habits || parsed.habits.length === 0) parsed.habits = DEFAULT_HABITS;
      if (!parsed.exerciseDatabase || parsed.exerciseDatabase.length === 0) parsed.exerciseDatabase = DEFAULT_EXERCISES;
      if (!parsed.nutritionTargets || parsed.nutritionTargets.dailyCalories < 3000 || parsed.nutritionTargets.dailyWaterLiters < 4.0) {
        parsed.nutritionTargets = {
          ...DEFAULT_NUTRITION_TARGETS,
          ...(parsed.nutritionTargets || {}),
          dailyCalories: Math.max(3000, parsed.nutritionTargets?.dailyCalories || 3000),
          dailyProteinGrams: Math.max(160, parsed.nutritionTargets?.dailyProteinGrams || 160),
          dailyWaterLiters: Math.max(4.0, parsed.nutritionTargets?.dailyWaterLiters || 4.0),
        };
        saveMomentumData(parsed);
      }
      if (!parsed.workouts) parsed.workouts = {};
      if (!parsed.foodEntries) parsed.foodEntries = {};
      if (!parsed.waterLogs) parsed.waterLogs = {};
      if (!parsed.bodyMeasurements) parsed.bodyMeasurements = {};
      if (!parsed.goals) parsed.goals = [];
      return parsed;
    }

    // Try V1 migration
    const v1Raw = localStorage.getItem(LEGACY_STORAGE_KEY_V1);
    const initialData = createInitialData();

    if (v1Raw) {
      const v1Data = JSON.parse(v1Raw);
      initialData.habits = v1Data.habits || DEFAULT_HABITS;
      initialData.dailyRecords = v1Data.dailyRecords || {};
      initialData.goals = v1Data.goals || initialData.goals;
      saveMomentumData(initialData);
      return initialData;
    }

    // Try original legacy migration
    const origRaw = localStorage.getItem(LEGACY_STORAGE_KEY_ORIGINAL);
    if (origRaw) {
      const origData = JSON.parse(origRaw);
      Object.entries(origData).forEach(([dateStr, habitsMap]) => {
        initialData.dailyRecords[dateStr] = {
          habits: habitsMap,
          score: calculateHabitScore(habitsMap, DEFAULT_HABITS),
          updatedAt: new Date().toISOString()
        };
      });
      saveMomentumData(initialData);
    }

    return initialData;
  } catch (error) {
    console.error('Error reading momentum data:', error);
    return createInitialData();
  }
};

// Save entire MOMENTUM data tree
export const saveMomentumData = (data) => {
  try {
    // Recalculate PRs automatically whenever data is saved
    if (data.workouts) {
      data.personalRecords = detectPersonalRecords(data.workouts);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving momentum data:', error);
    return false;
  }
};

// Workouts CRUD
export const saveWorkout = (dateStr, workoutLog) => {
  const data = getMomentumData();
  if (!data.workouts[dateStr]) {
    data.workouts[dateStr] = [];
  }
  const existingIdx = data.workouts[dateStr].findIndex(w => w.id === workoutLog.id);
  if (existingIdx >= 0) {
    data.workouts[dateStr][existingIdx] = workoutLog;
  } else {
    data.workouts[dateStr].push(workoutLog);
  }
  saveMomentumData(data);
  return data;
};

export const deleteWorkout = (dateStr, workoutId) => {
  const data = getMomentumData();
  if (data.workouts[dateStr]) {
    data.workouts[dateStr] = data.workouts[dateStr].filter(w => w.id !== workoutId);
  }
  saveMomentumData(data);
  return data;
};

// Food Entries CRUD
export const saveFoodEntry = (dateStr, foodEntry) => {
  const data = getMomentumData();
  if (!data.foodEntries[dateStr]) {
    data.foodEntries[dateStr] = [];
  }
  const existingIdx = data.foodEntries[dateStr].findIndex(f => f.id === foodEntry.id);
  if (existingIdx >= 0) {
    data.foodEntries[dateStr][existingIdx] = foodEntry;
  } else {
    data.foodEntries[dateStr].push(foodEntry);
  }
  saveMomentumData(data);
  return data;
};

export const deleteFoodEntry = (dateStr, foodId) => {
  const data = getMomentumData();
  if (data.foodEntries[dateStr]) {
    data.foodEntries[dateStr] = data.foodEntries[dateStr].filter(f => f.id !== foodId);
  }
  saveMomentumData(data);
  return data;
};

// Water Log CRUD
export const saveWaterLog = (dateStr, liters) => {
  const data = getMomentumData();
  data.waterLogs[dateStr] = Math.max(0, Number(liters.toFixed(1)));
  saveMomentumData(data);
  return data;
};

// Body Measurements CRUD
export const saveBodyMeasurement = (dateStr, measurementObj) => {
  const data = getMomentumData();
  data.bodyMeasurements[dateStr] = {
    ...(data.bodyMeasurements[dateStr] || {}),
    ...measurementObj,
    date: dateStr,
    updatedAt: new Date().toISOString()
  };
  saveMomentumData(data);
  return data;
};

// Settings CRUD
export const saveNutritionTargets = (targets) => {
  const data = getMomentumData();
  data.nutritionTargets = { ...data.nutritionTargets, ...targets };
  saveMomentumData(data);
  return data;
};

export const saveWeightGoal = (weightGoalObj) => {
  const data = getMomentumData();
  data.weightGoal = { ...data.weightGoal, ...weightGoalObj };
  saveMomentumData(data);
  return data;
};

// Backward compatibility exports for components
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
  const data = getMomentumData();
  const existing = data.dailyRecords[dateStr] || {};
  data.dailyRecords[dateStr] = {
    ...existing,
    habits: habitsMap,
    updatedAt: new Date().toISOString()
  };
  saveMomentumData(data);
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
