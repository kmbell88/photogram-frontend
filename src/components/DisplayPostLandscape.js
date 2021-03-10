import React, { useRef, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { PhotogramContext } from '../contexts/PhotogramContext';
import { PostContext } from '../contexts/PostContext';
import { Link } from 'react-router-dom';
import heartRed from '../assets/images/heart-red.svg';
import heartEmpty from '../assets/images/heart-empty.svg';
import comment from '../assets/images/comment.svg';
import bookmark from '../assets/images/bookmark.svg';
import bookmarkYellow from '../assets/images/bookmark-yellow.svg';
import defaultProfPic from '../assets/images/img-avatar.png';
import '../assets/css/displayPost.css';

const DisplayPostLandscape = ({ modal }) => {
  const [ isFollowing, setIsFollowing ] = useState(false);
  const {
    post, setPost,
    postLikes, setpostLikes,
    comments, setComments,
    bookmarked, setBookmarked,
    liked, setLiked,
    newComment, setNewComment,
    handleLike, handleComment, handleBookmark,
    getDatePosted
  } = useContext(PostContext);
  const { user, usersFollowed, setUsersFollowed } = useContext(PhotogramContext);
  const addCommentModal = useRef(null);

  useEffect(() => {
    if (usersFollowed && post)
      setIsFollowing(usersFollowed.some(followed => followed._id === post.postBody.postedBy._id));
  }, [usersFollowed]);

  const toggleCommentModal = () => {
    if (!user) {
      alert("Please login or register to comment");
      return;
    }
    if (addCommentModal.current.style.display === 'none')
      addCommentModal.current.style.display = 'flex'
    else
      addCommentModal.current.style.display = 'none';
  }

  const handleFollow = () => {
    if (!user) {
      alert('Please login or register to follow');
      return;
    }

    axios.post(`${process.env.REACT_APP_BASE_URL}users/updateFollow`, {
      userIdOne: user._id,
      userIdTwo: post.postBody.postedBy._id
    })
    .then(res => {
      if (!isFollowing) {
        setUsersFollowed([...usersFollowed, post.postBody.postedBy]);
      }
      else {
        setUsersFollowed(oldFollowing => oldFollowing.filter(following => following._id !== post.postBody.postedBy._id));
      }
    })
    .catch(error => console.log(error));
  };

  return (
    <article className="post-modal" style={modal && { border: 'none', width: '95vw' }}>
    { post && postLikes &&
      <>
      <div className="post-modal__img">
        <img src={post.postBody.imgUrl} />
      </div>
      <div className="post-modal__content">
        <div className="post-modal__content__header">
          <div className="post-modal__content__header--user">
            <Link to={`/${post.postBody.postedBy.username}`}><img className="post-prof-pic profile-pic" src={post.postBody.postedBy.profIcon || defaultProfPic } style={{ height: '50px', width: '50px', borderRadius: '50%' }} /></Link>
            <div className="post-username"><Link to={`/${post.postBody.postedBy.username}`}>{post.postBody.postedBy.username}</Link></div>
          </div>
          { !user || user._id !== post.postBody.postedBy._id && 
            <>
            { isFollowing ?
              <div className="post-modal__content__header--follow" style={{cursor: "pointer"}} onClick={handleFollow}>Following</div> :
              <div className="post-modal__content__header--follow" style={{cursor: "pointer"}} onClick={handleFollow}>Follow</div>
            }
            </>
          }
          { !user && <div className="post-modal__content__header--follow" style={{cursor: "pointer"}} onClick={handleFollow}>Follow</div> }
        </div>
        <hr className="post-modal__hr" />
        <div className="post-modal__content__comments">
        <div className="post-modal__content__description">
          {post.postBody.description}
        </div>
          {comments && comments.map(comment => <Comment comment={comment} key={post._id + Math.random()} />) }
        </div>
        <hr className="post-modal__hr" />        
        <div className="post-modal__content__post-buttons">
          <div className="post-modal__content__post-buttons__left">
            <ul className="posts-ul">
              <li className="posts-li">
                { !liked ?
                  <img src={heartEmpty} style={{height: '22px', width: '22px'}} onClick={handleLike} /> :
                  <img src={heartRed} style={{height: '22px', width: '22px'}} onClick={handleLike} />
                }
              </li>
              <li className="posts-li"><img src={comment} style={{height: '22px', width: '22px'}} onClick={toggleCommentModal} /></li>
            </ul>
          </div>
          <div className="post-modal__content__post-buttons__right">
            <ul className="posts-ul">
              <li className="posts-li">
                { !bookmarked ?
                    <img src={bookmark} style={{height: '22px', width: '22px'}} onClick={handleBookmark} /> :
                    <img src={bookmarkYellow} style={{height: '22px', width: '22px'}} onClick={handleBookmark} />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="post-modal__content__post-likes">
          { postLikes.length === 1 &&
          <div className="post-likes">
            <Link to={`/${postLikes[0].username}`}><img src={postLikes[0].profIcon || defaultProfPic} /></Link>
            Liked by <span className="post-like-span"> <Link to={`/${postLikes[0].username}`}>{postLikes[0].username} </Link></span>
          </div>
          }
          { postLikes.length === 2 &&
          <div className="post-likes">
            <Link to={`/${postLikes[0].username}`}><img src={postLikes[0].profIcon || defaultProfPic} /></Link>
            Liked by <span className="post-like-span"> <Link to={`/${postLikes[0].username}`}>{postLikes[0].username} </Link></span> and <span className="post-like-span"> <Link to={`/${postLikes[1].username}`}>{postLikes[1].username} </Link></span>
          </div>
          }
          { postLikes.length > 2 &&
          <div className="post-likes">
            <Link to={`/${postLikes[0].username}`}><img src={postLikes[0].profIcon || defaultProfPic} /></Link>
            Liked by <span className="post-like-span"> <Link to={`/${postLikes[0].username}`}>{postLikes[0].username} </Link></span> and <span className="post-like-span"> {postLikes.length - 1} others</span>
          </div>
          }
        </div>
        <div className="post-modal__content__date-posted post-date">
          {getDatePosted()}
        </div>
        <div className="post-modal__content__add-comment post-add-comment-container" style={{display: 'none'}} ref={addCommentModal}>
          <textarea
            className="post-modal__content__add-comment--textarea post-add-comment-textarea"
            value={newComment}
            rows="3"
            placeholder="Add a comment..."
            onChange={desc => setNewComment(desc.target.value)}
          />
          <div className="post-modal__content__add-comment--button post-add-comment-button" onClick={handleComment}>Post</div>
        </div>
      </div>
      </>
    }
    </article>
  );
};

const Comment = ({ comment }) => {
  const [ commenter, setCommenter ] = useState(null);
  const { allUsers } = useContext(PhotogramContext);

  useEffect(() => {
    if (allUsers)
      setCommenter(allUsers.find(user => user._id === comment.commentBy));
  }, [allUsers]);
  

  return (
    <div className="post-comment">
      {allUsers && commenter && 
        <>
          <Link to={`/${commenter.username}`}><img src={commenter.profIcon || defaultProfPic} style={{ height: '25px', width: '25px', borderRadius: '50%', paddingRight: '4px' }} /></Link>
          <Link to={`/${commenter.username}`}><span className="comment-username bold-text">{ commenter.username }</span></Link> { comment.comment }
        </>
      }
    </div>
  );
};

export default DisplayPostLandscape;
