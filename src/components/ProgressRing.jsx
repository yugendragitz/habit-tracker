import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { useMotion } from '../context/MotionContext';

/**
 * ProgressRing Component
 * Uses motion system for smooth value interpolation
 */
const ProgressRing = memo(({ 
  percentage, 
  size = 200, 
  strokeWidth = 12,
  showLabel = true,
  label = 'Complete',
}) => {
  const { gsap, DURATION, EASING, setPreviousValue, getPreviousValue } = useMotion();
  
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const animationRef = useRef(null);
  const hasEnteredRef = useRef(false);
  const valueKeyRef = useRef(`ring_${Math.random().toString(36).substr(2, 9)}`);

  // Calculate ring dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Animate percentage changes
  const animateProgress = useCallback((newValue) => {
    const prevValue = getPreviousValue(valueKeyRef.current, 0);
    
    // Kill any running animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Store new value
    setPreviousValue(valueKeyRef.current, newValue);

    // Calculate stroke offsets
    const fromOffset = circumference - (prevValue / 100) * circumference;
    const toOffset = circumference - (newValue / 100) * circumference;

    // Create coordinated timeline
    const tl = gsap.timeline();

    // Animate ring stroke
    if (ringRef.current) {
      tl.fromTo(ringRef.current,
        { strokeDashoffset: fromOffset },
        { 
          strokeDashoffset: toOffset, 
          duration: DURATION.slow, 
          ease: EASING.smooth 
        },
        0
      );
    }

    // Animate number counter
    tl.to({ value: prevValue }, {
      value: newValue,
      duration: DURATION.slow,
      ease: EASING.smooth,
      onUpdate: function() {
        setDisplayPercentage(Math.round(this.targets()[0].value));
      }
    }, 0);

    animationRef.current = tl;
    return tl;
  }, [gsap, DURATION, EASING, circumference, getPreviousValue, setPreviousValue]);

  // Entrance animation
  useEffect(() => {
    if (containerRef.current && !hasEnteredRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: DURATION.normal, 
          ease: EASING.smooth,
          delay: 0.2,
          onComplete: () => {
            hasEnteredRef.current = true;
            // Animate to initial percentage after entrance
            animateProgress(percentage);
          }
        }
      );
    } else if (hasEnteredRef.current) {
      // Animate subsequent changes
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

  return (
    <div ref={containerRef} className="relative inline-flex items-center justify-center" style={{ opacity: 0 }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#00d4aa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Progress ring */}
        <circle
          ref={ringRef}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          filter="url(#glow)"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl sm:text-5xl font-bold gradient-text">
          {displayPercentage}%
        </span>
        {showLabel && (
          <span className="text-sm text-white/50 mt-1">{label}</span>
        )}
      </div>

      {/* Glow effect behind ring */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 blur-xl pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent ${100 - displayPercentage}%, rgba(0, 255, 200, 0.3) ${100 - displayPercentage}%)`,
        }}
      />
    </div>
  );
});

ProgressRing.displayName = 'ProgressRing';

export default ProgressRing;
