import Image from 'next/image';
import styles from './AuthorInfo.module.css';

const AuthorInfo = ({ author }) => {
  return (
    <div className={styles.authorInfo}>
      {author.profile_pic && (
        <Image
          src={author.profile_pic.uri}
          alt="Profile Photo"
          width={50}
          height={50}
          loading="lazy"
          className={styles.authorProfilePic}
        />
      )}
      <h3 className={styles.authorName}>{author.display_name}</h3>
    </div>
  );
};

export default AuthorInfo;