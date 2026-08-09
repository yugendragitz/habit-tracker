import { memo } from 'react';

/**
 * CoachOrb Component
 * Procedural SVG/Canvas AI Energy Orb featuring glowing concentric orbits,
 * soft bloom, and dynamic breathing states:
 * - 'idle': Soft slow breathing
 * - 'thinking': Orbit rotation spin
 * - 'responding': Glowing cyan pulse
 * - 'success': Soft violet glow
 * - 'error': Muted state
 */
const CoachOrb = memo(({ state = 'idle', size = 120, className = '' }) => {
  const getOrbStateClasses = () => {
    switch (state) {
      case 'thinking':
        return 'animate-spin opacity-90 scale-105';
      case 'responding':
        return 'animate-pulse scale-110';
      case 'success':
        return 'scale-105 filter brightness-125';
      case 'error':
        return 'opacity-50 grayscale';
      default:
        return 'animate-cosmicPulse opacity-85';
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center pointer-events-none select-none ${className}`}>
      
      {/* Background Soft Glow Spotlight */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-cyan-400/30 rounded-full blur-2xl transition-all duration-700"
        style={{ width: size * 1.3, height: size * 1.3, left: -size * 0.15, top: -size * 0.15 }}
      />

      {/* SVG Energy Orb */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        className={`transform transition-all duration-700 ${getOrbStateClasses()}`}
      >
        <defs>
          <linearGradient id="orbGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="orbGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          <filter id="orbGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Orbit Line */}
        <circle cx="100" cy="100" r="85" fill="none" stroke="url(#orbGrad1)" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.6" />

        {/* Middle Orbit Line */}
        <circle cx="100" cy="100" r="65" fill="none" stroke="url(#orbGrad2)" strokeWidth="2" strokeDasharray="12 8" opacity="0.8" />

        {/* Core Glowing Sphere */}
        <circle cx="100" cy="100" r="45" fill="url(#orbGrad1)" filter="url(#orbGlow)" opacity="0.9" />

        {/* Inner Light Core */}
        <circle cx="100" cy="100" r="22" fill="#ffffff" filter="url(#orbGlow)" opacity="0.9" />
      </svg>

    </div>
  );
});

CoachOrb.displayName = 'CoachOrb';

export default CoachOrb;
