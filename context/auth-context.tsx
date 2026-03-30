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

const STORAGE_KEY = 'resume_builder_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user info and update state
  const fetchAndSetUser = async (accessToken: string) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (!res.ok) throw new Error('Failed to fetch user info');
      
      const userData = await res.json();
      
      // Google usually returns 'picture', but we add fallbacks just in case
      const picture = userData.picture || userData.avatar || userData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=random`;

      const newUser: GoogleUser = {
        name: userData.name || 'Google User',
        email: userData.email || '',
        picture: picture,
        access_token: accessToken,
      };

      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      console.error('Error fetching user info:', err);
      return null;
    }
  };

  // Restore user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as GoogleUser;
        if (parsedUser.access_token) {
          setUser(parsedUser);
          
          // Background check to see if token is still valid AND refresh info
          fetchAndSetUser(parsedUser.access_token).then(updatedUser => {
            if (!updatedUser) {
              console.warn('Persisted session token expired or invalid');
              logout();
            }
          });
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    // Initialize Google API
    const init = async () => {
      try {
        await loadGoogleScript();

        // Check for access_token in URL hash (handles mobile redirects)
        if (typeof window !== 'undefined' && window.location.hash) {
          const params = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = params.get('access_token');

          if (accessToken) {
            console.log('Mobile/Redirect: Access token found in URL hash');
            setLoading(true);
            const success = await fetchAndSetUser(accessToken);
            if (success) {
              // Clear hash from URL
              window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
            }
            setLoading(false);
          }
        }
        
        initTokenClient(async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            setLoading(true);
            await fetchAndSetUser(tokenResponse.access_token);
            setLoading(false);
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
    localStorage.removeItem(STORAGE_KEY);
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
