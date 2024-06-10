"use client";

import { useState, useEffect } from 'react';
import { loginUser } from '../lib/authService';
import './globals.css';

export default function RootLayout({ children }) {
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const authToken = await loginUser();
      setToken(authToken);
    };

    fetchToken();
  }, []);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}