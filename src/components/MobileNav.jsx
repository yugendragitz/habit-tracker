export default function MobileNav({ activeTab, onTabChange }) {
  const primaryTabs = [
    { id: 'today', label: 'Today', icon: '⚡' },
    { id: 'coach', label: 'Coach', icon: '🤖' },
    { id: 'fitness', label: 'Workout', icon: '🏋️‍♂️' },
    { id: 'nutrition', label: 'Fuel', icon: '🥗' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-nav px-3 py-2 flex items-center justify-around">
      {primaryTabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-accent-primary font-bold scale-105' : 'text-white/50 hover:text-white'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
