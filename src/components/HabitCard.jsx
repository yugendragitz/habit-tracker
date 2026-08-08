import { useEffect, useRef, memo, useCallback } from 'react';
import { useMotion } from '../context/MotionContext';

const HabitCard = memo(({ habit, isCompleted, onToggle, index }) => {
  const { animateHabitCheck, gsap, DURATION, EASING } = useMotion();
  
  const cardRef = useRef(null);
  const checkRef = useRef(null);
  const iconRef = useRef(null);
  const glowRef = useRef(null);
  const hasEnteredRef = useRef(false);
  const prevCompletedRef = useRef(isCompleted);

  useEffect(() => {
    if (cardRef.current && !hasEnteredRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 20, scale: 0.98 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: DURATION.normal, 
          delay: Math.min(index * 0.04, 0.4),
          ease: EASING.smooth,
          onComplete: () => {
            hasEnteredRef.current = true;
          }
        }
      );
    }
  }, [gsap, DURATION, EASING, index]);

  useEffect(() => {
    if (!hasEnteredRef.current || prevCompletedRef.current === isCompleted) return;

    const elements = {
      checkbox: checkRef.current,
      icon: iconRef.current,
      card: cardRef.current,
      glow: glowRef.current,
    };

    animateHabitCheck(elements, isCompleted);
    prevCompletedRef.current = isCompleted;
  }, [isCompleted, animateHabitCheck]);

  const handleToggle = useCallback(() => {
    onToggle(habit.id);
  }, [onToggle, habit.id]);

  const accentColor = habit.color || '#00ffc8';

  return (
    <div
      ref={cardRef}
      onClick={handleToggle}
      className={`
        relative overflow-hidden rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-300
        ${isCompleted 
          ? 'bg-gradient-to-br from-dark-700/90 to-dark-800/95 border border-accent-primary/30 shadow-lg' 
          : 'bg-gradient-to-br from-dark-700/50 to-dark-800/60 border border-white/5 hover:border-white/20'
        }
        active:scale-[0.98] group
      `}
    >
      {/* Background Glow */}
      <div 
        ref={glowRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ 
          background: `radial-gradient(circle at top right, ${accentColor}20 0%, transparent 70%)`,
          opacity: isCompleted ? 0.6 : 0 
        }}
      />

      <div className="relative flex items-center gap-4 z-10">
        
        {/* Checkbox */}
        <div className="relative flex items-center justify-center">
          <input
            ref={checkRef}
            type="checkbox"
            checked={isCompleted}
            onChange={() => {}}
            className="habit-checkbox cursor-pointer"
          />
        </div>

        {/* Icon container with colored border */}
        <div 
          ref={iconRef}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-inner"
          style={{ 
            backgroundColor: isCompleted ? `${accentColor}30` : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isCompleted ? `${accentColor}60` : 'rgba(255,255,255,0.1)'}`
          }}
        >
          {habit.icon || '⚡'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-sm sm:text-base truncate ${isCompleted ? 'text-white' : 'text-white/80'}`}>
              {habit.name}
            </h3>
            {habit.category && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                {habit.category}
              </span>
            )}
          </div>
          <p className={`text-xs truncate mt-0.5 ${isCompleted ? 'text-accent-primary font-medium' : 'text-white/40'}`}>
            {habit.description || 'Daily Habit'}
          </p>
        </div>

        {/* Status Badge */}
        <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
          isCompleted 
            ? 'bg-accent-primary text-dark-900 shadow-glow' 
            : 'bg-white/5 text-white/30 group-hover:bg-white/10'
        }`}>
          {isCompleted ? '✓ DONE' : 'TO DO'}
        </div>

      </div>
    </div>
  );
});

HabitCard.displayName = 'HabitCard';
export default HabitCard;
