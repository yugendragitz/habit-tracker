import { memo } from 'react';

/**
 * MomentumMark Component
 * Signature abstract geometric M brand mark representing forward-moving,
 * upward-thrusting progress with Electric Violet -> Cosmic Blue -> Cyan gradient glow.
 * NO container boxes, NO emojis. Crisp at all pixel dimensions (16px to 128px).
 */
const MomentumMark = memo(({ size = 32, className = '', animate = false }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`transform transition-transform hover:scale-105 duration-300 ${animate ? 'animate-fadeIn' : ''}`}
      >
        <defs>
          <linearGradient id="momentumMarkGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3CFF" />
            <stop offset="50%" stopColor="#246BFF" />
            <stop offset="100%" stopColor="#27D9FF" />
          </linearGradient>

          <filter id="markGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Upward Thrusting Left Leg */}
        <path 
          d="M8 40V16L20 32" 
          stroke="url(#momentumMarkGrad)" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          filter="url(#markGlowFilter)"
        />

        {/* Upward Thrusting Right Leg */}
        <path 
          d="M40 40V16L28 32" 
          stroke="url(#momentumMarkGrad)" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          filter="url(#markGlowFilter)"
        />

        {/* Central Peak Focus Point */}
        <circle cx="24" cy="12" r="3.5" fill="#27D9FF" filter="url(#markGlowFilter)" />
      </svg>
    </div>
  );
});

MomentumMark.displayName = 'MomentumMark';

export default MomentumMark;
