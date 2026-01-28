import { memo, useMemo } from 'react';
import { getShortMonthName, getDaysInMonth } from '../utils/dateUtils';
import { getHabitsForMonth } from '../utils/storageUtils';

const MonthGrid = memo(({ year, month, habitList, isCurrentMonth = false }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthData = useMemo(() => getHabitsForMonth(year, month), [year, month]);
  const totalHabits = habitList.length;

  const getDayCompletion = (day) => {
    const dateKey = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    const dayHabits = monthData[dateKey] || {};
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

  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(<div key={'empty-' + i} className='aspect-square' />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const completion = getDayCompletion(day);
      const isToday = isCurrentMonth && day === new Date().getDate();
      cells.push(
        <div
          key={day}
          className={'aspect-square rounded-md flex items-center justify-center text-xs font-medium cursor-default relative group animate-fadeIn ' + getCompletionColor(completion) + (isToday ? ' ring-2 ring-accent-primary ring-offset-2 ring-offset-dark-800' : '')}
          style={{ animationDelay: (day * 15) + 'ms' }}
          title={'Day ' + day + ': ' + Math.round(completion * 100) + '% complete'}
        >
          <span className={(completion > 0.5 ? 'text-dark-900' : 'text-white/60') + (isToday ? ' font-bold' : '')}>{day}</span>
          <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-600 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10'>
            {Math.round(completion * 100)}%
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className={'card p-4 sm:p-5 animate-fadeIn ' + (isCurrentMonth ? 'border-accent-primary/20' : '')}>
      <div className='flex items-center justify-between mb-4'>
        <h3 className={'font-semibold text-sm sm:text-base ' + (isCurrentMonth ? 'text-accent-primary' : 'text-white/80')}>
          {getShortMonthName(month)}
        </h3>
        {isCurrentMonth && (
          <span className='text-xs text-accent-primary/60 bg-accent-primary/10 px-2 py-0.5 rounded-full'>Current</span>
        )}
      </div>
      <div className='grid grid-cols-7 gap-1 mb-2'>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className='text-center text-xs text-white/30 font-medium'>{day}</div>
        ))}
      </div>
      <div className='grid grid-cols-7 gap-1'>{renderGrid()}</div>
    </div>
  );
});

MonthGrid.displayName = 'MonthGrid';
export default MonthGrid;
