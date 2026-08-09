import { memo } from 'react';
import { getShortMonthName } from '../utils/dateUtils';
import { getHeatmapLevel, HEATMAP_COLORS, calculateDailyScore } from '../utils/analyticsUtils';

/**
 * YearHeatmap Component
 * Full-width responsive heatmap container fitting 100% within viewport width
 * with zero horizontal page scrollbars.
 */
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
    <div className="card p-4 sm:p-6 bg-[#0d0f19] border-white/10 space-y-4 overflow-hidden">
      
      {/* Heatmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block">ANNUAL CONSISTENCY DENSITY</span>
          <h3 className="text-base font-black text-white">{year} TRANSFORMATION HEATMAP</h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] text-white/50">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5].map(lvl => (
              <div key={lvl} className={`w-3 h-3 rounded-xs border ${HEATMAP_COLORS[lvl]}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Local Scroll Container (Zero Main Page Scrollbar) */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-[700px] space-y-2">
          
          {/* Month Labels */}
          <div className="flex pl-6">
            {monthLabels.map(({ month, weekIndex }) => (
              <div 
                key={month} 
                className="text-[10px] text-white/40 font-extrabold tracking-wider uppercase" 
                style={{ marginLeft: weekIndex === 0 ? 0 : 'auto', width: '48px' }}
              >
                {getShortMonthName(month)}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 mr-2 text-[9px] text-white/30 font-bold justify-between py-0.5">
              <span>M</span>
              <span>W</span>
              <span>F</span>
            </div>

            <div className="flex gap-1 flex-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1 flex-1">
                  {week.map((day, dayIndex) => {
                    if (!day) return <div key={dayIndex} className="aspect-square bg-transparent" />;
                    
                    const level = getHeatmapLevel(day.score);
                    return (
                      <div
                        key={dayIndex}
                        onClick={() => onSelectDate && onSelectDate(day.dateKey)}
                        className={`
                          aspect-square rounded-xs cursor-pointer group relative transition-all duration-200 border
                          ${HEATMAP_COLORS[level]}
                          ${day.isToday ? 'ring-1 ring-cyan-400 ring-offset-1 ring-offset-[#05060b] scale-110 z-10' : 'hover:scale-125'}
                        `}
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#080d1c] border border-white/10 rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 shadow-2xl">
                          {getShortMonthName(day.month)} {day.day}, {year} • {day.score}% Score
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
});

YearHeatmap.displayName = 'YearHeatmap';

export default YearHeatmap;
