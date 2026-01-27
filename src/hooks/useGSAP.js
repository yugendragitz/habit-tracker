import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Custom hook for GSAP animations
 * Provides reusable animation utilities
 */
export const useGSAP = () => {
  const animationRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  // Fade in animation
  const fadeIn = (element, options = {}) => {
    const { duration = 0.6, delay = 0, y = 20, ease = 'power3.out' } = options;
    
    return gsap.fromTo(element, 
      { opacity: 0, y },
      { opacity: 1, y: 0, duration, delay, ease }
    );
  };

  // Stagger animation for multiple elements
  const staggerIn = (elements, options = {}) => {
    const { duration = 0.5, stagger = 0.1, y = 30, ease = 'power3.out' } = options;
    
    return gsap.fromTo(elements,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration, stagger, ease }
    );
  };

  // Scale bounce animation (for checkboxes)
  const scaleBounce = (element, options = {}) => {
    const { scale = 1.2, duration = 0.3 } = options;
    
    return gsap.timeline()
      .to(element, { scale, duration: duration / 2, ease: 'power2.out' })
      .to(element, { scale: 1, duration: duration / 2, ease: 'elastic.out(1, 0.5)' });
  };

  // Progress animation (for bars and rings)
  const animateProgress = (element, fromValue, toValue, options = {}) => {
    const { duration = 0.8, ease = 'power2.out', onUpdate } = options;
    
    return gsap.to({ value: fromValue }, {
      value: toValue,
      duration,
      ease,
      onUpdate: function() {
        if (onUpdate) onUpdate(this.targets()[0].value);
      }
    });
  };

  // Glow pulse animation
  const glowPulse = (element, options = {}) => {
    const { duration = 0.4, intensity = '0 0 30px rgba(0, 255, 200, 0.6)' } = options;
    
    return gsap.timeline()
      .to(element, { boxShadow: intensity, duration: duration / 2 })
      .to(element, { boxShadow: '0 0 20px rgba(0, 255, 200, 0.3)', duration: duration / 2 });
  };

  // Shake animation (for errors)
  const shake = (element, options = {}) => {
    const { duration = 0.5, intensity = 5 } = options;
    
    return gsap.timeline()
      .to(element, { x: -intensity, duration: 0.1 })
      .to(element, { x: intensity, duration: 0.1 })
      .to(element, { x: -intensity, duration: 0.1 })
      .to(element, { x: intensity, duration: 0.1 })
      .to(element, { x: 0, duration: 0.1 });
  };

  // Counter animation
  const animateCounter = (element, fromValue, toValue, options = {}) => {
    const { duration = 1, ease = 'power2.out', suffix = '', decimals = 0 } = options;
    
    return gsap.to({ value: fromValue }, {
      value: toValue,
      duration,
      ease,
      onUpdate: function() {
        const current = this.targets()[0].value;
        element.textContent = current.toFixed(decimals) + suffix;
      }
    });
  };

  return {
    fadeIn,
    staggerIn,
    scaleBounce,
    animateProgress,
    glowPulse,
    shake,
    animateCounter,
    gsap,
  };
};

export default useGSAP;
