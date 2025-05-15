import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { setAuthToken } from '@/apis/userApi';

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setAuthState({ user, loading: false, error: null });
        
        if (user) {
          const token = await user.getIdToken();
          setAuthToken(token);
        } else {
          setAuthToken(null);
        }
      },
      (error) => {
        setAuthState({ user: null, loading: false, error: error.message });
        setAuthToken(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof Error) {
        setAuthState((prev) => ({ ...prev, error: error.message }));
      }
      throw error;
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const signup = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof Error) {
        setAuthState((prev) => ({ ...prev, error: error.message }));
      }
      throw error;
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signOut(auth);
      setAuthToken(null);
    } catch (error) {
      if (error instanceof Error) {
        setAuthState((prev) => ({ ...prev, error: error.message }));
      }
      throw error;
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    signup,
    logout,
  };
} 