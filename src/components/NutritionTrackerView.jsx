import { useState } from 'react';
import ProgressBar from './ProgressBar';
import WaterTrackerWidget from './WaterTrackerWidget';
import { MEAL_TYPES } from '../utils/nutritionUtils';

export default function NutritionTrackerView({
  selectedDate,
  foodEntriesMap,
  waterLogsMap,
  nutritionTargets,
  currentDailyNutrition,
  macroStats,
  onSaveFoodEntry,
  onDeleteFoodEntry,
  onUpdateWaterLog,
  onAddWaterDelta,
  onUpdateNutritionTargets
}) {
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showTargetsModal, setShowTargetsModal] = useState(false);

  // Add Meal Form state
  const [mealType, setMealType] = useState('Breakfast');
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState(300);
  const [protein, setProtein] = useState(25);
  const [carbs, setCarbs] = useState(30);
  const [fat, setFat] = useState(8);

  // Targets Form state
  const [targetCals, setTargetCals] = useState(nutritionTargets.dailyCalories || 3000);
  const [targetProt, setTargetProt] = useState(nutritionTargets.dailyProteinGrams || 130);
  const [targetCarbs, setTargetCarbs] = useState(nutritionTargets.dailyCarbsGrams || 350);
  const [targetFat, setTargetFat] = useState(nutritionTargets.dailyFatGrams || 80);
  const [targetWater, setTargetWater] = useState(nutritionTargets.dailyWaterLiters || 4.0);

  const currentWater = waterLogsMap[selectedDate] || 0;
  const foodEntries = foodEntriesMap[selectedDate] || [];

  const handleAddMealSubmit = (e) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    onSaveFoodEntry(selectedDate, {
      id: `food-${Date.now()}`,
      date: selectedDate,
      mealType,
      name: foodName.trim(),
      quantity: quantity.trim() || '1 serving',
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      createdAt: new Date().toISOString(),
    });

    setFoodName('');
    setQuantity('');
    setShowAddMealModal(false);
  };

  const handleSaveTargetsSubmit = (e) => {
    e.preventDefault();
    onUpdateNutritionTargets({
      dailyCalories: Number(targetCals),
      dailyProteinGrams: Number(targetProt),
      dailyCarbsGrams: Number(targetCarbs),
      dailyFatGrams: Number(targetFat),
      dailyWaterLiters: Number(targetWater),
    });
    setShowTargetsModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="card p-6 bg-gradient-to-br from-dark-800/90 to-dark-700/80 border-accent-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-accent-primary uppercase tracking-widest">Nutrition & Hydration System</span>
          <h2 className="text-xl font-extrabold text-white mt-1">🥗 Daily Fuel & Macro Tracker</h2>
          <p className="text-xs text-white/60 mt-1">Track calories (3000+ kcal target), protein, carbs, fats, and water (4L Creatine support) for {selectedDate}.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTargetsModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            ⚙️ Edit Targets
          </button>
          <button
            onClick={() => setShowAddMealModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-accent-primary text-dark-900 shadow-glow hover:brightness-110 transition-all"
          >
            + Add Food / Meal
          </button>
        </div>
      </div>

      {/* Macro Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Calories */}
        <div className="card p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60 font-semibold uppercase">Calories</span>
            <span className="text-accent-primary font-bold">{currentDailyNutrition.totalCalories} / {nutritionTargets.dailyCalories || 3000} kcal</span>
          </div>
          <ProgressBar percentage={macroStats.caloriePct} showPercentage={false} height={8} />
          <div className="flex justify-between text-[11px] text-white/40 pt-1">
            <span>Progress: {macroStats.caloriePct}%</span>
            <span>{macroStats.remainingCalories} kcal left</span>
          </div>
        </div>

        {/* Protein */}
        <div className="card p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60 font-semibold uppercase">Protein</span>
            <span className="text-emerald-400 font-bold">{currentDailyNutrition.totalProtein} / {nutritionTargets.dailyProteinGrams || 140}g</span>
          </div>
          <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden border border-white/5">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${macroStats.proteinPct}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-white/40 pt-1">
            <span>Progress: {macroStats.proteinPct}%</span>
            <span>{macroStats.remainingProtein}g left</span>
          </div>
        </div>

        {/* Carbs */}
        <div className="card p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60 font-semibold uppercase">Carbohydrates</span>
            <span className="text-amber-400 font-bold">{currentDailyNutrition.totalCarbs} / {nutritionTargets.dailyCarbsGrams || 300}g</span>
          </div>
          <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden border border-white/5">
            <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${macroStats.carbsPct}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-white/40 pt-1">
            <span>Progress: {macroStats.carbsPct}%</span>
            <span>{macroStats.remainingCarbs}g left</span>
          </div>
        </div>

        {/* Fat */}
        <div className="card p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60 font-semibold uppercase">Fats</span>
            <span className="text-purple-400 font-bold">{currentDailyNutrition.totalFat} / {nutritionTargets.dailyFatGrams || 70}g</span>
          </div>
          <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden border border-white/5">
            <div className="h-full bg-purple-400 rounded-full transition-all duration-500" style={{ width: `${macroStats.fatPct}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-white/40 pt-1">
            <span>Progress: {macroStats.fatPct}%</span>
            <span>{macroStats.remainingFat}g left</span>
          </div>
        </div>

      </div>

      {/* Water Tracker Widget */}
      <WaterTrackerWidget
        selectedDate={selectedDate}
        currentWaterLiters={currentWater}
        targetWaterLiters={nutritionTargets.dailyWaterLiters || 3.0}
        onAddWaterDelta={onAddWaterDelta}
        onUpdateWaterLog={onUpdateWaterLog}
      />

      {/* Meal Breakdown List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Today's Meals & Food Logs</h3>
          <span className="text-xs text-white/50">{foodEntries.length} Items Logged</span>
        </div>

        {foodEntries.length === 0 ? (
          <div className="card p-12 text-center text-white/40 space-y-2">
            <p className="text-3xl">🥗</p>
            <p className="text-sm font-medium">Nothing logged yet today.</p>
            <p className="text-xs text-white/30">Click "+ Add Food / Meal" to track your breakfast, lunch, dinner, or snacks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEAL_TYPES.map(mType => {
              const items = foodEntries.filter(f => f.mealType === mType);
              if (items.length === 0) return null;
              
              const mCal = items.reduce((sum, i) => sum + (Number(i.calories) || 0), 0);
              const mProt = items.reduce((sum, i) => sum + (Number(i.protein) || 0), 0);

              return (
                <div key={mType} className="card p-5 space-y-3 border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{mType === 'Breakfast' ? '🍳' : mType === 'Lunch' ? '🥗' : mType === 'Dinner' ? '🥩' : '🍎'}</span>
                      <span>{mType}</span>
                    </h4>
                    <span className="text-xs font-bold text-accent-primary">{mCal} kcal • {mProt}g protein</span>
                  </div>

                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="p-3 rounded-xl bg-dark-900/60 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <span className="text-[10px] text-white/40">{item.quantity}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-bold text-white block">{item.calories} kcal</span>
                            <span className="text-[10px] text-emerald-400">{item.protein}g P • {item.carbs}g C • {item.fat}g F</span>
                          </div>
                          <button
                            onClick={() => onDeleteFoodEntry(selectedDate, item.id)}
                            className="text-white/30 hover:text-red-400"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Food Modal */}
      {showAddMealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="card max-w-md w-full p-6 space-y-4 border-white/10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">Add Food Entry</h3>
              <button onClick={() => setShowAddMealModal(false)} className="text-white/50 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddMealSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Meal Type</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                >
                  {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Food / Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Chicken Breast or Oats with Milk"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Quantity / Serving Description</label>
                <input
                  type="text"
                  placeholder="e.g. 200g or 1 bowl"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Fats (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddMealModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent-primary text-dark-900 font-bold shadow-glow"
                >
                  Save Food Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Targets Config Modal */}
      {showTargetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="card max-w-md w-full p-6 space-y-4 border-white/10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">Configure Daily Nutrition Targets</h3>
              <button onClick={() => setShowTargetsModal(false)} className="text-white/50 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveTargetsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Daily Calorie Target (kcal)</label>
                <input
                  type="number"
                  value={targetCals}
                  onChange={(e) => setTargetCals(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-white/70 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={targetProt}
                    onChange={(e) => setTargetProt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={targetCarbs}
                    onChange={(e) => setTargetCarbs(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={targetFat}
                    onChange={(e) => setTargetFat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Daily Water Target (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWater}
                  onChange={(e) => setTargetWater(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowTargetsModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent-primary text-dark-900 font-bold shadow-glow"
                >
                  Save Targets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
