import { useAuth } from '../context/AuthContext';

export default function TopHeaderBar({ userName, selectedDate, onSelectDate, currentStreak }) {
  const { user, logout } = useAuth();

  const isGuest = !user || user.isAnonymous;

  const handleAuthAction = () => {
    if (confirm(isGuest ? 'Switch to Log In / Sign Up screen?' : 'Are you sure you want to Log Out?')) {
      logout();
    }
  };

  return (
    <header className="w-full bg-[#0d0f19]/90 border border-white/10 backdrop-blur-xl py-3 px-4 sm:px-6 mb-6 rounded-2xl flex items-center justify-between shadow-lg">
      
      {/* Left: Brand & Date Navigator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-dark-900 font-black text-sm shadow-glow">
            ⚡
          </div>
          <div>
            <h1 className="font-extrabold text-white text-sm tracking-wider uppercase leading-none">MOMENTUM</h1>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest block mt-0.5">PERFORMANCE OS</span>
          </div>
        </div>

        {currentStreak !== undefined && (
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
            <span>🔥</span>
            <span>{currentStreak}d Streak</span>
          </div>
        )}
      </div>

      {/* Right: User Profile & Prominent Log In / Log Out Button */}
      <div className="flex items-center gap-3">
        {/* User Info Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs">
          <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-[11px] border border-purple-500/30">
            {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'G'}
          </div>
          <span className="text-white font-semibold">{user?.displayName || user?.email?.split('@')[0] || 'Guest User'}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isGuest ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'}`}>
            {isGuest ? 'Guest Mode' : 'Cloud Synced'}
          </span>
        </div>

        {/* PROMINENT LOG IN / LOG OUT BUTTON IN TOP BAR */}
        <button
          onClick={handleAuthAction}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-glow ${
            isGuest 
              ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:brightness-110' 
              : 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30'
          }`}
        >
          <span>{isGuest ? '🔑' : '🚪'}</span>
          <span>{isGuest ? 'Log In / Sign Up' : 'Log Out'}</span>
        </button>
      </div>

    </header>
  );
}
