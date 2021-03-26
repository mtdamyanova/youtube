import { Link } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { auth } from '../../firebase';
import { getUser, getUserVideos } from '../../service';
import VideoCard from '../VideoCard/VideoCard';
import ScrollableTabsButtonAuto from './CurrentUserTabs';

export default function UserProfile({ slidebar, slideBarContainer }) {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [myVideos, setMyVideos] = useState([]);
    const [history, setHistory] = useState([]);
    const [liked, setLiked] = useState([]);

    useEffect(() => {
        getUser(id)
            .then(res => {
                setUser(res);
                return Promise.all([getUserVideos(res.videos), getUserVideos(res.history), getUserVideos(res.liked)]);
            })
            .then(res => {
                setMyVideos(res[0]);
                setHistory(res[1]);
                setLiked(res[2]);
            })
    }, [id]);

    return (
        <div className='mainContainer'>
            <div className={slidebar ? 'open' : 'close'}>
                {slideBarContainer}
            </div>
            <div className='videoContainer'>
                {/* if is logged in */}
                <ScrollableTabsButtonAuto videos={myVideos} history={history} liked={liked} />
                {/* else */}
            </div>
        </div>
    )
}