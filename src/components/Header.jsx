import { useEffect, useRef, memo } from 'react';
import { useMotion } from '../context/MotionContext';
import { getDisplayDate, getToday } from '../utils/dateUtils';
import { getDailyQuote } from '../utils/habits';
import MomentumMark from './MomentumMark';

const Header = memo(({ userName, selectedDate, onSelectDate, currentStreak, onOpenHabitManager }) => {
  const { gsap, DURATION, EASING } = useMotion();

  const headerRef = useRef(null);
  const dateRef = useRef(null);
  const quoteRef = useRef(null);

  const today = getToday();
  const isToday = selectedDate === today;
  const quote = getDailyQuote();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = userName || 'Champion';

  // Navigate date backwards/forwards
  const handleShiftDate = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    const dateStr = current.toISOString().split('T')[0];
    onSelectDate(dateStr);
  };

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: DURATION.normal, ease: EASING.smooth }
      );
    }
  }, [gsap, DURATION, EASING]);

  return (
    <header
      ref={headerRef}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-700/90 to-dark-800/90 border border-white/10 p-6 sm:p-8 mb-6 shadow-2xl"
    >
      {/* Dynamic glow overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 space-y-6">
        
        {/* Top bar: System title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <MomentumMark size={32} />
            <div>
              <span className="text-[10px] font-bold tracking-widest text-accent-primary uppercase">
                Personal Transformation System
              </span>
              <h2 className="text-lg font-black text-white tracking-tight">
                MOMENTUM
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className="px-3.5 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center gap-1.5 text-xs font-extrabold shadow-sm">
              <span className="text-sm">🔥</span>
              <span>{currentStreak || 0} DAY STREAK</span>
            </div>

            {/* Manage Habits trigger */}
            <button
              onClick={onOpenHabitManager}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>⚙️</span>
              <span>Habits</span>
            </button>
          </div>
        </div>

        {/* Date Selector & Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div ref={dateRef}>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {getGreeting()}, <span className="text-accent-primary">{displayName}</span> 👋
            </h1>
            <p className="text-sm text-white/50 mt-1">
              {getDisplayDate(selectedDate)} {!isToday && '(Past History Mode)'}
            </p>
          </div>

          {/* Date Picker Bar */}
          <div className="flex items-center gap-2 bg-dark-900/80 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => handleShiftDate(-1)}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 text-xs transition-all"
              title="Previous Day"
            >
              ◀
            </button>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onSelectDate(e.target.value)}
              className="px-3 py-1 rounded-xl bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            />

            {!isToday ? (
              <button
                onClick={() => onSelectDate(today)}
                className="px-3 py-1 rounded-xl bg-accent-primary text-dark-900 font-bold text-xs shadow-glow transition-all"
              >
                Today
              </button>
            ) : (
              <button
                onClick={() => handleShiftDate(1)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 text-xs transition-all"
                title="Next Day"
              >
                ▶
              </button>
            )}
          </div>
        </div>

        {/* Daily Motivational Quote */}
        <div ref={quoteRef} className="pt-4 border-t border-white/5">
          <p className="text-xs sm:text-sm text-white/50 italic leading-relaxed">
            "{quote}"
          </p>
        </div>

      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;
