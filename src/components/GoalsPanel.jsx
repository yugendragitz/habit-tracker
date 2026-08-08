import { useState } from 'react';

export default function GoalsPanel({ goals, habitsList, dailyRecords, onAddGoal, onToggleGoal, onDeleteGoal }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [targetDays, setTargetDays] = useState(20);
  const [linkedHabitId, setLinkedHabitId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddGoal({
      title: title.trim(),
      category,
      targetDays: Number(targetDays),
      linkedHabitId: linkedHabitId || null,
    });
    setTitle('');
    setTargetDays(20);
    setLinkedHabitId('');
    setShowAddForm(false);
  };

  // Helper to calculate target progress from historical dailyRecords
  const calculateGoalProgress = (goal) => {
    let count = 0;
    Object.values(dailyRecords || {}).forEach(rec => {
      if (goal.linkedHabitId) {
        if (rec.habits && rec.habits[goal.linkedHabitId]) {
          count++;
        }
      } else {
        // If unlinked, count days with score >= 50%
        if (rec.score >= 50) {
          count++;
        }
      }
    });
    return Math.min(count, goal.targetDays);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 card bg-gradient-to-br from-accent-primary/10 to-cyan-500/10 border-accent-primary/30">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🎯 Goals & Consistency Milestones
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Define long-term consistency targets linked to your core daily habits.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-accent-primary text-dark-900 shadow-glow hover:brightness-110 transition-all"
        >
          {showAddForm ? '✕ Close Form' : '+ New Goal'}
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="card p-6 space-y-4 animate-fadeIn border-white/20">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create Consistency Goal</h3>
          
          <div>
            <label className="block text-xs text-white/70 mb-1">Goal Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Master Boxing Routine or 20 Workout Days"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white placeholder-white/30 text-sm focus:border-accent-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/70 mb-1">Target Successful Days</label>
              <input
                type="number"
                min="1"
                max="365"
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-sm focus:border-accent-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1">Link to Habit (Optional)</label>
              <select
                value={linkedHabitId}
                onChange={(e) => setLinkedHabitId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-sm focus:border-accent-primary focus:outline-none"
              >
                <option value="">Any Habit (General Consistency)</option>
                {habitsList.map(h => (
                  <option key={h.id} value={h.id}>{h.icon} {h.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-sm focus:border-accent-primary focus:outline-none"
              >
                <option value="Health">Health</option>
                <option value="Fitness">Fitness</option>
                <option value="Mind">Mind</option>
                <option value="Productivity">Productivity</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-semibold bg-accent-primary text-dark-900 shadow-glow"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const currentProgress = calculateGoalProgress(goal);
          const percentage = Math.round((currentProgress / goal.targetDays) * 100);
          const isDone = goal.completed || percentage >= 100;
          const linkedHabit = habitsList.find(h => h.id === goal.linkedHabitId);

          return (
            <div 
              key={goal.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDone 
                  ? 'bg-emerald-950/20 border-emerald-500/40' 
                  : 'card border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                      {goal.category}
                    </span>
                    {linkedHabit && (
                      <span className="text-xs text-accent-primary font-medium flex items-center gap-1">
                        {linkedHabit.icon} {linkedHabit.name}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base mt-1.5">{goal.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleGoal(goal.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone ? 'bg-emerald-500 text-dark-900' : 'bg-white/10 text-white/30 hover:bg-white/20'
                    }`}
                    title="Toggle Goal Completion"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-white/30 hover:text-red-400 text-xs transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 mt-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-white/60">Progress</span>
                  <span className="text-accent-primary font-bold">{currentProgress} / {goal.targetDays} Days ({percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-dark-900 overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-primary to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
