import { useState } from 'react';
import { EXERCISE_CATEGORIES } from '../utils/exerciseDatabase';
import { calculateWorkoutSummary } from '../utils/fitnessUtils';

export default function WorkoutLoggerModal({ dateStr, exerciseDatabase, isOpen, onClose, onSaveWorkout, onAddCustomExercise }) {
  const [title, setTitle] = useState('Chest + Triceps');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Chest');
  const [exercisesInWorkout, setExercisesInWorkout] = useState([]);
  
  // Custom Exercise Creator modal state inside logger
  const [showAddCustomEx, setShowAddCustomEx] = useState(false);
  const [customExName, setCustomExName] = useState('');
  const [customExCat, setCustomExCat] = useState('Chest');
  const [customExEquip, setCustomExEquip] = useState('Dumbbell');

  if (!isOpen) return null;

  const filteredExercises = (exerciseDatabase || []).filter(e => e.category === selectedCategory);

  const handleAddExerciseToWorkout = (ex) => {
    setExercisesInWorkout(prev => [
      ...prev,
      {
        exerciseId: ex.id,
        name: ex.name,
        category: ex.category,
        equipment: ex.equipment,
        muscleGroups: ex.muscleGroups || [ex.category],
        sets: [
          { setNumber: 1, weightKg: 40, reps: 10 },
          { setNumber: 2, weightKg: 45, reps: 8 },
        ]
      }
    ]);
  };

  const handleRemoveExercise = (index) => {
    setExercisesInWorkout(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSet = (exIndex) => {
    setExercisesInWorkout(prev => {
      const updated = [...prev];
      const ex = updated[exIndex];
      const lastSet = ex.sets[ex.sets.length - 1] || { weightKg: 20, reps: 10 };
      ex.sets.push({
        setNumber: ex.sets.length + 1,
        weightKg: lastSet.weightKg,
        reps: lastSet.reps,
      });
      return updated;
    });
  };

  const handleRemoveSet = (exIndex, setIndex) => {
    setExercisesInWorkout(prev => {
      const updated = [...prev];
      updated[exIndex].sets = updated[exIndex].sets.filter((_, i) => i !== setIndex);
      return updated;
    });
  };

  const handleUpdateSet = (exIndex, setIndex, field, value) => {
    setExercisesInWorkout(prev => {
      const updated = [...prev];
      updated[exIndex].sets[setIndex][field] = Math.max(0, Number(value));
      return updated;
    });
  };

  const handleCreateCustomExercise = (e) => {
    e.preventDefault();
    if (!customExName.trim()) return;
    onAddCustomExercise({
      name: customExName.trim(),
      category: customExCat,
      equipment: customExEquip,
      muscleGroups: [customExCat],
    });
    setCustomExName('');
    setShowAddCustomEx(false);
  };

  const summary = calculateWorkoutSummary(exercisesInWorkout);

  const handleSubmitWorkout = (e) => {
    e.preventDefault();
    if (exercisesInWorkout.length === 0) {
      alert('Please add at least one exercise to your workout log.');
      return;
    }

    onSaveWorkout(dateStr, {
      id: `workout-${Date.now()}`,
      date: dateStr,
      title: title.trim() || 'Daily Workout',
      durationMinutes: Number(durationMinutes) || 45,
      notes: notes.trim(),
      exercises: exercisesInWorkout,
      ...summary,
      createdAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="card max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <span className="text-xs text-accent-primary font-bold uppercase tracking-widest">Gym & Training Logger</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Log Workout — {dateStr}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitWorkout} className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Top Inputs: Title, Duration, Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/70 mb-1">Workout Title / Routine Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Push Day (Chest + Triceps)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-sm focus:border-accent-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                max="300"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-sm focus:border-accent-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Live Summary Bar */}
          <div className="p-4 rounded-xl bg-dark-900/80 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-white/40 block">Total Exercises</span>
              <strong className="text-white text-sm">{exercisesInWorkout.length}</strong>
            </div>
            <div>
              <span className="text-white/40 block">Total Sets</span>
              <strong className="text-white text-sm">{summary.totalSets}</strong>
            </div>
            <div>
              <span className="text-white/40 block">Total Reps</span>
              <strong className="text-white text-sm">{summary.totalReps}</strong>
            </div>
            <div>
              <span className="text-white/40 block">Total Volume</span>
              <strong className="text-accent-primary text-sm font-extrabold">{summary.totalVolume.toLocaleString()} kg</strong>
            </div>
          </div>

          {/* Exercise Picker Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Select Exercises to Add</h3>
              <button
                type="button"
                onClick={() => setShowAddCustomEx(!showAddCustomEx)}
                className="text-xs text-accent-primary hover:underline font-medium"
              >
                {showAddCustomEx ? '✕ Close Form' : '+ Custom Exercise'}
              </button>
            </div>

            {/* Custom Exercise Form */}
            {showAddCustomEx && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-semibold text-white">Create Custom Exercise</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Exercise Name"
                    value={customExName}
                    onChange={(e) => setCustomExName(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-xs text-white"
                  />
                  <select
                    value={customExCat}
                    onChange={(e) => setCustomExCat(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-xs text-white"
                  >
                    {EXERCISE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={handleCreateCustomExercise}
                    className="px-4 py-2 rounded-lg bg-accent-primary text-dark-900 font-bold text-xs"
                  >
                    Save Exercise
                  </button>
                </div>
              </div>
            )}

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {EXERCISE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    selectedCategory === cat.id ? 'bg-accent-primary text-dark-900 font-bold shadow-glow' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Exercise list selector */}
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 bg-dark-900/60 rounded-xl border border-white/5">
              {filteredExercises.map(ex => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleAddExerciseToWorkout(ex)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-accent-primary/20 hover:border-accent-primary/30 border border-white/5 text-xs text-white/80 transition-all flex items-center gap-1.5"
                >
                  <span>+ {ex.name}</span>
                  <span className="text-[10px] text-white/40">({ex.equipment})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exercises in Workout list */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Logged Exercises ({exercisesInWorkout.length})</h3>

            {exercisesInWorkout.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-white/40 text-xs">
                Click any exercise above to add it to your workout session.
              </div>
            ) : (
              <div className="space-y-4">
                {exercisesInWorkout.map((ex, exIdx) => {
                  const exVol = ex.sets.reduce((sum, s) => sum + ((Number(s.weightKg) || 0) * (Number(s.reps) || 0)), 0);

                  return (
                    <div key={exIdx} className="p-4 rounded-xl bg-dark-900/80 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{ex.name}</h4>
                          <span className="text-[10px] text-accent-primary font-medium">{ex.category} • {ex.equipment} • {exVol} kg vol</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(exIdx)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Remove Exercise
                        </button>
                      </div>

                      {/* Sets list */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 text-[10px] text-white/40 font-bold uppercase px-2">
                          <div className="col-span-2">Set</div>
                          <div className="col-span-4">Weight (kg)</div>
                          <div className="col-span-4">Reps</div>
                          <div className="col-span-2 text-right">Action</div>
                        </div>

                        {ex.sets.map((set, setIdx) => (
                          <div key={setIdx} className="grid grid-cols-12 gap-2 items-center px-2 py-1 rounded-lg bg-white/5">
                            <div className="col-span-2 font-bold text-xs text-white">#{setIdx + 1}</div>
                            <div className="col-span-4">
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={set.weightKg}
                                onChange={(e) => handleUpdateSet(exIdx, setIdx, 'weightKg', e.target.value)}
                                className="w-full px-2 py-1 rounded bg-dark-900 border border-white/10 text-xs text-white"
                              />
                            </div>
                            <div className="col-span-4">
                              <input
                                type="number"
                                min="0"
                                value={set.reps}
                                onChange={(e) => handleUpdateSet(exIdx, setIdx, 'reps', e.target.value)}
                                className="w-full px-2 py-1 rounded bg-dark-900 border border-white/10 text-xs text-white"
                              />
                            </div>
                            <div className="col-span-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveSet(exIdx, setIdx)}
                                className="text-xs text-white/40 hover:text-red-400"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddSet(exIdx)}
                        className="text-xs text-accent-primary font-semibold hover:underline pt-1 block"
                      >
                        + Add Set
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">Workout Notes / Performance Feeling</label>
            <textarea
              rows="2"
              placeholder="e.g., Felt strong on bench press, good pump!"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs resize-none"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-extrabold bg-accent-primary text-dark-900 shadow-glow"
            >
              Save Workout Log
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
