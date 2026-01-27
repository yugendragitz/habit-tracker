import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { useMotion } from '../context/MotionContext';

/**
 * ProgressBar Component
 * Uses motion system for smooth value interpolation
 */
const ProgressBar = memo(({ 
  percentage, 
  label, 
  showPercentage = true,
  height = 8,
  color = 'accent',
  className = ''
}) => {
  const { gsap, DURATION, EASING, setPreviousValue, getPreviousValue } = useMotion();
  
  const barRef = useRef(null);
  const containerRef = useRef(null);
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const animationRef = useRef(null);
  const hasEnteredRef = useRef(false);
  const valueKeyRef = useRef(`bar_${Math.random().toString(36).substr(2, 9)}`);

  // Animate progress changes
  const animateProgress = useCallback((newValue) => {
    const prevValue = getPreviousValue(valueKeyRef.current, 0);
    
    if (animationRef.current) {
      animationRef.current.kill();
    }

    setPreviousValue(valueKeyRef.current, newValue);

    const tl = gsap.timeline();

    // Animate bar width
    if (barRef.current) {
      tl.fromTo(barRef.current,
        { width: `${prevValue}%` },
        { 
          width: `${newValue}%`, 
          duration: DURATION.normal, 
          ease: EASING.smooth 
        },
        0
      );
    }

    // Animate number
    tl.to({ value: prevValue }, {
      value: newValue,
      duration: DURATION.normal,
      ease: EASING.smooth,
      onUpdate: function() {
        setDisplayPercentage(Math.round(this.targets()[0].value));
      }
    }, 0);

    animationRef.current = tl;
    return tl;
  }, [gsap, DURATION, EASING, getPreviousValue, setPreviousValue]);

  // Entrance and value changes
  useEffect(() => {
    if (containerRef.current && !hasEnteredRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, x: -10 },
        { 
          opacity: 1, 
          x: 0, 
          duration: DURATION.fast, 
          ease: EASING.smooth,
          onComplete: () => {
            hasEnteredRef.current = true;
            animateProgress(percentage);
          }
        }
      );
    } else if (hasEnteredRef.current) {
      animateProgress(percentage);
    }
  }, [percentage, gsap, DURATION, EASING, animateProgress]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  // Get color classes based on color prop
  const getColorClasses = () => {
    switch (color) {
      case 'purple': return 'from-purple-500 to-purple-400';
      case 'blue': return 'from-blue-500 to-blue-400';
      case 'green': return 'from-green-500 to-green-400';
      case 'orange': return 'from-orange-500 to-orange-400';
      case 'pink': return 'from-pink-500 to-pink-400';
      default: return 'from-accent-primary to-cyan-400';
    }
  };

  return (
    <div ref={containerRef} className={`w-full ${className}`} style={{ opacity: 0 }}>
      {/* Label and percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-white/70 font-medium">{label}</span>}
          {showPercentage && <span className="text-sm font-semibold text-accent-primary">{displayPercentage}%</span>}
        </div>
      )}
      
      {/* Progress track */}
      <div className="w-full rounded-full overflow-hidden bg-white/10" style={{ height: `${height}px` }}>
        {/* Progress fill */}
        <div
          ref={barRef}
          className={`h-full rounded-full bg-gradient-to-r ${getColorClasses()} relative overflow-hidden`}
          style={{ width: '0%' }}
        >
          {/* Shine effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
