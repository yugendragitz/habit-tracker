/**
 * insightEngine.js - Deterministic Pattern Detection & Automated Insights for MOMENTUM
 */

export const detectAutomatedInsights = (aiContext) => {
  const insights = [];
  const { today, targets, stats7Day, stats30Day, weightProgress } = aiContext;

  // 1. Positive Trend: Workout Consistency
  if (stats7Day.workoutCount >= 3) {
    insights.push({
      type: 'positive',
      icon: '📈',
      title: 'Strong Workout Momentum',
      description: `You completed ${stats7Day.workoutCount} workouts this week with ${stats7Day.totalVolume.toLocaleString()} kg total volume.`,
    });
  }

  // 2. Warning: Protein Target Misses
  if (stats7Day.avgProtein < targets.dailyProteinGrams * 0.85) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Protein Target Attention Required',
      description: `Your 7-day average protein is ${stats7Day.avgProtein}g vs your ${targets.dailyProteinGrams}g target. Prioritize protein before workout sessions.`,
    });
  }

  // 3. Warning: Hydration / Creatine Support
  if (stats7Day.avgWater < (targets.dailyWaterLiters || 4.0) * 0.8) {
    insights.push({
      type: 'warning',
      icon: '💧',
      title: 'Creatine Hydration Warning',
      description: `7-day average water is ${stats7Day.avgWater}L vs target ${targets.dailyWaterLiters || 4.0}L. Increase hydration to maximize muscle cellular saturation.`,
    });
  }

  // 4. Achievement: High Habit Consistency
  if (stats7Day.habitConsistency >= 80) {
    insights.push({
      type: 'achievement',
      icon: '🔥',
      title: 'High Discipline Week',
      description: `Your 7-day habit consistency is at ${stats7Day.habitConsistency}%. Excellent execution across your core routines!`,
    });
  }

  // 5. Pattern Association: High Energy vs Study Habit
  if (stats7Day.associations?.highEnergyStudyRate && stats7Day.associations?.lowEnergyStudyRate) {
    const diff = stats7Day.associations.highEnergyStudyRate - stats7Day.associations.lowEnergyStudyRate;
    if (diff > 15) {
      insights.push({
        type: 'pattern',
        icon: '💡',
        title: 'Energy & Study Pattern Association',
        description: `Your data shows a strong association: Study habit completion is ${stats7Day.associations.highEnergyStudyRate}% on high-energy days vs ${stats7Day.associations.lowEnergyStudyRate}% on low-energy days.`,
      });
    }
  }

  // 6. Weight Goal Milestone Progress
  if (weightProgress.current && weightProgress.target) {
    const diff = Math.abs(weightProgress.target - weightProgress.start);
    const achieved = Math.abs(weightProgress.current - weightProgress.start);
    const pct = diff > 0 ? Math.round((achieved / diff) * 100) : 100;
    if (pct > 0) {
      insights.push({
        type: 'achievement',
        icon: '🎯',
        title: 'Weight Milestone Progress',
        description: `You have reached ${weightProgress.current} kg (${pct}% of target ${weightProgress.target} kg).`,
      });
    }
  }

  return insights;
};
