import { useEffect, useRef, useMemo, memo } from 'react';
import { useMotion } from '../context/MotionContext';
import { getYearHeatmapData, getShortMonthName } from '../utils/dateUtils';
import { getHabitsForYear } from '../utils/storageUtils';

/**
 * YearHeatmap Component
 * Uses motion system for coordinated cell animations
 */
const YearHeatmap = memo(({ year, habitList }) => {
  const { gsap, DURATION, EASING, STAGGER } = useMotion();
  
  const containerRef = useRef(null);
  const cellRefs = useRef([]);
  const hasAnimatedRef = useRef(false);

  const weeks = useMemo(() => getYearHeatmapData(year), [year]);
  const yearData = useMemo(() => getHabitsForYear(year), [year]);
  const totalHabits = habitList.length;

  // Calculate completion for a specific date
  const getDateCompletion = (dateString) => {
    if (!dateString) return -1;
    const dayHabits = yearData[dateString] || {};
    const completed = Object.values(dayHabits).filter(Boolean).length;
    return totalHabits > 0 ? completed / totalHabits : 0;
  };

  // Get color based on completion level
  const getCompletionColor = (completion) => {
    if (completion < 0) return 'bg-transparent';
    if (completion === 0) return 'bg-white/5 hover:bg-white/10';
    if (completion < 0.25) return 'bg-accent-primary/20 hover:bg-accent-primary/30';
    if (completion < 0.5) return 'bg-accent-primary/40 hover:bg-accent-primary/50';
    if (completion < 0.75) return 'bg-accent-primary/60 hover:bg-accent-primary/70';
    if (completion < 1) return 'bg-accent-primary/80 hover:bg-accent-primary/90';
    return 'bg-accent-primary hover:shadow-glow';
  };

  // Coordinated entrance animation
  useEffect(() => {
    if (hasAnimatedRef.current) return;

    const tl = gsap.timeline();

    // Container fades in
    tl.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: DURATION.normal, ease: EASING.smooth }
    );

    // Cells animate with wave effect
    const validCells = cellRefs.current.filter(Boolean);
    if (validCells.length > 0) {
      tl.fromTo(validCells,
        { opacity: 0, scale: 0 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: DURATION.fast, 
          stagger: 0.002,
          ease: EASING.smooth
        },
        '-=0.3'
      );
    }

    hasAnimatedRef.current = true;
  }, [gsap, DURATION, EASING]);

  // Calculate month positions for labels
  const getMonthLabels = () => {
    const labels = [];
    let currentMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstValidDay = week.find(d => d !== null);
      if (firstValidDay) {
        const month = parseInt(firstValidDay.split('-')[1]) - 1;
        if (month !== currentMonth) {
          currentMonth = month;
          labels.push({ month, weekIndex });
        }
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();
  let cellIndex = 0;

  return (
    <div ref={containerRef} style={{ opacity: 0 }} className="card p-4 sm:p-6 overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white/80">{year} Overview</h3>
        
        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-white/5" />
            <div className="w-3 h-3 rounded-sm bg-accent-primary/25" />
            <div className="w-3 h-3 rounded-sm bg-accent-primary/50" />
            <div className="w-3 h-3 rounded-sm bg-accent-primary/75" />
            <div className="w-3 h-3 rounded-sm bg-accent-primary" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Month labels */}
      <div className="relative mb-1" style={{ marginLeft: '28px' }}>
        <div className="flex">
          {monthLabels.map(({ month, weekIndex }, i) => (
            <span key={i} className="text-xs text-white/40" style={{ position: 'absolute', left: `${weekIndex * 14}px` }}>
              {getShortMonthName(month)}
            </span>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-1 mt-6">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {['', 'M', '', 'W', '', 'F', ''].map((day, i) => (
            <div key={i} className="h-3 text-[10px] text-white/30 flex items-center">{day}</div>
          ))}
        </div>

        {/* Week columns */}
        <div className="flex gap-[3px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((date, dayIndex) => {
                const completion = getDateCompletion(date);
                const isValidCell = date !== null;
                const idx = cellIndex++;
                
                return (
                  <div
                    key={dayIndex}
                    ref={el => { if (isValidCell) cellRefs.current[idx] = el; }}
                    style={{ opacity: isValidCell ? 0 : 1 }}
                    className={`w-3 h-3 rounded-sm ${getCompletionColor(completion)} ${isValidCell ? 'cursor-pointer' : ''}`}
                    title={date ? `${date}: ${Math.round(Math.max(0, completion) * 100)}%` : ''}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">Total tracked days: {Object.keys(yearData).length}</span>
          <span className="text-accent-primary">
            {(() => {
              let total = 0;
              Object.values(yearData).forEach(day => {
                total += Object.values(day).filter(Boolean).length;
              });
              return total;
            })()} habits completed
          </span>
        </div>
      </div>
    </div>
  );
});

YearHeatmap.displayName = 'YearHeatmap';

export default YearHeatmap;
