import { useMemo, memo } from 'react';
import ProgressBar from './ProgressBar';
import { getMonthlyStats } from '../utils/storageUtils';
import { getCurrentMonth, getCurrentYear, getMonthName, getDaysInMonth } from '../utils/dateUtils';

/**
 * MonthlyStats Component
 */
const MonthlyStats = memo(({ habitList }) => {
  const year = getCurrentYear();
  const month = getCurrentMonth();
  const monthName = getMonthName(month);
  const daysInMonth = getDaysInMonth(year, month);
  const currentDay = new Date().getDate();

  const stats = useMemo(() => getMonthlyStats(year, month, habitList), [year, month, habitList]);

  return (
    <div className="card p-5 sm:p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white/80 text-lg">{monthName} Analytics</h3>
        <span className="text-sm text-white/40">Day {currentDay} of {daysInMonth}</span>
      </div>

      {/* Overall monthly progress */}
      <div className="mb-6 p-4 rounded-xl bg-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60">Monthly Progress</span>
          <span className="text-xl font-bold gradient-text">{Math.round(stats.percentage)}%</span>
        </div>
        <ProgressBar percentage={stats.percentage} showPercentage={false} height={10} />
        <div className="flex justify-between mt-3 text-xs text-white/40">
          <span>{stats.totalCompleted} habits completed</span>
          <span>{stats.daysTracked} days tracked</span>
        </div>
      </div>

      {/* Per-habit breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-white/60">Habit Breakdown</h4>
        
        {habitList.map((habit, index) => {
          const habitStat = stats.habitStats[habit.id] || { completed: 0, total: stats.daysTracked };
          const percentage = habitStat.total > 0 ? (habitStat.completed / habitStat.total) * 100 : 0;

          return (
            <div key={habit.id} className="flex items-center gap-3">
              <span className="text-lg">{habit.icon}</span>
              <div className="flex-1 min-w-0">
                <ProgressBar percentage={percentage} label={habit.name} height={6} color={getColorForIndex(index)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.daysTracked}</div>
          <div className="text-xs text-white/40">Days Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-primary">{stats.totalCompleted}</div>
          <div className="text-xs text-white/40">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.totalPossible - stats.totalCompleted}</div>
          <div className="text-xs text-white/40">Missed</div>
        </div>
      </div>
    </div>
  );
});

const getColorForIndex = (index) => {
  const colors = ['purple', 'green', 'blue', 'orange', 'pink', 'accent', 'orange', 'pink'];
  return colors[index % colors.length];
};

MonthlyStats.displayName = 'MonthlyStats';
export default MonthlyStats;
