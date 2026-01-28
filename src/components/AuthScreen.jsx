import { useState, useRef, useEffect, memo } from 'react';
import { useMotion } from '../context/MotionContext';
import { useAuth } from '../context/AuthContext';

/**
 * AuthScreen Component - Simple login/signup
 */
const AuthScreen = memo(() => {
  const { gsap, DURATION, EASING } = useMotion();
  const { login, signup, error, clearError } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: DURATION.slow, ease: EASING.smooth }
    );
    hasAnimatedRef.current = true;
  }, [gsap, DURATION, EASING]);

  const toggleMode = () => {
    clearError();
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div ref={containerRef} style={{ opacity: 0 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-primary via-cyan-400 to-accent-primary flex items-center justify-center shadow-glow">
            <span className="text-4xl font-black text-dark-900">YH</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Habit Tracker</h1>
          <p className="text-white/50 text-sm">
            {isLogin ? 'Welcome back!' : 'Start building better habits'}
          </p>
          <p className="text-white/20 text-xs mt-2">BUILT BY YUGI</p>
        </div>

        <div className="card p-6 sm:p-8">
          <div ref={formRef}>
            <h2 className="text-xl font-semibold text-white mb-6">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm text-white/60 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-primary/50 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-white/60 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-primary/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-primary/50 transition-all"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-semibold text-dark-900 bg-gradient-to-r from-accent-primary to-cyan-400 hover:shadow-glow transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-white/40 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button onClick={toggleMode} className="text-accent-primary hover:text-cyan-400 text-sm font-medium">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AuthScreen.displayName = 'AuthScreen';
export default AuthScreen;
