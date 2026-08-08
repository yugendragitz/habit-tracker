import { getHeatmapLevel, HEATMAP_COLORS } from '../utils/analyticsUtils';
import { calculateDailyNutrition } from '../utils/nutritionUtils';

export default function DayDetailModal({ dateStr, dailyRecord, workoutsMap, foodEntriesMap, waterLogsMap, bodyMeasurementsMap, habitsList, isOpen, onClose, onToggleHabit }) {
  if (!isOpen || !dateStr) return null;

  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const habitsMap = dailyRecord?.habits || {};
  const activeHabits = (habitsList || []).filter(h => h.active !== false);
  const completedList = activeHabits.filter(h => habitsMap[h.id]);
  
  const score = dailyRecord?.score !== undefined 
    ? dailyRecord.score 
    : Math.round((completedList.length / (activeHabits.length || 1)) * 100);

  const level = getHeatmapLevel(score);

  const workouts = workoutsMap?.[dateStr] || [];
  const foods = foodEntriesMap?.[dateStr] || [];
  const water = waterLogsMap?.[dateStr] || 0;
  const measurement = bodyMeasurementsMap?.[dateStr] || {};
  const nutrition = calculateDailyNutrition(foods);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="card max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Date Summary Inspector</span>
            <h2 className="text-lg font-bold text-white mt-0.5">{formattedDate}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Daily score summary card */}
          <div className="p-4 rounded-xl bg-dark-900/80 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-white/50">Daily Discipline Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-white">{score}</span>
                <span className="text-xs text-white/40">/ 100</span>
              </div>
              <p className="text-xs text-white/60 mt-1">
                {completedList.length} of {activeHabits.length} habits completed
              </p>
            </div>

            <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${HEATMAP_COLORS[level]}`}>
              {score >= 75 ? '🔥 Excellent' : score >= 50 ? '⚡ Good' : score > 0 ? '🌱 Average' : '○ No Activity'}
            </div>
          </div>

          {/* Quick Metrics Badges for Phase 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-white/40 font-bold block">Workout</span>
              <strong className="text-accent-primary">{workouts.length > 0 ? `✓ ${workouts.length} Logged` : 'None'}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-white/40 font-bold block">Calories</span>
              <strong className="text-white">{nutrition.totalCalories} kcal</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-white/40 font-bold block">Protein</span>
              <strong className="text-emerald-400">{nutrition.totalProtein}g</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-white/40 font-bold block">Water</span>
              <strong className="text-cyan-400">{water} L</strong>
            </div>
          </div>

          {/* Workout Section if recorded */}
          {workouts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-accent-primary uppercase tracking-wider">🏋️ Workout Recorded</h4>
              {workouts.map(w => (
                <div key={w.id} className="p-3 rounded-xl bg-dark-900/60 border border-white/5 text-xs flex justify-between">
                  <div>
                    <strong className="text-white block">{w.title}</strong>
                    <span className="text-white/40">{w.exercises?.length || 0} exercises • {w.durationMinutes} min</span>
                  </div>
                  <span className="font-bold text-accent-primary">{(w.totalVolume || 0).toLocaleString()} kg vol</span>
                </div>
              ))}
            </div>
          )}

          {/* Habits breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Habits for this Day
            </h3>
            
            <div className="space-y-2">
              {activeHabits.map((habit) => {
                const isDone = Boolean(habitsMap[habit.id]);
                return (
                  <div 
                    key={habit.id}
                    onClick={() => onToggleHabit(habit.id, dateStr)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isDone 
                        ? 'bg-accent-primary/10 border-accent-primary/30 text-white' 
                        : 'bg-dark-900/40 border-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{habit.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{habit.name}</p>
                        <span className="text-[10px] text-white/40">{habit.category}</span>
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone ? 'bg-accent-primary text-dark-900 shadow-glow' : 'bg-white/10 text-white/30'
                    }`}>
                      {isDone ? '✓' : '○'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reflections */}
          {(dailyRecord?.morningFocus || dailyRecord?.eveningReflection?.note) && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
              {dailyRecord.morningFocus && (
                <div>
                  <span className="text-[10px] font-semibold text-accent-primary uppercase">Morning Priority</span>
                  <p className="text-xs text-white/80 mt-0.5">{dailyRecord.morningFocus}</p>
                </div>
              )}

              {dailyRecord.eveningReflection?.note && (
                <div>
                  <div className="flex items-center justify-between text-[10px] text-purple-400 font-semibold uppercase">
                    <span>Evening Reflection</span>
                    <span>{dailyRecord.eveningReflection.mood} (Energy: {dailyRecord.eveningReflection.energy || 3}/5)</span>
                  </div>
                  <p className="text-xs text-white/80 mt-0.5 italic">"{dailyRecord.eveningReflection.note}"</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
