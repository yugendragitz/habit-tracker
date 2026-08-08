/**
 * nutritionUtils.js - Macro & Water tracking analytics for MOMENTUM
 */

export const DEFAULT_NUTRITION_TARGETS = {
  dailyCalories: 3000,
  dailyProteinGrams: 160,
  dailyCarbsGrams: 350,
  dailyFatGrams: 80,
  dailyWaterLiters: 4.0,
};

export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

// Calculate total nutrition from daily food entries
export const calculateDailyNutrition = (foodEntries = []) => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  const mealTotals = {
    Breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
    Lunch: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
    Dinner: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
    Snacks: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
  };

  (foodEntries || []).forEach(item => {
    const cal = Number(item.calories) || 0;
    const p = Number(item.protein) || 0;
    const c = Number(item.carbs) || 0;
    const f = Number(item.fat) || 0;

    totalCalories += cal;
    totalProtein += p;
    totalCarbs += c;
    totalFat += f;

    const meal = mealTotals[item.mealType] ? item.mealType : 'Snacks';
    mealTotals[meal].calories += cal;
    mealTotals[meal].protein += p;
    mealTotals[meal].carbs += c;
    mealTotals[meal].fat += f;
    mealTotals[meal].count += 1;
  });

  return {
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein),
    totalCarbs: Math.round(totalCarbs),
    totalFat: Math.round(totalFat),
    mealTotals,
  };
};

// Calculate remaining macros against user targets
export const calculateRemainingMacros = (dailyNutrition, targets = DEFAULT_NUTRITION_TARGETS, waterLiters = 0) => {
  const safeTargets = { ...DEFAULT_NUTRITION_TARGETS, ...targets };

  const remainingCalories = Math.max(0, safeTargets.dailyCalories - dailyNutrition.totalCalories);
  const remainingProtein = Math.max(0, safeTargets.dailyProteinGrams - dailyNutrition.totalProtein);
  const remainingCarbs = Math.max(0, safeTargets.dailyCarbsGrams - dailyNutrition.totalCarbs);
  const remainingFat = Math.max(0, safeTargets.dailyFatGrams - dailyNutrition.totalFat);
  const remainingWater = Math.max(0, Number((safeTargets.dailyWaterLiters - waterLiters).toFixed(1)));

  const caloriePct = Math.min(100, Math.round((dailyNutrition.totalCalories / safeTargets.dailyCalories) * 100));
  const proteinPct = Math.min(100, Math.round((dailyNutrition.totalProtein / safeTargets.dailyProteinGrams) * 100));
  const carbsPct = Math.min(100, Math.round((dailyNutrition.totalCarbs / safeTargets.dailyCarbsGrams) * 100));
  const fatPct = Math.min(100, Math.round((dailyNutrition.totalFat / safeTargets.dailyFatGrams) * 100));
  const waterPct = Math.min(100, Math.round((waterLiters / safeTargets.dailyWaterLiters) * 100));

  return {
    remainingCalories,
    remainingProtein,
    remainingCarbs,
    remainingFat,
    remainingWater,
    caloriePct,
    proteinPct,
    carbsPct,
    fatPct,
    waterPct,
    targets: safeTargets,
  };
};
