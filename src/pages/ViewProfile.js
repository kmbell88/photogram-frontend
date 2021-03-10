import React, { useState, useEffect, useContext } from 'react';
import Profile from '../components/Profile';
import PhotoGallery from '../components/PhotoGallery';
import axios from 'axios';
import '../assets/css/viewProfile.css';

const ViewProfile = ({ match }) => {
  const [ profile, setProfile ] = useState(null);
  const [ posts, setPosts ] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);

  const username = match.params.username;
  function getProfile() {
    axios.get(`${process.env.REACT_APP_BASE_URL}users/username/${username}`)
    .then(res => {
      const axiosUser = res.data;
      setProfile(axiosUser);
      setPosts(axiosUser.posts.reverse());
    })
    .catch(error => console.log(error));
  }

  return (
    <>
    { profile &&
      <div className="profile">
        <Profile profile={profile} />
        <PhotoGallery posts={posts} />
        <br />
        <hr className="profile__hr" />
      </div>
    }
    </>
  );
};

export default ViewProfile;
