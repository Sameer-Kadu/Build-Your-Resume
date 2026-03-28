'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadGoogleScript, initTokenClient, loginWithGoogle, logoutGoogle, GoogleUser } from '@/lib/google-auth';

interface AuthContextType {
  user: GoogleUser | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Google API
    const init = async () => {
      try {
        await loadGoogleScript();
        
        initTokenClient(async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            setLoading(true);
            // Fetch user profile info using access token
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const userData = await res.json();
              
              setUser({
                name: userData.name,
                email: userData.email,
                picture: userData.picture,
                access_token: tokenResponse.access_token,
              });
            } catch (err) {
              console.error('Failed to fetch user profile', err);
            } finally {
              setLoading(false);
            }
          }
        });
      } catch (err) {
        console.error('GIS Error:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = () => {
    loginWithGoogle();
  };

  const logout = () => {
    if (user?.access_token) {
      logoutGoogle(user.access_token);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
