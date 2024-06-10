"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFeed } from '../lib/feedService';

const FeedPage = ({ token }) => {
  const [feed, setFeed] = useState([]);
  const [cursor, setCursor] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFeed(token, cursor);
      setFeed((prevFeed) => [...prevFeed, ...data.posts]);
      setCursor(data.pagination.next_cursor);
    };

    fetchData();
  }, [token, cursor]);

  const loadMorePosts = () => {
    setCursor((prevCursor) => prevCursor);
  };

  return (
    <div>
      <h1>Social Media Feed</h1>
      {feed.map((post) => (
        <div key={post.id}>
          <Link href={`/posts/${post.id}`}>
            <a>
              <img src={post.creator.profile_picture_url} alt="Profile" />
              <h3>{post.creator.display_name}</h3>
              <p>{post.description}</p>
              <p>Likes: {post.like_count}</p>
            </a>
          </Link>
        </div>
      ))}
      <button onClick={loadMorePosts}>Load More</button>
    </div>
  );
};

export default function Home({ token }) {
  return <FeedPage token={token} />;
}