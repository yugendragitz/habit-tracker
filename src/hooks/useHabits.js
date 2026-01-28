import { useState, useEffect, useCallback } from 'react';
import { getToday } from '../utils/dateUtils';
import { getHabitsForDate, saveHabitsForDate } from '../utils/storageUtils';
import { saveHabitsToCloud, loadHabitsFromCloud } from '../utils/cloudStorage';
import { HABITS } from '../utils/habits';

/**
 * Custom hook for managing daily habit state
 * Syncs to cloud when user is authenticated
 */
export const useHabits = (userId = null) => {
  const [currentDate, setCurrentDate] = useState(getToday());
  const [habits, setHabits] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load habits for current date
  useEffect(() => {
    const loadHabits = async () => {
      const today = getToday();
      
      if (today !== currentDate) {
        setCurrentDate(today);
      }
      
      let savedHabits = {};
      
      // Try cloud first if logged in
      if (userId) {
        const cloudHabits = await loadHabitsFromCloud(userId, today);
        if (cloudHabits) savedHabits = cloudHabits;
      }
      
      // Fallback to localStorage
      if (Object.keys(savedHabits).length === 0) {
        savedHabits = getHabitsForDate(today);
      }
      
      const initializedHabits = {};
      HABITS.forEach(habit => {
        initializedHabits[habit.id] = savedHabits[habit.id] || false;
      });
      
      setHabits(initializedHabits);
      setIsLoaded(true);
    };

    loadHabits();

    const interval = setInterval(() => {
      const today = getToday();
      if (today !== currentDate) {
        setCurrentDate(today);
        loadHabits();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentDate, userId]);

  // Toggle habit
  const toggleHabit = useCallback((habitId) => {
    setHabits(prev => {
      const newHabits = { ...prev, [habitId]: !prev[habitId] };
      saveHabitsForDate(currentDate, newHabits);
      if (userId) saveHabitsToCloud(userId, currentDate, newHabits);
      return newHabits;
    });
  }, [currentDate, userId]);

  const setHabitStatus = useCallback((habitId, status) => {
    setHabits(prev => {
      const newHabits = { ...prev, [habitId]: status };
      saveHabitsForDate(currentDate, newHabits);
      if (userId) saveHabitsToCloud(userId, currentDate, newHabits);
      return newHabits;
    });
  }, [currentDate, userId]);

  const completedCount = Object.values(habits).filter(Boolean).length;
  const totalCount = HABITS.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return {
    currentDate,
    habits,
    isLoaded,
    toggleHabit,
    setHabitStatus,
    completedCount,
    totalCount,
    completionPercentage,
    habitList: HABITS,
  };
};

export default useHabits;
