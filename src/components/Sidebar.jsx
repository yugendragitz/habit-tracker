import MomentumMark from './MomentumMark';

export default function Sidebar({ activeTab, onTabChange, userName, currentStreak, onLogout }) {
  const navItems = [
    { id: 'today', label: 'Today', icon: '⚡' },
    { id: 'coach', label: 'AI Coach', icon: '🤖', badge: 'AI' },
    { id: 'fitness', label: 'Workout Log', icon: '🏋️‍♂️' },
    { id: 'nutrition', label: 'Nutrition & Water', icon: '🥗' },
    { id: 'body', label: 'Body Metrics', icon: '📐' },
    { id: 'analytics', label: 'Reviews', icon: '📊' },
    { id: 'habits', label: 'Habits', icon: '⚙️' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-40 bg-[#070912]/95 border-r border-white/10 backdrop-blur-xl p-4 justify-between">
      
      {/* Top Section: Brand & Navigation */}
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="px-3 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MomentumMark size={30} />
            <div>
              <h1 className="font-extrabold text-white text-base tracking-wider uppercase leading-none">MOMENTUM</h1>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest block mt-0.5">PERFORMANCE OS</span>
            </div>
          </div>

          <div className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold flex items-center gap-1">
            <span>🔥</span>
            <span>{currentStreak}d</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between relative transition-all duration-200 group
                  ${isActive 
                    ? 'bg-purple-500/15 text-white font-bold border border-purple-500/30' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-purple-500 rounded-r-full shadow-glow" />
                )}

                <div className="flex items-center gap-3 pl-1">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-500 text-white shadow-glow">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Section: Profile & Sign Out */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-500/30">
              {userName?.[0]?.toUpperCase() || 'Y'}
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none">{userName || 'Yugi'}</p>
              <span className="text-[10px] text-white/40 mt-0.5 block">Active Session</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="text-xs text-white/40 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all"
            title="Sign Out"
          >
            🚪
          </button>
        </div>
      </div>

    </aside>
  );
}
