// ChildPost.js
import styles from './ChildPost.module.css';
import AuthorInfo from '../authorInfo/AuthorInfo';
import Attachment from '../mediaAttachments/Attachment';

const ChildPost = ({ post }) => {
  const renderAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) {
      return null;
    }


  // Commented out to turn off the photos in the main feed.
  //
  //   return (
  //     <div className={styles.attachmentContainer}>
  //       {attachments.map((attachment) => (
  //         <div key={attachment.id}>
  //           {attachment.resource_type === 'asset' && (
  //             <Attachment attachment={attachment} />
  //           )}
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  //the link that lets to know if there are and reponses
  return (
    <div className={styles.childPostContainer}>
      <div className={styles.postContent}>
        {post.author && <AuthorInfo author={post.author} />}
        <p className={styles.postDescription}>{post.description}</p>
        {renderAttachments(post.attachments)}
      </div>
      {post.featured_children && post.featured_children.length > 0 && (
        <div className={styles.childPosts}>
          {post.featured_children.map((childPost) => (
            <ChildPost key={childPost.id} post={childPost} />
          ))}
        </div>
      )}
    </div>
  );
};
}

export default ChildPost;