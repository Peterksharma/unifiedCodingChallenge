"use client";

import { useState, useEffect, useCallback } from 'react';
import { serialize } from 'cookie';
import { getToken } from '../lib/authService';
import './globals.css';
import TokenContext from './TokenContext';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default function RootLayout({ children }) {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchToken = useCallback(async () => {
    try {
      const authToken = await getToken();
      setToken(authToken);
      document.cookie = serialize('token', authToken, {
        maxAge: 60 * 60 * 24 * 1,
        path: '/',
      });
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return (
    <html>
      <body>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <TokenContext.Provider value={token}>
            {children}
          </TokenContext.Provider>
        )}
      </body>
    </html>
  );
}