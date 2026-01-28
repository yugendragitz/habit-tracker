/**
 * Date utility functions for habit tracking
 * Handles date formatting, comparisons, and range calculations
 */

// Get today's date in YYYY-MM-DD format
export const getToday = () => {
  const now = new Date();
  return formatDate(now);
};

// Format a date object to YYYY-MM-DD string
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Parse YYYY-MM-DD string to Date object
export const parseDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Get current month (0-11)
export const getCurrentMonth = () => new Date().getMonth();

// Get current year
export const getCurrentYear = () => new Date().getFullYear();

// Get month name from index
export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

// Get short month name
export const getShortMonthName = (monthIndex) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthIndex];
};

// Get number of days in a month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get all dates in a month
export const getDatesInMonth = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month);
  const dates = [];
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(formatDate(new Date(year, month, day)));
  }
  return dates;
};

// Get day of week (0 = Sunday, 6 = Saturday)
export const getDayOfWeek = (dateString) => {
  return parseDate(dateString).getDay();
};

// Get week number of the year
export const getWeekNumber = (dateString) => {
  const date = parseDate(dateString);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Check if a date is today
export const isToday = (dateString) => {
  return dateString === getToday();
};

// Check if a date is in the past
export const isPast = (dateString) => {
  return dateString < getToday();
};

// Check if a date is in the future
export const isFuture = (dateString) => {
  return dateString > getToday();
};

// Get formatted display date
export const getDisplayDate = (dateString) => {
  const date = parseDate(dateString);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Get all dates in a year organized by week for heatmap
export const getYearHeatmapData = (year) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const weeks = [];
  let currentWeek = [];
  
  // Pad the first week with empty cells
  const startDayOfWeek = startDate.getDay();
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }
  
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    currentWeek.push(formatDate(currentDate));
    
    if (currentDate.getDay() === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Push the last incomplete week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }
  
  return weeks;
};

// Get dates for last N days
export const getLastNDays = (n) => {
  const dates = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  return dates;
};

// Get short day name from day index (0=Sun, 1=Mon, etc.)
export const getShortDayName = (dayIndex) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex];
};
