import { useMemo } from 'react';
import { calculateHabitScore, getHeatmapLevel, HEATMAP_COLORS } from '../utils/analyticsUtils';

export default function WeeklyMonthlyAnalytics({ dailyRecords, workoutsMap, foodEntriesMap, waterLogsMap, activeHabits }) {
  // 7-day Weekly summary analytics
  const weeklyStats = useMemo(() => {
    const today = new Date();
    let habitScoreSum = 0;
    let workoutCount = 0;
    let totalVolume = 0;
    let calorieSum = 0;
    let proteinSum = 0;
    let waterSum = 0;
    let bestDay = { date: '', score: -1 };
    let weakestDay = { date: '', score: 101 };

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Habits score
      const rec = dailyRecords[dateStr] || {};
      const score = rec.score !== undefined ? rec.score : calculateHabitScore(rec.habits || {}, activeHabits);
      habitScoreSum += score;

      if (score > bestDay.score) bestDay = { date: dateStr, score };
      if (score < weakestDay.score) weakestDay = { date: dateStr, score };

      // Workouts
      const logs = workoutsMap[dateStr] || [];
      workoutCount += logs.length;
      logs.forEach(l => { totalVolume += (l.totalVolume || 0); });

      // Nutrition
      const foods = foodEntriesMap[dateStr] || [];
      foods.forEach(f => {
        calorieSum += (Number(f.calories) || 0);
        proteinSum += (Number(f.protein) || 0);
      });

      // Water
      waterSum += (waterLogsMap[dateStr] || 0);
    }

    return {
      habitConsistency: Math.round(habitScoreSum / 7),
      workoutCount,
      totalVolume,
      avgCalories: Math.round(calorieSum / 7),
      avgProtein: Math.round(proteinSum / 7),
      avgWater: Number((waterSum / 7).toFixed(1)),
      bestDay,
      weakestDay,
    };
  }, [dailyRecords, workoutsMap, foodEntriesMap, waterLogsMap, activeHabits]);

  // 30-day Monthly summary analytics
  const monthlyStats = useMemo(() => {
    const today = new Date();
    let habitScoreSum = 0;
    let workoutCount = 0;
    let totalVolume = 0;
    let calorieSum = 0;
    let proteinSum = 0;
    let waterSum = 0;
    let activeDays = 0;

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const rec = dailyRecords[dateStr];
      if (rec) {
        activeDays++;
        const score = rec.score !== undefined ? rec.score : calculateHabitScore(rec.habits || {}, activeHabits);
        habitScoreSum += score;
      }

      const logs = workoutsMap[dateStr] || [];
      workoutCount += logs.length;
      logs.forEach(l => { totalVolume += (l.totalVolume || 0); });

      const foods = foodEntriesMap[dateStr] || [];
      foods.forEach(f => {
        calorieSum += (Number(f.calories) || 0);
        proteinSum += (Number(f.protein) || 0);
      });

      waterSum += (waterLogsMap[dateStr] || 0);
    }

    return {
      activeDays,
      habitConsistency: activeDays > 0 ? Math.round(habitScoreSum / activeDays) : 0,
      workoutCount,
      totalVolume,
      avgCalories: Math.round(calorieSum / 30),
      avgProtein: Math.round(proteinSum / 30),
      avgWater: Number((waterSum / 30).toFixed(1)),
    };
  }, [dailyRecords, workoutsMap, foodEntriesMap, waterLogsMap, activeHabits]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="card p-6 bg-gradient-to-br from-dark-800/90 to-dark-700/80 border-accent-primary/30">
        <span className="text-xs font-bold text-accent-primary uppercase tracking-widest">Performance Analytical Reviews</span>
        <h2 className="text-xl font-extrabold text-white mt-1">📊 Weekly & Monthly Progress Analytics</h2>
        <p className="text-xs text-white/60 mt-1">Deep analysis of workout volume, macro averages, discipline consistency, and performance trends.</p>
      </div>

      {/* THIS WEEK REVIEW CARD */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <span>📅</span>
            <span>THIS WEEK REVIEW</span>
          </h3>
          <span className="text-xs text-accent-primary font-extrabold">{weeklyStats.habitConsistency}% Average Consistency</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 font-bold uppercase">Habit Consistency</span>
            <div className="text-2xl font-black text-accent-primary">{weeklyStats.habitConsistency}%</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 font-bold uppercase">Workouts Completed</span>
            <div className="text-2xl font-black text-white">{weeklyStats.workoutCount} Sessions</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 font-bold uppercase">Total Volume</span>
            <div className="text-2xl font-black text-cyan-400">{weeklyStats.totalVolume.toLocaleString()} kg</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 font-bold uppercase">Avg Protein / Cal</span>
            <div className="text-xl font-black text-emerald-400">{weeklyStats.avgProtein}g / {weeklyStats.avgCalories} kcal</div>
          </div>
        </div>

        {/* Best & Weakest Days */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase">🔥 Best Day This Week</span>
              <p className="font-bold text-white text-sm mt-0.5">{weeklyStats.bestDay.date || 'N/A'}</p>
            </div>
            <span className="text-2xl font-black text-emerald-400">{weeklyStats.bestDay.score >= 0 ? `${weeklyStats.bestDay.score}%` : '0%'}</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase">🌱 Growth Focus Day</span>
              <p className="font-bold text-white text-sm mt-0.5">{weeklyStats.weakestDay.date || 'N/A'}</p>
            </div>
            <span className="text-2xl font-black text-amber-400">{weeklyStats.weakestDay.score <= 100 ? `${weeklyStats.weakestDay.score}%` : '0%'}</span>
          </div>
        </div>
      </div>

      {/* THIS MONTH REVIEW CARD */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <span>🗓️</span>
            <span>THIS MONTH ANALYTICS</span>
          </h3>
          <span className="text-xs text-white/50">{monthlyStats.activeDays} Days Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 font-bold uppercase">Active Logged Days</span>
            <div className="text-2xl font-black text-white">{monthlyStats.activeDays} / 30 Days</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 font-bold uppercase">Workouts Completed</span>
            <div className="text-2xl font-black text-accent-primary">{monthlyStats.workoutCount} Sessions</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 font-bold uppercase">Monthly Training Volume</span>
            <div className="text-2xl font-black text-cyan-400">{monthlyStats.totalVolume.toLocaleString()} kg</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 font-bold uppercase">Avg Water Intake</span>
            <div className="text-2xl font-black text-cyan-300">{monthlyStats.avgWater} Liters/day</div>
          </div>
        </div>
      </div>

    </div>
  );
}
