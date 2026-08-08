import { useState } from 'react';
import { HABIT_CATEGORIES } from '../utils/habits';

const ICONS = ['🌙', '🥗', '💧', '💪', '🥊', '📚', '🎯', '🧘', '🏃', '🚴', '💻', '🎨', '📝', '🧘‍♂️', '🧠', '⚡', '🔥', '🏆'];
const COLORS = ['#a78bfa', '#34d399', '#60a5fa', '#f87171', '#fb923c', '#fbbf24', '#00ffc8', '#f472b6', '#a3e635', '#e879f9'];

export default function HabitManagerModal({ habitsList, isOpen, onClose, onAddHabit, onUpdateHabit, onToggleActive, onDeleteHabit }) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add' | 'edit'
  const [editingHabit, setEditingHabit] = useState(null);

  // New habit form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('⚡');
  const [color, setColor] = useState('#00ffc8');
  const [category, setCategory] = useState('Personal');
  const [frequency, setFrequency] = useState('daily');

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setDescription('');
    setIcon('⚡');
    setColor('#00ffc8');
    setCategory('Personal');
    setFrequency('daily');
    setEditingHabit(null);
  };

  const handleStartEdit = (habit) => {
    setEditingHabit(habit);
    setName(habit.name);
    setDescription(habit.description || '');
    setIcon(habit.icon || '⚡');
    setColor(habit.color || '#00ffc8');
    setCategory(habit.category || 'Personal');
    setFrequency(habit.frequency || 'daily');
    setActiveTab('edit');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (activeTab === 'add') {
      onAddHabit({
        name: name.trim(),
        description: description.trim(),
        icon,
        color,
        category,
        frequency,
      });
    } else if (activeTab === 'edit' && editingHabit) {
      onUpdateHabit({
        ...editingHabit,
        name: name.trim(),
        description: description.trim(),
        icon,
        color,
        category,
        frequency,
      });
    }
    resetForm();
    setActiveTab('list');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="card max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              ⚙️ Manage Habits
            </h2>
            <p className="text-xs text-white/50">Add, edit, or configure your daily routine</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-white/10 px-5 pt-3 gap-3">
          <button
            onClick={() => { setActiveTab('list'); resetForm(); }}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'list' 
                ? 'border-accent-primary text-accent-primary' 
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            All Habits ({habitsList.length})
          </button>
          <button
            onClick={() => { setActiveTab('add'); resetForm(); }}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'add' 
                ? 'border-accent-primary text-accent-primary' 
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            + Add Custom Habit
          </button>
          {activeTab === 'edit' && (
            <span className="pb-3 text-sm font-semibold border-b-2 border-amber-400 text-amber-400">
              Editing: {editingHabit?.name}
            </span>
          )}
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* List View */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              {habitsList.map((habit) => (
                <div 
                  key={habit.id}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    habit.active !== false
                      ? 'bg-dark-800/80 border-white/10'
                      : 'bg-dark-900/40 border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                      style={{ backgroundColor: `${habit.color}20`, border: `1px solid ${habit.color}40` }}
                    >
                      {habit.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-sm">{habit.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                          {habit.category || 'Personal'}
                        </span>
                      </div>
                      <p className="text-xs text-white/40">{habit.description || 'No description'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleActive(habit.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        habit.active !== false
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {habit.active !== false ? 'Active' : 'Disabled'}
                    </button>
                    
                    <button
                      onClick={() => handleStartEdit(habit)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-all"
                      title="Edit Habit"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete habit "${habit.name}"? Historical data will remain.`)) {
                          onDeleteHabit(habit.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-all"
                      title="Delete Habit"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add / Edit Form */}
          {(activeTab === 'add' || activeTab === 'edit') && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Habit Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 Pages"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900/80 border border-white/10 text-white placeholder-white/30 focus:border-accent-primary focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Daily non-fiction reading"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900/80 border border-white/10 text-white placeholder-white/30 focus:border-accent-primary focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900/80 border border-white/10 text-white focus:border-accent-primary focus:outline-none text-sm"
                  >
                    {HABIT_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id} className="bg-dark-900">{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900/80 border border-white/10 text-white focus:border-accent-primary focus:outline-none text-sm"
                  >
                    <option value="daily" className="bg-dark-900">Every Day (Daily)</option>
                    <option value="weekdays" className="bg-dark-900">Weekdays (Mon-Fri)</option>
                    <option value="weekends" className="bg-dark-900">Weekends (Sat-Sun)</option>
                  </select>
                </div>
              </div>

              {/* Icon selection */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Select Icon</label>
                <div className="flex flex-wrap gap-2 p-3 bg-dark-900/60 rounded-xl border border-white/5">
                  {ICONS.map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIcon(i)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                        icon === i ? 'bg-accent-primary text-dark-900 font-bold scale-110' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color selection */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Accent Color</label>
                <div className="flex gap-2 p-3 bg-dark-900/60 rounded-xl border border-white/5">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        color === c ? 'scale-125 border-white shadow-glow' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setActiveTab('list'); resetForm(); }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-sm font-semibold bg-accent-primary text-dark-900 shadow-glow hover:brightness-110 transition-all"
                >
                  {activeTab === 'add' ? 'Create Habit' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
