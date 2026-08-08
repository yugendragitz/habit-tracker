import { useMemo, memo } from 'react';
import ProgressBar from './ProgressBar';
import { getCurrentMonth, getCurrentYear, getMonthName, getDaysInMonth } from '../utils/dateUtils';
import { calculateDailyScore } from '../utils/analyticsUtils';

const MonthlyStats = memo(({ dailyRecords = {}, activeHabits = [] }) => {
  const year = getCurrentYear();
  const month = getCurrentMonth();
  const monthName = getMonthName(month);
  const daysInMonth = getDaysInMonth(year, month);
  const currentDay = new Date().getDate();

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

  const stats = useMemo(() => {
    let totalCompleted = 0;
    let daysTracked = 0;
    let sumScore = 0;
    const habitCounts = {};

    activeHabits.forEach(h => { habitCounts[h.id] = 0; });

    Object.entries(dailyRecords).forEach(([dateStr, record]) => {
      if (dateStr.startsWith(monthPrefix)) {
        daysTracked++;
        const habitsMap = record.habits || {};
        const score = record.score !== undefined 
          ? record.score 
          : calculateDailyScore(habitsMap, activeHabits);
        sumScore += score;

        activeHabits.forEach(h => {
          if (habitsMap[h.id]) {
            habitCounts[h.id]++;
            totalCompleted++;
          }
        });
      }
    });

    const averageScore = daysTracked > 0 ? Math.round(sumScore / daysTracked) : 0;
    return {
      daysTracked,
      totalCompleted,
      averageScore,
      habitCounts,
      totalPossible: daysTracked * activeHabits.length
    };
  }, [dailyRecords, activeHabits, monthPrefix]);

  return (
    <div className="card p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-lg">{monthName} Discipline Analytics</h3>
        <span className="text-xs text-white/50">Day {currentDay} of {daysInMonth}</span>
      </div>

      {/* Overall monthly progress */}
      <div className="p-4 rounded-xl bg-dark-900/80 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60">Average Monthly Score</span>
          <span className="text-2xl font-extrabold text-accent-primary">{stats.averageScore}%</span>
        </div>
        <ProgressBar percentage={stats.averageScore} showPercentage={false} height={10} />
        <div className="flex justify-between mt-3 text-xs text-white/40">
          <span>{stats.totalCompleted} total completions</span>
          <span>{stats.daysTracked} days logged</span>
        </div>
      </div>

      {/* Per-habit breakdown */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Habit Consistency Breakdown</h4>
        
        {activeHabits.map((habit) => {
          const count = stats.habitCounts[habit.id] || 0;
          const percentage = stats.daysTracked > 0 ? Math.round((count / stats.daysTracked) * 100) : 0;

          return (
            <div key={habit.id} className="flex items-center gap-3">
              <span className="text-xl">{habit.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-white/80">{habit.name}</span>
                  <span className="text-accent-primary">{count} / {stats.daysTracked || 1} days ({percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden border border-white/5">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: habit.color || '#00ffc8'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xl font-bold text-white">{stats.daysTracked}</div>
          <div className="text-[10px] text-white/40 font-semibold uppercase">Days Active</div>
        </div>
        <div>
          <div className="text-xl font-bold text-accent-primary">{stats.totalCompleted}</div>
          <div className="text-[10px] text-white/40 font-semibold uppercase">Completed</div>
        </div>
        <div>
          <div className="text-xl font-bold text-white">{stats.averageScore}%</div>
          <div className="text-[10px] text-white/40 font-semibold uppercase">Avg Score</div>
        </div>
      </div>
    </div>
  );
});

MonthlyStats.displayName = 'MonthlyStats';
export default MonthlyStats;
