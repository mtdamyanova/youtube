import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideos } from '../../redux/selectors/videos';
import Layout from '../Layout/Layout';
import VideoCard from '../VideoCard/VideoCard';
import InfiniteScroll from "react-infinite-scroll-component";
import { setLoading, setNotLoading } from '../../redux/actions/loadingBar';
import { setAlertOn } from '../../redux/actions/alertNotifier';
import styles from './TrendingVideos.module.scss';
import { getUser } from '../../redux/selectors/user';

export default function TrendingVideos() {
    const dispatch = useDispatch();
    const videos = useSelector(getVideos);
    const user = useSelector(getUser);
    const [lastVideoIndex, setLastVideoIndex] = useState(0);
    const [visibleVideos, setVisibleVideos] = useState([]);
    const [scrollTop, setScrollTop] = useState(0);
    const [sorted, setSorted] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const videosLimitOnPage = 25;
    const newVideosOnScroll = videos.length < 4 ? videos.length : 4;

    useEffect(() => {
        setSorted(videos.sort((a, b) => b.views - a.views));
    }, [videos.length]);

    useEffect(() => {
        setVisibleVideos(sorted.slice(0, 16));
        setLastVideoIndex(sorted.length < 16 ? 0 : 15);
    }, [sorted.length]);

    const fetchMoreData = (e) => {
        if (scrollTop > window.scrollY) return;
        if (visibleVideos.length > videosLimitOnPage) {
            dispatch(setAlertOn('info', 'No more videos to show. Check again later or upload some.'));
            return setHasMore(false);
        }

        dispatch(setLoading());
        let newVideos;
        const endIndex = lastVideoIndex + newVideosOnScroll;
        if (endIndex > videos.length) {
            const diff = endIndex - videos.length;
            newVideos = videos.slice(newVideosOnScroll - diff, videos.length);
            newVideos.concat(videos.slice(0, diff));
            setLastVideoIndex(diff - 1);
        } else {
            newVideos = visibleVideos.slice(lastVideoIndex, endIndex);
            setLastVideoIndex(endIndex);
        }

        setTimeout(() => {
            setVisibleVideos([...visibleVideos, ...newVideos]);
            dispatch(setNotLoading());
        }, 1000)
    }

    return (
        <Layout>
            {user ? <>
                <h1 className={styles.welcomeText}>Trending videos those days...</h1>
                <InfiniteScroll
                    className={styles.videoContainer}
                    dataLength={visibleVideos.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    scrollThreshold='1px'
                    onScroll={() => {
                        if (scrollTop < window.scrollY) {
                            setScrollTop(window.scrollY);
                        }
                    }}
                >

                    {
                        visibleVideos.map(video => (
                            <VideoCard key={video.id + Math.random()} url={video.url} title={video.title} views={video.views} id={video.id} author={video.author} authorPhotoURL={video.authorPhotoURL} />
                        ))
                    }
                </InfiniteScroll>
            </> : <h1 className={styles.welcomeText}>Sign in first</h1>}
        </Layout >
    )
}