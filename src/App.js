import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useRouteMatch,
} from "react-router-dom";
import './App.scss';
import './reset.css';
import SignUp from './Components/SignUp/SignUp';
import ErrorPage from './Components/ErrorPage/ErrorPage';
import OpenVideo from './Components/OpenVideo/OpenVideo';
import SignIn from "./Components/SignIn/SignIn";
import ResetPassword from './Components/ResetPassword/ResetPassword';
import SignOut from "./Components/SignOut/SignOut";
import UploadVideo from './Components/UploadVideo/UploadVideo';
import Search from "./Components/Search/Search";
import UserProfile from "./Components/UserProfile/UserProfile";
import { auth, db } from "./firebase";
import VoiceControl from './Components/VoiceControl/VoiceControl';
import ProgressBar from "./Components/ProgressBar/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from './redux/actions/user';
import { getUser } from './redux/selectors/user';
import { getIsLoading } from "./redux/selectors/loading";
import HomePage from "./Components/HomePage/HomePage";
import { changeThemeColors } from './utils';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const isLoading = useSelector(getIsLoading);
  const theme = useSelector(state => state.theme.theme);

  useEffect(() => {
    changeThemeColors(theme);
  }, [theme])

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(logout());
      }
    })
  }, [dispatch]);

  // useEffect(() => {
  //   console.log('User: ', user)
  //   if (user && user.uid) {
  //     db.collection('videos').where('authorID', '==', 'RfXjuwWcP9QIlS8D0vtyA8Cipix2').onSnapshot(snapshot => {
  //       console.log('Snapshot: ', snapshot)
  //       snapshot.forEach(doc => {
  //         console.log('Real Time update: ', doc.data())

  //         // If the liked by array was changed!
  //         //  disliked by 
  //       })
  //     })
  //   }

  // }, [user])

  return (
    <Router>
      <VoiceControl />
      <>
        <ProgressBar isOn={isLoading} />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/video/:id" component={OpenVideo} />
          <Route path="/search/:id" component={Search} />
          <Route exact path="/search">
            <Redirect to="/" />
          </Route>
          <Route path="/upload" component={UploadVideo} />
          <Route path="/user/:id" component={UserProfile} />
          <Route path="/signout"
            render={() => {
              if (auth.currentUser && user) {
                return <SignOut />
              } else {
                return <Redirect to='/' />
              }
            }} />
          <Route path="/signup"
            render={() => {
              if (auth.currentUser && user) {
                return <Redirect to='/' />
              } else {
                return <SignUp />
              }
            }} />
          <Route path="/signin"
            render={() => {
              if (auth.currentUser && user) {
                return <Redirect to='/' />
              } else {
                return <SignIn />
              }
            }}
          />
          <Route path="/reset"
            render={() => {
              if (auth.currentUser && user) {
                return <Redirect to='/' />
              } else {
                return <ResetPassword />
              }
            }} />
          <Route path="*">
            <ErrorPage />
          </Route>
        </Switch>
      </>
    </Router >
  );
}