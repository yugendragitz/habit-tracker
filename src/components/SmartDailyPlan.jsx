import { useState } from 'react';

export default function SmartDailyPlan({ selectedDate, workoutsMap, activeHabits }) {
  const [scheduleItems, setScheduleItems] = useState([
    { id: 't1', time: '06:00 AM', title: 'Hydration (1.0L Water) + Morning Focus', completed: true },
    { id: 't2', time: '07:30 AM', title: 'High-Protein Breakfast', completed: true },
    { id: 't3', time: '09:00 AM', title: 'Focused Work / College Session', completed: false },
    { id: 't4', time: '05:30 PM', title: 'Pre-Workout Snack & Hydration', completed: false },
    { id: 't5', time: '06:00 PM', title: 'Strength Training Session', completed: workoutsMap[selectedDate]?.length > 0 },
    { id: 't6', time: '08:00 PM', title: 'Protein-Rich Dinner', completed: false },
    { id: 't7', time: '09:30 PM', title: 'Habit Routine & Evening Reflection', completed: false },
    { id: 't8', time: '10:30 PM', title: 'Wind Down & Sleep', completed: false },
  ]);

  const [newItemTime, setNewItemTime] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleItem = (id) => {
    setScheduleItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    setScheduleItems(prev => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        time: newItemTime || '12:00 PM',
        title: newItemTitle.trim(),
        completed: false,
      }
    ]);
    setNewItemTime('');
    setNewItemTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider">AI Daily Architecture</span>
          <h3 className="font-bold text-white text-base">📅 "MY DAY" — Daily Execution Plan</h3>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs text-accent-primary font-semibold hover:underline"
        >
          {showAddForm ? '✕ Close' : '+ Custom Time Block'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddItem} className="p-3 rounded-xl bg-dark-900 border border-white/10 flex gap-2 text-xs">
          <input
            type="text"
            placeholder="Time (e.g. 03:00 PM)"
            value={newItemTime}
            onChange={(e) => setNewItemTime(e.target.value)}
            className="w-1/3 px-3 py-1.5 rounded-lg bg-dark-800 border border-white/10 text-white"
          />
          <input
            type="text"
            placeholder="Task / Event Title"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="w-2/3 px-3 py-1.5 rounded-lg bg-dark-800 border border-white/10 text-white"
          />
          <button type="submit" className="px-3 py-1.5 rounded-lg bg-accent-primary text-dark-900 font-bold">
            Add
          </button>
        </form>
      )}

      <div className="space-y-2">
        {scheduleItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              item.completed 
                ? 'bg-accent-primary/10 border-accent-primary/30 text-white' 
                : 'bg-dark-900/60 border-white/5 text-white/70 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-accent-primary w-20">{item.time}</span>
              <span className={`text-xs font-medium ${item.completed ? 'line-through text-white/50' : 'text-white'}`}>{item.title}</span>
            </div>

            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
              item.completed ? 'bg-accent-primary text-dark-900 font-bold' : 'border border-white/20 text-transparent'
            }`}>
              ✓
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
