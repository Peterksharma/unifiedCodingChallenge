import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { fetchPost } from '../../lib/feedService';

const PostPage = ({ token }) => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPost(token, id);
        if (data) {
          setPost(data);
        } else {
          setError('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to fetch post. Please try again.');
      }
    };
  
    if (id) {
      fetchData();
    }
  }, [token, id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Post Details</h1>
      {post.author && (
        <>
          <img src={post.author.profile_pic} alt="Profile" />
          <h3>{post.author.display_name}</h3>
        </>
      )}
      <p>{post.description}</p>
      <p>Likes: {post.likes}</p>
      <button onClick={() => router.back()}>Back to Feed</button>
    </div>
  );
};

export default function Post({ token }) {
  return <PostPage token={token} />;
}