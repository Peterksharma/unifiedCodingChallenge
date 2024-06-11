"use client";

import { useContext } from 'react';
import FeedPage from './FeedPage';
import TokenContext from './TokenContext';

export default function Home() {
  const token = useContext(TokenContext);

  console.log('Token in Home component:', token);

  if (!token) {
    return <div>Loading...</div>;
  }

  return <FeedPage token={token} />;
}