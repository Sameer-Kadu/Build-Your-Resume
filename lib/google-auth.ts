/**
 * Google Identity Services (GIS) Auth Utility
 * This handles the client-side Google OAuth 2.0 flow (Token Model).
 */

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: any) => void;
          }) => any;
          requestAccessToken: (options: { prompt: string }) => void;
          revoke: (accessToken: string, callback: () => void) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  access_token: string;
}

let tokenClient: any = null;

/**
 * Load the GIS script dynamically
 */
export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return;
    if (window.google) return resolve();

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
    document.head.appendChild(script);
  });
};

/**
 * Initialize the Token Client
 */
export const initTokenClient = (callback: (tokenResponse: any) => void) => {
  if (typeof window !== 'undefined' && window.google) {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: callback,
    });
  }
};

/**
 * Trigger the OAuth flow
 */
export const loginWithGoogle = () => {
  if (tokenClient) {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    console.error('Token client not initialized');
  }
};

/**
 * Revoke the token (Logout)
 */
export const logoutGoogle = (accessToken: string) => {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.oauth2.revoke(accessToken, () => {
      console.log('Token revoked');
    });
  }
};
