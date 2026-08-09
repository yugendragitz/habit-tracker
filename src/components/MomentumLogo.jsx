import { memo } from 'react';

/**
 * MomentumLogo Component
 * Abstract vector M brand mark featuring upward-thrusting geometric strokes
 * with Electric Violet to Cyan gradient glow.
 */
const MomentumLogo = memo(({ size = 32, className = '' }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform hover:scale-105 duration-300"
      >
        <defs>
          <linearGradient id="momentumGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3CFF" />
            <stop offset="50%" stopColor="#246BFF" />
            <stop offset="100%" stopColor="#27D9FF" />
          </linearGradient>

          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Upward Thrusting Left Leg */}
        <path 
          d="M8 40V16L20 32" 
          stroke="url(#momentumGradient)" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          filter="url(#logoGlow)"
        />

        {/* Upward Thrusting Right Leg */}
        <path 
          d="M40 40V16L28 32" 
          stroke="url(#momentumGradient)" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          filter="url(#logoGlow)"
        />

        {/* Central Peak Accent */}
        <circle cx="24" cy="12" r="3" fill="#27D9FF" filter="url(#logoGlow)" />
      </svg>
    </div>
  );
});

MomentumLogo.displayName = 'MomentumLogo';

export default MomentumLogo;
