/**
 * useMomentumData.js - Master Custom Hook for MOMENTUM Architecture (Phase 2)
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getToday } from '../utils/dateUtils';
import { 
  getMomentumData, 
  saveMomentumData,
  saveWorkout as saveWorkoutLocal,
  deleteWorkout as deleteWorkoutLocal,
  saveFoodEntry as saveFoodEntryLocal,
  deleteFoodEntry as deleteFoodEntryLocal,
  saveWaterLog as saveWaterLogLocal,
  saveBodyMeasurement as saveBodyMeasurementLocal,
  saveNutritionTargets as saveNutritionTargetsLocal,
  saveWeightGoal as saveWeightGoalLocal,
} from '../utils/storageUtils';
import { saveMomentumToCloud, loadMomentumFromCloud } from '../utils/cloudStorage';
import { 
  calculateHabitScore, 
  calculateTransformationScore,
  calculateStreaks, 
  calculateRangeConsistency 
} from '../utils/analyticsUtils';
import { calculateDailyNutrition, calculateRemainingMacros } from '../utils/nutritionUtils';
import { detectPersonalRecords } from '../utils/fitnessUtils';

export const useMomentumData = (userId = null) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [data, setData] = useState(() => getMomentumData());
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial Sync from Cloud if authenticated
  useEffect(() => {
    let isMounted = true;
    const syncData = async () => {
      const localData = getMomentumData();
      if (userId) {
        const cloudData = await loadMomentumFromCloud(userId);
        if (cloudData && isMounted) {
          const merged = {
            ...localData,
            ...cloudData,
            habits: cloudData.habits && cloudData.habits.length > 0 ? cloudData.habits : localData.habits,
            exerciseDatabase: cloudData.exerciseDatabase && cloudData.exerciseDatabase.length > 0 ? cloudData.exerciseDatabase : localData.exerciseDatabase,
            dailyRecords: { ...localData.dailyRecords, ...(cloudData.dailyRecords || {}) },
            workouts: { ...localData.workouts, ...(cloudData.workouts || {}) },
            foodEntries: { ...localData.foodEntries, ...(cloudData.foodEntries || {}) },
            waterLogs: { ...localData.waterLogs, ...(cloudData.waterLogs || {}) },
            bodyMeasurements: { ...localData.bodyMeasurements, ...(cloudData.bodyMeasurements || {}) },
            goals: cloudData.goals && cloudData.goals.length > 0 ? cloudData.goals : localData.goals,
            nutritionTargets: cloudData.nutritionTargets || localData.nutritionTargets,
            weightGoal: cloudData.weightGoal || localData.weightGoal,
          };
          setData(merged);
          saveMomentumData(merged);
          setIsLoaded(true);
          return;
        }
      }
      if (isMounted) {
        setData(localData);
        setIsLoaded(true);
      }
    };

    syncData();
    return () => { isMounted = false; };
  }, [userId]);

  // Derived collections
  const habitsList = useMemo(() => data.habits || [], [data.habits]);
  const activeHabits = useMemo(() => habitsList.filter(h => h.active !== false), [habitsList]);
  const exerciseDatabase = useMemo(() => data.exerciseDatabase || [], [data.exerciseDatabase]);
  const dailyRecords = useMemo(() => data.dailyRecords || {}, [data.dailyRecords]);
  const workoutsMap = useMemo(() => data.workouts || {}, [data.workouts]);
  const foodEntriesMap = useMemo(() => data.foodEntries || {}, [data.foodEntries]);
  const waterLogsMap = useMemo(() => data.waterLogs || {}, [data.waterLogs]);
  const bodyMeasurementsMap = useMemo(() => data.bodyMeasurements || {}, [data.bodyMeasurements]);
  const goals = useMemo(() => data.goals || [], [data.goals]);
  const nutritionTargets = useMemo(() => data.nutritionTargets || {}, [data.nutritionTargets]);
  const weightGoal = useMemo(() => data.weightGoal || {}, [data.weightGoal]);

  // Personal Records
  const personalRecords = useMemo(() => {
    return detectPersonalRecords(workoutsMap);
  }, [workoutsMap]);

  // Selected Date specific records
  const currentDailyRecord = useMemo(() => dailyRecords[selectedDate] || { habits: {}, score: 0 }, [dailyRecords, selectedDate]);
  const currentHabitCompletions = useMemo(() => currentDailyRecord.habits || {}, [currentDailyRecord]);
  const currentWorkouts = useMemo(() => workoutsMap[selectedDate] || [], [workoutsMap, selectedDate]);
  const currentFoodEntries = useMemo(() => foodEntriesMap[selectedDate] || [], [foodEntriesMap, selectedDate]);
  const currentWaterLiters = useMemo(() => waterLogsMap[selectedDate] || 0, [waterLogsMap, selectedDate]);
  const currentBodyMeasurement = useMemo(() => bodyMeasurementsMap[selectedDate] || {}, [bodyMeasurementsMap, selectedDate]);

  // Analytics for selected date
  const habitsScore = useMemo(() => calculateHabitScore(currentHabitCompletions, activeHabits), [currentHabitCompletions, activeHabits]);
  const completedHabitsCount = useMemo(() => activeHabits.filter(h => currentHabitCompletions[h.id]).length, [activeHabits, currentHabitCompletions]);

  const currentDailyNutrition = useMemo(() => calculateDailyNutrition(currentFoodEntries), [currentFoodEntries]);
  const macroStats = useMemo(() => calculateRemainingMacros(currentDailyNutrition, nutritionTargets, currentWaterLiters), [currentDailyNutrition, nutritionTargets, currentWaterLiters]);

  const goalsPct = useMemo(() => {
    if (!goals || goals.length === 0) return 100;
    const completedGoals = goals.filter(g => g.completed).length;
    return Math.round((completedGoals / goals.length) * 100);
  }, [goals]);

  // Unified Transformation Score
  const transformationScore = useMemo(() => {
    return calculateTransformationScore({
      habitsScore,
      workoutCompleted: currentWorkouts.length > 0,
      nutritionPct: macroStats.caloriePct,
      waterPct: macroStats.waterPct,
      goalsPct,
    });
  }, [habitsScore, currentWorkouts, macroStats, goalsPct]);

  // Streaks & Range Consistency
  const streakStats = useMemo(() => calculateStreaks(dailyRecords, activeHabits, getToday()), [dailyRecords, activeHabits]);
  const weeklyConsistency = useMemo(() => calculateRangeConsistency(dailyRecords, activeHabits, 7), [dailyRecords, activeHabits]);
  const monthlyConsistency = useMemo(() => calculateRangeConsistency(dailyRecords, activeHabits, 30), [dailyRecords, activeHabits]);

  // Actions
  const toggleHabit = useCallback((habitId, dateStr = selectedDate) => {
    setData(prev => {
      const existing = prev.dailyRecords[dateStr] || { habits: {} };
      const currentCompletions = existing.habits || {};
      const newCompletions = { ...currentCompletions, [habitId]: !currentCompletions[habitId] };
      const activeList = (prev.habits || []).filter(h => h.active !== false);
      const score = calculateHabitScore(newCompletions, activeList);

      const updatedRecords = {
        ...prev.dailyRecords,
        [dateStr]: { ...existing, habits: newCompletions, score, updatedAt: new Date().toISOString() }
      };
      const newData = { ...prev, dailyRecords: updatedRecords };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [selectedDate, userId]);

  const saveMorningFocus = useCallback((focusText, dateStr = selectedDate) => {
    setData(prev => {
      const existing = prev.dailyRecords[dateStr] || { habits: {} };
      const updatedRecords = {
        ...prev.dailyRecords,
        [dateStr]: { ...existing, morningFocus: focusText, updatedAt: new Date().toISOString() }
      };
      const newData = { ...prev, dailyRecords: updatedRecords };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [selectedDate, userId]);

  const saveEveningReflection = useCallback((reflectionObj, dateStr = selectedDate) => {
    setData(prev => {
      const existing = prev.dailyRecords[dateStr] || { habits: {} };
      const updatedRecords = {
        ...prev.dailyRecords,
        [dateStr]: { ...existing, eveningReflection: reflectionObj, updatedAt: new Date().toISOString() }
      };
      const newData = { ...prev, dailyRecords: updatedRecords };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [selectedDate, userId]);

  // Workout Actions
  const saveWorkout = useCallback((dateStr, workoutLog) => {
    setData(prev => {
      const newData = saveWorkoutLocal(dateStr, workoutLog);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  const deleteWorkout = useCallback((dateStr, workoutId) => {
    setData(prev => {
      const newData = deleteWorkoutLocal(dateStr, workoutId);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  // Food Actions
  const saveFoodEntry = useCallback((dateStr, foodEntry) => {
    setData(prev => {
      const newData = saveFoodEntryLocal(dateStr, foodEntry);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  const deleteFoodEntry = useCallback((dateStr, foodId) => {
    setData(prev => {
      const newData = deleteFoodEntryLocal(dateStr, foodId);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  // Water Actions
  const updateWaterLog = useCallback((dateStr, liters) => {
    setData(prev => {
      const newData = saveWaterLogLocal(dateStr, liters);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  const addWaterDelta = useCallback((deltaLiters, dateStr = selectedDate) => {
    setData(prev => {
      const current = prev.waterLogs[dateStr] || 0;
      const next = Math.max(0, Number((current + deltaLiters).toFixed(1)));
      const newData = saveWaterLogLocal(dateStr, next);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [selectedDate, userId]);

  // Body Measurements & Settings Actions
  const saveBodyMeasurement = useCallback((dateStr, measurementObj) => {
    setData(prev => {
      const newData = saveBodyMeasurementLocal(dateStr, measurementObj);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  const updateNutritionTargets = useCallback((targets) => {
    setData(prev => {
      const newData = saveNutritionTargetsLocal(targets);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  const updateWeightGoal = useCallback((weightGoalObj) => {
    setData(prev => {
      const newData = saveWeightGoalLocal(weightGoalObj);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  // Habit CRUD
  const addHabit = useCallback((newHabit) => {
    setData(prev => {
      const updatedHabits = [...prev.habits, { ...newHabit, id: newHabit.id || `habit-${Date.now()}` }];
      const newData = { ...prev, habits: updatedHabits };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  const updateHabit = useCallback((updatedHabit) => {
    setData(prev => {
      const updatedHabits = prev.habits.map(h => h.id === updatedHabit.id ? { ...h, ...updatedHabit } : h);
      const newData = { ...prev, habits: updatedHabits };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  const toggleHabitActive = useCallback((habitId) => {
    setData(prev => {
      const updatedHabits = prev.habits.map(h => h.id === habitId ? { ...h, active: !h.active } : h);
      const newData = { ...prev, habits: updatedHabits };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  const deleteHabit = useCallback((habitId) => {
    setData(prev => {
      const updatedHabits = prev.habits.filter(h => h.id !== habitId);
      const newData = { ...prev, habits: updatedHabits };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  // Exercise Database CRUD
  const addCustomExercise = useCallback((exerciseObj) => {
    const newEx = {
      id: `ex-custom-${Date.now()}`,
      name: exerciseObj.name,
      category: exerciseObj.category || 'Chest',
      equipment: exerciseObj.equipment || 'Dumbbell',
      muscleGroups: exerciseObj.muscleGroups || [exerciseObj.category],
    };
    setData(prev => {
      const updatedDb = [...(prev.exerciseDatabase || []), newEx];
      const newData = { ...prev, exerciseDatabase: updatedDb };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  // Goal CRUD
  const addGoal = useCallback((goalData) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      title: goalData.title,
      category: goalData.category || 'Fitness',
      targetValue: Number(goalData.targetValue) || 20,
      currentValue: Number(goalData.currentValue) || 0,
      unit: goalData.unit || 'days',
      linkedHabitIds: goalData.linkedHabitIds || [],
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setData(prev => {
      const updatedGoals = [...prev.goals, newGoal];
      const newData = { ...prev, goals: updatedGoals };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  const toggleGoal = useCallback((goalId) => {
    setData(prev => {
      const updatedGoals = prev.goals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g);
      const newData = { ...prev, goals: updatedGoals };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  const deleteGoal = useCallback((goalId) => {
    setData(prev => {
      const updatedGoals = prev.goals.filter(g => g.id !== goalId);
      const newData = { ...prev, goals: updatedGoals };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  return {
    selectedDate,
    setSelectedDate,
    isLoaded,
    habitsList,
    activeHabits,
    exerciseDatabase,
    dailyRecords,
    workoutsMap,
    foodEntriesMap,
    waterLogsMap,
    bodyMeasurementsMap,
    goals,
    nutritionTargets,
    weightGoal,
    personalRecords,
    currentDailyRecord,
    currentHabitCompletions,
    currentWorkouts,
    currentFoodEntries,
    currentWaterLiters,
    currentBodyMeasurement,
    habitsScore,
    completedHabitsCount,
    totalCount: activeHabits.length,
    currentDailyNutrition,
    macroStats,
    transformationScore,
    streakStats,
    weeklyConsistency,
    monthlyConsistency,
    toggleHabit,
    saveMorningFocus,
    saveEveningReflection,
    saveWorkout,
    deleteWorkout,
    saveFoodEntry,
    deleteFoodEntry,
    updateWaterLog,
    addWaterDelta,
    saveBodyMeasurement,
    updateNutritionTargets,
    updateWeightGoal,
    addHabit,
    updateHabit,
    toggleHabitActive,
    deleteHabit,
    addCustomExercise,
    addGoal,
    toggleGoal,
    deleteGoal,
  };
};

export default useMomentumData;
