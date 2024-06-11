import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { fetchPost } from '../../src/lib/postService'; 
import Image from 'next/image';
import TokenContext from '../../src/app/TokenContext';
import { parse, serialize } from 'cookie';
import styles from './PostPage.module.css';

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


const ChildPost = ({ post }) => {
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

  return (
    <div className={styles.childPost}>
      <h3>{post.description}</h3>
      {post.author && (
        <>
          {post.author.profile_pic && (
            <Image
              src={post.author.profile_pic.uri}
              alt="Profile"
              width={30}
              height={30}
              priority
            />
          )}
          <p>{post.author.display_name}</p>
        </>
      )}
      <p>Likes: {post.likes}</p>
      {renderAttachments(post.attachments)}
      <p>Created At: {formatCreatedAt(post.created_at)}</p>

      {post.featured_children && post.featured_children.length > 0 && (
        <div className={styles.childPosts}>
          <h4>Responses:</h4>
          {post.featured_children.map((childPost) => (
            <ChildPost key={childPost.id} post={childPost} />
          ))}
        </div>
      )}
    </div>
  );
};

const PostPage = ({ post, error }) => {
  const router = useRouter();
  const token = useContext(TokenContext);

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

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

  return (
    <div>
      <h1>{post.description}</h1>
      {post.author && (
        <>
          {post.author.profile_pic && (
            <Image
              src={post.author.profile_pic.uri}
              alt="Profile"
              width={50}
              height={50}
              priority
            />
          )}
          <h3>{post.author.display_name}</h3>
        </>
      )}
      <p>Description: {post.description}</p>
      <p>Likes: {post.likes}</p>
      {renderAttachments(post.attachments)}
      <p>Created At: {formatCreatedAt(post.created_at)}</p>
      <h2>Responses:</h2>
      {post.featured_children.map((childPost) => (
        <ChildPost key={childPost.id} post={childPost} />
      ))}
      <button onClick={() => router.back()}>Back to Feed</button>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { req, params } = context;
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  try {
    const post = await fetchPost(token, params.id);
    if (!post) {
      return { notFound: true };
    }
    return {
      props: {
        post,
        error: null,
      },
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      props: {
        post: null,
        error: 'Failed to fetch post. Please try again',
      },
    };
  }
}

export default PostPage;
