import { useState } from 'react';

export default function WaterTrackerWidget({ selectedDate, currentWaterLiters, targetWaterLiters = 3.0, onAddWaterDelta, onUpdateWaterLog }) {
  const [isEditing, setIsEditing] = useState(false);
  const [manualInput, setManualInput] = useState(currentWaterLiters);

  const pct = Math.min(100, Math.round((currentWaterLiters / (targetWaterLiters || 3.0)) * 100));

  const handleManualSave = () => {
    onUpdateWaterLog(selectedDate, Math.max(0, Number(manualInput)));
    setIsEditing(false);
  };

  return (
    <div className="card p-5 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💧</span>
          <h3 className="font-bold text-white text-sm">Hydration & Water Log</h3>
        </div>
        <button
          onClick={() => { setIsEditing(!isEditing); setManualInput(currentWaterLiters); }}
          className="text-xs text-white/50 hover:text-white font-medium"
        >
          {isEditing ? 'Cancel' : 'Edit Target/Log'}
        </button>
      </div>

      {/* Manual Input Form */}
      {isEditing ? (
        <div className="p-3 bg-dark-900/90 rounded-xl border border-white/10 flex items-center gap-2">
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-dark-800 border border-white/10 text-white text-xs"
          />
          <span className="text-xs text-white/60 font-bold">Liters</span>
          <button
            onClick={handleManualSave}
            className="px-3 py-1.5 rounded-lg bg-accent-primary text-dark-900 font-bold text-xs shadow-glow"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-xl bg-dark-900/80 border border-white/10">
          <div>
            <span className="text-[10px] text-white/40 uppercase font-bold">Today's Intake</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-cyan-400">{currentWaterLiters.toFixed(1)}</span>
              <span className="text-xs text-white/40">/ {targetWaterLiters} Liters</span>
            </div>
            <p className="text-xs text-white/60 mt-1">
              {currentWaterLiters >= targetWaterLiters ? '🎉 Hydration Goal Achieved!' : `${(targetWaterLiters - currentWaterLiters).toFixed(1)}L remaining`}
            </p>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.1)" strokeWidth="5" fill="transparent" />
              <circle
                cx="28" cy="28" r="22"
                stroke="#22d3ee"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray="138"
                strokeDashoffset={138 - (138 * pct) / 100}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">{pct}%</span>
          </div>
        </div>
      )}

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: '+250ml', delta: 0.25 },
          { label: '+500ml', delta: 0.50 },
          { label: '+750ml', delta: 0.75 },
          { label: '+1.0L', delta: 1.00 },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={() => onAddWaterDelta(btn.delta, selectedDate)}
            className="py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 font-bold text-xs transition-all active:scale-95"
          >
            {btn.label}
          </button>
        ))}
      </div>

    </div>
  );
}
