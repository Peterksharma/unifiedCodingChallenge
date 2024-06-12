"use client";

import { useState, useEffect, useRef } from 'react';
import { fetchFeed } from '../../src/lib/feedService';
import styles from './FeedPage.module.css';
import Post from '../../src/app/components/userPost/Post';
 

const FeedPage = ({ token }) => {
  const [feed, setFeed] = useState([]);
  const [cursor, setCursor] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});

  //See if there are likes
  useEffect(() => {
    const storedLikedPosts = localStorage.getItem('likedPosts');
    if (storedLikedPosts) {
      setLikedPosts(JSON.parse(storedLikedPosts));
    }
  }, []);

  //Update the likes
  useEffect(() => {
    const storedLikeCounts = localStorage.getItem('likeCounts');
    if (storedLikeCounts) {
      setLikeCounts(JSON.parse(storedLikeCounts));
    }
  }, []);

  //Implements the loading page.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFeed(token, cursor);
        setFeed(prevFeed => [...prevFeed, ...data.posts]);
        setCursor(data.pagination.next_cursor);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch feed. Please try again.');
        setIsLoading(false);
      }
    };

    //Page watcher for the "Lazy load" of the feed itself.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          fetchData();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [token, cursor, isLoading]);

  //Allows the user to Like and then Unlike a liked post.
  //Leveraged local storage for this to make it persistance for the test.
  const handleLikeClick = (postId) => {
    const updatedLikedPosts = [...likedPosts];
    const index = updatedLikedPosts.indexOf(postId);

    if (index === -1) {
      updatedLikedPosts.push(postId);
      setLikeCounts((prevLikeCounts) => ({
        ...prevLikeCounts,
        [postId]: (prevLikeCounts[postId] || 0) + 1,
      }));
    } else {
      updatedLikedPosts.splice(index, 1);
      setLikeCounts((prevLikeCounts) => ({
        ...prevLikeCounts,
        [postId]: prevLikeCounts[postId] - 1,
      }));
    }

    //Send it!
    setLikedPosts(updatedLikedPosts);
    localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
    localStorage.setItem('likeCounts', JSON.stringify(likeCounts));
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.header}>Social Media Feed</h1>
      {feed.map((post) => (
        <Post
          key={post.id}
          post={post}
          likedPosts={likedPosts}
          likeCounts={likeCounts}
          handleLikeClick={handleLikeClick}
        />
      ))}
      <div ref={loaderRef} className={styles.loadingContainer}>
        {isLoading && <div>Loading more posts...</div>}
      </div>
    </div>
  );
};

export default FeedPage