import { memo } from 'react';
import { getShortMonthName } from '../utils/dateUtils';
import { getHeatmapLevel, HEATMAP_COLORS, calculateDailyScore } from '../utils/analyticsUtils';

const YearHeatmap = memo(({ year, dailyRecords = {}, activeHabits = [], onSelectDate }) => {
  const today = new Date();
  const isCurrentYear = year === today.getFullYear();

  const getDayScore = (date) => {
    const yearStr = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    const dateKey = `${yearStr}-${monthStr}-${dayStr}`;
    const record = dailyRecords[dateKey];
    
    const score = record?.score !== undefined 
      ? record.score 
      : calculateDailyScore(record?.habits || {}, activeHabits);
    return { dateKey, score };
  };

  const generateYearGrid = () => {
    const weeks = [];
    let currentWeek = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const firstDayOfWeek = startDate.getDay();
    
    for (let i = 0; i < firstDayOfWeek; i++) { 
      currentWeek.push(null); 
    }

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const { dateKey, score } = getDayScore(currentDate);
      const isToday = isCurrentYear && 
        currentDate.getMonth() === today.getMonth() && 
        currentDate.getDate() === today.getDate();

      currentWeek.push({ 
        dateKey,
        score, 
        isToday, 
        month: currentDate.getMonth(), 
        day: currentDate.getDate() 
      });

      if (currentDate.getDay() === 6) { 
        weeks.push(currentWeek); 
        currentWeek = []; 
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (currentWeek.length > 0) { 
      while (currentWeek.length < 7) { 
        currentWeek.push(null); 
      } 
      weeks.push(currentWeek); 
    }
    return weeks;
  };

  const weeks = generateYearGrid();

  const getMonthLabels = () => {
    const labels = [];
    let currentMonth = -1;
    weeks.forEach((week, weekIndex) => {
      week.forEach((day) => { 
        if (day && day.month !== currentMonth) { 
          currentMonth = day.month; 
          labels.push({ month: currentMonth, weekIndex }); 
        } 
      });
    });
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="card p-4 sm:p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          🟩 {year} Consistency Heatmap
        </h3>
        <span className="text-xs text-white/50">GitHub-style Daily Score Heatmap</span>
      </div>

      <div className="flex mb-2 pl-8 min-w-max">
        {monthLabels.map(({ month, weekIndex }) => (
          <div 
            key={month} 
            className="text-xs text-white/40 font-semibold" 
            style={{ marginLeft: weekIndex === 0 ? 0 : 'auto', width: '45px' }}
          >
            {getShortMonthName(month)}
          </div>
        ))}
      </div>

      <div className="flex gap-1 min-w-max">
        <div className="flex flex-col gap-1 mr-2">
          {['', 'M', '', 'W', '', 'F', ''].map((day, i) => (
            <div key={i} className="w-3 h-3 text-[10px] text-white/30 font-bold flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                if (!day) return <div key={dayIndex} className="w-3 h-3 bg-transparent" />;
                
                const level = getHeatmapLevel(day.score);
                return (
                  <div
                    key={dayIndex}
                    onClick={() => onSelectDate && onSelectDate(day.dateKey)}
                    className={`
                      w-3.5 h-3.5 rounded-sm cursor-pointer group relative transition-all duration-200 border
                      ${HEATMAP_COLORS[level]}
                      ${day.isToday ? 'ring-1 ring-accent-primary ring-offset-1 ring-offset-dark-900 scale-110' : 'hover:scale-125'}
                    `}
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-dark-900 border border-white/10 rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 shadow-2xl">
                      {getShortMonthName(day.month)} {day.day}, {year} • {day.score}% Score
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-white/50">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4, 5].map(lvl => (
            <div key={lvl} className={`w-3.5 h-3.5 rounded-sm border ${HEATMAP_COLORS[lvl]}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
});

YearHeatmap.displayName = 'YearHeatmap';
export default YearHeatmap;
