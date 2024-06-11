"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchFeed } from '../../src/lib/feedService';
import styles from './FeedPage.module.css';

const Attachment = ({ attachment }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleMediaClick = () => {
    setIsFullScreen(!isFullScreen);
  };

  const renderMedia = () => {
    if (attachment.mime_type.includes('image')) {
      return (
        <Image
          src={attachment.uri}
          alt={attachment.description || 'Image'}
          width={250}
          height={250}
          loading="lazy"
          onClick={handleMediaClick}
          className={isFullScreen ? styles.fullScreenImage : ''}
        />
      );
    } else if (attachment.mime_type.includes('video')) {
      return (
        <video
          width="250"
          height="250"
          controls
          onClick={handleMediaClick}
          className={isFullScreen ? styles.fullScreenVideo : ''}
        >
          <source src={attachment.uri} type={attachment.mime_type} />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  return (
    <div className={styles.attachmentWrapper}>
      {renderMedia()}
    </div>
  );
};

const ChildPost = ({ post, renderAttachments }) => {
  return (
    <div className={styles.childPostContainer}>
      <div className={styles.postContent}>
        {post.author && (
          <div className={styles.authorInfo}>
            {post.author.profile_pic && (
              <Image
                src={post.author.profile_pic.uri}
                alt="Profile Photo"
                width={30}
                height={30}
                loading="lazy"
                className={styles.authorProfilePic}
              />
            )}
            <h4 className={styles.authorName}>{post.author.display_name}</h4>
          </div>
        )}
        <p className={styles.postDescription}>{post.description}</p>
        {renderAttachments(post.attachments)}
      </div>
      {post.featured_children && post.featured_children.length > 0 && (
        <div className={styles.childPosts}>
          {post.featured_children.map((childPost) => (
            <ChildPost key={childPost.id} post={childPost} renderAttachments={renderAttachments} />
          ))}
        </div>
      )}
    </div>
  );
};


const FeedPage = ({ token }) => {
  const [feed, setFeed] = useState([]);
  const [cursor, setCursor] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    const storedLikedPosts = localStorage.getItem('likedPosts');
    if (storedLikedPosts) {
      setLikedPosts(JSON.parse(storedLikedPosts));
    }
  }, []);

  useEffect(() => {
    const storedLikeCounts = localStorage.getItem('likeCounts');
    if (storedLikeCounts) {
      setLikeCounts(JSON.parse(storedLikeCounts));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFeed(token, cursor);
        setFeed(prevFeed => [...prevFeed, ...data.posts]);
        setCursor(data.pagination.next_cursor);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching feed:', error);
        setError('Failed to fetch feed. Please try again.');
        setIsLogading(false);
      }
    };

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

    setLikedPosts(updatedLikedPosts);
    localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
    localStorage.setItem('likeCounts', JSON.stringify(likeCounts));
  };

  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleString();
  };

  const renderAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) {
      return null;
    }

    return (
      <div className={styles.attachmentContainer}>
        {attachments.map((attachment) => (
          <div key={attachment.id}>
            {attachment.resource_type === 'asset' && (
              <Attachment attachment={attachment} />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (error) {
    return <div>{error}</div>;
  }

  //Whats wrong with the titles? I think titles/descriptions are flipped.
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.header}>Social Media Feed</h1>
      {feed.map((post) => (
        <div key={post.id} className={styles.postContainer}>
          <div className={styles.postContent}>
            {post.author && (
              <div className={styles.authorInfo}>
                {post.author.profile_pic && (
                  <Image
                    src={post.author.profile_pic.uri}
                    alt="Profile Photo"
                    width={50}
                    height={50}
                    loading="lazy"
                    className={styles.authorProfilePic}
                  />
                )}
                <h3 className={styles.authorName}>{post.author.display_name}</h3>
              </div>
            )}
            <p className={styles.postTitle}>Title: {post.title}</p>
            <p className={styles.postDescription}>Description: {post.description}</p>
            <p className={styles.postLikes}>
              Likes: {likeCounts[post.id] || post.likes}
            </p>
            <button
              className={styles.likeButton}
              onClick={() => handleLikeClick(post.id)}
            >
              {likedPosts.includes(post.id) ? 'Unlike' : 'Like'}
            </button>
            {renderAttachments(post.attachments)}
            <p>Created At: {formatCreatedAt(post.created_at)}</p>
          </div>

          {post.featured_children && post.featured_children.length > 0 && (
            <div className={styles.childPostsContainer}>
              {post.featured_children.map((childPost) => (
                <div key={childPost.id} className={styles.childPostWrapper}>
                  <ChildPost post={childPost} renderAttachments={renderAttachments} />
                </div>
              ))}
            </div>
            
          )}
                    <Link href={`/posts/${post.id}`} className={styles.postLink}>
            <p>Click here to see just this post.</p>
          </Link>
        </div>
      ))}
      <div ref={loaderRef} className={styles.loadingContainer}>
        {isLoading && <div>Loading more posts...</div>}
      </div>
    </div>
  );
};

export default FeedPage;