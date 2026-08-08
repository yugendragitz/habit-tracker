import { useMemo, memo } from 'react';
import { getCurrentYear, getShortMonthName } from '../utils/dateUtils';
import { calculateDailyScore } from '../utils/analyticsUtils';

const YearlyProgress = memo(({ dailyRecords = {}, activeHabits = [] }) => {
  const year = getCurrentYear();

  const stats = useMemo(() => {
    const monthlySum = new Array(12).fill(0);
    const monthlyCount = new Array(12).fill(0);
    let totalCompleted = 0;
    let daysTracked = 0;

    Object.entries(dailyRecords).forEach(([dateStr, record]) => {
      if (dateStr.startsWith(`${year}-`)) {
        const monthIndex = parseInt(dateStr.split('-')[1], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          daysTracked++;
          const habitsMap = record.habits || {};
          const score = record.score !== undefined 
            ? record.score 
            : calculateDailyScore(habitsMap, activeHabits);

          monthlySum[monthIndex] += score;
          monthlyCount[monthIndex]++;

          activeHabits.forEach(h => {
            if (habitsMap[h.id]) totalCompleted++;
          });
        }
      }
    });

    const monthlyPercentages = monthlySum.map((sum, i) => {
      return monthlyCount[i] > 0 ? Math.round(sum / monthlyCount[i]) : 0;
    });

    const overallAverage = daysTracked > 0 
      ? Math.round(monthlySum.reduce((a, b) => a + b, 0) / daysTracked) 
      : 0;

    return {
      monthlyPercentages,
      daysTracked,
      totalCompleted,
      overallAverage
    };
  }, [dailyRecords, activeHabits, year]);

  const maxPercentage = Math.max(...stats.monthlyPercentages, 1);

  return (
    <div className="card p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-lg">{year} Annual Discipline Overview</h3>
        <span className="text-sm font-extrabold text-accent-primary">{stats.overallAverage}% Average Score</span>
      </div>

      {/* Monthly bar chart */}
      <div className="h-44 flex items-end gap-2 pt-6">
        {stats.monthlyPercentages.map((percentage, i) => {
          const height = maxPercentage > 0 ? (percentage / maxPercentage) * 100 : 0;
          const currentMonth = new Date().getMonth();
          const isCurrentMonth = i === currentMonth;
          const isFutureMonth = i > currentMonth;

          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full h-32 flex items-end justify-center relative group">
                <div
                  className={`
                    w-full max-w-6 rounded-t-lg transition-all duration-500
                    ${isFutureMonth 
                      ? 'bg-white/5' 
                      : isCurrentMonth 
                        ? 'bg-gradient-to-t from-accent-primary to-cyan-400 shadow-glow' 
                        : 'bg-gradient-to-t from-accent-primary/60 to-accent-primary/40 hover:from-accent-primary'
                    }
                  `}
                  style={{ height: isFutureMonth ? '8%' : `${Math.max(height, 8)}%` }}
                />
                
                {!isFutureMonth && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-900 border border-white/10 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
                    {getShortMonthName(i)}: {percentage}%
                  </div>
                )}
              </div>

              <span className={`text-[10px] font-bold mt-2 ${isCurrentMonth ? 'text-accent-primary' : 'text-white/40'}`}>
                {getShortMonthName(i).charAt(0)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl bg-dark-900/80 border border-white/10 text-center">
          <div className="text-2xl font-black text-white">{stats.daysTracked}</div>
          <div className="text-[10px] text-white/40 font-bold uppercase mt-0.5">Days Recorded</div>
        </div>
        <div className="p-3.5 rounded-xl bg-dark-900/80 border border-white/10 text-center">
          <div className="text-2xl font-black text-accent-primary">{stats.totalCompleted}</div>
          <div className="text-[10px] text-white/40 font-bold uppercase mt-0.5">Total Habit Completions</div>
        </div>
      </div>
    </div>
  );
});

YearlyProgress.displayName = 'YearlyProgress';
export default YearlyProgress;
