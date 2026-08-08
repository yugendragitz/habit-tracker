import { memo } from 'react';
import { getShortMonthName, getDaysInMonth } from '../utils/dateUtils';
import { getHeatmapLevel, HEATMAP_COLORS, calculateDailyScore } from '../utils/analyticsUtils';

const MonthGrid = memo(({ year, month, dailyRecords = {}, activeHabits = [], isCurrentMonth = false, onSelectDate }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const getDayRecord = (day) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${year}-${monthStr}-${dayStr}`;
    return { dateKey, record: dailyRecords[dateKey] };
  };

  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const { dateKey, record } = getDayRecord(day);
      const habitsMap = record?.habits || {};
      const score = record?.score !== undefined 
        ? record.score 
        : calculateDailyScore(habitsMap, activeHabits);

      const level = getHeatmapLevel(score);
      const isToday = isCurrentMonth && day === new Date().getDate();

      cells.push(
        <div
          key={day}
          onClick={() => onSelectDate && onSelectDate(dateKey)}
          className={`
            aspect-square rounded-lg flex items-center justify-center text-xs font-semibold 
            cursor-pointer relative group transition-all duration-200 border
            ${HEATMAP_COLORS[level]}
            ${isToday ? 'ring-2 ring-accent-primary ring-offset-2 ring-offset-dark-900 font-bold scale-105' : 'hover:scale-110'}
          `}
          title={`${dateKey}: ${score}% score`}
        >
          <span>{day}</span>

          {/* Hover Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-dark-900 border border-white/10 rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-xl">
            {dateKey}: {score}% score
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className={`card p-4 sm:p-5 ${isCurrentMonth ? 'border-accent-primary/30 shadow-glow' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold text-sm sm:text-base ${isCurrentMonth ? 'text-accent-primary' : 'text-white/80'}`}>
          {getShortMonthName(month)} {year}
        </h3>
        {isCurrentMonth && (
          <span className="text-[10px] font-bold text-accent-primary bg-accent-primary/20 border border-accent-primary/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Current
          </span>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-[10px] text-white/40 font-bold uppercase">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">{renderGrid()}</div>
    </div>
  );
});

MonthGrid.displayName = 'MonthGrid';
export default MonthGrid;
