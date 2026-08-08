/**
 * aiContextEngine.js - Structured Context Aggregation & Association Engine for MOMENTUM
 */
import { calculateHabitScore, calculateDailyScore } from '../utils/analyticsUtils';
import { calculateDailyNutrition } from '../utils/nutritionUtils';
import { calculateWorkoutSummary } from '../utils/fitnessUtils';

// Aggregate structured context data for AI reasoning
export const buildAIContext = ({
  user = null,
  selectedDate,
  dailyRecords = {},
  workoutsMap = {},
  foodEntriesMap = {},
  waterLogsMap = {},
  bodyMeasurementsMap = {},
  goals = [],
  nutritionTargets = {},
  weightGoal = {},
  activeHabits = [],
  personalRecords = {},
}) => {
  const todayStr = selectedDate || new Date().toISOString().split('T')[0];

  // 1. Current Selected Date Snapshot
  const todayRecord = dailyRecords[todayStr] || {};
  const habitsMap = todayRecord.habits || {};
  const habitsScore = calculateHabitScore(habitsMap, activeHabits);
  const todayWorkouts = workoutsMap[todayStr] || [];
  const todayFoods = foodEntriesMap[todayStr] || [];
  const todayWater = waterLogsMap[todayStr] || 0;
  const todayWeight = bodyMeasurementsMap[todayStr]?.weightKg || null;
  const todayNutrition = calculateDailyNutrition(todayFoods);

  // 2. 7-Day & 30-Day Aggregations
  const getRangeStats = (numDays) => {
    const today = new Date(todayStr);
    let habitScoreSum = 0;
    let workoutCount = 0;
    let totalVolume = 0;
    let calSum = 0;
    let protSum = 0;
    let waterSum = 0;
    let activeDays = 0;
    let sleepHighStudyCount = 0;
    let sleepHighTotal = 0;
    let sleepLowStudyCount = 0;
    let sleepLowTotal = 0;

    for (let i = 0; i < numDays; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];

      const rec = dailyRecords[dateKey];
      if (rec) {
        activeDays++;
        const s = rec.score !== undefined ? rec.score : calculateHabitScore(rec.habits || {}, activeHabits);
        habitScoreSum += s;

        // Association check: Sleep / Evening energy vs Study habit
        const studyHabitDone = rec.habits?.['study'] || rec.habits?.['reading'];
        const energy = rec.eveningReflection?.energy || 3;
        if (energy >= 4) {
          sleepHighTotal++;
          if (studyHabitDone) sleepHighStudyCount++;
        } else {
          sleepLowTotal++;
          if (studyHabitDone) sleepLowStudyCount++;
        }
      }

      const logs = workoutsMap[dateKey] || [];
      workoutCount += logs.length;
      logs.forEach(l => { totalVolume += (l.totalVolume || 0); });

      const foods = foodEntriesMap[dateKey] || [];
      foods.forEach(f => {
        calSum += (Number(f.calories) || 0);
        protSum += (Number(f.protein) || 0);
      });

      waterSum += (waterLogsMap[dateKey] || 0);
    }

    return {
      habitConsistency: activeDays > 0 ? Math.round(habitScoreSum / activeDays) : 0,
      workoutCount,
      totalVolume: Math.round(totalVolume),
      avgCalories: Math.round(calSum / numDays),
      avgProtein: Math.round(protSum / numDays),
      avgWater: Number((waterSum / numDays).toFixed(1)),
      activeDays,
      associations: {
        highEnergyStudyRate: sleepHighTotal > 0 ? Math.round((sleepHighStudyCount / sleepHighTotal) * 100) : null,
        lowEnergyStudyRate: sleepLowTotal > 0 ? Math.round((sleepLowStudyCount / sleepLowTotal) * 100) : null,
      }
    };
  };

  const stats7Day = getRangeStats(7);
  const stats30Day = getRangeStats(30);

  // 3. Weight Progression
  const sortedMeasurements = Object.entries(bodyMeasurementsMap)
    .filter(([_, rec]) => rec.weightKg)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]));
  
  const latestWeight = sortedMeasurements.length > 0
    ? sortedMeasurements[sortedMeasurements.length - 1][1].weightKg
    : (weightGoal.currentWeightKg || 54.0);

  // 4. Structured Snapshot Object
  return {
    user: {
      name: user?.displayName || 'Yugi',
      isGuest: !user?.uid,
    },
    today: {
      date: todayStr,
      habitsScore,
      completedHabits: activeHabits.filter(h => habitsMap[h.id]).map(h => h.name),
      missedHabits: activeHabits.filter(h => !habitsMap[h.id]).map(h => h.name),
      workoutCompleted: todayWorkouts.length > 0,
      workoutVolume: todayWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0),
      calories: todayNutrition.totalCalories,
      protein: todayNutrition.totalProtein,
      carbs: todayNutrition.totalCarbs,
      fat: todayNutrition.totalFat,
      waterLiters: todayWater,
      weightKg: todayWeight,
      morningFocus: todayRecord.morningFocus || null,
      eveningNote: todayRecord.eveningReflection?.note || null,
    },
    targets: {
      dailyCalories: Math.max(3000, nutritionTargets.dailyCalories || 3000),
      dailyProteinGrams: nutritionTargets.dailyProteinGrams || 130,
      dailyWaterLiters: Math.max(4.0, nutritionTargets.dailyWaterLiters || 4.0),
      weightGoalKg: weightGoal.targetWeightKg || 65.0,
    },
    weightProgress: {
      current: latestWeight,
      start: weightGoal.currentWeightKg || 54.0,
      target: weightGoal.targetWeightKg || 65.0,
    },
    stats7Day,
    stats30Day,
    goalsCount: goals.length,
    completedGoalsCount: goals.filter(g => g.completed).length,
    personalRecordsCount: Object.keys(personalRecords).length,
  };
};
