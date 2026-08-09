import { memo } from 'react';
import MonthMiniCalendar from './MonthMiniCalendar';

/**
 * YearGrid Component
 * Renders all 12 months in a responsive grid layout:
 * - Desktop: 4 columns x 3 rows
 * - Tablet: 3 columns x 4 rows
 * - Mobile: 2 columns x 6 rows
 */
const YearGrid = memo(({
  year,
  dailyRecords = {},
  activeHabits = [],
  selectedDate,
  onSelectDate,
}) => {
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block">YEARLY CALENDAR GRID</span>
          <h3 className="text-base font-black text-white">{year} — 12 MONTH TRANSFORMATION OVERVIEW</h3>
        </div>
        <span className="text-xs text-white/50 hidden sm:block">Click any day to view daily transformation details</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {months.map((monthIdx) => (
          <MonthMiniCalendar
            key={monthIdx}
            year={year}
            monthIndex={monthIdx}
            dailyRecords={dailyRecords}
            activeHabits={activeHabits}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
});

YearGrid.displayName = 'YearGrid';

export default YearGrid;
