import { memo, useMemo } from 'react';

/**
 * YearMilestones Component
 * Chronological timeline showing real user milestones extracted from historical data
 * (First 7-day streak, Personal Records hit, Workout milestones).
 */
const YearMilestones = memo(({
  year,
  dailyRecordsMap = {},
  personalRecords = {},
  streakStats = {},
}) => {
  const milestonesList = useMemo(() => {
    const list = [];

    // Check PR achievements in target year
    Object.values(personalRecords || {}).forEach(pr => {
      if (pr.dateAchieved && pr.dateAchieved.startsWith(String(year))) {
        list.push({
          date: pr.dateAchieved,
          title: `Personal Record: ${pr.exerciseName}`,
          description: `${pr.maxWeightKg} kg × ${pr.maxRepsAtMaxWeight} reps hit!`,
          icon: '🏆',
          badge: 'PR HIT',
        });
      }
    });

    // Check high performance days (90%+ score)
    Object.entries(dailyRecordsMap || {}).forEach(([dateStr, rec]) => {
      if (dateStr.startsWith(String(year)) && rec.score >= 90) {
        list.push({
          date: dateStr,
          title: 'Peak Transformation Day',
          description: `Achieved ${rec.score}% daily score milestone!`,
          icon: '⚡',
          badge: 'PEAK DAY',
        });
      }
    });

    return list.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
  }, [year, dailyRecordsMap, personalRecords]);

  return (
    <div className="card p-6 bg-[#0d0f19] border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block">YEARLY TIMELINE</span>
          <h3 className="text-base font-black text-white">{year} TRANSFORMATIONAL MILESTONES</h3>
        </div>
        <span className="text-xs text-white/50">{milestonesList.length} Milestones Achieved</span>
      </div>

      {milestonesList.length === 0 ? (
        <div className="p-6 text-center text-white/40 text-xs italic">
          Your first milestone is waiting. Continue completing your daily habits and workouts!
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {milestonesList.map((m, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-[#141827] border border-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{m.title}</h4>
                  <p className="text-[11px] text-white/50">{m.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {m.badge}
                </span>
                <span className="text-[10px] text-white/40 block mt-1">{m.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
});

YearMilestones.displayName = 'YearMilestones';

export default YearMilestones;
