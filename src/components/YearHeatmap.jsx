import { memo, useMemo } from 'react';
import { getShortMonthName } from '../utils/dateUtils';
import { getHabitsForYear } from '../utils/storageUtils';

const YearHeatmap = memo(({ year, habitList }) => {
  const yearData = useMemo(() => getHabitsForYear(year), [year]);
  const totalHabits = habitList.length;
  const today = new Date();
  const isCurrentYear = year === today.getFullYear();

  const getDayCompletion = (date) => {
    const dateKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    const dayHabits = yearData[dateKey] || {};
    const completed = Object.values(dayHabits).filter(Boolean).length;
    return totalHabits > 0 ? completed / totalHabits : 0;
  };

  const getCompletionColor = (completion) => {
    if (completion === 0) return 'bg-white/5';
    if (completion < 0.25) return 'bg-accent-primary/20';
    if (completion < 0.5) return 'bg-accent-primary/40';
    if (completion < 0.75) return 'bg-accent-primary/60';
    if (completion < 1) return 'bg-accent-primary/80';
    return 'bg-accent-primary';
  };

  const generateYearGrid = () => {
    const weeks = [];
    let currentWeek = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const firstDayOfWeek = startDate.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) { currentWeek.push(null); }
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const completion = getDayCompletion(currentDate);
      const isToday = isCurrentYear && currentDate.getMonth() === today.getMonth() && currentDate.getDate() === today.getDate();
      currentWeek.push({ date: new Date(currentDate), completion, isToday, month: currentDate.getMonth(), day: currentDate.getDate() });
      if (currentDate.getDay() === 6) { weeks.push(currentWeek); currentWeek = []; }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (currentWeek.length > 0) { while (currentWeek.length < 7) { currentWeek.push(null); } weeks.push(currentWeek); }
    return weeks;
  };

  const weeks = generateYearGrid();
  const getMonthLabels = () => {
    const labels = [];
    let currentMonth = -1;
    weeks.forEach((week, weekIndex) => {
      week.forEach((day) => { if (day && day.month !== currentMonth) { currentMonth = day.month; labels.push({ month: currentMonth, weekIndex }); } });
    });
    return labels;
  };
  const monthLabels = getMonthLabels();

  return (
    <div className='card p-4 sm:p-6 animate-fadeIn overflow-x-auto'>
      <h3 className='text-lg font-semibold text-white mb-4'>{year} Activity</h3>
      <div className='flex mb-2 pl-8 min-w-max'>
        {monthLabels.map(({ month, weekIndex }) => (
          <div key={month} className='text-xs text-white/40' style={{ marginLeft: weekIndex === 0 ? 0 : 'auto', width: '45px' }}>
            {getShortMonthName(month)}
          </div>
        ))}
      </div>
      <div className='flex gap-1 min-w-max'>
        <div className='flex flex-col gap-1 mr-2'>
          {['', 'M', '', 'W', '', 'F', ''].map((day, i) => (
            <div key={i} className='w-3 h-3 text-xs text-white/30 flex items-center justify-center'>{day}</div>
          ))}
        </div>
        <div className='flex gap-1'>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className='flex flex-col gap-1'>
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={'w-3 h-3 rounded-sm cursor-default group relative transition-all duration-200 hover:ring-1 hover:ring-white/30 animate-fadeIn ' + (day ? getCompletionColor(day.completion) : 'bg-transparent') + (day && day.isToday ? ' ring-1 ring-accent-primary' : '')}
                  style={{ animationDelay: (weekIndex * 5) + 'ms' }}
                >
                  {day && (
                    <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-600 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10'>
                      {getShortMonthName(day.month)} {day.day}: {Math.round(day.completion * 100)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className='flex items-center justify-end gap-2 mt-4 text-xs text-white/40'>
        <span>Less</span>
        <div className='flex gap-1'>
          <div className='w-3 h-3 rounded-sm bg-white/5' />
          <div className='w-3 h-3 rounded-sm bg-accent-primary/20' />
          <div className='w-3 h-3 rounded-sm bg-accent-primary/40' />
          <div className='w-3 h-3 rounded-sm bg-accent-primary/60' />
          <div className='w-3 h-3 rounded-sm bg-accent-primary/80' />
          <div className='w-3 h-3 rounded-sm bg-accent-primary' />
        </div>
        <span>More</span>
      </div>
    </div>
  );
});

YearHeatmap.displayName = 'YearHeatmap';
export default YearHeatmap;
