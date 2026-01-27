/**
 * localStorage utilities for habit data persistence
 * All habit data is keyed by date (YYYY-MM-DD)
 */

const STORAGE_KEY = 'habitTracker';

// Get all stored habit data
export const getAllData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {};
  }
};

// Save all habit data
export const saveAllData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Get habits for a specific date
export const getHabitsForDate = (date) => {
  const allData = getAllData();
  return allData[date] || {};
};

// Save habits for a specific date
export const saveHabitsForDate = (date, habits) => {
  const allData = getAllData();
  allData[date] = habits;
  return saveAllData(allData);
};

// Update a single habit for a date
export const updateHabitForDate = (date, habitId, completed) => {
  const allData = getAllData();
  if (!allData[date]) {
    allData[date] = {};
  }
  allData[date][habitId] = completed;
  return saveAllData(allData);
};

// Get habits for a month
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

// Get habits for a year
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

// Calculate completion percentage for a date
export const getCompletionForDate = (date, totalHabits) => {
  const habits = getHabitsForDate(date);
  const completed = Object.values(habits).filter(Boolean).length;
  return totalHabits > 0 ? (completed / totalHabits) * 100 : 0;
};

// Calculate monthly statistics
export const getMonthlyStats = (year, month, habitList) => {
  const monthData = getHabitsForMonth(year, month);
  const totalHabits = habitList.length;
  const daysTracked = Object.keys(monthData).length;
  
  let totalCompleted = 0;
  let totalPossible = 0;
  const habitStats = {};
  
  // Initialize habit stats
  habitList.forEach(habit => {
    habitStats[habit.id] = { completed: 0, total: daysTracked };
  });
  
  // Calculate stats
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

// Calculate yearly statistics
export const getYearlyStats = (year, habitList) => {
  const yearData = getHabitsForYear(year);
  const totalHabits = habitList.length;
  const daysTracked = Object.keys(yearData).length;
  
  let totalCompleted = 0;
  const monthlyProgress = new Array(12).fill(0);
  const monthlyDays = new Array(12).fill(0);
  
  Object.entries(yearData).forEach(([date, habits]) => {
    const month = parseInt(date.split('-')[1]) - 1;
    const completedCount = Object.values(habits).filter(Boolean).length;
    totalCompleted += completedCount;
    monthlyProgress[month] += completedCount;
    monthlyDays[month]++;
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

// Clear all data (for testing/reset)
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};
