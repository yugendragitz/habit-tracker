import { useState, useEffect } from 'react';
import { AIService } from '../services/aiService';
import CoachOrb from './CoachOrb';
import CoachChat from './CoachChat';

/**
 * AICoachDashboard Master Component
 * Decluttered, peaceful digital sanctuary for AI guidance:
 * - Deep Midnight Navy base (#070812) with soft radial ambient lighting
 * - Time-aware hero greeting ("Good morning, Yugi.") -> "Here's what matters today."
 * - Breathing AI Energy Orb (CoachOrb.jsx)
 * - Single priority action focus (TODAY'S INSIGHT -> WHY THIS MATTERS -> TODAY'S MOVE)
 * - Quiet today metric summary strip
 * - "WHAT I'VE NOTICED" Pattern Cards
 * - Conversational Ask Your Coach shell
 */
export default function AICoachDashboard({ selectedDate, fullAppData, onOpenAIFoodLogger }) {
  const [loading, setLoading] = useState(true);
  const [coachData, setCoachData] = useState(null);
  const [showDailyReview, setShowDailyReview] = useState(false);
  const [showRecoveryMode, setShowRecoveryMode] = useState(false);

  // Time-aware greeting generator
  const getTimeAwareGreeting = () => {
    const hour = new Date().getHours();
    const userName = fullAppData?.user?.displayName || 'Yugi';
    if (hour < 12) return `Good morning, ${userName}.`;
    if (hour < 17) return `Good afternoon, ${userName}.`;
    if (hour < 22) return `Good evening, ${userName}.`;
    return `Wind down, ${userName}.`;
  };

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
      <div className="card p-12 text-center text-white/50 flex flex-col items-center justify-center gap-4 bg-[#070812] border-white/10 min-h-[400px]">
        <CoachOrb state="thinking" size={90} />
        <span className="text-xs font-semibold text-purple-300 animate-pulse">
          Your coach is reflecting on your recent performance...
        </span>
      </div>
    );
  }

  const { aiContext, insights = [], priorities = [], data = {} } = coachData;
  const { today, targets, stats7Day } = aiContext;

  // Single main priority action item
  const mainPriority = priorities[0] || {
    title: 'Hydration & Creatine Saturation',
    description: 'Hit 4.0L water intake for optimal muscle recovery and creatine uptake.',
    action: 'Drink 1.0L water before noon and log intake.',
    category: 'Hydration'
  };

  return (
    <div className="space-y-8 relative overflow-hidden">
      
      {/* Soft Ambient Lighting Background Field */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-purple-900/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[170px]" />
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-cyan-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 space-y-8 max-w-5xl mx-auto">

        {/* 1. HERO COACH SANCTUARY HEADER */}
        <div className="text-center space-y-4 pt-4">
          
          {/* AI Energy Orb Visual */}
          <div className="flex justify-center pb-2">
            <CoachOrb state="idle" size={130} />
          </div>

          <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block">YOUR PERSONAL COACH</span>
          
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {getTimeAwareGreeting()}
          </h1>
          
          <p className="text-sm text-white/60 font-medium">
            Here's what matters today.
          </p>

        </div>

        {/* 2. HERO AI INSIGHT & SINGLE PRIORITY CARD */}
        <div className="card p-6 sm:p-8 bg-[#0d0f19]/90 border-white/10 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Today's Main Insight */}
          <div className="space-y-2 border-b border-white/10 pb-5">
            <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block">TODAY'S INSIGHT</span>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              "{data.coachInsight || 'Your strongest days happen when your sleep, hydration, and protein targets are met consistently.'}"
            </h2>
          </div>

          {/* Why This Matters */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block">WHY THIS MATTERS</span>
            <p className="text-xs text-white/70 leading-relaxed">
              Your 7-day habit consistency is {stats7Day.habitConsistency || 80}%. Protecting your hydration and nutrition targets keeps your energy and muscle recovery at peak levels.
            </p>
          </div>

          {/* Single Clear Priority Action */}
          <div className="p-4 rounded-2xl bg-[#141827] border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block">TODAY'S MOVE</span>
              <h3 className="font-bold text-white text-sm">{mainPriority.title}</h3>
              <p className="text-xs text-white/60">{mainPriority.action || mainPriority.description}</p>
            </div>

            <button
              onClick={onOpenAIFoodLogger}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-extrabold text-xs shadow-glow hover:brightness-110 transition-all whitespace-nowrap"
            >
              ✨ AI Food Logger
            </button>
          </div>

        </div>

        {/* 3. QUIET TODAY SUMMARY STRIP */}
        <div className="card p-4 bg-[#0d0f19] border-white/10">
          <div className="flex flex-wrap items-center justify-around gap-4 text-center text-xs">
            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase block">TODAY'S HABITS</span>
              <strong className="text-white font-black text-sm">{today.completedHabits.length} Logged</strong>
            </div>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase block">WORKOUT</span>
              <strong className="text-purple-400 font-black text-sm">{today.workoutCompleted ? '✓ Logged' : '○ Pending'}</strong>
            </div>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase block">DAILY FUEL</span>
              <strong className="text-orange-400 font-black text-sm">{today.calories} / {targets.dailyCalories || 3000} kcal</strong>
            </div>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase block">HYDRATION</span>
              <strong className="text-cyan-400 font-black text-sm">{today.waterLiters.toFixed(1)} / {targets.dailyWaterLiters || 4.0} L</strong>
            </div>
          </div>
        </div>

        {/* 4. "WHAT I'VE NOTICED" PATTERN CARDS */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block pl-1">WHAT I'VE NOTICED</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(insights.length > 0 ? insights.slice(0, 3) : [
              { title: 'Sleep & Energy Link', text: 'Your highest transformation scores correlate directly with hitting your recovery target.' },
              { title: 'Workout Consistency', text: 'Logging your exercises regularly builds weekly volume progression.' },
              { title: 'Hydration Target', text: '4.0L daily water supports creatine saturation and physical stamina.' },
            ]).map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#0d0f19] border border-white/5 space-y-1.5 hover:border-purple-500/30 transition-all">
                <span className="font-mono text-[10px] font-bold text-cyan-400 block">0{idx + 1}</span>
                <h4 className="font-bold text-white text-xs">{item.title || item.type || 'Pattern Insight'}</h4>
                <p className="text-[11px] text-white/60 leading-relaxed">{item.text || item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ASK YOUR COACH CONVERSATIONAL SECTION */}
        <CoachChat fullAppData={fullAppData} />

        {/* 6. CONTEXTUAL DRAWER TOGGLES (Daily Review & Recovery Mode) */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setShowDailyReview(!showDailyReview)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold border border-white/10 transition-all"
          >
            🌙 Today's End of Day Reflection {showDailyReview ? '▲' : '▼'}
          </button>

          <button
            onClick={() => setShowRecoveryMode(!showRecoveryMode)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold border border-white/10 transition-all"
          >
            🩹 Reset / Recovery Support {showRecoveryMode ? '▲' : '▼'}
          </button>
        </div>

        {/* Expandable Daily Review Drawer */}
        {showDailyReview && (
          <div className="card p-6 bg-[#0d0f19] border-white/10 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white text-sm">🌙 TODAY'S EVENING REFLECTION</h3>
              <span className="text-xs text-purple-400 font-bold">{today.habitsScore} / 100 Daily Score</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1">
                <strong className="text-purple-300 font-bold block">✓ WHAT WENT WELL TODAY</strong>
                <p className="text-white/70">Completed {today.completedHabits.length} habits and maintained solid focus.</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                <strong className="text-amber-300 font-bold block">🎯 TOMORROW'S OPPORTUNITY</strong>
                <p className="text-white/70">Prioritize hitting full 4.0L hydration early in the afternoon.</p>
              </div>
            </div>
          </div>
        )}

        {/* Expandable Recovery Mode Drawer */}
        {showRecoveryMode && (
          <div className="card p-6 bg-[#0d0f19] border-purple-500/30 space-y-3 animate-fadeIn">
            <h3 className="font-black text-white text-sm">🩹 RESET & RECOVERY MODE</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Difficult days don't erase your long-term progress. Focus on three simple steps today: 1) Drink 1L water, 2) Complete one core habit, 3) Get quality rest tonight.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
