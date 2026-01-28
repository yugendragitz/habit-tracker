import { useMemo, memo } from 'react';
import { getYearlyStats } from '../utils/storageUtils';
import { getCurrentYear, getShortMonthName } from '../utils/dateUtils';

/**
 * YearlyProgress Component
 */
const YearlyProgress = memo(({ habitList }) => {
  const year = getCurrentYear();
  const stats = useMemo(() => getYearlyStats(year, habitList), [year, habitList]);
  const maxPercentage = Math.max(...stats.monthlyPercentages, 1);

  return (
    <div className="card p-5 sm:p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white/80 text-lg">{year} Progress</h3>
        <span className="text-sm font-medium text-accent-primary">{Math.round(stats.percentage)}% overall</span>
      </div>

      {/* Monthly bar chart */}
      <div className="h-40 flex items-end gap-2">
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
                    w-full max-w-8 rounded-t-md transition-all duration-500
                    ${isFutureMonth 
                      ? 'bg-white/5' 
                      : isCurrentMonth 
                        ? 'bg-gradient-to-t from-accent-primary to-cyan-400' 
                        : 'bg-gradient-to-t from-accent-primary/60 to-accent-primary/40'
                    }
                    ${!isFutureMonth && 'hover:from-accent-primary hover:to-cyan-400'}
                  `}
                  style={{ height: isFutureMonth ? '10%' : `${Math.max(height, 5)}%` }}
                />
                
                {!isFutureMonth && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-600 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {Math.round(percentage)}%
                  </div>
                )}
              </div>

              <span className={`text-xs mt-2 ${isCurrentMonth ? 'text-accent-primary font-medium' : 'text-white/40'}`}>
                {getShortMonthName(i).charAt(0)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-white/5">
          <div className="text-xl font-bold gradient-text">{stats.daysTracked}</div>
          <div className="text-xs text-white/40">Days Tracked</div>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <div className="text-xl font-bold gradient-text">{stats.totalCompleted}</div>
          <div className="text-xs text-white/40">Total Completions</div>
        </div>
      </div>
    </div>
  );
});

YearlyProgress.displayName = 'YearlyProgress';
export default YearlyProgress;
