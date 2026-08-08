import { useState, useMemo } from 'react';

export default function HistoryJournal({ dailyRecords, habitsList, onSelectDate }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'high' | 'reflections'
  const activeHabits = (habitsList || []).filter(h => h.active !== false);

  const sortedDates = useMemo(() => {
    return Object.keys(dailyRecords || {}).sort().reverse();
  }, [dailyRecords]);

  const filteredDates = useMemo(() => {
    return sortedDates.filter(dateStr => {
      const record = dailyRecords[dateStr];
      if (!record) return false;
      if (filter === 'high') return (record.score || 0) >= 75;
      if (filter === 'reflections') return Boolean(record.morningFocus || record.eveningReflection?.note);
      return true;
    });
  }, [sortedDates, dailyRecords, filter]);

  return (
    <div className="space-y-6">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card p-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📜 Historical Journal & Timeline
          </h2>
          <p className="text-xs text-white/50">Inspect past discipline scores, daily completed habits, and reflections.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 bg-dark-900/60 p-1 rounded-xl border border-white/5">
          {[
            { id: 'all', label: 'All Days' },
            { id: 'high', label: 'High Score (≥75%)' },
            { id: 'reflections', label: 'With Journal Notes' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f.id ? 'bg-accent-primary text-dark-900 shadow-glow' : 'text-white/60 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      {filteredDates.length === 0 ? (
        <div className="card p-12 text-center text-white/40 space-y-2">
          <p className="text-3xl">🌱</p>
          <p className="text-sm font-medium">No recorded history matching this filter yet.</p>
          <p className="text-xs text-white/30">Complete habits today to begin building your personal journey timeline.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDates.map(dateStr => {
            const record = dailyRecords[dateStr];
            const habitsMap = record.habits || {};
            const score = record.score !== undefined ? record.score : 0;
            const dateObj = new Date(dateStr);
            const dateFormatted = dateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div 
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className="card p-5 hover:border-white/20 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      score >= 75 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      score >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-white/10 text-white/60'
                    }`}>
                      {score}% Score
                    </div>
                    <h3 className="font-bold text-white text-sm">{dateFormatted}</h3>
                  </div>

                  <span className="text-xs text-accent-primary font-medium hover:underline">
                    Inspect Day →
                  </span>
                </div>

                {/* Habit Badges */}
                <div className="flex flex-wrap gap-2">
                  {activeHabits.map(h => {
                    const isDone = habitsMap[h.id];
                    return (
                      <span 
                        key={h.id}
                        className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                          isDone 
                            ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                            : 'bg-white/5 text-white/30'
                        }`}
                      >
                        <span>{h.icon}</span>
                        <span>{h.name}</span>
                        <span className="font-bold">{isDone ? '✓' : '○'}</span>
                      </span>
                    );
                  })}
                </div>

                {/* Morning focus or reflection notes */}
                {(record.morningFocus || record.eveningReflection?.note) && (
                  <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 text-xs text-white/70 space-y-1">
                    {record.morningFocus && (
                      <p><span className="text-accent-primary font-semibold">Priority:</span> {record.morningFocus}</p>
                    )}
                    {record.eveningReflection?.note && (
                      <p><span className="text-purple-400 font-semibold">Reflection:</span> "{record.eveningReflection.note}" {record.eveningReflection.mood}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
