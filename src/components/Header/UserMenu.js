import React, { useEffect, useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Tooltip } from '@material-ui/core';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import styles from './Header.module.css';
import { Link, useHistory } from "react-router-dom";
import { auth } from '../../firebase';

export default function UserMenu() {
    const history = useHistory();
    const [user, setUser] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
            }
        });
    }, []);
    const [openNotify, setOpenNotify] = useState(false);
    const handleClickNotify = () => {
        setOpenNotify((prev) => !prev);
    };
    const handleClickAwayNotify = () => {
        setOpenNotify(false);
    };
    const [openProfile, setOpenProfile] = useState(false);
    const handleClickProfile = () => {
        setOpenProfile((prev) => !prev);
    };
    const handleClickAwayProfile = () => {
        setOpenProfile(false);
    };

    return (
        <div id={styles.userIcons}>
            <Tooltip title="Upload a video" placement="bottom">
                <VideoCallIcon fontSize='default' className={styles.icons} onClick={() => history.push('/upload')} />
            </Tooltip>
            <ClickAwayListener
                mouseEvent="onMouseDown"
                touchEvent="onTouchStart"
                onClickAway={handleClickAwayNotify}
            >
                <div className={styles.dropdownContainer} >
                    <Tooltip title="Notifications" placement="bottom">
                        <NotificationsIcon className={styles.icons} onClick={handleClickNotify} />
                    </Tooltip>
                    {openNotify ? (
                        <div id={styles.dropdownNotify} className={styles.dropdown}>
                            <h4 className={styles.notifyTitle}>Notifications</h4>
                            <div className={styles.line}></div>
                            <NotificationsIcon fontSize="large" id={styles.bigNotifyIcon} />
                            <p className={styles.greyText}>No new notifications.</p>
                        </div>
                    ) : null}
                </div>
            </ClickAwayListener>

            <ClickAwayListener
                mouseEvent="onMouseDown"
                touchEvent="onTouchStart"
                onClickAway={handleClickAwayProfile}
            >
                <div className={styles.dropdownContainer} >
                    <Tooltip title="My profile" placement="bottom">
                        <h1 onClick={handleClickProfile} className={styles.userIcon}>{user ? user.displayName[0] : null}</h1>
                    </Tooltip>
                    {openProfile ? (
                        <ul className={styles.dropdown}>
                            <li className={styles.displayFlex}>
                                <h1 className={styles.userIcon}>{user ? user.displayName[0] : null}</h1>
                                <div>
                                    <h4 className={styles.marginNone}>{user ? user.displayName : null}</h4>
                                    <p className={styles.marginNone}>{user ? user.email : null}</p>
                                </div>
                            </li>
                            <div className={styles.line}></div>
                            <Link to='/channel' className={styles.links}>
                                <li className={styles.listItem}>
                                    <AccountBoxIcon className={styles.iconColorGrey} />
                                    <p className={styles.text}>My channel</p>
                                </li>
                            </Link>
                            <div className={styles.line}></div>
                            <Link to='/signout' className={styles.links}>
                                <li className={styles.listItem}>
                                    <ExitToAppIcon className={styles.iconColorGrey} />
                                    <p className={styles.text}>Sign out</p>
                                </li>
                            </Link>
                        </ul>
                    ) : null}
                </div>
            </ClickAwayListener>
        </div >
    );
}