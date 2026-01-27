import { useEffect, useRef, memo, useCallback } from 'react';
import { useMotion } from '../context/MotionContext';

/**
 * HabitCard Component
 * Uses centralized motion system for all animations
 */
const HabitCard = memo(({ habit, isCompleted, onToggle, index, onAnimationComplete }) => {
  const { animateHabitCheck, gsap, DURATION, EASING } = useMotion();
  
  const cardRef = useRef(null);
  const checkRef = useRef(null);
  const iconRef = useRef(null);
  const glowRef = useRef(null);
  const hasEnteredRef = useRef(false);
  const prevCompletedRef = useRef(isCompleted);

  // Entrance animation - only runs once
  useEffect(() => {
    if (cardRef.current && !hasEnteredRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: DURATION.normal, 
          delay: index * 0.06,
          ease: EASING.smooth,
          onComplete: () => {
            hasEnteredRef.current = true;
          }
        }
      );
    }
  }, [gsap, DURATION, EASING, index]);

  // Animate state changes (not initial render)
  useEffect(() => {
    // Skip if this is initial render or value hasn't changed
    if (!hasEnteredRef.current) return;
    if (prevCompletedRef.current === isCompleted) return;

    const elements = {
      checkbox: checkRef.current,
      icon: iconRef.current,
      card: cardRef.current,
      glow: glowRef.current,
    };

    // Animate the state change
    const tl = animateHabitCheck(elements, isCompleted);
    
    if (onAnimationComplete) {
      tl.eventCallback('onComplete', onAnimationComplete);
    }

    prevCompletedRef.current = isCompleted;
  }, [isCompleted, animateHabitCheck, onAnimationComplete]);

  // Handle toggle with immediate visual feedback
  const handleToggle = useCallback(() => {
    onToggle(habit.id);
  }, [onToggle, habit.id]);

  return (
    <div
      ref={cardRef}
      onClick={handleToggle}
      style={{ opacity: 0 }}
      className={`
        relative overflow-hidden rounded-2xl p-4 sm:p-5 cursor-pointer
        ${isCompleted 
          ? 'bg-gradient-to-br from-dark-700/80 to-dark-800/90 border border-accent-primary/20' 
          : 'bg-gradient-to-br from-dark-700/60 to-dark-800/70 border border-white/5'
        }
        hover:border-accent-primary/30
        active:scale-[0.98]
        group
      `}
    >
      {/* Glow effect layer */}
      <div 
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-transparent pointer-events-none"
        style={{ opacity: isCompleted ? 0.3 : 0 }}
      />

      <div className="relative flex items-center gap-4">
        {/* Checkbox */}
        <div className="relative">
          <input
            ref={checkRef}
            type="checkbox"
            checked={isCompleted}
            onChange={() => {}}
            className="habit-checkbox"
          />
          {/* Checkbox glow */}
          <div 
            className={`
              absolute inset-0 rounded-lg bg-accent-primary/30 blur-md pointer-events-none
              ${isCompleted ? 'opacity-100' : 'opacity-0'}
            `}
          />
        </div>

        {/* Icon */}
        <div 
          ref={iconRef}
          className="text-2xl sm:text-3xl"
          style={{ 
            opacity: isCompleted ? 1 : 0.6,
            filter: isCompleted ? 'saturate(1)' : 'saturate(0.5)'
          }}
        >
          {habit.icon}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm sm:text-base ${isCompleted ? 'text-white' : 'text-white/80'}`}>
            {habit.name}
          </h3>
          <p className={`text-xs sm:text-sm truncate ${isCompleted ? 'text-accent-primary/80' : 'text-white/40'}`}>
            {habit.description}
          </p>
        </div>

        {/* Status indicator */}
        <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-accent-primary shadow-glow' : 'bg-white/20'}`} />
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
    </div>
  );
});

HabitCard.displayName = 'HabitCard';

export default HabitCard;
