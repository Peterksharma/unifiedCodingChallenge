import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { fetchPost } from '../../lib/feedService';

const PostPage = ({ token }) => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPost(token, id);
      setPost(data);
    };

    if (id) {
      fetchData();
    }
  }, [token, id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Post Details</h1>
      <img src={post.creator.profile_picture_url} alt="Profile" />
      <h3>{post.creator.display_name}</h3>
      <p>{post.description}</p>
      <p>Likes: {post.like_count}</p>
      <button onClick={() => router.back()}>Back to Feed</button>
    </div>
  );
};

export default function Post({ token }) {
  return <PostPage token={token} />;
}