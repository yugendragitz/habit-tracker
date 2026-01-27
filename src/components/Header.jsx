import { useEffect, useRef, memo } from 'react';
import { useMotion } from '../context/MotionContext';
import { getDisplayDate, getToday, getCurrentMonth, getMonthName } from '../utils/dateUtils';
import { getDailyQuote } from '../utils/habits';

/**
 * Header Component
 * Uses motion system for coordinated entrance animations
 */
const Header = memo(() => {
  const { gsap, DURATION, EASING, STAGGER } = useMotion();
  
  const headerRef = useRef(null);
  const dateRef = useRef(null);
  const quoteRef = useRef(null);
  const badgeRef = useRef(null);

  const today = getToday();
  const displayDate = getDisplayDate(today);
  const currentMonth = getMonthName(getCurrentMonth());
  const quote = getDailyQuote();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Coordinated entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: EASING.smooth } });

    // Fade in container
    tl.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: DURATION.normal }
    );

    // Badge slides in
    tl.fromTo(badgeRef.current,
      { opacity: 0, x: -20, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: DURATION.fast },
      '-=0.2'
    );

    // Date section fades up
    tl.fromTo(dateRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: DURATION.normal },
      '-=0.2'
    );

    // Quote fades in last
    tl.fromTo(quoteRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: DURATION.normal },
      '-=0.15'
    );
  }, [gsap, DURATION, EASING]);

  return (
    <header 
      ref={headerRef}
      style={{ opacity: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-700/80 to-dark-800/90 border border-white/5 p-6 sm:p-8 mb-6"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Top row: Month badge and time */}
        <div className="flex items-center justify-between mb-4">
          <span 
            ref={badgeRef}
            style={{ opacity: 0 }}
            className="px-3 py-1 text-xs font-medium rounded-full bg-accent-primary/20 text-accent-primary border border-accent-primary/20"
          >
            {currentMonth} 2026
          </span>
          <span className="text-sm text-white/40">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>

        {/* Greeting and date */}
        <div ref={dateRef} style={{ opacity: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {getGreeting()} 👋
          </h1>
          <p className="text-lg sm:text-xl text-white/60">{displayDate}</p>
        </div>

        {/* Motivational quote */}
        <div ref={quoteRef} style={{ opacity: 0 }} className="mt-6 pt-6 border-t border-white/5">
          <p className="text-sm sm:text-base text-white/50 italic leading-relaxed">"{quote}"</p>
        </div>
      </div>

      {/* Animated gradient border */}
      <div 
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(0,255,200,0.1) 0%, transparent 50%, rgba(34,211,238,0.1) 100%)',
          opacity: 0.5,
        }}
      />
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
