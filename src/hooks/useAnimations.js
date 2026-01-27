import { useRef, useEffect, useCallback } from 'react';
import { useMotion } from '../context/MotionContext';

/**
 * usePageTransition Hook
 * Manages enter/exit animations for page content
 */
export const usePageTransition = (isActive) => {
  const { gsap, DURATION, EASING, STAGGER } = useMotion();
  const containerRef = useRef(null);
  const elementsRef = useRef([]);
  const timelineRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Register an element for animation
  const registerElement = useCallback((el, index) => {
    if (el) {
      elementsRef.current[index] = el;
    }
  }, []);

  // Enter animation
  const animateEnter = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const elements = elementsRef.current.filter(Boolean);
    if (elements.length === 0) return;

    // Set initial state
    gsap.set(elements, { opacity: 0, y: 30 });

    timelineRef.current = gsap.timeline();
    
    timelineRef.current.to(elements, {
      opacity: 1,
      y: 0,
      duration: DURATION.normal,
      ease: EASING.smooth,
      stagger: STAGGER.normal,
    });

    hasAnimatedRef.current = true;
    return timelineRef.current;
  }, [gsap, DURATION, EASING, STAGGER]);

  // Exit animation
  const animateExit = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const elements = elementsRef.current.filter(Boolean);
    if (elements.length === 0) return Promise.resolve();

    return new Promise((resolve) => {
      timelineRef.current = gsap.timeline({ onComplete: resolve });
      
      timelineRef.current.to(elements, {
        opacity: 0,
        y: -20,
        duration: DURATION.fast,
        ease: EASING.smooth,
        stagger: STAGGER.tight,
      });
    });
  }, [gsap, DURATION, EASING, STAGGER]);

  // Animate on active change
  useEffect(() => {
    if (isActive && !hasAnimatedRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(animateEnter, 50);
      return () => clearTimeout(timer);
    }
    
    if (!isActive) {
      hasAnimatedRef.current = false;
    }
  }, [isActive, animateEnter]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return {
    containerRef,
    registerElement,
    animateEnter,
    animateExit,
  };
};

/**
 * useElementAnimation Hook
 * Handles individual element entrance animation
 */
export const useElementAnimation = (options = {}) => {
  const { gsap, DURATION, EASING } = useMotion();
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const timelineRef = useRef(null);

  const {
    delay = 0,
    y = 20,
    scale = 1,
    duration = DURATION.normal,
    ease = EASING.smooth,
    triggerOnMount = true,
  } = options;

  const animate = useCallback(() => {
    if (!elementRef.current || hasAnimatedRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    gsap.set(elementRef.current, { opacity: 0, y, scale: scale === 1 ? 1 : 0.95 });

    timelineRef.current = gsap.to(elementRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      ease,
      delay,
    });

    hasAnimatedRef.current = true;
    return timelineRef.current;
  }, [gsap, delay, y, scale, duration, ease]);

  const reset = useCallback(() => {
    hasAnimatedRef.current = false;
    if (elementRef.current) {
      gsap.set(elementRef.current, { opacity: 0, y });
    }
  }, [gsap, y]);

  useEffect(() => {
    if (triggerOnMount) {
      const timer = setTimeout(animate, 10);
      return () => clearTimeout(timer);
    }
  }, [triggerOnMount, animate]);

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return { ref: elementRef, animate, reset };
};

/**
 * useProgressAnimation Hook
 * Animates progress values from previous to new
 */
export const useProgressAnimation = (initialValue = 0) => {
  const { gsap, DURATION, EASING, setPreviousValue, getPreviousValue } = useMotion();
  const displayValueRef = useRef(initialValue);
  const animationRef = useRef(null);
  const keyRef = useRef(`progress_${Math.random().toString(36).substr(2, 9)}`);

  const animate = useCallback((targetValue, onUpdate, options = {}) => {
    const {
      duration = DURATION.slow,
      ease = EASING.smooth,
      onComplete,
    } = options;

    // Get previous value
    const fromValue = getPreviousValue(keyRef.current, initialValue);

    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Store new value
    setPreviousValue(keyRef.current, targetValue);

    // Animate
    animationRef.current = gsap.to({ value: fromValue }, {
      value: targetValue,
      duration,
      ease,
      onUpdate: function() {
        const currentValue = this.targets()[0].value;
        displayValueRef.current = currentValue;
        onUpdate?.(currentValue);
      },
      onComplete,
    });

    return animationRef.current;
  }, [gsap, DURATION, EASING, getPreviousValue, setPreviousValue, initialValue]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return { animate, displayValue: displayValueRef, key: keyRef.current };
};

/**
 * useListAnimation Hook
 * Handles staggered list animations
 */
export const useListAnimation = () => {
  const { gsap, DURATION, EASING, STAGGER } = useMotion();
  const itemsRef = useRef([]);
  const timelineRef = useRef(null);

  const registerItem = useCallback((el, index) => {
    if (el) {
      itemsRef.current[index] = el;
    }
  }, []);

  const animateIn = useCallback((options = {}) => {
    const {
      y = 30,
      scale = 0.95,
      stagger = STAGGER.normal,
      duration = DURATION.normal,
      ease = EASING.smooth,
      delay = 0,
    } = options;

    const items = itemsRef.current.filter(Boolean);
    if (items.length === 0) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    gsap.set(items, { opacity: 0, y, scale });

    timelineRef.current = gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      ease,
      stagger,
      delay,
    });

    return timelineRef.current;
  }, [gsap, DURATION, EASING, STAGGER]);

  const animateOut = useCallback((options = {}) => {
    const {
      y = -20,
      stagger = STAGGER.tight,
      duration = DURATION.fast,
      ease = EASING.smooth,
    } = options;

    const items = itemsRef.current.filter(Boolean);
    if (items.length === 0) return Promise.resolve();

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    return new Promise((resolve) => {
      timelineRef.current = gsap.to(items, {
        opacity: 0,
        y,
        duration,
        ease,
        stagger,
        onComplete: resolve,
      });
    });
  }, [gsap, DURATION, EASING, STAGGER]);

  const reset = useCallback(() => {
    itemsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return { registerItem, animateIn, animateOut, reset, items: itemsRef };
};

export default {
  usePageTransition,
  useElementAnimation,
  useProgressAnimation,
  useListAnimation,
};
