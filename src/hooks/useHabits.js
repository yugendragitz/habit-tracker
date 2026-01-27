import { useState, useEffect, useCallback } from 'react';
import { getToday } from '../utils/dateUtils';
import { getHabitsForDate, saveHabitsForDate } from '../utils/storageUtils';
import { HABITS } from '../utils/habits';

/**
 * Custom hook for managing daily habit state
 * Handles loading, saving, and auto-reset on date change
 */
export const useHabits = () => {
  const [currentDate, setCurrentDate] = useState(getToday());
  const [habits, setHabits] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load habits for current date
  useEffect(() => {
    const loadHabits = () => {
      const today = getToday();
      
      if (today !== currentDate) {
        setCurrentDate(today);
      }
      
      const savedHabits = getHabitsForDate(today);
      
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
  }, [currentDate]);

  // Toggle a habit's completion status
  const toggleHabit = useCallback((habitId) => {
    setHabits(prev => {
      const newHabits = { ...prev, [habitId]: !prev[habitId] };
      saveHabitsForDate(currentDate, newHabits);
      return newHabits;
    });
  }, [currentDate]);

  // Set a specific habit's status
  const setHabitStatus = useCallback((habitId, status) => {
    setHabits(prev => {
      const newHabits = { ...prev, [habitId]: status };
      saveHabitsForDate(currentDate, newHabits);
      return newHabits;
    });
  }, [currentDate]);

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
