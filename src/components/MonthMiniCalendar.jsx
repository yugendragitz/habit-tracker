import { memo } from 'react';
import { getShortMonthName } from '../utils/dateUtils';
import { calculateDailyScore } from '../utils/analyticsUtils';

/**
 * MonthMiniCalendar Component
 * Renders a single month mini grid with Sun-Sat columns, cosmic color scale,
 * today indicator, future date handling, and accessible tooltips.
 */
const MonthMiniCalendar = memo(({
  year,
  monthIndex, // 0 - 11
  dailyRecords = {},
  activeHabits = [],
  selectedDate,
  onSelectDate,
}) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Days in month
  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0);
  const totalDays = endDate.getDate();
  const startDayOfWeek = startDate.getDay(); // 0 (Sun) to 6 (Sat)

  // Calculate monthly consistency score
  let recordedDays = 0;
  let totalScoreEarned = 0;

  const daysArray = [];

  // Padding cells before day 1
  for (let i = 0; i < startDayOfWeek; i++) {
    daysArray.push(null);
  }

  // Days of month
  for (let day = 1; day <= totalDays; day++) {
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${year}-${monthStr}-${dayStr}`;
    const dateObj = new Date(year, monthIndex, day);

    const isFuture = dateObj > today;
    const isToday = dateKey === todayStr;

    const record = dailyRecords[dateKey];
    let score = 0;

    if (record) {
      score = record.score !== undefined 
        ? record.score 
        : calculateDailyScore(record.habits || {}, activeHabits);
      recordedDays++;
      totalScoreEarned += score;
    }

    daysArray.push({
      day,
      dateKey,
      isFuture,
      isToday,
      score,
      record,
    });
  }

  const monthlyConsistencyPct = recordedDays > 0 ? Math.round(totalScoreEarned / recordedDays) : 0;

  // Cosmic Color Resolver (0% to 100%)
  const getCellColorClass = (dayData) => {
    if (!dayData) return 'bg-transparent';
    if (dayData.isFuture) return 'bg-[#0a0d18]/50 border-white/5 opacity-40';
    if (dayData.score === 0 || dayData.score === undefined) return 'bg-[#090D1C] border-white/5';
    if (dayData.score <= 25) return 'bg-[#172A5A] border-blue-500/20 text-blue-200';
    if (dayData.score <= 50) return 'bg-[#3B2A8F] border-purple-500/30 text-purple-200';
    if (dayData.score <= 75) return 'bg-[#7A35C9] border-purple-400/40 text-white font-semibold';
    if (dayData.score <= 90) return 'bg-[#C94CFF] border-pink-400/50 text-white shadow-glow-magenta font-bold';
    return 'bg-[#5DEBFF] border-cyan-300 text-dark-900 shadow-glow-cyan font-black';
  };

  return (
    <div className="card p-3.5 bg-[#0d0f19] border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between">
      
      {/* Month Header */}
      <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-white/5">
        <h4 className="text-xs font-black tracking-wider text-white uppercase">
          {getShortMonthName(monthIndex)}
        </h4>
        <span className="text-[10px] font-bold text-purple-400">
          {monthlyConsistencyPct > 0 ? `${monthlyConsistencyPct}%` : '—'}
        </span>
      </div>

      {/* Weekday Labels (S M T W T F S) */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[9px] font-bold text-white/30 uppercase">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>

      {/* Days Mini Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((d, i) => {
          if (!d) return <div key={i} className="aspect-square" />;

          const isSelected = selectedDate === d.dateKey;
          const colorClass = getCellColorClass(d);

          return (
            <div
              key={d.dateKey}
              onClick={() => onSelectDate && onSelectDate(d.dateKey)}
              className={`
                aspect-square rounded-md flex items-center justify-center text-[9px] font-bold cursor-pointer relative group transition-all duration-200 border
                ${colorClass}
                ${d.isToday ? 'ring-1 ring-cyan-400 ring-offset-1 ring-offset-[#05060b] scale-105 z-10' : ''}
                ${isSelected ? 'ring-2 ring-purple-500 ring-offset-1 ring-offset-[#05060b] scale-110 z-20' : 'hover:scale-115'}
              `}
            >
              <span>{d.day}</span>

              {/* Accessible Custom Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-[#080d1c] border border-white/10 rounded-xl text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 shadow-2xl space-y-0.5">
                <div className="font-bold text-purple-300 uppercase">
                  {getShortMonthName(monthIndex)} {d.day}, {year}
                </div>
                {d.isFuture ? (
                  <span className="text-white/40 italic">Upcoming</span>
                ) : (
                  <div>
                    <span className="text-cyan-400 font-extrabold">{d.score}% Score</span>
                    {d.record && (
                      <span className="text-white/50 block text-[9px]">
                        {Object.keys(d.record.habits || {}).length} habits completed
                      </span>
                    )}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
});

MonthMiniCalendar.displayName = 'MonthMiniCalendar';

export default MonthMiniCalendar;
