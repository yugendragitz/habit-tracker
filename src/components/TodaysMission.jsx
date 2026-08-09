export default function TodaysMission({ activeHabits, habitsCompletions, onToggleHabit, selectedDate }) {
  // Category Color Accent Token Resolver
  const getCategoryColorClass = (category, isDone) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('fitness') || cat.includes('workout') || cat.includes('gym')) {
      return isDone 
        ? 'bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-glow' 
        : 'hover:border-purple-500/30';
    }
    if (cat.includes('nutrition') || cat.includes('fuel') || cat.includes('eat')) {
      return isDone 
        ? 'bg-orange-500/15 border-orange-500/40 text-orange-300 shadow-glow-orange' 
        : 'hover:border-orange-500/30';
    }
    if (cat.includes('hydration') || cat.includes('water') || cat.includes('recovery') || cat.includes('sleep')) {
      return isDone 
        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-glow-cyan' 
        : 'hover:border-cyan-500/30';
    }
    if (cat.includes('study') || cat.includes('mind') || cat.includes('learn')) {
      return isDone 
        ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 shadow-glow' 
        : 'hover:border-blue-500/30';
    }
    return isDone 
      ? 'bg-pink-500/15 border-pink-500/40 text-pink-300 shadow-glow-magenta' 
      : 'hover:border-pink-500/30';
  };

  const getCategoryBadgeClass = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('fitness')) return 'bg-purple-500 text-white';
    if (cat.includes('nutrition')) return 'bg-orange-500 text-white';
    if (cat.includes('hydration') || cat.includes('recovery')) return 'bg-cyan-500 text-dark-900';
    if (cat.includes('study')) return 'bg-blue-500 text-white';
    return 'bg-pink-500 text-white';
  };

  return (
    <div className="card p-6 space-y-4 bg-[#0d0f19]">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">OBJECTIVE COMMAND</span>
          <h3 className="font-bold text-white text-base">TODAY'S MISSION & HABIT ROUTINE</h3>
        </div>
        <span className="text-xs text-white/50">{activeHabits.filter(h => habitsCompletions[h.id]).length} / {activeHabits.length} Objectives Completed</span>
      </div>

      <div className="space-y-2">
        {activeHabits.map((habit, idx) => {
          const isDone = Boolean(habitsCompletions[habit.id]);
          const numStr = String(idx + 1).padStart(2, '0');
          const catClass = getCategoryColorClass(habit.category, isDone);
          const badgeClass = getCategoryBadgeClass(habit.category);

          return (
            <div
              key={habit.id}
              onClick={() => onToggleHabit(habit.id, selectedDate)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-250 ${
                isDone 
                  ? catClass 
                  : 'bg-[#141827] border-white/5 text-white/70 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-white/40">{numStr}</span>
                <span className="text-lg">{habit.icon}</span>
                <div>
                  <p className={`text-xs font-bold ${isDone ? 'text-white' : 'text-white/80'}`}>{habit.name}</p>
                  <span className="text-[10px] text-white/40">{habit.description || habit.category}</span>
                </div>
              </div>

              {/* State Lock Toggle Button (○ → ✓) */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-300 ${
                isDone 
                  ? `${badgeClass} shadow-glow scale-110` 
                  : 'bg-white/5 text-white/30 border border-white/10 hover:border-white/30'
              }`}>
                {isDone ? '✓' : '○'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
