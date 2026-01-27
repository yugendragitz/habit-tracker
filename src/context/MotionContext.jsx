import { createContext, useContext, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Motion System - Single Source of Truth for all animations
 * 
 * Architecture:
 * - Master timeline per screen (today, monthly, yearly)
 * - Child timelines for interaction types
 * - All state changes animate from previous to new values
 * - No element appears or changes without motion
 */

// Default easing curves for consistent feel
export const EASING = {
  // Primary easing for most animations
  smooth: 'power2.out',
  // Bouncy for completions/celebrations
  bounce: 'elastic.out(1, 0.5)',
  // Sharp for quick feedback
  snap: 'power3.out',
  // Gentle for subtle changes
  gentle: 'power1.inOut',
  // Spring for physical feel
  spring: 'back.out(1.7)',
};

// Duration presets
export const DURATION = {
  instant: 0.15,
  fast: 0.25,
  normal: 0.4,
  slow: 0.6,
  page: 0.8,
};

// Stagger presets
export const STAGGER = {
  tight: 0.03,
  normal: 0.06,
  relaxed: 0.1,
  cascade: 0.15,
};

// Motion Context
const MotionContext = createContext(null);

/**
 * Motion Provider - Wraps the app and manages all animation timelines
 */
export const MotionProvider = ({ children }) => {
  // Master timelines for each screen
  const masterTimelines = useRef({
    today: null,
    monthly: null,
    yearly: null,
  });

  // Child timeline registries
  const childTimelines = useRef({
    habitInteractions: new Map(),
    progressUpdates: new Map(),
    pageTransitions: new Map(),
  });

  // Previous values store for interpolation
  const previousValues = useRef(new Map());

  // Active screen tracker
  const activeScreen = useRef('today');

  // Initialize master timeline for a screen
  const initMasterTimeline = useCallback((screen) => {
    // Kill existing timeline if any
    if (masterTimelines.current[screen]) {
      masterTimelines.current[screen].kill();
    }

    // Create new master timeline
    masterTimelines.current[screen] = gsap.timeline({
      paused: true,
      defaults: {
        ease: EASING.smooth,
        duration: DURATION.normal,
      },
    });

    return masterTimelines.current[screen];
  }, []);

  // Get or create master timeline
  const getMasterTimeline = useCallback((screen) => {
    if (!masterTimelines.current[screen]) {
      initMasterTimeline(screen);
    }
    return masterTimelines.current[screen];
  }, [initMasterTimeline]);

  // Create child timeline and register it
  const createChildTimeline = useCallback((type, id, options = {}) => {
    const timeline = gsap.timeline({
      paused: true,
      defaults: {
        ease: EASING.smooth,
        duration: DURATION.normal,
      },
      ...options,
    });

    childTimelines.current[type]?.set(id, timeline);
    return timeline;
  }, []);

  // Get child timeline
  const getChildTimeline = useCallback((type, id) => {
    return childTimelines.current[type]?.get(id);
  }, []);

  // Remove child timeline
  const removeChildTimeline = useCallback((type, id) => {
    const timeline = childTimelines.current[type]?.get(id);
    if (timeline) {
      timeline.kill();
      childTimelines.current[type].delete(id);
    }
  }, []);

  // Store previous value for interpolation
  const setPreviousValue = useCallback((key, value) => {
    previousValues.current.set(key, value);
  }, []);

  // Get previous value
  const getPreviousValue = useCallback((key, defaultValue = 0) => {
    return previousValues.current.get(key) ?? defaultValue;
  }, []);

  // Animate value from previous to new
  const animateValue = useCallback((key, newValue, onUpdate, options = {}) => {
    const prevValue = getPreviousValue(key, options.defaultValue ?? 0);
    const { duration = DURATION.normal, ease = EASING.smooth, onComplete } = options;

    // Store new value as previous for next animation
    setPreviousValue(key, newValue);

    // Animate
    return gsap.to({ value: prevValue }, {
      value: newValue,
      duration,
      ease,
      onUpdate: function() {
        onUpdate(this.targets()[0].value);
      },
      onComplete,
    });
  }, [getPreviousValue, setPreviousValue]);

  // Page transition animation
  const transitionToScreen = useCallback((fromScreen, toScreen, elements) => {
    const tl = gsap.timeline();

    // Exit animation for current screen
    if (elements.exit) {
      tl.to(elements.exit, {
        opacity: 0,
        y: -20,
        duration: DURATION.fast,
        ease: EASING.smooth,
        stagger: STAGGER.tight,
      });
    }

    // Enter animation for new screen
    if (elements.enter) {
      tl.fromTo(elements.enter,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.normal,
          ease: EASING.smooth,
          stagger: STAGGER.normal,
        },
        '-=0.1'
      );
    }

    activeScreen.current = toScreen;
    return tl;
  }, []);

  // Habit check animation sequence
  const animateHabitCheck = useCallback((elements, isChecking) => {
    const { checkbox, icon, card, glow } = elements;
    const tl = gsap.timeline();

    if (isChecking) {
      // Check animation
      tl.to(checkbox, {
        scale: 1.3,
        duration: DURATION.instant,
        ease: EASING.snap,
      })
      .to(checkbox, {
        scale: 1,
        duration: DURATION.normal,
        ease: EASING.bounce,
      })
      .to(icon, {
        scale: 1.2,
        rotation: 15,
        duration: DURATION.instant,
        ease: EASING.snap,
      }, '-=0.3')
      .to(icon, {
        scale: 1,
        rotation: 0,
        duration: DURATION.normal,
        ease: EASING.bounce,
      })
      .to(card, {
        boxShadow: '0 0 30px rgba(0, 255, 200, 0.4)',
        borderColor: 'rgba(0, 255, 200, 0.3)',
        duration: DURATION.fast,
      }, '-=0.4')
      .to(card, {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        borderColor: 'rgba(0, 255, 200, 0.15)',
        duration: DURATION.slow,
      });

      if (glow) {
        tl.to(glow, {
          opacity: 1,
          scale: 1.5,
          duration: DURATION.fast,
        }, '-=0.6')
        .to(glow, {
          opacity: 0.3,
          scale: 1,
          duration: DURATION.normal,
        });
      }
    } else {
      // Uncheck animation
      tl.to(checkbox, {
        scale: 0.9,
        duration: DURATION.instant,
        ease: EASING.snap,
      })
      .to(checkbox, {
        scale: 1,
        duration: DURATION.fast,
        ease: EASING.smooth,
      })
      .to(icon, {
        scale: 0.95,
        opacity: 0.6,
        duration: DURATION.fast,
      }, '-=0.2')
      .to(card, {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        duration: DURATION.fast,
      }, '-=0.2');

      if (glow) {
        tl.to(glow, {
          opacity: 0,
          duration: DURATION.fast,
        }, '-=0.3');
      }
    }

    return tl;
  }, []);

  // Progress ring animation
  const animateProgressRing = useCallback((ring, fromValue, toValue, circumference) => {
    const fromOffset = circumference - (fromValue / 100) * circumference;
    const toOffset = circumference - (toValue / 100) * circumference;

    return gsap.fromTo(ring,
      { strokeDashoffset: fromOffset },
      {
        strokeDashoffset: toOffset,
        duration: DURATION.slow,
        ease: EASING.smooth,
      }
    );
  }, []);

  // Progress bar animation
  const animateProgressBar = useCallback((bar, fromValue, toValue) => {
    return gsap.fromTo(bar,
      { width: `${fromValue}%` },
      {
        width: `${toValue}%`,
        duration: DURATION.normal,
        ease: EASING.smooth,
      }
    );
  }, []);

  // Stagger entrance animation
  const staggerEntrance = useCallback((elements, options = {}) => {
    const {
      y = 30,
      opacity = 0,
      scale = 0.95,
      stagger = STAGGER.normal,
      duration = DURATION.normal,
      ease = EASING.smooth,
      delay = 0,
    } = options;

    return gsap.fromTo(elements,
      { opacity, y, scale },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        ease,
        stagger,
        delay,
      }
    );
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Kill all master timelines
      Object.values(masterTimelines.current).forEach(tl => tl?.kill());
      
      // Kill all child timelines
      Object.values(childTimelines.current).forEach(map => {
        map.forEach(tl => tl?.kill());
        map.clear();
      });
    };
  }, []);

  const contextValue = {
    // Timeline management
    getMasterTimeline,
    createChildTimeline,
    getChildTimeline,
    removeChildTimeline,
    
    // Value interpolation
    setPreviousValue,
    getPreviousValue,
    animateValue,
    
    // Pre-built animations
    transitionToScreen,
    animateHabitCheck,
    animateProgressRing,
    animateProgressBar,
    staggerEntrance,
    
    // Constants
    EASING,
    DURATION,
    STAGGER,
    
    // Raw GSAP access for custom animations
    gsap,
  };

  return (
    <MotionContext.Provider value={contextValue}>
      {children}
    </MotionContext.Provider>
  );
};

/**
 * useMotion Hook - Access the motion system from any component
 */
export const useMotion = () => {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return context;
};

/**
 * useAnimatedValue Hook - Animate a value whenever it changes
 */
export const useAnimatedValue = (value, options = {}) => {
  const { animateValue, getPreviousValue, setPreviousValue } = useMotion();
  const displayValueRef = useRef(value);
  const animationRef = useRef(null);

  const animate = useCallback((newValue, onUpdate) => {
    // Kill any running animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    animationRef.current = animateValue(
      options.key || 'default',
      newValue,
      (v) => {
        displayValueRef.current = v;
        onUpdate?.(v);
      },
      options
    );

    return animationRef.current;
  }, [animateValue, options]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return { animate, displayValue: displayValueRef };
};

/**
 * useStaggerAnimation Hook - Animate multiple elements with stagger
 */
export const useStaggerAnimation = () => {
  const { staggerEntrance, STAGGER, DURATION, EASING } = useMotion();
  const animationRef = useRef(null);

  const animate = useCallback((elements, options = {}) => {
    if (animationRef.current) {
      animationRef.current.kill();
    }
    animationRef.current = staggerEntrance(elements, options);
    return animationRef.current;
  }, [staggerEntrance]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return { animate, STAGGER, DURATION, EASING };
};

export default MotionContext;
