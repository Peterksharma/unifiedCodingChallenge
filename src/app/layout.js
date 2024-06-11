"use client";

import { useState, useEffect, useCallback } from 'react';
import { loginUser } from '../lib/authService';
import './globals.css';
import TokenContext from './TokenContext';

export default function RootLayout({ children }) {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchToken = useCallback(async () => {
    try {
      const authToken = await loginUser();
      setToken(authToken);
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  if (isLoading) {
    return (
      <html>
        <body>
          <div>Loading...</div>
        </body>
      </html>
    );
  }

  return (
    <html>
      <body>
        <TokenContext.Provider value={token}>
          {children}
        </TokenContext.Provider>
      </body>
    </html>
  );
}