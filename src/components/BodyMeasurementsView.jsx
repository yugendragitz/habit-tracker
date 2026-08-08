import { useState, useMemo } from 'react';

export default function BodyMeasurementsView({ selectedDate, bodyMeasurementsMap, weightGoal, onSaveBodyMeasurement, onUpdateWeightGoal }) {
  const [weightKg, setWeightKg] = useState(bodyMeasurementsMap[selectedDate]?.weightKg || 54.0);
  const [bodyFat, setBodyFat] = useState(bodyMeasurementsMap[selectedDate]?.bodyFatPercentage || '');
  const [chestCm, setChestCm] = useState(bodyMeasurementsMap[selectedDate]?.chestCm || '');
  const [waistCm, setWaistCm] = useState(bodyMeasurementsMap[selectedDate]?.waistCm || '');
  const [armsCm, setArmsCm] = useState(bodyMeasurementsMap[selectedDate]?.armsCm || '');
  const [thighsCm, setThighsCm] = useState(bodyMeasurementsMap[selectedDate]?.thighsCm || '');

  // Weight goal config modal state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [currentW, setCurrentW] = useState(weightGoal.currentWeightKg || 54.0);
  const [targetW, setTargetW] = useState(weightGoal.targetWeightKg || 65.0);
  const [targetD, setTargetD] = useState(weightGoal.targetDate || '2026-12-31');

  // Sorted list of historical body measurement logs
  const measurementHistory = useMemo(() => {
    const list = [];
    Object.entries(bodyMeasurementsMap || {}).forEach(([dStr, rec]) => {
      if (rec.weightKg) {
        list.push({ dateStr: dStr, ...rec });
      }
    });
    return list.sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr));
  }, [bodyMeasurementsMap]);

  const latestWeight = measurementHistory.length > 0 
    ? measurementHistory[measurementHistory.length - 1].weightKg 
    : (weightGoal.currentWeightKg || 54.0);

  // Weight goal progress calculation
  const goalStart = weightGoal.currentWeightKg || 54.0;
  const goalTarget = weightGoal.targetWeightKg || 65.0;
  const isGaining = goalTarget > goalStart;

  const totalDiff = Math.abs(goalTarget - goalStart);
  const currentDiff = isGaining ? (latestWeight - goalStart) : (goalStart - latestWeight);
  const weightProgressPct = totalDiff > 0 ? Math.min(100, Math.max(0, Math.round((currentDiff / totalDiff) * 100))) : 100;

  const handleSaveLog = (e) => {
    e.preventDefault();
    onSaveBodyMeasurement(selectedDate, {
      weightKg: Number(weightKg) || null,
      bodyFatPercentage: bodyFat ? Number(bodyFat) : null,
      chestCm: chestCm ? Number(chestCm) : null,
      waistCm: waistCm ? Number(waistCm) : null,
      armsCm: armsCm ? Number(armsCm) : null,
      thighsCm: thighsCm ? Number(thighsCm) : null,
    });
    alert(`Saved body metrics for ${selectedDate}`);
  };

  const handleSaveGoalSubmit = (e) => {
    e.preventDefault();
    onUpdateWeightGoal({
      currentWeightKg: Number(currentW),
      targetWeightKg: Number(targetW),
      targetDate: targetD,
    });
    setShowGoalModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="card p-6 bg-gradient-to-br from-dark-800/90 to-dark-700/80 border-accent-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-accent-primary uppercase tracking-widest">Body Composition & Weight Goals</span>
          <h2 className="text-xl font-extrabold text-white mt-1">📐 Physical Body Tracker</h2>
          <p className="text-xs text-white/60 mt-1">Track body weight, body fat %, circumferences, and progress toward target goals.</p>
        </div>

        <button
          onClick={() => setShowGoalModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-accent-primary text-dark-900 shadow-glow hover:brightness-110 transition-all"
        >
          ⚙️ Edit Weight Goal
        </button>
      </div>

      {/* Target Weight Goal Progress Bar (54kg ━━━━━━━░░░ 65kg) */}
      <div className="card p-6 space-y-4 bg-gradient-to-br from-dark-800/90 to-dark-700/80 border-accent-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider">Weight Goal Milestone</span>
            <h3 className="text-lg font-bold text-white mt-0.5">Target: {goalTarget} kg</h3>
          </div>
          <span className="text-xs text-accent-primary font-extrabold">{weightProgressPct}% Achieved</span>
        </div>

        {/* Visual Progress Line */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-white/60">Start: {goalStart} kg</span>
            <span className="text-accent-primary font-black">Latest: {latestWeight} kg</span>
            <span className="text-white/60">Target: {goalTarget} kg</span>
          </div>

          <div className="w-full h-3 rounded-full bg-dark-900 overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-accent-primary via-cyan-400 to-emerald-400 rounded-full transition-all duration-700 shadow-glow"
              style={{ width: `${Math.max(5, weightProgressPct)}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] text-white/40 italic text-right">
          Goal Target Date: {weightGoal.targetDate || 'December 2026'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form to log measurements for selected date */}
        <form onSubmit={handleSaveLog} className="card p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Log Metrics ({selectedDate})</h3>

          <div>
            <label className="block text-xs text-white/70 mb-1">Body Weight (kg) *</label>
            <input
              type="number"
              step="0.1"
              required
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-white/70 mb-1">Body Fat Percentage (%)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 15.5"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] text-white/60 mb-1">Chest (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 98"
                value={chestCm}
                onChange={(e) => setChestCm(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-dark-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-white/60 mb-1">Waist (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 80"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-dark-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-white/60 mb-1">Arms (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 35"
                value={armsCm}
                onChange={(e) => setArmsCm(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-dark-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-white/60 mb-1">Thighs (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 55"
                value={thighsCm}
                onChange={(e) => setThighsCm(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-dark-900 border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-accent-primary text-dark-900 font-extrabold text-xs shadow-glow"
          >
            Save Body Measurement Log
          </button>
        </form>

        {/* Right Column: Weight Trend Graph & History Log */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Weight Progression Line Graph */}
          <div className="card p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Weight Progression History</h3>

            {measurementHistory.length === 0 ? (
              <div className="p-8 text-center text-white/40 text-xs">
                No body measurements logged yet. Log your weight to generate historical progression graphs.
              </div>
            ) : (
              <div className="h-40 flex items-end gap-2 border-b border-white/10 pb-2 pt-4">
                {measurementHistory.map((item, idx) => {
                  const maxW = Math.max(...measurementHistory.map(m => m.weightKg), 1);
                  const hPct = (item.weightKg / maxW) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative">
                      <div
                        className="w-full max-w-8 bg-gradient-to-t from-accent-primary/50 to-cyan-400 rounded-t-md hover:brightness-125 transition-all"
                        style={{ height: `${Math.max(20, hPct)}%` }}
                      />
                      <span className="text-[10px] text-white/40 mt-1">{item.dateStr.split('-').slice(1).join('/')}</span>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 bg-dark-900 border border-white/10 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.dateStr}: {item.weightKg} kg {item.bodyFatPercentage ? `(${item.bodyFatPercentage}% BF)` : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Historical Records List */}
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Measurement History</h3>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {measurementHistory.map(rec => (
                <div key={rec.dateStr} className="p-3 rounded-xl bg-dark-900/60 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{rec.dateStr}</span>
                    <span className="text-accent-primary font-bold ml-3">{rec.weightKg} kg</span>
                    {rec.bodyFatPercentage && <span className="text-white/50 ml-2">({rec.bodyFatPercentage}% BF)</span>}
                  </div>

                  <div className="flex gap-2 text-[10px] text-white/40">
                    {rec.chestCm && <span>Chest: {rec.chestCm}cm</span>}
                    {rec.waistCm && <span>Waist: {rec.waistCm}cm</span>}
                    {rec.armsCm && <span>Arms: {rec.armsCm}cm</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Goal Config Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="card max-w-md w-full p-6 space-y-4 border-white/10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">Configure Weight Goal</h3>
              <button onClick={() => setShowGoalModal(false)} className="text-white/50 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveGoalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Starting / Baseline Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentW}
                  onChange={(e) => setCurrentW(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Target Weight Goal (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetW}
                  onChange={(e) => setTargetW(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Target Deadline Date</label>
                <input
                  type="date"
                  value={targetD}
                  onChange={(e) => setTargetD(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent-primary text-dark-900 font-bold shadow-glow"
                >
                  Save Weight Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
