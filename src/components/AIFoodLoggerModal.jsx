import { useState } from 'react';
import { AIService } from '../services/aiService';

export default function AIFoodLoggerModal({ selectedDate, fullAppData, isOpen, onClose, onSaveFoodEntry }) {
  const [naturalInput, setNaturalInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [mealType, setMealType] = useState('Dinner');

  if (!isOpen) return null;

  const handleParseFood = async (e) => {
    e.preventDefault();
    if (!naturalInput.trim()) return;

    setIsParsing(true);
    const res = await AIService.requestCoachAction('parse_food', fullAppData, { foodInput: naturalInput.trim() });
    setIsParsing(false);

    if (res?.data?.estimatedItems) {
      setPreviewData(res.data);
    }
  };

  const handleUpdateItem = (index, field, value) => {
    setPreviewData(prev => {
      if (!prev) return prev;
      const items = [...prev.estimatedItems];
      items[index][field] = field === 'name' || field === 'quantity' ? value : Number(value);
      return { ...prev, estimatedItems: items };
    });
  };

  const handleRemoveItem = (index) => {
    setPreviewData(prev => {
      if (!prev) return prev;
      const items = prev.estimatedItems.filter((_, i) => i !== index);
      return { ...prev, estimatedItems: items };
    });
  };

  const handleConfirmSaveAll = () => {
    if (!previewData || !previewData.estimatedItems) return;

    previewData.estimatedItems.forEach(item => {
      onSaveFoodEntry(selectedDate, {
        id: `food-ai-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        date: selectedDate,
        mealType,
        name: item.name,
        quantity: item.quantity || '1 serving',
        calories: Number(item.calories) || 0,
        protein: Number(item.protein) || 0,
        carbs: Number(item.carbs) || 0,
        fat: Number(item.fat) || 0,
        createdAt: new Date().toISOString(),
      });
    });

    setNaturalInput('');
    setPreviewData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="card max-w-xl w-full p-6 space-y-5 border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥗</span>
            <div>
              <h3 className="font-bold text-white text-base">Natural Language AI Food Logger</h3>
              <span className="text-[10px] text-accent-primary font-semibold uppercase">Powered by MOMENTUM AI</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white">✕</button>
        </div>

        {!previewData ? (
          /* Natural Input Form */
          <form onSubmit={handleParseFood} className="space-y-4 text-xs">
            <div>
              <label className="block text-white/70 mb-1 font-semibold">Select Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 mb-1 font-semibold">Describe what you ate in natural text</label>
              <textarea
                rows="3"
                required
                placeholder="e.g. I ate 3 boiled eggs, 2 chapatis, and chicken curry"
                value={naturalInput}
                onChange={(e) => setNaturalInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white text-xs resize-none focus:border-accent-primary focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isParsing}
                className="px-5 py-2.5 rounded-xl bg-accent-primary text-dark-900 font-extrabold shadow-glow hover:brightness-110 transition-all flex items-center gap-2"
              >
                {isParsing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Macros...</span>
                  </>
                ) : (
                  <span>✨ Parse & Estimate Macros</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Editable Preview & Confirmation */
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
              <span>⚠️</span>
              <span><strong>Estimated values:</strong> Review and adjust quantities or macros before saving.</span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {previewData.estimatedItems.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-dark-900 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                      className="font-bold text-white bg-transparent border-b border-white/20 text-xs py-0.5 focus:outline-none"
                    />
                    <button onClick={() => handleRemoveItem(idx)} className="text-red-400 hover:underline text-[10px]">
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[10px]">
                    <div>
                      <span className="text-white/40 block">Calories</span>
                      <input
                        type="number"
                        value={item.calories}
                        onChange={(e) => handleUpdateItem(idx, 'calories', e.target.value)}
                        className="w-full px-1.5 py-1 bg-white/5 rounded border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <span className="text-white/40 block">Protein (g)</span>
                      <input
                        type="number"
                        value={item.protein}
                        onChange={(e) => handleUpdateItem(idx, 'protein', e.target.value)}
                        className="w-full px-1.5 py-1 bg-white/5 rounded border border-white/10 text-emerald-400"
                      />
                    </div>
                    <div>
                      <span className="text-white/40 block">Carbs (g)</span>
                      <input
                        type="number"
                        value={item.carbs}
                        onChange={(e) => handleUpdateItem(idx, 'carbs', e.target.value)}
                        className="w-full px-1.5 py-1 bg-white/5 rounded border border-white/10 text-amber-400"
                      />
                    </div>
                    <div>
                      <span className="text-white/40 block">Fat (g)</span>
                      <input
                        type="number"
                        value={item.fat}
                        onChange={(e) => handleUpdateItem(idx, 'fat', e.target.value)}
                        className="w-full px-1.5 py-1 bg-white/5 rounded border border-white/10 text-purple-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <button
                onClick={() => setPreviewData(null)}
                className="text-white/50 hover:text-white"
              >
                ← Back to Edit Description
              </button>
              <button
                onClick={handleConfirmSaveAll}
                className="px-6 py-2.5 rounded-xl bg-accent-primary text-dark-900 font-extrabold shadow-glow"
              >
                Confirm & Save to {mealType}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
