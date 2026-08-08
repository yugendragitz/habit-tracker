/**
 * useMomentumData.js - Master Custom Hook for MOMENTUM Architecture
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getToday } from '../utils/dateUtils';
import { 
  getMomentumData, 
  saveMomentumData,
  saveHabitsList,
  saveDailyRecord,
  saveGoal as saveGoalLocal,
  deleteGoal as deleteGoalLocal
} from '../utils/storageUtils';
import { saveMomentumToCloud, loadMomentumFromCloud } from '../utils/cloudStorage';
import { 
  calculateDailyScore, 
  calculateStreaks, 
  calculateRangeConsistency 
} from '../utils/analyticsUtils';

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
          // Merge local and cloud data smartly
          const merged = {
            ...localData,
            ...cloudData,
            habits: cloudData.habits && cloudData.habits.length > 0 ? cloudData.habits : localData.habits,
            dailyRecords: { ...localData.dailyRecords, ...(cloudData.dailyRecords || {}) },
            goals: cloudData.goals && cloudData.goals.length > 0 ? cloudData.goals : localData.goals,
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

  // Sync back to storage & cloud helper
  const persistState = useCallback((newData) => {
    setData(newData);
    saveMomentumData(newData);
    if (userId) {
      saveMomentumToCloud(userId, newData);
    }
  }, [userId]);

  // Derived state
  const habitsList = useMemo(() => data.habits || [], [data.habits]);
  const activeHabits = useMemo(() => habitsList.filter(h => h.active !== false), [habitsList]);
  const dailyRecords = useMemo(() => data.dailyRecords || {}, [data.dailyRecords]);
  const goals = useMemo(() => data.goals || [], [data.goals]);

  // Selected date record
  const currentDailyRecord = useMemo(() => {
    return dailyRecords[selectedDate] || { habits: {}, score: 0 };
  }, [dailyRecords, selectedDate]);

  const currentHabitCompletions = useMemo(() => {
    return currentDailyRecord.habits || {};
  }, [currentDailyRecord]);

  // Analytics
  const dailyScore = useMemo(() => {
    return calculateDailyScore(currentHabitCompletions, activeHabits);
  }, [currentHabitCompletions, activeHabits]);

  const completedCount = useMemo(() => {
    return activeHabits.filter(h => currentHabitCompletions[h.id]).length;
  }, [activeHabits, currentHabitCompletions]);

  const totalCount = activeHabits.length;

  const streakStats = useMemo(() => {
    return calculateStreaks(dailyRecords, activeHabits, getToday());
  }, [dailyRecords, activeHabits]);

  const weeklyConsistency = useMemo(() => {
    return calculateRangeConsistency(dailyRecords, activeHabits, 7);
  }, [dailyRecords, activeHabits]);

  const monthlyConsistency = useMemo(() => {
    return calculateRangeConsistency(dailyRecords, activeHabits, 30);
  }, [dailyRecords, activeHabits]);

  // Actions
  const toggleHabit = useCallback((habitId, dateStr = selectedDate) => {
    setData(prev => {
      const existing = prev.dailyRecords[dateStr] || { habits: {} };
      const currentCompletions = existing.habits || {};
      const newCompletions = {
        ...currentCompletions,
        [habitId]: !currentCompletions[habitId]
      };

      const activeList = (prev.habits || []).filter(h => h.active !== false);
      const score = calculateDailyScore(newCompletions, activeList);

      const updatedRecords = {
        ...prev.dailyRecords,
        [dateStr]: {
          ...existing,
          habits: newCompletions,
          score,
          updatedAt: new Date().toISOString()
        }
      };

      const newData = { ...prev, dailyRecords: updatedRecords };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [selectedDate, userId]);

  // Save Morning Focus text
  const saveMorningFocus = useCallback((focusText, dateStr = selectedDate) => {
    setData(prev => {
      const existing = prev.dailyRecords[dateStr] || { habits: {} };
      const updatedRecords = {
        ...prev.dailyRecords,
        [dateStr]: {
          ...existing,
          morningFocus: focusText,
          updatedAt: new Date().toISOString()
        }
      };
      const newData = { ...prev, dailyRecords: updatedRecords };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [selectedDate, userId]);

  // Save Evening Reflection
  const saveEveningReflection = useCallback((reflectionObj, dateStr = selectedDate) => {
    setData(prev => {
      const existing = prev.dailyRecords[dateStr] || { habits: {} };
      const updatedRecords = {
        ...prev.dailyRecords,
        [dateStr]: {
          ...existing,
          eveningReflection: reflectionObj,
          updatedAt: new Date().toISOString()
        }
      };
      const newData = { ...prev, dailyRecords: updatedRecords };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [selectedDate, userId]);

  // Add Custom Habit
  const addHabit = useCallback((newHabit) => {
    const habitObj = {
      id: newHabit.id || `habit-${Date.now()}`,
      name: newHabit.name || 'New Habit',
      description: newHabit.description || '',
      icon: newHabit.icon || '⭐',
      color: newHabit.color || '#00ffc8',
      category: newHabit.category || 'Personal',
      frequency: newHabit.frequency || 'daily',
      target: newHabit.target || 1,
      active: true,
      createdAt: new Date().toISOString(),
    };

    setData(prev => {
      const updatedHabits = [...prev.habits, habitObj];
      const newData = { ...prev, habits: updatedHabits };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  // Update Habit
  const updateHabit = useCallback((updatedHabit) => {
    setData(prev => {
      const updatedHabits = prev.habits.map(h => 
        h.id === updatedHabit.id ? { ...h, ...updatedHabit } : h
      );
      const newData = { ...prev, habits: updatedHabits };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  // Toggle Active/Disable Habit
  const toggleHabitActive = useCallback((habitId) => {
    setData(prev => {
      const updatedHabits = prev.habits.map(h => 
        h.id === habitId ? { ...h, active: !h.active } : h
      );
      const newData = { ...prev, habits: updatedHabits };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  // Delete Habit
  const deleteHabit = useCallback((habitId) => {
    setData(prev => {
      const updatedHabits = prev.habits.filter(h => h.id !== habitId);
      const newData = { ...prev, habits: updatedHabits };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  // Add Goal
  const addGoal = useCallback((goalData) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      title: goalData.title,
      category: goalData.category || 'Personal',
      targetDays: Number(goalData.targetDays) || 30,
      linkedHabitId: goalData.linkedHabitId || null,
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

  // Toggle Goal Completed
  const toggleGoal = useCallback((goalId) => {
    setData(prev => {
      const updatedGoals = prev.goals.map(g => 
        g.id === goalId ? { ...g, completed: !g.completed } : g
      );
      const newData = { ...prev, goals: updatedGoals };
      saveMomentumData(newData);
      if (userId) saveMomentumToCloud(userId, newData);
      return newData;
    });
  }, [userId]);

  // Delete Goal
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
    dailyRecords,
    goals,
    currentDailyRecord,
    currentHabitCompletions,
    dailyScore,
    completedCount,
    totalCount,
    streakStats,
    weeklyConsistency,
    monthlyConsistency,
    toggleHabit,
    saveMorningFocus,
    saveEveningReflection,
    addHabit,
    updateHabit,
    toggleHabitActive,
    deleteHabit,
    addGoal,
    toggleGoal,
    deleteGoal,
  };
};

export default useMomentumData;
