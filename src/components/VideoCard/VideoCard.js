import React from 'react';
import styles from './VideoCard.module.css';
import HoverVideoPlayer from 'react-hover-video-player';
export default function VideoCard({ url, title, id, author }) {
    return (

        <div className={styles.container} id={id}>
            <HoverVideoPlayer
                videoSrc={url} className={styles.video}
            />
            <p className={styles.title}>{title}</p>
            <p className={styles.description}>{author}</p>
        </div>
    );
}