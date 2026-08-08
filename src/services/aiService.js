/**
 * aiService.js - Client-Side AI Abstraction Service for MOMENTUM
 */
import { buildAIContext } from './aiContextEngine';
import { detectAutomatedInsights } from './insightEngine';
import { calculateDailyPriorities } from './priorityEngine';

export class AIService {
  // Request AI Briefing / Daily Review / Chat / Food Parse
  static async requestCoachAction(action, fullAppData, extraParams = {}) {
    const aiContext = buildAIContext(fullAppData);
    const insights = detectAutomatedInsights(aiContext);
    const priorities = calculateDailyPriorities(aiContext);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          aiContext,
          insights,
          priorities,
          userMessage: extraParams.userMessage || '',
          foodInput: extraParams.foodInput || '',
        })
      });

      if (response.ok) {
        const jsonRes = await response.json();
        return {
          success: true,
          aiContext,
          insights,
          priorities,
          data: jsonRes.data,
          isFallback: jsonRes.isFallback || false,
        };
      }
    } catch (err) {
      console.warn('AI Server API offline/unavailable. Falling back to local engine:', err);
    }

    // Client-side Fallback Engine
    return {
      success: true,
      aiContext,
      insights,
      priorities,
      data: this.generateLocalFallback(action, aiContext, insights, priorities, extraParams),
      isFallback: true,
    };
  }

  // Client-Side Deterministic Fallback Generator
  static generateLocalFallback(action, aiContext, insights, priorities, extraParams) {
    const { today, targets, stats7Day, weightProgress } = aiContext;

    if (action === 'parse_food') {
      const input = extraParams.foodInput || 'Meal';
      return {
        estimatedItems: [
          { name: input, calories: 500, protein: 35, carbs: 45, fat: 15, quantity: '1 serving' }
        ],
        totalCalories: 500,
        totalProtein: 35,
        totalCarbs: 45,
        totalFat: 15,
        note: 'Estimated values — please review before saving.',
      };
    }

    if (action === 'chat') {
      const q = (extraParams.userMessage || '').toLowerCase();
      let reply = `Analyzing your real stored data: `;
      if (q.includes('month') || q.includes('doing')) {
        reply += `Your 30-day habit consistency is ${aiContext.stats30Day.habitConsistency}%. You have completed ${aiContext.stats30Day.workoutCount} workouts with an average of ${aiContext.stats30Day.avgCalories} kcal and ${aiContext.stats30Day.avgWater}L water per day.`;
      } else if (q.includes('gym') || q.includes('workout') || q.includes('progress')) {
        reply += `You logged ${stats7Day.workoutCount} workouts this week (${stats7Day.totalVolume.toLocaleString()} kg total volume). You have hit ${aiContext.personalRecordsCount} Personal Records!`;
      } else if (q.includes('eat') || q.includes('food') || q.includes('nutrition')) {
        const remCal = Math.max(0, targets.dailyCalories - today.calories);
        const remProt = Math.max(0, targets.dailyProteinGrams - today.protein);
        reply += `You have ${remCal} kcal and ${remProt}g protein remaining today against your 3000 kcal target. Focus on lean chicken, eggs, or protein shakes.`;
      } else if (q.includes('weight') || q.includes('body')) {
        reply += `Your starting weight was ${weightProgress.start} kg, current weight is ${weightProgress.current} kg, and your goal is ${weightProgress.target} kg.`;
      } else {
        reply += `Your top priority right now is: "${priorities[0]?.title || 'Maintain Hydration'}" because ${priorities[0]?.reason || 'consistency is key'}.`;
      }

      return {
        reply,
        suggestedQuestions: [
          'How am I doing this month?',
          'How is my gym progress?',
          'What should I eat today?',
          'Why did my transformation score drop?'
        ]
      };
    }

    // Default Briefing
    return {
      greeting: `GOOD MORNING, ${(aiContext.user?.name || 'YUGI').toUpperCase()}`,
      summary: `Yesterday: ${today.completedHabits.length} habits completed • ${today.workoutCompleted ? 'Workout ✓' : 'No Workout'} • ${today.calories} / ${targets.dailyCalories} kcal • ${today.protein}g protein • ${today.waterLiters}L water.`,
      coachInsight: insights.length > 0 ? insights[0].description : 'Your strongest days happen when sleep and hydration targets (4.0L) are met.',
      motivation: `You have completed ${stats7Day.activeDays} of your last 7 tracked days. Today is your next opportunity!`,
    };
  }
}
