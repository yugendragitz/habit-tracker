import { useEffect, useRef, useState, useCallback } from 'react';
import { MotionProvider, useMotion } from './context/MotionContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header';
import AnimatedBackground from './components/AnimatedBackground';
import HabitCard from './components/HabitCard';
import ProgressRing from './components/ProgressRing';
import ProgressBar from './components/ProgressBar';
import MonthGrid from './components/MonthGrid';
import YearHeatmap from './components/YearHeatmap';
import DailyChart from './components/DailyChart';
import MonthlyStats from './components/MonthlyStats';
import YearlyProgress from './components/YearlyProgress';
import AuthScreen from './components/AuthScreen';
import HabitManagerModal from './components/HabitManagerModal';
import DailyCheckIn from './components/DailyCheckIn';
import DayDetailModal from './components/DayDetailModal';
import GoalsPanel from './components/GoalsPanel';
import HistoryJournal from './components/HistoryJournal';

// Master Hook
import useMomentumData from './hooks/useMomentumData';

// Utils
import { getCurrentMonth, getCurrentYear, getToday } from './utils/dateUtils';

function AppContent() {
  const { gsap, DURATION, EASING } = useMotion();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  
  const appRef = useRef(null);
  const [activeTab, setActiveTab] = useState('today');
  const [isHabitManagerOpen, setIsHabitManagerOpen] = useState(false);
  const [inspectingDate, setInspectingDate] = useState(null);
  const hasInitialAnimatedRef = useRef(false);
  
  // Master MOMENTUM hook
  const {
    selectedDate,
    setSelectedDate,
    isLoaded,
    habitsList,
    activeHabits,
    dailyRecords,
    goals,
    currentDailyRecord,
    currentHabitCompletions,
    dailyScore,
    completedCount,
    totalCount,
    streakStats,
    weeklyConsistency,
    monthlyConsistency,
    toggleHabit,
    saveMorningFocus,
    saveEveningReflection,
    addHabit,
    updateHabit,
    toggleHabitActive,
    deleteHabit,
    addGoal,
    toggleGoal,
    deleteGoal,
  } = useMomentumData(user?.uid);

  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonth();
  const todayStr = getToday();

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
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
          <span className="text-white/50 text-sm">Authenticating MOMENTUM...</span>
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
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
          <span className="text-white/50 text-sm">Initializing your daily system...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={appRef}
      className="min-h-screen bg-dark-900 text-white font-sans selection:bg-accent-primary selection:text-dark-900"
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header */}
        <Header 
          userName={user?.displayName || user?.email?.split('@')[0]}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          currentStreak={streakStats.currentStreak}
          onOpenHabitManager={() => setIsHabitManagerOpen(true)}
        />

        {/* User Info & Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-dark-800/60 border border-white/5 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-primary to-cyan-400 flex items-center justify-center text-dark-900 font-extrabold text-sm shadow-glow">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'M'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">{user?.displayName || 'Transformer'}</p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                  {user?.isAnonymous ? 'Guest Mode' : 'Cloud Synced'}
                </span>
              </div>
              <p className="text-xs text-white/40">{user?.email || 'Local session'}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'today', label: '⚡ Today' },
              { id: 'habits', label: '⚙️ Habits' },
              { id: 'calendar', label: '📅 Calendar & Heatmap' },
              { id: 'goals', label: '🎯 Goals' },
              { id: 'history', label: '📜 Journal & Logs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300
                  ${activeTab === tab.id 
                    ? 'bg-accent-primary text-dark-900 shadow-glow scale-105' 
                    : 'bg-dark-700/50 text-white/60 hover:bg-dark-600 hover:text-white'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
            
            <button
              onClick={logout}
              className="px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white hover:bg-white/10 transition-all ml-2"
              title="Sign Out"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* TODAY TAB (DASHBOARD) */}
          {activeTab === 'today' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Progress Banner & Daily Habits List */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Daily Progress & Discipline Score Banner */}
                <div className="card p-6 bg-gradient-to-br from-dark-800/90 to-dark-700/80 border-accent-primary/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="text-xs font-bold text-accent-primary uppercase tracking-widest">
                      Daily Discipline Score
                    </span>
                    <div className="flex items-baseline justify-center sm:justify-start gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-white">{dailyScore}</span>
                      <span className="text-sm text-white/40">/ 100</span>
                    </div>
                    <p className="text-xs text-white/60">
                      {completedCount} of {totalCount} daily habits completed
                    </p>
                  </div>

                  <div className="w-full sm:w-1/2 space-y-2">
                    <ProgressBar 
                      percentage={dailyScore}
                      showPercentage={true}
                      height={12}
                      label=""
                    />
                    <div className="flex justify-between text-[11px] text-white/50 font-medium pt-1">
                      <span>Streak: <strong className="text-orange-400 font-extrabold">{streakStats.currentStreak} Days 🔥</strong></span>
                      <span>Longest: <strong className="text-white font-bold">{streakStats.longestStreak} Days</strong></span>
                    </div>
                  </div>
                </div>

                {/* Daily Habits List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        Today's Habits & Routine
                      </h2>
                      <p className="text-xs text-white/50">Complete habits for {selectedDate}</p>
                    </div>

                    <button
                      onClick={() => setIsHabitManagerOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-accent-primary text-xs font-bold border border-accent-primary/20 transition-all"
                    >
                      + Manage Habits
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeHabits.map((habit, index) => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        isCompleted={Boolean(currentHabitCompletions[habit.id])}
                        onToggle={(id) => toggleHabit(id, selectedDate)}
                        index={index}
                      />
                    ))}
                  </div>
                </div>

                {/* Daily Check-In Widget (Morning Focus & Evening Reflection) */}
                <DailyCheckIn 
                  selectedDate={selectedDate}
                  dailyRecord={currentDailyRecord}
                  onSaveMorningFocus={(focus) => saveMorningFocus(focus, selectedDate)}
                  onSaveEveningReflection={(ref) => saveEveningReflection(ref, selectedDate)}
                />

                {/* 14-Day Trend Chart */}
                <DailyChart habitList={activeHabits} days={14} />
              </div>

              {/* Right Column: Progress Ring, Consistency Stats & Motivational Card */}
              <div className="space-y-6">
                
                {/* Progress Ring Card */}
                <div className="card p-6 flex flex-col items-center shadow-xl">
                  <ProgressRing 
                    percentage={dailyScore}
                    size={190}
                    strokeWidth={14}
                    label="Discipline"
                  />
                  
                  <div className="mt-5 text-center space-y-1">
                    {dailyScore === 100 ? (
                      <p className="text-accent-primary font-bold text-sm">
                        🎉 Perfect Discipline Day! All habits complete!
                      </p>
                    ) : dailyScore >= 75 ? (
                      <p className="text-emerald-300 font-semibold text-sm">
                        Great momentum! Finish the last habits! 💪
                      </p>
                    ) : dailyScore >= 50 ? (
                      <p className="text-amber-300 font-semibold text-sm">
                        Halfway done. Keep pushing forward!
                      </p>
                    ) : (
                      <p className="text-white/60 text-sm">
                        Every small step builds your future self! 🚀
                      </p>
                    )}
                  </div>
                </div>

                {/* Consistency Summary Stats */}
                <div className="card p-5 space-y-4">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">Consistency Metrics</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-white/5">
                      <span className="text-xs text-white/60">7-Day Consistency</span>
                      <span className="text-base font-extrabold text-accent-primary">{weeklyConsistency}%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-white/5">
                      <span className="text-xs text-white/60">30-Day Consistency</span>
                      <span className="text-base font-extrabold text-cyan-400">{monthlyConsistency}%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-white/5">
                      <span className="text-xs text-white/60">Total Active Days</span>
                      <span className="text-base font-extrabold text-white">{streakStats.totalActiveDays} Days</span>
                    </div>
                  </div>
                </div>

                {/* Motivational Accountability Card (Non-Punitive) */}
                <div className="card p-5 bg-gradient-to-br from-accent-primary/10 via-purple-500/10 to-cyan-500/10 border-accent-primary/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <h3 className="font-bold text-white text-sm">Accountability & Growth</h3>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    "Missed a day or habit? Long-term consistency is key ({monthlyConsistency}% 30-day average). Your progress isn't lost—get right back on track today."
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* HABITS MANAGER TAB */}
          {activeTab === 'habits' && (
            <div className="card p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">⚙️ Habit Management System</h2>
                  <p className="text-xs text-white/50">Configure core habits, add custom routines, assign categories and target frequencies.</p>
                </div>
                <button
                  onClick={() => setIsHabitManagerOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent-primary text-dark-900 shadow-glow"
                >
                  + Add Custom Habit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habitsList.map((habit) => (
                  <div 
                    key={habit.id}
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      habit.active !== false ? 'bg-dark-800/80 border-white/10' : 'bg-dark-900/40 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{habit.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
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

          {/* CALENDAR & HEATMAP TAB */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonthlyStats dailyRecords={dailyRecords} activeHabits={activeHabits} />
                
                <MonthGrid 
                  year={currentYear}
                  month={currentMonth}
                  dailyRecords={dailyRecords}
                  activeHabits={activeHabits}
                  isCurrentMonth={true}
                  onSelectDate={(d) => setInspectingDate(d)}
                />
              </div>

              {/* Year Heatmap Grid */}
              <YearHeatmap 
                year={currentYear} 
                dailyRecords={dailyRecords}
                activeHabits={activeHabits}
                onSelectDate={(d) => setInspectingDate(d)}
              />

              {/* All Months Grid Overview */}
              <div className="space-y-4">
                <h3 className="font-bold text-white text-lg">Annual Calendar Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }, (_, i) => (
                    <MonthGrid
                      key={i}
                      year={currentYear}
                      month={i}
                      dailyRecords={dailyRecords}
                      activeHabits={activeHabits}
                      isCurrentMonth={i === currentMonth}
                      onSelectDate={(d) => setInspectingDate(d)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GOALS TAB */}
          {activeTab === 'goals' && (
            <GoalsPanel 
              goals={goals}
              habitsList={activeHabits}
              dailyRecords={dailyRecords}
              onAddGoal={addGoal}
              onToggleGoal={toggleGoal}
              onDeleteGoal={deleteGoal}
            />
          )}

          {/* HISTORY & JOURNAL TAB */}
          {activeTab === 'history' && (
            <HistoryJournal 
              dailyRecords={dailyRecords}
              habitsList={habitsList}
              onSelectDate={(d) => setInspectingDate(d)}
            />
          )}
        </div>

        {/* Modals */}
        <HabitManagerModal 
          habitsList={habitsList}
          isOpen={isHabitManagerOpen}
          onClose={() => setIsHabitManagerOpen(false)}
          onAddHabit={addHabit}
          onUpdateHabit={updateHabit}
          onToggleActive={toggleHabitActive}
          onDeleteHabit={deleteHabit}
        />

        <DayDetailModal 
          dateStr={inspectingDate}
          dailyRecord={dailyRecords[inspectingDate]}
          habitsList={habitsList}
          isOpen={Boolean(inspectingDate)}
          onClose={() => setInspectingDate(null)}
          onToggleHabit={toggleHabit}
        />

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-white/40">
            MOMENTUM — Personal Transformation System • Phase 1: TRACK ME
          </p>
          <p className="text-xs text-accent-primary font-bold mt-2">
            BUILT BY YUGI
          </p>
        </footer>

      </div>
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
