import React, { useState, useEffect, useContext } from 'react';
import defaultProfPic from '../assets/images/img-avatar.png';
import axios from 'axios';
import { PhotogramContext } from '../contexts/PhotogramContext';

const Profile = ({ profile }) => {
  const [ isFollowing, setIsFollowing ] = useState(false);
  const { user, usersFollowed, setUsersFollowed } = useContext(PhotogramContext);

  useEffect(() => {
    if (usersFollowed && profile)
      setIsFollowing(usersFollowed.some(followed => followed._id === profile._id));
  }, [usersFollowed, profile]);

  const handleFollow = () => {
    if (!user) {
      alert('Please login or register to follow');
      return;
    }

    axios.post(`${process.env.REACT_APP_HEROKU}users/updateFollow`, {
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
    <>
      <div className="profile__header">
        <div className="profile__header__img-container">
          <img src={profile.profPic || defaultProfPic} />
        </div>
        <div className="profile__header__user-details">
          <div className="profile__header__user-details__username">
            <div className="username">{profile.username}</div>
              { !user || user._id !== profile._id && 
                <>
                { isFollowing ?
                  <div className="follow" onClick={handleFollow}>Following</div> :
                  <div className="follow" onClick={handleFollow}>Follow</div>
                }
                </>
              }
              { !user && <div className="follow" onClick={handleFollow}>Follow</div> }
          </div>
          <br />
          <div className="profile__header__user-details__stats">
            { profile.posts.length === 1 ?
              <div className="user-posts"><span className="bold-text">1 </span>post</div> :
              <div className="user-posts"><span className="bold-text">{profile.posts.length}</span> posts</div>
            }
            { profile.followers.length === 1 ?
              <div className="followers"><span className="bold-text">1</span> follower</div> :
              <div className="followers"><span className="bold-text">{profile.followers.length}</span> followers</div>
            }
            <div className="following"><span className="bold-text">{profile.following.length}</span> following</div>
          </div>
          <br />
          <div className="profile__header__user-details__display-name bold-text">{profile.displayName}</div>
          <div className="profile__header__user-details__description">{profile.profDescription}</div>
        </div>
      </div>
      <br /><br />
      <hr className="profile__hr" />
      <br />
    </>
  );
};

export default Profile;
