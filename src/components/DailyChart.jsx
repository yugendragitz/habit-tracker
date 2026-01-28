import { memo, useMemo } from 'react';
import { getHabitsForMonth } from '../utils/storageUtils';
import { formatDate, getShortDayName } from '../utils/dateUtils';

const DailyChart = memo(({ habitList }) => {
  const totalHabits = habitList.length;
  const today = new Date();

  const weekData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = formatDate(date);
      const monthData = getHabitsForMonth(date.getFullYear(), date.getMonth());
      const dayHabits = monthData[dateKey] || {};
      const completed = Object.values(dayHabits).filter(Boolean).length;
      data.push({
        date, dateKey, dayName: getShortDayName(date.getDay()), completed,
        percentage: totalHabits > 0 ? (completed / totalHabits) * 100 : 0, isToday: i === 0
      });
    }
    return data;
  }, [totalHabits, today.toDateString()]);

  const maxCompleted = Math.max(...weekData.map(d => d.completed), 1);

  return (
    <div className='card p-4 sm:p-5 animate-fadeIn'>
      <h3 className='text-sm sm:text-base font-semibold text-white/80 mb-4'>Last 7 Days</h3>
      <div className='flex items-end justify-between gap-2 h-32'>
        {weekData.map((day, index) => {
          const barHeight = (day.completed / maxCompleted) * 100;
          return (
            <div key={day.dateKey} className='flex-1 flex flex-col items-center gap-2 group animate-fadeIn' style={{ animationDelay: (index * 50) + 'ms' }}>
              <div className='w-full h-24 bg-white/5 rounded-t-md overflow-hidden flex flex-col justify-end relative'>
                <div className={'w-full rounded-t-md transition-all duration-500 ease-out ' + (day.isToday ? 'bg-accent-primary' : 'bg-accent-primary/60')} style={{ height: barHeight + '%' }} />
                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                  <div className='bg-dark-600 px-2 py-1 rounded text-xs text-white'>{day.completed}/{totalHabits}</div>
                </div>
              </div>
              <span className={'text-xs ' + (day.isToday ? 'text-accent-primary font-semibold' : 'text-white/40')}>{day.dayName}</span>
            </div>
          );
        })}
      </div>
      <div className='mt-4 pt-4 border-t border-white/5'>
        <div className='flex justify-between items-center'>
          <span className='text-xs text-white/40'>Weekly Average</span>
          <span className='text-sm font-semibold text-accent-primary'>{Math.round(weekData.reduce((acc, d) => acc + d.percentage, 0) / 7)}%</span>
        </div>
      </div>
    </div>
  );
});

DailyChart.displayName = 'DailyChart';
export default DailyChart;
