import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  auth, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  googleProvider
} from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign up function
  const signup = async (email, password) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (err) {
      let errorMessage = 'Failed to create account';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (err) {
      let errorMessage = 'Invalid email or password';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Google Sign In - NEW!
  const signInWithGoogle = async () => {
    try {
      setError('');
      // This opens a popup window for Google login
      const result = await signInWithPopup(auth, googleProvider);
      
      // You can get the Google Access Token if needed
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      
      // The signed-in user info
      const user = result.user;
      console.log('Google sign in successful:', user.email);
      
      return { success: true, user };
    } catch (err) {
      console.error('Google sign in error:', err);
      
      let errorMessage = 'Failed to sign in with Google';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in cancelled - popup was closed';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Sign in popup was blocked by browser';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email but different sign-in method';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
      return { success: true };
    } catch (err) {
      setError('Failed to log out');
      return { success: false, error: 'Failed to log out' };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    signInWithGoogle,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};