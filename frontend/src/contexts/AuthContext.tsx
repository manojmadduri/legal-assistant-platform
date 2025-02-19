import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../services/api';
import toast from 'react-hot-toast';

export interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

interface UserProfile {
  id: string;
  email: string;
  companyName: string;
  businessType: string;
  industry: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  lastLoginAt?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateUserPassword: async () => {},
  updateUserProfile: async () => {},
  resendVerificationEmail: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (user: FirebaseUser) => {
    try {
      const response = await api.get('/users/profile');
      setUserProfile(response.data);
      
      // Update last login time
      await api.post('/users/login-timestamp');
      
      // Show verification reminder if email is not verified
      if (!user.emailVerified) {
        toast.error(
          'Please verify your email address. Check your inbox for the verification link.',
          { duration: 7000 }
        );
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserProfile(result.user);
      return result;
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many login attempts. Please try again later.');
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(result.user);
    return result;
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      // Clear any local storage or session data
      localStorage.removeItem('lastRoute');
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    try {
      if (!user) throw new Error('No user logged in');
      await updatePassword(user, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('No user logged in');
      const response = await api.put('/users/profile', data);
      setUserProfile(response.data);
    } catch (error) {
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      if (!user) throw new Error('No user logged in');
      await sendEmailVerification(user);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Please wait before requesting another verification email.');
      }
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserPassword,
    updateUserProfile,
    resendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
