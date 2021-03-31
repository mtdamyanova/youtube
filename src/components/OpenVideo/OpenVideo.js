import React, { useEffect, useState } from 'react';
import { Redirect, Route, Router, useHistory, useParams } from "react-router-dom";
import styles from './OpenVideo.module.scss';
import { getVideo } from "../../service";
import ReactPlayer from 'react-player';
import { auth } from '../../firebase';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import LikeOrDislikeVideo from './LikeOrDislikeVideo';
import { Input, Link } from '@material-ui/core'
import { getAllVideos } from '../../service';
import VideoCard from '../VideoCard/VideoCard';
import { db } from '../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { likeVideo, dislikeVideo, likeIt } from '../../redux/actions/likeOrDislike';

export default function OpenVideo({ sidebar }) {
    const history = useHistory();
    const { id } = useParams();
    const [video, setVideo] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [user, setUser] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
            }
        });
    }, [user]);

    useEffect(() => {
        db.collection('videos').doc(id).get()
            .then(res => {
                setVideo({ ...res.data() });
            })
    }, [id])

    const onInputChange = (e) => {
        setInputValue(e.currentTarget.value);
    }
    const dispatch = useDispatch();
    useEffect(() => {
        likeIt(video, id);
        // console.log(video);
        console.log(id);
    }, [video, id])

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && inputValue) {
            if (video.comments) {
                video.comments.unshift({ comment: inputValue, user: user.displayName, photoURL: user.photoURL, userId: user.uid });
            }
            setInputValue('');
        }
    }

    const numberLikes = (
        <><ThumbUp className={isLiked ? styles.liked : styles.button} onClick={() => { dispatch(likeIt(video, id)) }} /><span>{video.likes}</span></>
    );
    const loggedNumberLikes = (
        <><LikeOrDislikeVideo button={<ThumbUp className={styles.button} />} content={'Like this video?'} /><span>{video.likes}</span></>
    );
    const numberDislikes = (
        <><ThumbDownIcon className={isDisliked ? styles.disliked : styles.button} onClick={() => { dispatch(dislikeVideo()) }} /><span>{video.dislikes}</span></>
    );
    const loggedNumberDIslikes = (
        <><LikeOrDislikeVideo button={<ThumbDownIcon className={styles.button} />} content={`Don't like this video?`} /><span>{video.dislikes}</span></>
    );

    return (
        <div className={sidebar ? styles.notActive : styles.mainContainer}>
            <div>
                <div><ReactPlayer url={video.url} controls playing={true} className={styles.video} />
                    <div className={styles.likesContainer}>
                        <div className={styles.hashtags}>
                            {`#${video.title} #video# ${video.views} #youtube`}
                        </div>
                        <div className={styles.thumbs}>
                            {user ? <>{numberLikes}</> : <>{loggedNumberLikes}</>}
                            {user ? <>{numberDislikes}</> : <>{loggedNumberDIslikes}</>}
                        </div>
                        <div>{video.views} views</div>
                    </div>
                    <p className={styles.info}>{video.title}</p>
                    <a href={`/user/${video.authorID}`}>{video.author}</a>
                    <div>
                        <div className={styles.commentsContainer}>
                            <div onClick={() => !user ? history.push('/signin') : null}>
                                < Input placeholder='Добавяне на публичен коментар...' className={styles.input} onChange={onInputChange} onKeyPress={handleKeyPress} value={inputValue} />
                            </div>
                            {video.comments ?
                                video.comments.map((currentComment, index) => (
                                    <div key={index} className={styles.mainComm} >
                                        <div className={styles.userLogo} onClick={() => history.push(`/user/${currentComment.userId}`)}>
                                            {currentComment.photoURL ? <img className={styles.userPic} src={currentComment.photoURL} alt='user logo' /> : <h1>{currentComment.user[0]}</h1>}</div>
                                        <div className={styles.commentsContainer}>
                                            <div className={styles.someComment}>
                                                <p className={styles.userName}>{currentComment.user}</p>
                                                <p className={styles.comment}>{currentComment.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : <div className={styles.addFirstComment}>Add your first comment...</div>}
                        </div>

                    </div>
                </div>
            </div>
            {/* <div className={styles.otherVideos}>
                {videos.map(video => (
                    <Link to={`/video/${video.id}`} className='link' key={video.id}>
                        <div>
                            <VideoCard url={video.url} title={video.title} duration={video.duration} />
                        </div>
                    </Link>
                ))}
            </div> */}
        </div>
    );
}