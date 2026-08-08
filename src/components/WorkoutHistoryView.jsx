import { useState, useMemo } from 'react';
import { formatVolume } from '../utils/fitnessUtils';

export default function WorkoutHistoryView({ workoutsMap, personalRecords, exerciseDatabase, onOpenLogger, onDeleteWorkout }) {
  const [selectedExerciseId, setSelectedExerciseId] = useState('');

  // Flat list of workouts sorted by date descending
  const allWorkoutsList = useMemo(() => {
    const list = [];
    Object.entries(workoutsMap || {}).forEach(([dateStr, logs]) => {
      (logs || []).forEach(log => {
        list.push({ ...log, dateStr });
      });
    });
    return list.sort((a, b) => new Date(b.dateStr) - new Date(a.dateStr));
  }, [workoutsMap]);

  // PR list
  const prList = useMemo(() => Object.values(personalRecords || {}), [personalRecords]);

  // Progression data for selected exercise
  const exerciseProgression = useMemo(() => {
    if (!selectedExerciseId) return [];
    const history = [];
    Object.entries(workoutsMap || {}).sort().forEach(([dateStr, logs]) => {
      (logs || []).forEach(log => {
        (log.exercises || []).forEach(ex => {
          if (ex.exerciseId === selectedExerciseId || ex.name === selectedExerciseId) {
            let maxW = 0;
            let maxVol = 0;
            (ex.sets || []).forEach(s => {
              const w = Number(s.weightKg) || 0;
              const r = Number(s.reps) || 0;
              if (w > maxW) maxW = w;
              if (w * r > maxVol) maxVol = w * r;
            });
            history.push({ dateStr, maxW, maxVol });
          }
        });
      });
    });
    return history;
  }, [selectedExerciseId, workoutsMap]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="card p-6 bg-gradient-to-br from-dark-800/90 to-dark-700/80 border-accent-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-accent-primary uppercase tracking-widest">Training History & PR Engine</span>
          <h2 className="text-xl font-extrabold text-white mt-1">🏋️‍♂️ Fitness & Workout Center</h2>
          <p className="text-xs text-white/60 mt-1">Log workouts, track volume progression, and hit personal records.</p>
        </div>
        <button
          onClick={onOpenLogger}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-accent-primary text-dark-900 shadow-glow hover:brightness-110 transition-all"
        >
          + Log Today's Workout
        </button>
      </div>

      {/* PR Showcase Trophies */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            🏆 Personal Records (PRs)
          </h3>
          <span className="text-xs text-amber-400 font-semibold">{prList.length} Records Hit</span>
        </div>

        {prList.length === 0 ? (
          <div className="card p-6 text-center text-white/40 text-xs">
            No PRs detected yet. Log your workout sets to trigger automated PR tracking!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {prList.map((pr, i) => (
              <div key={i} className="p-4 rounded-xl card border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase">🔥 Max Weight PR</span>
                  <h4 className="font-bold text-white text-sm mt-0.5">{pr.exerciseName}</h4>
                  <p className="text-xs text-white/60 font-semibold mt-1">
                    {pr.maxWeightKg} kg × {pr.maxRepsAtMaxWeight} reps
                  </p>
                  <span className="text-[10px] text-white/40">Achieved: {pr.dateAchieved}</span>
                </div>
                <span className="text-3xl">🏆</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Progression Graph */}
      <div className="card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Exercise Progression Chart</h3>
          <select
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white"
          >
            <option value="">Select Exercise to View Graph...</option>
            {exerciseDatabase.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name} ({ex.category})</option>
            ))}
          </select>
        </div>

        {selectedExerciseId && exerciseProgression.length > 0 ? (
          <div className="space-y-2 pt-2">
            <div className="h-36 flex items-end gap-2 border-b border-white/10 pb-2">
              {exerciseProgression.map((item, idx) => {
                const maxVal = Math.max(...exerciseProgression.map(p => p.maxW), 1);
                const hPct = (item.maxW / maxVal) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative">
                    <div
                      className="w-full max-w-6 bg-gradient-to-t from-accent-primary/60 to-accent-primary rounded-t-md hover:brightness-125 transition-all"
                      style={{ height: `${Math.max(15, hPct)}%` }}
                    />
                    <span className="text-[10px] text-white/40 mt-1">{item.dateStr.split('-').slice(1).join('/')}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 bg-dark-900 border border-white/10 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.dateStr}: {item.maxW} kg
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-white/40 text-xs">
            {selectedExerciseId ? 'No historical workout data for this exercise yet.' : 'Select an exercise above to visualize progression.'}
          </div>
        )}
      </div>

      {/* Workout History List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Logged Workouts ({allWorkoutsList.length})</h3>

        {allWorkoutsList.length === 0 ? (
          <div className="card p-12 text-center text-white/40 space-y-2">
            <p className="text-3xl">🏋️‍♂️</p>
            <p className="text-sm font-medium">Your training log is empty.</p>
            <p className="text-xs text-white/30">Click "+ Log Today's Workout" to start building your strength timeline.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allWorkoutsList.map((log) => (
              <div key={log.id} className="card p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest">{log.dateStr}</span>
                    <h4 className="font-bold text-white text-base mt-0.5">{log.title}</h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/70 font-semibold">⏱️ {log.durationMinutes} min</span>
                    <span className="px-2.5 py-1 rounded-lg bg-accent-primary/20 text-accent-primary font-bold">📦 {formatVolume(log.totalVolume)}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete workout "${log.title}"?`)) onDeleteWorkout(log.dateStr, log.id);
                      }}
                      className="text-white/30 hover:text-red-400 text-xs ml-2"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Exercises Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(log.exercises || []).map((ex, exIdx) => (
                    <div key={exIdx} className="p-3 rounded-xl bg-dark-900/60 border border-white/5 space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-white">
                        <span>{ex.name}</span>
                        <span className="text-white/40">{ex.sets?.length || 0} sets</span>
                      </div>
                      <div className="flex flex-wrap gap-1 text-[11px] text-white/60">
                        {(ex.sets || []).map((s, sIdx) => (
                          <span key={sIdx} className="px-1.5 py-0.5 bg-white/5 rounded">
                            {s.weightKg}kg × {s.reps}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {log.notes && (
                  <p className="text-xs text-white/60 italic pt-1">"{log.notes}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
