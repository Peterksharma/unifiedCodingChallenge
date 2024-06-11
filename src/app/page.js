"use client";

import { useContext } from 'react';
import FeedPage from '../../pages/feed/FeedPage';
import TokenContext from './TokenContext';

export default function Home() {
  const token = useContext(TokenContext);

  if (!token) {
    return <div>Loading...</div>;
  }

  return <FeedPage token={token} />;
}