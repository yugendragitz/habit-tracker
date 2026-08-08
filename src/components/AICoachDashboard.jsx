import { useState, useEffect } from 'react';
import { AIService } from '../services/aiService';
import SmartDailyPlan from './SmartDailyPlan';
import CoachChat from './CoachChat';

export default function AICoachDashboard({ selectedDate, fullAppData, onOpenAIFoodLogger }) {
  const [loading, setLoading] = useState(true);
  const [coachData, setCoachData] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('briefing');

  useEffect(() => {
    let isMounted = true;
    const fetchCoach = async () => {
      setLoading(true);
      const res = await AIService.requestCoachAction('briefing', fullAppData);
      if (isMounted) {
        setCoachData(res);
        setLoading(false);
      }
    };
    fetchCoach();
    return () => { isMounted = false; };
  }, [selectedDate, fullAppData]);

  if (loading || !coachData) {
    return (
      <div className="card p-12 text-center text-white/50 flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
        <span className="text-xs">Analyzing your real habits, workouts, and macro trends...</span>
      </div>
    );
  }

  const { aiContext, insights = [], priorities = [], data = {} } = coachData;
  const { today, targets, stats7Day, stats30Day, weightProgress } = aiContext;

  // Recovery logic check: If last 3 days had low completion
  const isRecoveryMode = stats7Day.activeDays <= 3;

  return (
    <div className="space-y-6">
      
      {/* Top AI Coach Banner */}
      <div className="card p-6 bg-gradient-to-br from-dark-800/95 via-dark-800/90 to-dark-700/80 border-accent-primary/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-primary to-cyan-400 text-dark-900 font-black text-2xl flex items-center justify-center shadow-glow">
            🤖
          </div>
          <div>
            <span className="text-xs font-bold text-accent-primary uppercase tracking-widest">Personal Transformation AI</span>
            <h2 className="text-2xl font-black text-white mt-0.5">{data.greeting || `GOOD MORNING, ${(aiContext.user?.name || 'YUGI').toUpperCase()}`}</h2>
            <p className="text-xs text-white/60 mt-1">{data.coachInsight || 'Your consistency is driven by sleep, protein, and water targets.'}</p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAIFoodLogger}
            className="px-4 py-2 rounded-xl bg-accent-primary text-dark-900 font-extrabold text-xs shadow-glow hover:brightness-110 transition-all"
          >
            ✨ AI Food Logger
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { id: 'briefing', label: '🌅 Morning Briefing' },
          { id: 'review', label: '🌙 Daily Review' },
          { id: 'chat', label: '💬 Ask Your Coach' },
          { id: 'insights', label: '💡 Pattern Insights' },
          { id: 'plan', label: '📅 "My Day" Schedule' },
          { id: 'recovery', label: '🩹 Recovery Mode' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSubTab === tab.id
                ? 'bg-accent-primary text-dark-900 shadow-glow font-black'
                : 'bg-dark-800/80 text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MORNING BRIEFING */}
      {activeSubTab === 'briefing' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Yesterday Summary Banner */}
            <div className="card p-5 space-y-3 bg-dark-800/90 border-white/10">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Yesterday & Recent Baseline</span>
              <p className="text-xs text-white/80 leading-relaxed">{data.summary}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-white/40 font-bold block">7-Day Consistency</span>
                  <strong className="text-accent-primary font-black text-base">{stats7Day.habitConsistency}%</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-white/40 font-bold block">Workouts (7d)</span>
                  <strong className="text-white font-black text-base">{stats7Day.workoutCount} Sessions</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-white/40 font-bold block">Avg Calories</span>
                  <strong className="text-emerald-400 font-black text-base">{stats7Day.avgCalories} kcal</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-white/40 font-bold block">Avg Water</span>
                  <strong className="text-cyan-400 font-black text-base">{stats7Day.avgWater} L</strong>
                </div>
              </div>
            </div>

            {/* Deterministic Priority Engine List */}
            <div className="card p-6 space-y-4 border-accent-primary/20">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>🥇</span>
                <span>YOUR TOP 3 PRIORITIES TODAY</span>
              </h3>

              <div className="space-y-3">
                {priorities.map(p => (
                  <div key={p.rank} className="p-4 rounded-xl bg-dark-900 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-accent-primary">Priority #{p.rank} • {p.category}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-primary/20 text-accent-primary font-bold">Action Item</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{p.title}</h4>
                    <p className="text-xs text-white/60">{p.reason}</p>
                    <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary font-semibold text-xs mt-2">
                      👉 {p.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Motivation & Target Benchmarks */}
          <div className="space-y-6">
            
            {/* Motivational Encouragement Card */}
            <div className="card p-6 bg-gradient-to-br from-accent-primary/10 via-purple-500/10 to-cyan-500/10 border-accent-primary/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <h3 className="font-bold text-white text-sm">Contextual Motivation</h3>
              </div>
              <p className="text-xs text-white/80 italic leading-relaxed">
                "{data.motivation || 'Consistency is built day by day. Execute today’s top priorities!'}"
              </p>
            </div>

            {/* Target Benchmarks Card */}
            <div className="card p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Today's Target Benchmarks</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-dark-900 border border-white/5">
                  <span className="text-white/60">Calories Target</span>
                  <span className="font-bold text-white">{targets.dailyCalories} kcal</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-dark-900 border border-white/5">
                  <span className="text-white/60">Protein Target</span>
                  <span className="font-bold text-emerald-400">{targets.dailyProteinGrams}g</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-dark-900 border border-white/5">
                  <span className="text-white/60">Water Intake Target</span>
                  <span className="font-bold text-cyan-400">{targets.dailyWaterLiters || 4.0} Liters</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-dark-900 border border-white/5">
                  <span className="text-white/60">Target Weight Milestone</span>
                  <span className="font-bold text-accent-primary">{weightProgress.target} kg</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: DAILY REVIEW */}
      {activeSubTab === 'review' && (
        <div className="card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-accent-primary uppercase tracking-widest">End of Day Reflection</span>
              <h3 className="text-xl font-bold text-white mt-0.5">🌙 TODAY'S REVIEW — {selectedDate}</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-accent-primary">{today.habitsScore} / 100</span>
              <span className="text-xs text-white/40 block">Daily Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                <span>✓</span>
                <span>WHAT WENT WELL TODAY</span>
              </h4>
              <ul className="text-xs text-white/80 space-y-1 list-disc list-inside">
                <li>Completed {today.completedHabits.length} of {aiContext.today.completedHabits.length + aiContext.today.missedHabits.length} habits.</li>
                {today.workoutCompleted && <li>Logged workout with {today.workoutVolume.toLocaleString()} kg total volume.</li>}
                {today.protein >= targets.dailyProteinGrams && <li>Hit daily protein target ({today.protein}g).</li>}
                {today.waterLiters >= (targets.dailyWaterLiters || 4.0) && <li>Hit 4.0L hydration goal!</li>}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <span>✗</span>
                <span>AREAS FOR TOMORROW'S FOCUS</span>
              </h4>
              <ul className="text-xs text-white/80 space-y-1 list-disc list-inside">
                {today.missedHabits.map((h, i) => (
                  <li key={i}>Missed habit: {h}</li>
                ))}
                {today.protein < targets.dailyProteinGrams && <li>Protein intake was {today.protein}g vs {targets.dailyProteinGrams}g target.</li>}
                {today.waterLiters < (targets.dailyWaterLiters || 4.0) && <li>Hydration was {today.waterLiters}L vs {targets.dailyWaterLiters || 4.0}L target.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COACH CHAT */}
      {activeSubTab === 'chat' && (
        <CoachChat fullAppData={fullAppData} />
      )}

      {/* TAB 4: PATTERN INSIGHTS */}
      {activeSubTab === 'insights' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Automated Data Insights ({insights.length})</h3>

          {insights.length === 0 ? (
            <div className="card p-8 text-center text-white/40 text-xs">
              No pattern anomalies detected yet. Continue logging daily habits to generate data insights!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((item, idx) => (
                <div key={idx} className="card p-5 space-y-2 border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <span className="text-[10px] text-accent-primary uppercase font-bold">{item.type}</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: MY DAY PLAN */}
      {activeSubTab === 'plan' && (
        <SmartDailyPlan 
          selectedDate={selectedDate} 
          workoutsMap={fullAppData.workoutsMap} 
          activeHabits={aiContext.today.completedHabits} 
        />
      )}

      {/* TAB 6: RECOVERY MODE */}
      {activeSubTab === 'recovery' && (
        <div className="card p-6 bg-gradient-to-br from-purple-950/30 to-dark-800 border-purple-500/30 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <span className="text-3xl">🩹</span>
            <div>
              <h3 className="font-bold text-white text-base">Non-Punitive Recovery Protocol</h3>
              <p className="text-xs text-white/60">Missed days happen. Never over-compensate — restart cleanly with 3 steps.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-dark-900 border border-white/10 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-accent-primary text-dark-900 font-extrabold flex items-center justify-center text-xs">1</span>
              <div>
                <strong className="text-white block">Hydration (4.0L Water Target)</strong>
                <span className="text-white/50">Re-hydrate immediately to restore mental clarity and physical energy.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-dark-900 border border-white/10 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-accent-primary text-dark-900 font-extrabold flex items-center justify-center text-xs">2</span>
              <div>
                <strong className="text-white block">Protein & Nutrition Reset</strong>
                <span className="text-white/50">Hit your 3000 kcal & 130g protein target without skipping meals.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-dark-900 border border-white/10 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-accent-primary text-dark-900 font-extrabold flex items-center justify-center text-xs">3</span>
              <div>
                <strong className="text-white block">Execute 1 Core Workout Session</strong>
                <span className="text-white/50">Complete just 1 workout session to rebuild momentum instantly.</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
