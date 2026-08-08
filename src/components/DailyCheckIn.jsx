import { useState, useEffect } from 'react';

const MOODS = ['😞', '😕', '😐', '🙂', '🔥'];

export default function DailyCheckIn({ selectedDate, dailyRecord, onSaveMorningFocus, onSaveEveningReflection }) {
  const [morningFocus, setMorningFocus] = useState(dailyRecord?.morningFocus || '');
  const [mood, setMood] = useState(dailyRecord?.eveningReflection?.mood || '');
  const [energy, setEnergy] = useState(dailyRecord?.eveningReflection?.energy || 3);
  const [reflectionNote, setReflectionNote] = useState(dailyRecord?.eveningReflection?.note || '');
  const [isSaved, setIsSaved] = useState(false);

  // Sync state when date or record changes
  useEffect(() => {
    setMorningFocus(dailyRecord?.morningFocus || '');
    setMood(dailyRecord?.eveningReflection?.mood || '');
    setEnergy(dailyRecord?.eveningReflection?.energy || 3);
    setReflectionNote(dailyRecord?.eveningReflection?.note || '');
  }, [dailyRecord, selectedDate]);

  const handleFocusBlur = () => {
    onSaveMorningFocus(morningFocus);
    triggerSavedIndicator();
  };

  const handleReflectionSave = () => {
    onSaveEveningReflection({
      mood,
      energy,
      note: reflectionNote
    });
    triggerSavedIndicator();
  };

  const triggerSavedIndicator = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="card p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">☀️</span>
          <h3 className="font-bold text-white text-base">Daily Check-In & Journal</h3>
        </div>
        {isSaved && (
          <span className="text-xs text-emerald-400 font-semibold animate-pulse">
            ✓ Saved
          </span>
        )}
      </div>

      {/* Morning Focus */}
      <div>
        <label className="block text-xs font-semibold text-accent-primary uppercase tracking-wider mb-2">
          🌅 Morning Priority
        </label>
        <p className="text-xs text-white/50 mb-2">What is your single main focus for today?</p>
        <input
          type="text"
          placeholder="e.g., Complete project milestone & hit 3L water intake"
          value={morningFocus}
          onChange={(e) => setMorningFocus(e.target.value)}
          onBlur={handleFocusBlur}
          className="w-full px-4 py-2.5 rounded-xl bg-dark-900/90 border border-white/10 text-white placeholder-white/30 text-sm focus:border-accent-primary focus:outline-none transition-all"
        />
      </div>

      {/* Evening Reflection */}
      <div className="pt-2 border-t border-white/5 space-y-4">
        <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider">
          🌙 Evening Reflection
        </label>

        {/* Mood & Energy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="block text-xs text-white/60 mb-2">How did today feel?</span>
            <div className="flex gap-2">
              {MOODS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    mood === m 
                      ? 'bg-accent-primary text-dark-900 scale-110 font-bold shadow-glow' 
                      : 'bg-white/5 hover:bg-white/10 text-white/70'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs text-white/60 mb-2">
              <span>Energy Level</span>
              <span className="text-accent-primary font-bold">{energy} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full accent-accent-primary bg-dark-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Reflection Note */}
        <div>
          <span className="block text-xs text-white/60 mb-1">Reflection Note</span>
          <textarea
            rows="2"
            placeholder="Write a brief note on what went well or what you learned today..."
            value={reflectionNote}
            onChange={(e) => setReflectionNote(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-dark-900/90 border border-white/10 text-white placeholder-white/30 text-sm focus:border-accent-primary focus:outline-none transition-all resize-none"
          />
        </div>

        <button
          onClick={handleReflectionSave}
          className="w-full py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          Save Reflection
        </button>
      </div>

    </div>
  );
}
