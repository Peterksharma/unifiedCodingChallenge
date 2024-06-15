// Post.js
import Link from 'next/link';
import styles from './Post.module.css';
import AuthorInfo from './authorInfo/AuthorInfo';
import Attachment from './mediaAttachments/Attachment';
import ChildPost from './childrenPost/ChildPost';

const Post = ({ post, likedPosts, likeCounts, handleLikeClick }) => {
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
    <div className={styles.postContainer}>
      <div className={styles.postContent}>
        {post.author && <AuthorInfo author={post.author} />}
        <p className={styles.postTitle}>Title: {post.title}</p>
        <p className={styles.postDescription}>Description: {post.description}</p>
        <p className={styles.postLikes}>Likes: {likeCounts[post.id] || post.likes}</p>
        <button
          className={styles.likeButton}
          onClick={() => handleLikeClick(post.id)}
        >
          {/* Teranary in the wild for mega fast switching capabilities! */}
          {likedPosts.includes(post.id) ? 'Unlike' : 'Like'}
        </button>
        {post.attachments && post.attachments.length > 0 && (
          <>
            <p>Media:</p>
            {renderAttachments(post.attachments)}
          </>
        )}
        {post.featured_children && post.featured_children.length > 0 && (
          <div className={styles.responseSection}>
            <div className={styles.responseCount}>
              <p>{post.featured_children.length} response(s)</p>
            </div>
            {post.featured_children.map((childPost) => (
              <ChildPost key={childPost.id} post={childPost} />
            ))}
          </div>
        )}
        <div>
        <Link href={`/posts/${post.id}`} className={styles.postLink}>
          Click here to see just this post.
        </Link>
      </div>
      </div>
    </div>
  );
};

export default Post;