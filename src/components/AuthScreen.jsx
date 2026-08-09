import { useState, useRef, useEffect, memo } from 'react';
import { useMotion } from '../context/MotionContext';
import { useAuth } from '../context/AuthContext';
import MomentumLogo from './MomentumLogo';
import TransformationOrbital from './TransformationOrbital';

/**
 * AuthScreen Component - Next-Level MOMENTUM Authentication Experience
 */
const AuthScreen = memo(() => {
  const { gsap, DURATION, EASING } = useMotion();
  const { login, signup, guestLogin, error, clearError } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: DURATION.slow, ease: EASING.smooth }
      );
      hasAnimatedRef.current = true;
    }
  }, [gsap, DURATION, EASING]);

  const toggleMode = () => {
    clearError();
    if (formRef.current) {
      gsap.to(formRef.current, {
        opacity: 0, x: isLogin ? -20 : 20, duration: DURATION.fast, ease: EASING.smooth,
        onComplete: () => {
          setIsLogin(!isLogin);
          setFormData({ email: '', password: '', name: '' });
          gsap.fromTo(formRef.current,
            { opacity: 0, x: isLogin ? 20 : -20 },
            { opacity: 1, x: 0, duration: DURATION.fast, ease: EASING.smooth }
          );
        }
      });
    } else {
      setIsLogin(!isLogin);
      setFormData({ email: '', password: '', name: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, formData.name);
      }
      setIsSuccess(true);
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestAccess = () => {
    if (guestLogin) {
      guestLogin();
    } else {
      // Fallback guest bypass if auth context exposes guestLogin or window reload
      window.location.reload();
    }
  };

  // Success Transition View (~800ms)
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <MomentumLogo size={64} className="mb-6 shadow-glow" />
        <h2 className="text-3xl font-black text-white tracking-wider uppercase mb-2">MOMENTUM</h2>
        <p className="text-xs font-bold text-cyan-400 tracking-widest uppercase animate-pulse">
          YOUR SYSTEM IS READY
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050A] text-white flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      
      {/* Deep Atmospheric Lighting Layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-0 w-[650px] h-[650px] bg-blue-900/15 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-pink-900/15 rounded-full blur-[150px]" />
      </div>

      {/* Main Full-Page Composition */}
      <div 
        ref={containerRef} 
        style={{ opacity: 0 }}
        className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
      >
        
        {/* LEFT COLUMN: BRAND LAUNCH EXPERIENCE (55% / 7 cols) */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          
          {/* Brand Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3">
              <MomentumLogo size={40} className="shadow-glow" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase leading-none">
                  MOMENTUM
                </h1>
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-purple-400 uppercase block mt-1">
                  PERSONAL TRANSFORMATION SYSTEM
                </span>
              </div>
            </div>

            {/* Product Manifesto */}
            <p className="text-sm sm:text-base text-white/70 font-medium max-w-lg leading-relaxed pt-2">
              Track what you do. Understand how you progress. Become who you're building.
            </p>
          </div>

          {/* Procedural Orbital Transformation Graphic */}
          <div className="py-4">
            <TransformationOrbital />
          </div>

        </div>

        {/* RIGHT COLUMN: FLOATING AUTHENTICATION PANEL (45% / 5 cols) */}
        <div className="lg:col-span-5">
          <div className="w-full bg-[#0d0f19]/80 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div ref={formRef}>
              
              {/* Form Header */}
              <div className="mb-6">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block mb-1">
                  {isLogin ? 'AUTHENTICATION' : 'GET STARTED'}
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {isLogin ? 'WELCOME BACK' : 'CREATE YOUR MOMENTUM'}
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  {isLogin ? 'Your momentum is waiting.' : 'Start building your system today.'}
                </p>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-[#141827] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#141827] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-10 rounded-xl bg-[#141827] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs transition-colors p-1"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {!isLogin && (
                    <span className="text-[10px] text-white/40 block mt-1">
                      Must be at least 6 characters.
                    </span>
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
                    {error}
                  </div>
                )}

                {/* Primary Button: VIOLET -> BLUE -> CYAN Gradient */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:brightness-110 shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>AUTHENTICATING...</span>
                    </span>
                  ) : (
                    <span>{isLogin ? 'ENTER MOMENTUM →' : 'CREATE ACCOUNT →'}</span>
                  )}
                </button>
              </form>

              {/* Mode Switcher */}
              <div className="mt-6 text-center text-xs">
                <span className="text-white/40">
                  {isLogin ? "New to Momentum? " : "Already have an account? "}
                </span>
                <button 
                  onClick={toggleMode} 
                  className="text-purple-400 hover:text-cyan-400 font-bold transition-colors ml-1"
                >
                  {isLogin ? 'Create account' : 'Sign in'}
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
});

AuthScreen.displayName = 'AuthScreen';

export default AuthScreen;
