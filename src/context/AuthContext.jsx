import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AUTH_KEY = 'habit_tracker_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Sign up - just save to localStorage
  const signup = async (email, password, displayName) => {
    setError(null);
    
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    const newUser = {
      email,
      displayName: displayName || email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`${AUTH_KEY}_cred`, btoa(email + ':' + password));
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    setUser(newUser);
    
    return newUser;
  };

  // Sign in - check localStorage
  const login = async (email, password) => {
    setError(null);
    
    const savedCred = localStorage.getItem(`${AUTH_KEY}_cred`);
    
    if (!savedCred) {
      setError('No account found. Please sign up first.');
      return;
    }
    
    const expectedCred = btoa(email + ':' + password);
    
    if (savedCred !== expectedCred) {
      setError('Invalid email or password');
      return;
    }
    
    const savedUser = localStorage.getItem(AUTH_KEY);
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      return userData;
    }
  };

  const logout = () => setUser(null);
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signup,
      login,
      logout,
      clearError,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
