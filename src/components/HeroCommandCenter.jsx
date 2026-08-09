import ProgressRing from './ProgressRing';

export default function HeroCommandCenter({
  userName,
  selectedDate,
  transformationScore,
  completedHabitsCount,
  totalCount,
  currentWorkouts,
  currentDailyNutrition,
  currentWaterLiters,
  nutritionTargets,
  onOpenWorkoutLogger,
  onOpenNutritionTab,
}) {
  const dateObj = new Date(selectedDate);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDayStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="card p-6 sm:p-8 bg-[#0d0f19] border-white/10 shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Background Deep Cosmic Ambient Spotlight */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Greeting & Date Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-1">PERSONAL PERFORMANCE OS</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            GOOD MORNING, {(userName || 'YUGI').toUpperCase()}
          </h2>
          <p className="text-xs text-white/50 mt-1 font-medium">
            {dayName} • {monthDayStr}
          </p>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-white/40 font-bold uppercase block">TODAY'S MOMENTUM</span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">
                {transformationScore}
              </span>
              <span className="text-xs text-white/40 font-bold">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Visual Composition: Ring + Connected Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Left: Progress Ring */}
        <div className="flex flex-col items-center justify-center p-4">
          <ProgressRing
            percentage={transformationScore}
            size={185}
            strokeWidth={14}
            label="Transform"
          />
        </div>

        {/* Right: Connected Metric Strip (2 Columns) */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3 text-xs">
          
          {/* Habits Connected Tile */}
          <div className="p-4 rounded-2xl bg-[#141827] border border-white/5 space-y-1">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Habit Routine</span>
            <div className="flex items-baseline justify-between pt-1">
              <strong className="text-white text-base font-extrabold">{completedHabitsCount} / {totalCount}</strong>
              <span className="text-xs text-purple-400 font-bold">{Math.round((completedHabitsCount / (totalCount || 1)) * 100)}%</span>
            </div>
            <p className="text-[11px] text-white/50 pt-1">Daily habits completed</p>
          </div>

          {/* Workout Connected Tile */}
          <div 
            onClick={onOpenWorkoutLogger}
            className="p-4 rounded-2xl bg-[#141827] border border-white/5 space-y-1 cursor-pointer hover:border-purple-500/40 transition-all group"
          >
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Gym / Fitness</span>
            <div className="flex items-baseline justify-between pt-1">
              <strong className="text-white text-base font-extrabold">
                {currentWorkouts.length > 0 ? `✓ ${currentWorkouts.length} Logged` : '○ Not Logged'}
              </strong>
              <span className="text-xs text-purple-400 font-bold group-hover:underline">+ Log</span>
            </div>
            <p className="text-[11px] text-white/50 pt-1">
              {currentWorkouts.length > 0 ? `${currentWorkouts[0].totalVolume?.toLocaleString() || 0} kg vol` : 'Click to log workout'}
            </p>
          </div>

          {/* Calories Connected Tile */}
          <div 
            onClick={onOpenNutritionTab}
            className="p-4 rounded-2xl bg-[#141827] border border-white/5 space-y-1 cursor-pointer hover:border-orange-500/40 transition-all"
          >
            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">Daily Fuel</span>
            <div className="flex items-baseline justify-between pt-1">
              <strong className="text-white text-base font-extrabold">{currentDailyNutrition.totalCalories}</strong>
              <span className="text-xs text-white/40 font-bold">/ {nutritionTargets.dailyCalories || 3000} kcal</span>
            </div>
            <p className="text-[11px] text-orange-300 font-bold pt-1">{currentDailyNutrition.totalProtein}g protein logged</p>
          </div>

          {/* Water Connected Tile */}
          <div 
            onClick={onOpenNutritionTab}
            className="p-4 rounded-2xl bg-[#141827] border border-white/5 space-y-1 cursor-pointer hover:border-cyan-500/40 transition-all"
          >
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">Hydration Goal</span>
            <div className="flex items-baseline justify-between pt-1">
              <strong className="text-cyan-400 text-base font-extrabold">{currentWaterLiters.toFixed(1)} L</strong>
              <span className="text-xs text-white/40 font-bold">/ {nutritionTargets.dailyWaterLiters || 4.0} L</span>
            </div>
            <p className="text-[11px] text-white/50 pt-1">Creatine support hydration</p>
          </div>

        </div>

      </div>

    </div>
  );
}
