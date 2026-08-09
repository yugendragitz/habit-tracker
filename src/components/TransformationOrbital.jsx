import { memo } from 'react';

/**
 * TransformationOrbital Component
 * Procedural SVG graphical transformation visual with concentric orbital rings
 * and 6 connected nodes (HABITS, FITNESS, NUTRITION, GOALS, PROGRESS, AI).
 */
const TransformationOrbital = memo(() => {
  const nodes = [
    { label: 'HABITS', angle: 0, color: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-500/10' },
    { label: 'FITNESS', angle: 60, color: 'text-blue-400', border: 'border-blue-500/40', bg: 'bg-blue-500/10' },
    { label: 'NUTRITION', angle: 120, color: 'text-orange-400', border: 'border-orange-500/40', bg: 'bg-orange-500/10' },
    { label: 'GOALS', angle: 180, color: 'text-pink-400', border: 'border-pink-500/40', bg: 'bg-pink-500/10' },
    { label: 'PROGRESS', angle: 240, color: 'text-cyan-400', border: 'border-cyan-500/40', bg: 'bg-cyan-500/10' },
    { label: 'AI', angle: 300, color: 'text-violet-400', border: 'border-violet-500/40', bg: 'bg-violet-500/10' },
  ];

  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center pointer-events-none select-none">
      
      {/* Background Soft Glow Spotlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-cyan-500/10 rounded-full blur-3xl" />

      {/* SVG Orbital Geometry */}
      <svg className="absolute inset-0 w-full h-full animate-[spin_60s_linear_infinite]" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3CFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#246BFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#27D9FF" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer Ring */}
        <circle cx="200" cy="200" r="170" fill="none" stroke="url(#orbitGrad)" strokeWidth="1.5" strokeDasharray="6 6" />

        {/* Middle Ring */}
        <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />

        {/* Inner Ring */}
        <circle cx="200" cy="200" r="70" fill="none" stroke="rgba(124, 60, 255, 0.25)" strokeWidth="1" />

        {/* Connecting Spokes */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x2 = 200 + 170 * Math.cos(rad);
          const y2 = 200 + 170 * Math.sin(rad);
          return (
            <line
              key={i}
              x1="200"
              y1="200"
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      {/* Central MOMENTUM Core Node */}
      <div className="relative z-10 w-24 h-24 rounded-full bg-[#0d0f19] border border-purple-500/40 shadow-glow flex flex-col items-center justify-center text-center p-2 backdrop-blur-xl">
        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
          M
        </span>
        <span className="text-[8px] font-black text-white/50 tracking-widest uppercase mt-0.5">SYSTEM</span>
      </div>

      {/* Orbiting Category Nodes */}
      <div className="absolute inset-0 z-20">
        {nodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const radius = 135; // px from center
          const x = 50 + (radius / 200) * 50 * Math.cos(rad);
          const y = 50 + (radius / 200) * 50 * Math.sin(rad);

          return (
            <div
              key={i}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full border text-[9px] font-black tracking-wider uppercase backdrop-blur-md transition-transform duration-500 hover:scale-110 ${node.color} ${node.border} ${node.bg}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {node.label}
            </div>
          );
        })}
      </div>

    </div>
  );
});

TransformationOrbital.displayName = 'TransformationOrbital';

export default TransformationOrbital;
