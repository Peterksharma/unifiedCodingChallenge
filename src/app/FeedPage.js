"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFeed } from '../lib/feedService';

const FeedPage = ({ token }) => {
  const [feed, setFeed] = useState([]);
  const [cursor, setCursor] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFeed(token, cursor);
        setFeed((prevFeed) => [...prevFeed, ...data.posts]);
        setCursor(data.pagination.next_cursor);
      } catch (error) {
        console.error('Error fetching feed:', error);
        setError('Failed to fetch feed. Please try again.');
      }
    };

    fetchData();
  }, [token, cursor]);

  const loadMorePosts = () => {
    setCursor((prevCursor) => prevCursor);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Social Media Feed</h1>
      {feed.map((post, index) => (
        <div key={`${post.id}-${index}`}>
          <Link href={`/posts/${post.id}`}>
            <div>
              {post.author && (
                <div>
                  <h3>{post.author.display_name}</h3>
                </div>
              )}
              <p>{post.description}</p>
              <p>Likes: {post.likes}</p>
              {post.attachments && post.attachments.length > 0 && (
                <div>
                  <h4>Attachments:</h4>
                  {post.attachments.map((attachment, attachmentIndex) => (
                    <div key={`${attachment.id}-${attachmentIndex}`}>
                      <h5>{attachment.title}</h5>
                      <p>{attachment.description}</p>
                      {attachment.resource_type === 'action' && (
                        <div>
                          <p>Email Subject: {attachment.email_subject}</p>
                          <p>Email Body: {attachment.email_body}</p>
                          {attachment.targets && attachment.targets.officials && (
                            <div>
                              <h6>Targeted Officials:</h6>
                              <ul>
                                {attachment.targets.officials.map((official, officialIndex) => (
                                  <li key={`${official.id}-${officialIndex}`}>{official.name}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Link>
        </div>
      ))}
      <button onClick={loadMorePosts}>Load More</button>
    </div>
  );
};


export default FeedPage;