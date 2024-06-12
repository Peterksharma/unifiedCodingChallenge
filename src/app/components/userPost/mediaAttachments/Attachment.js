import { useState } from 'react';
import Image from 'next/image';
import styles from './Attachment.module.css';

const Attachment = ({ attachment }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleMediaClick = () => {
    setIsFullScreen(!isFullScreen);
  };

  //Need to handle Images and Video
  const renderMedia = () => {
    if (attachment.mime_type.includes('image')) {
      return (
        <div className={`${styles.mediaWrapper} ${isFullScreen ? styles.fullScreen : ''}`}>
          <Image
            src={attachment.uri}
            alt={attachment.description || 'Image'}
            layout="fill"
            objectFit="contain"
            loading="lazy"
            onClick={handleMediaClick}
          />
        </div>
      );
    } else if (attachment.mime_type.includes('video')) {
      return (
        <div className={`${styles.mediaWrapper} ${isFullScreen ? styles.fullScreen : ''}`}>
          <video
            controls
            onClick={handleMediaClick}
          >
            <source src={attachment.uri} type={attachment.mime_type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  };

  return <div className={styles.attachmentWrapper}>{renderMedia()}</div>;
};

export default Attachment;