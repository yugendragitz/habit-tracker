import { useState, useMemo } from 'react';
import YearGrid from './YearGrid';
import YearHeatmap from './YearHeatmap';
import DailyDetailPanel from './DailyDetailPanel';
import YearMilestones from './YearMilestones';
import { calculateDailyScore } from '../utils/analyticsUtils';

/**
 * CalendarView Master Component
 * Signature Visual Journey through the user's year:
 * 1. Year Header & Navigator (← 2025, 2026, 2027 →, TODAY)
 * 2. Year Summary Metric Chips
 * 3. 12-Month Responsive Mini Calendar Grid (4x3 / 3x4 / 2x6)
 * 4. Zero-Overflow Transformation Heatmap
 * 5. Selected Day Performance Breakdown
 * 6. Year Milestones Timeline
 */
export default function CalendarView({
  selectedDate,
  onSelectDate,
  dailyRecordsMap = {},
  workoutsMap = {},
  foodEntriesMap = {},
  waterLogsMap = {},
  activeHabits = [],
  personalRecords = {},
  nutritionTargets = {},
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [currentYear, setCurrentYear] = useState(() => {
    const d = new Date(selectedDate || todayStr);
    return d.getFullYear();
  });

  // Calculate year summary metrics
  const yearMetrics = useMemo(() => {
    let activeDaysCount = 0;
    let totalScoreSum = 0;
    let bestDayScore = 0;
    let workoutDaysCount = 0;

    Object.entries(dailyRecordsMap || {}).forEach(([dateStr, record]) => {
      if (dateStr.startsWith(String(currentYear))) {
        const score = record.score !== undefined 
          ? record.score 
          : calculateDailyScore(record.habits || {}, activeHabits);

        if (score > 0) {
          activeDaysCount++;
          totalScoreSum += score;
          if (score > bestDayScore) bestDayScore = score;
        }
      }
    });

    Object.entries(workoutsMap || {}).forEach(([dateStr, logs]) => {
      if (dateStr.startsWith(String(currentYear)) && logs && logs.length > 0) {
        workoutDaysCount++;
      }
    });

    const yearConsistencyPct = activeDaysCount > 0 ? Math.round(totalScoreSum / activeDaysCount) : 0;

    return {
      activeDaysCount,
      yearConsistencyPct,
      bestDayScore,
      workoutDaysCount,
    };
  }, [currentYear, dailyRecordsMap, workoutsMap, activeHabits]);

  // Selected date details
  const selectedDayRecord = dailyRecordsMap[selectedDate] || {};
  const selectedWorkouts = workoutsMap[selectedDate] || [];
  const selectedFoodEntries = foodEntriesMap[selectedDate] || [];
  const selectedWaterLiters = waterLogsMap[selectedDate] || 0;

  const handleYearShift = (delta) => {
    setCurrentYear(prev => prev + delta);
  };

  const handleGoToToday = () => {
    const currentYearNum = new Date().getFullYear();
    setCurrentYear(currentYearNum);
    if (onSelectDate) onSelectDate(todayStr);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. YEAR HEADER & NAVIGATOR */}
      <div className="card p-6 bg-[#0d0f19] border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block">YEARLY TRANSFORMATION JOURNEY</span>
          <h2 className="text-2xl font-black text-white">{currentYear} — YOUR YEAR VISUALIZED</h2>
          <p className="text-xs text-white/50 mt-1">Every day is part of the story. Track consistency across all 12 months.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleYearShift(-1)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all"
          >
            ← {currentYear - 1}
          </button>
          
          <button
            onClick={handleGoToToday}
            className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-extrabold border border-purple-500/30 hover:bg-purple-500/30 transition-all"
          >
            TODAY
          </button>

          <button
            onClick={() => handleYearShift(1)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all"
          >
            {currentYear + 1} →
          </button>
        </div>
      </div>

      {/* 2. YEAR SUMMARY METRIC CHIPS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        
        <div className="p-4 rounded-2xl bg-[#0d0f19] border border-white/10 space-y-1">
          <span className="text-[10px] text-white/40 font-bold uppercase block">ACTIVE DAYS</span>
          <strong className="text-white text-lg font-black">{yearMetrics.activeDaysCount} Days</strong>
          <span className="text-[10px] text-purple-400 block">Logged in {currentYear}</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d0f19] border border-white/10 space-y-1">
          <span className="text-[10px] text-white/40 font-bold uppercase block">CONSISTENCY</span>
          <strong className="text-purple-400 text-lg font-black">{yearMetrics.yearConsistencyPct}%</strong>
          <span className="text-[10px] text-white/40 block">Average daily score</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d0f19] border border-white/10 space-y-1">
          <span className="text-[10px] text-white/40 font-bold uppercase block">BEST DAY SCORE</span>
          <strong className="text-cyan-400 text-lg font-black">{yearMetrics.bestDayScore} / 100</strong>
          <span className="text-[10px] text-white/40 block">Peak achievement</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d0f19] border border-white/10 space-y-1">
          <span className="text-[10px] text-white/40 font-bold uppercase block">WORKOUT SESSIONS</span>
          <strong className="text-pink-400 text-lg font-black">{yearMetrics.workoutDaysCount} Sessions</strong>
          <span className="text-[10px] text-white/40 block">Gym workouts logged</span>
        </div>

      </div>

      {/* 3. 12-MONTH REASONABLE YEARLY CALENDAR GRID */}
      <YearGrid
        year={currentYear}
        dailyRecords={dailyRecordsMap}
        activeHabits={activeHabits}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      {/* 4. ZERO-OVERFLOW ANNUAL HEATMAP */}
      <YearHeatmap
        year={currentYear}
        dailyRecords={dailyRecordsMap}
        activeHabits={activeHabits}
        onSelectDate={onSelectDate}
      />

      {/* 5. SELECTED DAY PERFORMANCE BREAKDOWN */}
      <DailyDetailPanel
        selectedDate={selectedDate}
        dailyRecord={selectedDayRecord}
        workouts={selectedWorkouts}
        foodEntries={selectedFoodEntries}
        waterLiters={selectedWaterLiters}
        activeHabits={activeHabits}
        nutritionTargets={nutritionTargets}
      />

      {/* 6. YEAR MILESTONES TIMELINE */}
      <YearMilestones
        year={currentYear}
        dailyRecordsMap={dailyRecordsMap}
        personalRecords={personalRecords}
      />

    </div>
  );
}
