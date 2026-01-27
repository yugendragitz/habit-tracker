import { useEffect, useRef, useState, useCallback } from 'react';
import { MotionProvider, useMotion } from './context/MotionContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header';
import HabitCard from './components/HabitCard';
import ProgressRing from './components/ProgressRing';
import ProgressBar from './components/ProgressBar';
import MonthGrid from './components/MonthGrid';
import YearHeatmap from './components/YearHeatmap';
import DailyChart from './components/DailyChart';
import MonthlyStats from './components/MonthlyStats';
import YearlyProgress from './components/YearlyProgress';
import AuthScreen from './components/AuthScreen';

// Hooks
import useHabits from './hooks/useHabits';

// Utils
import { getCurrentMonth, getCurrentYear } from './utils/dateUtils';

/**
 * App Content - Wrapped by MotionProvider
 * Uses motion system for all page transitions and animations
 */
function AppContent() {
  const { gsap, DURATION, EASING, transitionToScreen } = useMotion();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  
  const appRef = useRef(null);
  const contentRef = useRef(null);
  const [activeTab, setActiveTab] = useState('today');
  const tabContentRef = useRef(null);
  const hasInitialAnimatedRef = useRef(false);
  
  // Habit management hook
  const {
    currentDate,
    habits,
    isLoaded,
    toggleHabit,
    completedCount,
    totalCount,
    completionPercentage,
    habitList,
  } = useHabits();

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

  // Tab change with page transition
  const handleTabChange = useCallback((newTab) => {
    if (newTab === activeTab) return;
    
    // Animate out current content, then switch
    if (tabContentRef.current) {
      gsap.to(tabContentRef.current, {
        opacity: 0,
        y: 10,
        duration: DURATION.fast,
        ease: EASING.smooth,
        onComplete: () => {
          setActiveTab(newTab);
          transitionToScreen(newTab);
          // Animate in new content
          gsap.fromTo(tabContentRef.current,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: DURATION.normal, ease: EASING.smooth }
          );
        }
      });
    } else {
      setActiveTab(newTab);
      transitionToScreen(newTab);
    }
  }, [activeTab, gsap, DURATION, EASING, transitionToScreen]);

  // Show auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
          <span className="text-white/50">Loading...</span>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Loading state with animated spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
          <span className="text-white/50">Loading your habits...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={appRef}
      className="min-h-screen bg-dark-900 text-white"
    >
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header */}
        <Header />

        {/* User info bar */}
        <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-dark-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-cyan-400 flex items-center justify-center text-dark-900 font-bold text-sm">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm text-white/80">{user?.displayName || 'User'}</p>
              <p className="text-xs text-white/40">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            Sign Out
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'today', label: 'Today' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'yearly', label: 'Yearly' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-accent-primary text-dark-900 shadow-glow' 
                  : 'bg-dark-700/50 text-white/60 hover:bg-dark-600 hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content with ref for transitions */}
        <div ref={tabContentRef}>
        {/* Today Tab */}
        {activeTab === 'today' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left column: Habits list */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Daily progress summary */}
              <div className="card p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white/80 mb-1">
                    Today's Progress
                  </h2>
                  <p className="text-sm text-white/40">
                    {completedCount} of {totalCount} habits completed
                  </p>
                </div>
                <ProgressBar 
                  percentage={completionPercentage}
                  showPercentage={true}
                  height={10}
                  className="w-1/3"
                  label=""
                />
              </div>

              {/* Habits grid */}
              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-4">
                  Daily Habits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {habitList.map((habit, index) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      isCompleted={habits[habit.id] || false}
                      onToggle={toggleHabit}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              {/* Recent progress chart */}
              <DailyChart habitList={habitList} days={14} />
            </div>

            {/* Right column: Progress ring and stats */}
            <div className="space-y-6">
              
              {/* Progress ring card */}
              <div className="card p-6 flex flex-col items-center">
                <ProgressRing 
                  percentage={completionPercentage}
                  size={180}
                  strokeWidth={14}
                  label="Today"
                />
                
                {/* Completion message */}
                <div className="mt-4 text-center">
                  {completionPercentage === 100 ? (
                    <p className="text-accent-primary font-medium">
                      🎉 Perfect day! All habits complete!
                    </p>
                  ) : completionPercentage >= 75 ? (
                    <p className="text-white/60">
                      Almost there! Keep going! 💪
                    </p>
                  ) : completionPercentage >= 50 ? (
                    <p className="text-white/60">
                      Halfway done, don't stop now!
                    </p>
                  ) : (
                    <p className="text-white/60">
                      Let's build those habits! 🚀
                    </p>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div className="card p-5">
                <h3 className="font-semibold text-white/80 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  {habitList.slice(0, 5).map((habit) => (
                    <div key={habit.id} className="flex items-center gap-3">
                      <span className="text-xl">{habit.icon}</span>
                      <span className="flex-1 text-sm text-white/60 truncate">
                        {habit.name}
                      </span>
                      <span 
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${habits[habit.id] 
                            ? 'bg-accent-primary text-dark-900' 
                            : 'bg-white/10 text-white/40'
                          }
                        `}
                      >
                        {habits[habit.id] ? '✓' : '○'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivational card */}
              <div className="card p-5 bg-gradient-to-br from-accent-primary/10 to-cyan-500/10 border-accent-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🎯</span>
                  <h3 className="font-semibold text-white/80">Stay Focused</h3>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  Every habit you complete brings you one step closer to your goals. 
                  Consistency is the key to transformation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Tab */}
        {activeTab === 'monthly' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Monthly stats */}
            <MonthlyStats habitList={habitList} />

            {/* Current month grid */}
            <MonthGrid 
              year={currentYear}
              month={currentMonth}
              habitList={habitList}
              isCurrentMonth={true}
            />

            {/* All months overview */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-white/80 mb-4">Monthly Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }, (_, i) => (
                  <MonthGrid
                    key={i}
                    year={currentYear}
                    month={i}
                    habitList={habitList}
                    isCurrentMonth={i === currentMonth}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Yearly Tab */}
        {activeTab === 'yearly' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Yearly progress */}
              <YearlyProgress habitList={habitList} />
              
              {/* Monthly comparison chart placeholder using DailyChart */}
              <DailyChart habitList={habitList} days={30} height={200} />
            </div>

            {/* Year heatmap */}
            <YearHeatmap year={currentYear} habitList={habitList} />
          </div>
        )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-white/30">
            Built with discipline • Track your habits • Transform your life
          </p>
          <p className="text-xs text-white/20 mt-2">
            Data stored locally on your device
          </p>
          <p className="text-xs mt-4">
            <span className="text-accent-primary/60 font-medium">BUILT BY YUGI</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

/**
 * Main App Component - Wrapper with Providers
 */
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
