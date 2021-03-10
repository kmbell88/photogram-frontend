import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostProvider from '../contexts/PostContext';
import DisplayPostLandscape from '../components/DisplayPostLandscape';
import PhotoGallery from '../components/PhotoGallery';
import axios from 'axios';

const ViewPost = ({ match }) => {
  const [ poster, setPoster ] = useState(null);
  const [ morePosts, setMorePosts ] = useState(null);

  useEffect(() => {
    getPageResources(match.params.postId);
    window.scrollTo(0, 0);
  }, [match.params.postId]);

  const getPageResources = (postId) => {
    axios.get(`${process.env.REACT_APP_BASE_URL}posts/${postId}`)
    .then(res => {
      setPoster(res.data.postBody.postedBy);
      return axios.get(`${process.env.REACT_APP_BASE_URL}users/username/${res.data.postBody.postedBy.username}`)
    })
    .then(res => {
      setMorePosts(res.data.posts.reverse());
    })
  }

  return (
    <>
      <PostProvider postId={match.params.postId}>
        <DisplayPostLandscape />
      </PostProvider>
      <br />
      <br />
      <hr className="profile__hr" />
      <br />
      <br />
      { poster && <div className="more-posts-text">More posts from <Link to={`/${poster.username}`}><span style={{color: '#000000'}}>{poster.username}</span></Link></div> }
      { morePosts && <PhotoGallery posts={morePosts} displayCount="9" /> }
          { poster && morePosts &&
      <>
      { morePosts > 9 ?
        <div className="blue-text-center"><Link to={`/${poster.username}`}>See More Posts</Link></div> :
        <div className="blue-text-center"><Link to={`/${poster.username}`}>View {poster.username}'s Profile</Link></div>
      }
      </>
    }
    <hr className="profile__hr" />  
    </>
  );
};

export default ViewPost;


