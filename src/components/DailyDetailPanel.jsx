import { memo } from 'react';

/**
 * DailyDetailPanel Component
 * Displays rich, real performance details for a selected date:
 * Habits, Gym Workout, Fuel/Calories, Hydration, Goals, Evening Notes.
 */
const DailyDetailPanel = memo(({
  selectedDate,
  dailyRecord = {},
  workouts = [],
  foodEntries = [],
  waterLiters = 0,
  activeHabits = [],
  nutritionTargets = {},
}) => {
  const dateObj = new Date(selectedDate);
  const formattedDateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const habitsCompletedMap = dailyRecord.habits || {};
  const completedHabitsList = activeHabits.filter(h => habitsCompletedMap[h.id]);

  const totalCals = foodEntries.reduce((sum, f) => sum + (f.calories || 0), 0);
  const totalProt = foodEntries.reduce((sum, f) => sum + (f.protein || 0), 0);

  const score = dailyRecord.score !== undefined 
    ? dailyRecord.score 
    : Math.round((completedHabitsList.length / (activeHabits.length || 1)) * 100);

  return (
    <div className="card p-6 bg-[#0d0f19] border-white/10 space-y-6">
      
      {/* Date Header & Transformation Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block">DAILY PERFORMANCE BREAKDOWN</span>
          <h3 className="text-xl font-black text-white">{formattedDateStr}</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-white/40 font-bold uppercase block">SCORE</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">
                {score}
              </span>
              <span className="text-xs text-white/40 font-bold">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Composition of Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Habits Tile */}
        <div className="p-4 rounded-2xl bg-[#141827] border border-white/5 space-y-2">
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Habit Routine</span>
          <strong className="text-white text-base font-extrabold block">
            {completedHabitsList.length} / {activeHabits.length} Completed
          </strong>
          <ul className="text-white/60 space-y-1 pt-1 list-disc list-inside">
            {completedHabitsList.slice(0, 4).map((h, i) => (
              <li key={i} className="truncate">{h.name}</li>
            ))}
            {completedHabitsList.length > 4 && (
              <li className="text-white/30 italic">+{completedHabitsList.length - 4} more</li>
            )}
          </ul>
        </div>

        {/* Workout Tile */}
        <div className="p-4 rounded-2xl bg-[#141827] border border-white/5 space-y-2">
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Gym Workout</span>
          <strong className="text-white text-base font-extrabold block">
            {workouts.length > 0 ? `✓ ${workouts.length} Workout Logged` : '○ No Workout Logged'}
          </strong>
          {workouts.length > 0 ? (
            <p className="text-white/60 pt-1">
              Total Volume: <span className="font-bold text-white">{workouts[0].totalVolume?.toLocaleString() || 0} kg</span>
            </p>
          ) : (
            <p className="text-white/40 pt-1">Rest or recovery day</p>
          )}
        </div>

        {/* Nutrition Tile */}
        <div className="p-4 rounded-2xl bg-[#141827] border border-white/5 space-y-2">
          <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">Daily Fuel</span>
          <strong className="text-white text-base font-extrabold block">
            {totalCals} / {nutritionTargets.dailyCalories || 3000} kcal
          </strong>
          <p className="text-orange-300 font-bold pt-1">
            {totalProt}g / {nutritionTargets.dailyProteinGrams || 130}g Protein
          </p>
        </div>

        {/* Water Tile */}
        <div className="p-4 rounded-2xl bg-[#141827] border border-white/5 space-y-2">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">Hydration</span>
          <strong className="text-cyan-400 text-base font-extrabold block">
            {Number(waterLiters).toFixed(1)} / {nutritionTargets.dailyWaterLiters || 4.0} Liters
          </strong>
          <p className="text-white/40 pt-1">Creatine support hydration</p>
        </div>

      </div>

      {/* Evening Reflection Note (If Stored) */}
      {dailyRecord.eveningReflection?.note && (
        <div className="p-4 rounded-2xl bg-[#141827] border border-white/5 space-y-1">
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">🌙 EVENING REFLECTION</span>
          <p className="text-xs text-white/80 italic">"{dailyRecord.eveningReflection.note}"</p>
        </div>
      )}

    </div>
  );
});

DailyDetailPanel.displayName = 'DailyDetailPanel';

export default DailyDetailPanel;
