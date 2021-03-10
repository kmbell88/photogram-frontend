import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PhotogramContext } from '../contexts/PhotogramContext';
import defaultProfPic from '../assets/images/img-avatar.png';
import LoginForm from './LoginForm';

const Sidebar = () => {
  const [ filteredUsers, setFilteredUsers ] = useState(null);
  const { allUsers, user } = useContext(PhotogramContext);

  useEffect(() => {
    if (allUsers && user)
      setFilteredUsers(allUsers.filter(filtered => filtered._id !== user._id))
  }, [allUsers, user]);

  return (
    <div className="sidebar-container">
      { !user ?
        <LoginForm /> :
        <>
        { user && allUsers && filteredUsers &&
          <>
          <SidebarUserProfile user={user} />
          <div className="suggestions">
            <div className="suggestion-text grey-text">Suggestions For You</div>
            {filteredUsers.slice(0,5).map(filtered => <SuggestedUser key={filtered._id} profile={filtered} />) }
          </div>
          </>
        }
        </>
      }
      <SidebarFooter />
    </div>
  );
};

const SidebarUserProfile = ({ user }) => {
  return (
    <div className="user-info">
      <Link to={`/${user.username}`}><img src={ user.profIcon || defaultProfPic } className="profile-pic" style={{ height: '55px', width: '55px'}} /></Link>
      <div className="suggestions-container-username">
        <span className="username"><Link to={`/${user.username}`}>{user.username}</Link></span>
        <span className="fullname grey-text">{user.displayName}</span>
      </div>
    </div>
  );
};

const SuggestedUser = ({ profile }) => {
  const [ isFollowing, setIsFollowing ] = useState(false);
  const { user, usersFollowed, setUsersFollowed } = useContext(PhotogramContext);

  useEffect(() => {
    if (usersFollowed && profile)
      setIsFollowing(usersFollowed.some(followed => followed._id === profile._id));
  }, [usersFollowed]);

  const handleFollow = () => {
    if (!user) {
      alert('Please login or register to follow');
      return;
    }

    axios.post(`${process.env.REACT_APP_BASE_URL}users/updateFollow`, {
      userIdOne: user._id,
      userIdTwo: profile._id
    })
    .then(res => {
      if (!isFollowing) {
        setUsersFollowed([...usersFollowed, profile]);
      }
      else {
        setUsersFollowed(oldFollowing => oldFollowing.filter(following => following._id !== profile._id));
      }
    })
    .catch(error => console.log(error));
  };

  return (
    <div className="suggested-user">
      <div className="user-info">
        <Link to={`/${profile.username}`}><img src={profile.profIcon || defaultProfPic} className="profile-pic" style={{ height: '55px', width: '55px'}} /></Link>
        <div className="suggestions-container-username">
          <span className="username"><Link to={`/${profile.username}`}>{profile.username}</Link></span>
          <span className="fullname grey-text">{profile.displayName}</span>
        </div>
      </div>
        { user && 
          <>
          { isFollowing ?
            <div className="follow-text" onClick={handleFollow} style={{ cursor: 'pointer'}}>Following</div> :
            <div className="follow-text" onClick={handleFollow} style={{ cursor: 'pointer'}}>Follow</div>
          }
          </>
        }
        { !user && <div className="follow-text" style={{cursor: "pointer"}} onClick={handleFollow}>Follow</div> }
    </div>
  );
};

const SidebarFooter = () => {
  return (
    <footer>
      <div className="app-info">
        <ul>
          <li>Repository</li>
          <li>Design</li>
          <li>Portfolio</li>
        </ul>
      </div>
      <div className="copyright">
        &copy; 2021 Ken Bell: Designer and Engineer
      </div>
    </footer>
  );
};

export default Sidebar;
