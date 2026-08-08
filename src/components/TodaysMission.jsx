export default function TodaysMission({ activeHabits, habitsCompletions, onToggleHabit, selectedDate }) {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest block">OBJECTIVE COMMAND</span>
          <h3 className="font-bold text-white text-base">TODAY'S MISSION & HABIT ROUTINE</h3>
        </div>
        <span className="text-xs text-white/50">{activeHabits.filter(h => habitsCompletions[h.id]).length} / {activeHabits.length} Objectives Completed</span>
      </div>

      <div className="space-y-2">
        {activeHabits.map((habit, idx) => {
          const isDone = Boolean(habitsCompletions[habit.id]);
          const numStr = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={habit.id}
              onClick={() => onToggleHabit(habit.id, selectedDate)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                isDone 
                  ? 'bg-accent-primary/10 border-accent-primary/40 text-white shadow-glow' 
                  : 'bg-dark-900/60 border-white/5 text-white/70 hover:border-white/20'
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
                  ? 'bg-accent-primary text-dark-900 shadow-glow scale-110' 
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
