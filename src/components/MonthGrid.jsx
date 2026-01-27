import { useEffect, useRef, memo, useMemo } from 'react';
import { useMotion } from '../context/MotionContext';
import { getShortMonthName, getDaysInMonth } from '../utils/dateUtils';
import { getHabitsForMonth } from '../utils/storageUtils';

/**
 * MonthGrid Component
 * Uses motion system for coordinated cell animations
 */
const MonthGrid = memo(({ year, month, habitList, isCurrentMonth = false }) => {
  const { gsap, DURATION, EASING, STAGGER } = useMotion();
  
  const gridRef = useRef(null);
  const cellRefs = useRef([]);
  const hasAnimatedRef = useRef(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthData = useMemo(() => getHabitsForMonth(year, month), [year, month]);
  const totalHabits = habitList.length;

  // Calculate completion for each day
  const getDayCompletion = (day) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayHabits = monthData[dateKey] || {};
    const completed = Object.values(dayHabits).filter(Boolean).length;
    return totalHabits > 0 ? completed / totalHabits : 0;
  };

  // Get color intensity based on completion
  const getCompletionColor = (completion) => {
    if (completion === 0) return 'bg-white/5';
    if (completion < 0.25) return 'bg-accent-primary/20';
    if (completion < 0.5) return 'bg-accent-primary/40';
    if (completion < 0.75) return 'bg-accent-primary/60';
    if (completion < 1) return 'bg-accent-primary/80';
    return 'bg-accent-primary';
  };

  // Coordinated entrance animation
  useEffect(() => {
    if (hasAnimatedRef.current) return;

    const tl = gsap.timeline();

    // Grid container fades in
    tl.fromTo(gridRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: DURATION.normal, ease: EASING.smooth }
    );

    // Cells animate with stagger
    const validCells = cellRefs.current.filter(Boolean);
    if (validCells.length > 0) {
      tl.fromTo(validCells,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: DURATION.fast, 
          stagger: STAGGER.tight,
          ease: EASING.smooth 
        },
        '-=0.2'
      );
    }

    hasAnimatedRef.current = true;
  }, [gsap, DURATION, EASING, STAGGER]);

  // Generate calendar grid
  const renderGrid = () => {
    const cells = [];
    cellRefs.current = [];
    
    // Empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const completion = getDayCompletion(day);
      const isToday = isCurrentMonth && day === new Date().getDate();
      const cellIndex = day - 1;
      
      cells.push(
        <div
          key={day}
          ref={el => cellRefs.current[cellIndex] = el}
          style={{ opacity: 0 }}
          className={`
            aspect-square rounded-md flex items-center justify-center
            text-xs font-medium cursor-default relative group
            ${getCompletionColor(completion)}
            ${isToday ? 'ring-2 ring-accent-primary ring-offset-2 ring-offset-dark-800' : ''}
          `}
          title={`Day ${day}: ${Math.round(completion * 100)}% complete`}
        >
          <span className={`${completion > 0.5 ? 'text-dark-900' : 'text-white/60'} ${isToday ? 'font-bold' : ''}`}>
            {day}
          </span>
          
          {/* Tooltip on hover */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-600 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            {Math.round(completion * 100)}%
          </div>
        </div>
      );
    }

    return cells;
  };

  return (
    <div 
      ref={gridRef}
      style={{ opacity: 0 }}
      className={`card p-4 sm:p-5 ${isCurrentMonth ? 'border-accent-primary/20' : ''}`}
    >
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold text-sm sm:text-base ${isCurrentMonth ? 'text-accent-primary' : 'text-white/80'}`}>
          {getShortMonthName(month)}
        </h3>
        {isCurrentMonth && (
          <span className="text-xs text-accent-primary/60 bg-accent-primary/10 px-2 py-0.5 rounded-full">Current</span>
        )}
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs text-white/30 font-medium">{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">{renderGrid()}</div>
    </div>
  );
});

MonthGrid.displayName = 'MonthGrid';

export default MonthGrid;
