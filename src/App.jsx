import { useEffect, useRef, useState, useCallback } from 'react';
import { MotionProvider, useMotion } from './context/MotionContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Navigation Shell Components
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import HeroCommandCenter from './components/HeroCommandCenter';
import TodaysMission from './components/TodaysMission';
import AnimatedBackground from './components/AnimatedBackground';

// Existing Components
import MonthGrid from './components/MonthGrid';
import YearHeatmap from './components/YearHeatmap';
import DailyChart from './components/DailyChart';
import AuthScreen from './components/AuthScreen';
import HabitManagerModal from './components/HabitManagerModal';
import DailyCheckIn from './components/DailyCheckIn';
import DayDetailModal from './components/DayDetailModal';
import GoalsPanel from './components/GoalsPanel';

// Phase 2 Components
import WorkoutLoggerModal from './components/WorkoutLoggerModal';
import WorkoutHistoryView from './components/WorkoutHistoryView';
import NutritionTrackerView from './components/NutritionTrackerView';
import WaterTrackerWidget from './components/WaterTrackerWidget';
import BodyMeasurementsView from './components/BodyMeasurementsView';
import WeeklyMonthlyAnalytics from './components/WeeklyMonthlyAnalytics';

// Phase 3 Components
import AICoachDashboard from './components/AICoachDashboard';
import AIFoodLoggerModal from './components/AIFoodLoggerModal';

// Master Hook
import useMomentumData from './hooks/useMomentumData';

// Utils
import { getCurrentMonth, getCurrentYear } from './utils/dateUtils';

function AppContent() {
  const { gsap, DURATION, EASING } = useMotion();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  
  const appRef = useRef(null);
  const [activeTab, setActiveTab] = useState('today'); // Default to Today Command Center
  const [isHabitManagerOpen, setIsHabitManagerOpen] = useState(false);
  const [isWorkoutLoggerOpen, setIsWorkoutLoggerOpen] = useState(false);
  const [isAIFoodLoggerOpen, setIsAIFoodLoggerOpen] = useState(false);
  const [inspectingDate, setInspectingDate] = useState(null);
  const hasInitialAnimatedRef = useRef(false);
  
  // Master MOMENTUM hook
  const momentumData = useMomentumData(user?.uid);
  const {
    selectedDate,
    setSelectedDate,
    isLoaded,
    habitsList,
    activeHabits,
    exerciseDatabase,
    dailyRecords,
    workoutsMap,
    foodEntriesMap,
    waterLogsMap,
    bodyMeasurementsMap,
    goals,
    nutritionTargets,
    weightGoal,
    personalRecords,
    currentDailyRecord,
    currentHabitCompletions,
    currentWorkouts,
    currentFoodEntries,
    currentWaterLiters,
    currentBodyMeasurement,
    habitsScore,
    completedHabitsCount,
    totalCount,
    currentDailyNutrition,
    macroStats,
    transformationScore,
    streakStats,
    weeklyConsistency,
    monthlyConsistency,
    toggleHabit,
    saveMorningFocus,
    saveEveningReflection,
    saveWorkout,
    deleteWorkout,
    saveFoodEntry,
    deleteFoodEntry,
    updateWaterLog,
    addWaterDelta,
    saveBodyMeasurement,
    updateNutritionTargets,
    updateWeightGoal,
    addHabit,
    updateHabit,
    toggleHabitActive,
    deleteHabit,
    addCustomExercise,
    addGoal,
    toggleGoal,
    deleteGoal,
  } = momentumData;

  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonth();

  // Initial page load animation
  useEffect(() => {
    if (appRef.current && isLoaded && !hasInitialAnimatedRef.current) {
      gsap.fromTo(appRef.current,
        { opacity: 0 },
        { opacity: 1, duration: DURATION.slow, ease: EASING.smooth }
      );
      hasInitialAnimatedRef.current = true;
    }
  }, [isLoaded, gsap, DURATION, EASING]);

  const handleTabChange = useCallback((newTab) => {
    if (newTab === activeTab) return;
    setActiveTab(newTab);
  }, [activeTab]);

  // Auth Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
          <span className="text-white/50 text-xs uppercase tracking-widest font-semibold">AUTHENTICATING MOMENTUM...</span>
        </div>
      </div>
    );
  }

  // Show Auth Screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Data Loading Screen
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
          <span className="text-white/50 text-xs uppercase tracking-widest font-semibold">INITIALIZING PERFORMANCE OS...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={appRef}
      className="min-h-screen bg-dark-950 text-white font-sans selection:bg-accent-primary selection:text-dark-900"
    >
      {/* Background System */}
      <AnimatedBackground />

      {/* Desktop Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userName={user?.displayName || user?.email?.split('@')[0]}
        currentStreak={streakStats.currentStreak}
        onLogout={logout}
      />

      {/* Main Content Workspace */}
      <div className="lg:pl-64 pb-20 lg:pb-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* TODAY COMMAND CENTER (DEFAULT HERO VIEW) */}
          {activeTab === 'today' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Hero Command Center Header */}
              <HeroCommandCenter
                userName={user?.displayName || 'YUGI'}
                selectedDate={selectedDate}
                transformationScore={transformationScore}
                completedHabitsCount={completedHabitsCount}
                totalCount={totalCount}
                currentWorkouts={currentWorkouts}
                currentDailyNutrition={currentDailyNutrition}
                currentWaterLiters={currentWaterLiters}
                nutritionTargets={nutritionTargets}
                onOpenWorkoutLogger={() => setIsWorkoutLoggerOpen(true)}
                onOpenNutritionTab={() => setActiveTab('nutrition')}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Objective Mission List & Daily Check-In */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Objective Mission List */}
                  <TodaysMission
                    activeHabits={activeHabits}
                    habitsCompletions={currentHabitCompletions}
                    onToggleHabit={toggleHabit}
                    selectedDate={selectedDate}
                  />

                  {/* Daily Check-In Widget (Morning Focus & Evening Reflection) */}
                  <DailyCheckIn 
                    selectedDate={selectedDate}
                    dailyRecord={currentDailyRecord}
                    onSaveMorningFocus={(focus) => saveMorningFocus(focus, selectedDate)}
                    onSaveEveningReflection={(ref) => saveEveningReflection(ref, selectedDate)}
                  />

                  {/* Quick Water Logger Widget */}
                  <WaterTrackerWidget
                    selectedDate={selectedDate}
                    currentWaterLiters={currentWaterLiters}
                    targetWaterLiters={nutritionTargets.dailyWaterLiters || 4.0}
                    onAddWaterDelta={addWaterDelta}
                    onUpdateWaterLog={updateWaterLog}
                  />

                  {/* 14-Day Trend Chart */}
                  <DailyChart habitList={activeHabits} days={14} />
                </div>

                {/* Right Column: Consistency Metrics & Philosophy */}
                <div className="space-y-6">
                  
                  {/* Consistency Summary Stats */}
                  <div className="card p-6 space-y-4">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider">Consistency Metrics</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900 border border-white/5">
                        <span className="text-xs text-white/60 font-semibold">7-Day Consistency</span>
                        <span className="text-lg font-black text-accent-primary">{weeklyConsistency}%</span>
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900 border border-white/5">
                        <span className="text-xs text-white/60 font-semibold">30-Day Consistency</span>
                        <span className="text-lg font-black text-cyan-400">{monthlyConsistency}%</span>
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900 border border-white/5">
                        <span className="text-xs text-white/60 font-semibold">Total Active Days</span>
                        <span className="text-lg font-black text-white">{streakStats.totalActiveDays} Days</span>
                      </div>
                    </div>
                  </div>

                  {/* Motivational Philosophy Card */}
                  <div className="card p-6 bg-gradient-to-br from-accent-primary/10 via-purple-500/10 to-cyan-500/10 border-accent-primary/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🔥</span>
                      <h3 className="font-bold text-white text-xs uppercase tracking-wider">Momentum Principle</h3>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed italic">
                      "Track habits, workouts, and nutrition daily to understand your performance and unlock your true potential."
                    </p>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* AI COACH TAB */}
          {activeTab === 'coach' && (
            <div className="animate-fadeIn">
              <AICoachDashboard
                selectedDate={selectedDate}
                fullAppData={momentumData}
                onOpenAIFoodLogger={() => setIsAIFoodLoggerOpen(true)}
              />
            </div>
          )}

          {/* FITNESS & WORKOUTS TAB */}
          {activeTab === 'fitness' && (
            <div className="animate-fadeIn">
              <WorkoutHistoryView 
                workoutsMap={workoutsMap}
                personalRecords={personalRecords}
                exerciseDatabase={exerciseDatabase}
                onOpenLogger={() => setIsWorkoutLoggerOpen(true)}
                onDeleteWorkout={deleteWorkout}
              />
            </div>
          )}

          {/* NUTRITION & WATER TAB */}
          {activeTab === 'nutrition' && (
            <div className="animate-fadeIn">
              <NutritionTrackerView 
                selectedDate={selectedDate}
                foodEntriesMap={foodEntriesMap}
                waterLogsMap={waterLogsMap}
                nutritionTargets={nutritionTargets}
                currentDailyNutrition={currentDailyNutrition}
                macroStats={macroStats}
                onSaveFoodEntry={saveFoodEntry}
                onDeleteFoodEntry={deleteFoodEntry}
                onUpdateWaterLog={updateWaterLog}
                onAddWaterDelta={addWaterDelta}
                onUpdateNutritionTargets={updateNutritionTargets}
              />
            </div>
          )}

          {/* BODY MEASUREMENTS TAB */}
          {activeTab === 'body' && (
            <div className="animate-fadeIn">
              <BodyMeasurementsView 
                selectedDate={selectedDate}
                bodyMeasurementsMap={bodyMeasurementsMap}
                weightGoal={weightGoal}
                onSaveBodyMeasurement={saveBodyMeasurement}
                onUpdateWeightGoal={updateWeightGoal}
              />
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'analytics' && (
            <div className="animate-fadeIn">
              <WeeklyMonthlyAnalytics 
                dailyRecords={dailyRecords}
                workoutsMap={workoutsMap}
                foodEntriesMap={foodEntriesMap}
                waterLogsMap={waterLogsMap}
                activeHabits={activeHabits}
              />
            </div>
          )}

          {/* HABITS TAB */}
          {activeTab === 'habits' && (
            <div className="card p-6 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">⚙️ Habit Management System</h2>
                  <p className="text-xs text-white/50">Configure core habits, add custom routines, assign categories and target frequencies.</p>
                </div>
                <button
                  onClick={() => setIsHabitManagerOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent-primary text-dark-950 shadow-glow font-bold"
                >
                  + Add Custom Habit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habitsList.map((habit) => (
                  <div 
                    key={habit.id}
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      habit.active !== false ? 'bg-dark-900 border-white/10' : 'bg-dark-900/40 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{habit.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-semibold">
                            {habit.category || 'Personal'}
                          </span>
                        </div>
                        <p className="text-xs text-white/40">{habit.description || 'Custom Habit'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleHabitActive(habit.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          habit.active !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/40'
                        }`}
                      >
                        {habit.active !== false ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete habit "${habit.name}"?`)) deleteHabit(habit.id);
                        }}
                        className="p-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === 'calendar' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonthGrid 
                  year={currentYear}
                  month={currentMonth}
                  dailyRecords={dailyRecords}
                  activeHabits={activeHabits}
                  isCurrentMonth={true}
                  onSelectDate={(d) => setInspectingDate(d)}
                />

                <YearHeatmap 
                  year={currentYear} 
                  dailyRecords={dailyRecords}
                  activeHabits={activeHabits}
                  onSelectDate={(d) => setInspectingDate(d)}
                />
              </div>
            </div>
          )}

          {/* GOALS TAB */}
          {activeTab === 'goals' && (
            <div className="animate-fadeIn">
              <GoalsPanel 
                goals={goals}
                habitsList={activeHabits}
                dailyRecords={dailyRecords}
                workoutsMap={workoutsMap}
                foodEntriesMap={foodEntriesMap}
                onAddGoal={addGoal}
                onToggleGoal={toggleGoal}
                onDeleteGoal={deleteGoal}
              />
            </div>
          )}

        </div>
      </div>

      {/* Mobile Glass Navigation */}
      <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Modals */}
      <WorkoutLoggerModal 
        dateStr={selectedDate}
        exerciseDatabase={exerciseDatabase}
        isOpen={isWorkoutLoggerOpen}
        onClose={() => setIsWorkoutLoggerOpen(false)}
        onSaveWorkout={saveWorkout}
        onAddCustomExercise={addCustomExercise}
      />

      <HabitManagerModal 
        habitsList={habitsList}
        isOpen={isHabitManagerOpen}
        onClose={() => setIsHabitManagerOpen(false)}
        onAddHabit={addHabit}
        onUpdateHabit={updateHabit}
        onToggleActive={toggleHabitActive}
        onDeleteHabit={deleteHabit}
      />

      <AIFoodLoggerModal
        selectedDate={selectedDate}
        fullAppData={momentumData}
        isOpen={isAIFoodLoggerOpen}
        onClose={() => setIsAIFoodLoggerOpen(false)}
        onSaveFoodEntry={saveFoodEntry}
      />

      <DayDetailModal 
        dateStr={inspectingDate}
        dailyRecord={dailyRecords[inspectingDate]}
        workoutsMap={workoutsMap}
        foodEntriesMap={foodEntriesMap}
        waterLogsMap={waterLogsMap}
        bodyMeasurementsMap={bodyMeasurementsMap}
        habitsList={habitsList}
        isOpen={Boolean(inspectingDate)}
        onClose={() => setInspectingDate(null)}
        onToggleHabit={toggleHabit}
      />

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MotionProvider>
        <AppContent />
      </MotionProvider>
    </AuthProvider>
  );
}

export default App;
