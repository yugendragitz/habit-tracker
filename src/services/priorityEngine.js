/**
 * priorityEngine.js - Deterministic Priority Ranking System for MOMENTUM
 */

export const calculateDailyPriorities = (aiContext) => {
  const priorities = [];
  const { today, targets, stats7Day } = aiContext;

  // Rule 1: Missed Protein / Creatine Hydration Target (Highest Priority for Strength/Fitness)
  if (stats7Day.avgWater < (targets.dailyWaterLiters || 4.0) * 0.8 || today.waterLiters < 2.0) {
    priorities.push({
      rank: 1,
      category: 'Hydration & Recovery',
      title: '💧 Hydration & Creatine Saturation',
      reason: `Water intake is below your 4.0L target. Hydration is key for muscle recovery & creatine uptake.`,
      action: 'Drink 1.0L water before noon and log intake.',
    });
  }

  // Rule 2: Protein & Nutrition Target
  if (stats7Day.avgProtein < targets.dailyProteinGrams * 0.85 || today.protein < targets.dailyProteinGrams) {
    priorities.push({
      rank: priorities.length + 1,
      category: 'Nutrition',
      title: '🥗 Protein & Calorie Fuel',
      reason: `Protein intake is below daily ${targets.dailyProteinGrams}g target. Needed to build lean tissue.`,
      action: 'Ensure high-protein meals (chicken/eggs/whey) for lunch and dinner.',
    });
  }

  // Rule 3: Workout Consistency
  if (!today.workoutCompleted && stats7Day.workoutCount < 4) {
    priorities.push({
      rank: priorities.length + 1,
      category: 'Fitness',
      title: '🏋️‍♂️ Strength Workout Session',
      reason: `You have ${stats7Day.workoutCount} workouts logged this week. Consistent overload builds momentum.`,
      action: 'Execute your planned gym routine and log sets × reps.',
    });
  }

  // Rule 4: Habit Routine
  if (today.missedHabits.length > 0) {
    priorities.push({
      rank: priorities.length + 1,
      category: 'Routine',
      title: '⚡ Habit Completion & Focus',
      reason: `${today.missedHabits.length} habits remain uncompleted for today (${today.missedHabits.slice(0, 2).join(', ')}).`,
      action: 'Clear remaining daily habits before evening reflection.',
    });
  }

  // Fallback default priorities if all targets are already met
  if (priorities.length === 0) {
    priorities.push(
      { rank: 1, category: 'Recovery', title: '🧘 Active Recovery & Sleep', reason: 'All key targets hit! Focus on sleep quality and rest.', action: 'Wind down by 10:30 PM.' },
      { rank: 2, category: 'Fitness', title: '🏋️ Maintain Overload', reason: 'Workout consistency is optimal.', action: 'Prepare tomorrow’s training split.' },
      { rank: 3, category: 'Growth', title: '📚 Knowledge & Study', reason: 'Maintain steady daily learning habits.', action: 'Complete 45 min focused reading/study.' }
    );
  }

  return priorities.slice(0, 3).map((p, idx) => ({ ...p, rank: idx + 1 }));
};
