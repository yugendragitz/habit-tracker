import { useEffect, useRef, useMemo, memo } from 'react';
import { useMotion } from '../context/MotionContext';
import { getLastNDays } from '../utils/dateUtils';
import { getCompletionForDate } from '../utils/storageUtils';

/**
 * DailyChart Component
 * Uses motion system for coordinated chart animations
 */
const DailyChart = memo(({ habitList, days = 14, height = 160, showLabels = true }) => {
  const { gsap, DURATION, EASING, STAGGER } = useMotion();
  
  const chartRef = useRef(null);
  const pathRef = useRef(null);
  const barsRef = useRef([]);
  const dotsRef = useRef([]);
  const hasAnimatedRef = useRef(false);

  const totalHabits = habitList.length;
  
  // Get data for last N days
  const chartData = useMemo(() => {
    const dates = getLastNDays(days);
    return dates.map(date => ({
      date,
      label: date.slice(-2),
      value: getCompletionForDate(date, totalHabits)
    }));
  }, [days, totalHabits]);

  // Calculate chart dimensions
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartHeight = height - padding.top - padding.bottom;

  // Generate SVG path for line chart
  const generatePath = () => {
    if (chartData.length === 0) return '';
    
    const xStep = 100 / (chartData.length - 1);
    
    const points = chartData.map((d, i) => ({
      x: i * xStep,
      y: chartHeight - (d.value / 100) * chartHeight
    }));

    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  // Coordinated entrance animation
  useEffect(() => {
    if (hasAnimatedRef.current) return;

    const tl = gsap.timeline();

    // Container fades in
    tl.fromTo(chartRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: DURATION.normal, ease: EASING.smooth }
    );

    // Bars animate up
    const validBars = barsRef.current.filter(Boolean);
    if (validBars.length > 0) {
      tl.fromTo(validBars,
        { scaleY: 0 },
        { 
          scaleY: 1, 
          duration: DURATION.normal, 
          stagger: STAGGER.tight,
          ease: EASING.smooth,
          transformOrigin: 'bottom'
        },
        '-=0.2'
      );
    }

    // Path draws in
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      tl.fromTo(pathRef.current,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: DURATION.page, ease: EASING.smooth },
        '-=0.4'
      );
    }

    // Dots pop in
    const validDots = dotsRef.current.filter(Boolean);
    if (validDots.length > 0) {
      tl.fromTo(validDots,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: DURATION.fast, 
          stagger: STAGGER.tight,
          ease: EASING.bounce
        },
        '-=0.5'
      );
    }

    hasAnimatedRef.current = true;
  }, [gsap, DURATION, EASING, STAGGER]);

  const barWidth = 100 / chartData.length - 2;

  return (
    <div ref={chartRef} style={{ opacity: 0 }} className="card p-4 sm:p-5">
      <h3 className="font-semibold text-white/80 mb-4">Last {days} Days Progress</h3>

      <div className="relative" style={{ height: `${height}px` }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ffc8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00ffc8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00ffc8" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value, i) => {
            const y = padding.top + chartHeight - (value / 100) * chartHeight;
            return (
              <g key={i}>
                <line x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                {showLabels && (
                  <text x="-2" y={y + 1} fill="rgba(255,255,255,0.3)" fontSize="3" textAnchor="end" dominantBaseline="middle">
                    {value}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Bars */}
          {chartData.map((d, i) => {
            const barHeight = (d.value / 100) * chartHeight;
            const x = (i / chartData.length) * 100 + 1;
            const y = padding.top + chartHeight - barHeight;
            
            return (
              <rect
                key={i}
                ref={el => barsRef.current[i] = el}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#chartGradient)"
                rx="1"
                style={{ transformOrigin: `${x + barWidth/2}px ${padding.top + chartHeight}px` }}
                className="cursor-pointer hover:fill-accent-primary/40"
              />
            );
          })}

          {/* Line chart */}
          <g transform={`translate(${barWidth / 2}, ${padding.top})`}>
            <path
              ref={pathRef}
              d={generatePath()}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 100;
              const y = chartHeight - (d.value / 100) * chartHeight;
              
              return (
                <g key={i}>
                  <circle
                    ref={el => dotsRef.current[i] = el}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill="#00ffc8"
                    style={{ opacity: 0 }}
                  />
                  <circle cx={x} cy={y} r="3" fill="transparent" className="cursor-pointer">
                    <title>{d.date}: {Math.round(d.value)}%</title>
                  </circle>
                </g>
              );
            })}
          </g>

          {/* X-axis labels */}
          {showLabels && chartData.map((d, i) => {
            const x = (i / chartData.length) * 100 + barWidth / 2 + 1;
            if (days > 14 && i % 2 !== 0) return null;
            
            return (
              <text key={i} x={x} y={height - 5} fill="rgba(255,255,255,0.4)" fontSize="2.5" textAnchor="middle">
                {d.label}
              </text>
            );
          })}
        </svg>

        {/* Average line indicator */}
        {(() => {
          const avg = chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length;
          const y = padding.top + chartHeight - (avg / 100) * chartHeight;
          
          return (
            <div 
              className="absolute left-0 right-0 border-t border-dashed border-accent-primary/30 pointer-events-none"
              style={{ top: `${y}px` }}
            >
              <span className="absolute right-0 -top-4 text-xs text-accent-primary/60">Avg: {Math.round(avg)}%</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
});

DailyChart.displayName = 'DailyChart';

export default DailyChart;
