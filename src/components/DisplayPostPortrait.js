import React, { useRef, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import DisplayPostLandscape from './DisplayPostLandscape';
import { PhotogramContext } from '../contexts/PhotogramContext';
import { PostContext } from '../contexts/PostContext';
import heartRed from '../assets/images/heart-red.svg';
import heartEmpty from '../assets/images/heart-empty.svg';
import comment from '../assets/images/comment.svg';
import bookmark from '../assets/images/bookmark.svg';
import bookmarkYellow from '../assets/images/bookmark-yellow.svg';
import defaultProfPic from '../assets/images/img-avatar.png';
import '../assets/css/displayPost.css';

const DisplayPostPortrait = () => {
  const [ showPostModal, setShowPostModal ] = useState(false);
  const addCommentDiv = useRef(null);
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

  const { user } = useContext(PhotogramContext);
  
  const toggleCommentDiv = () => {
    if (!user) {
      alert("Please login or register to comment");
      return;
    }
    if (addCommentDiv.current.style.display === 'none')
      addCommentDiv.current.style.display = 'flex'
    else
      addCommentDiv.current.style.display = 'none';
  }

  return(
    <>
    { post && postLikes &&
    <article className="post-container">
      <div className="post-header">
        <Link to={`/${post.postBody.postedBy.username}`}>
          <img className="post-prof-pic profile-pic" src={post.postBody.postedBy.profIcon || defaultProfPic } style={{ height: '50px', width: '50px', borderRadius: '50%' }} />
        </Link>
        <div className="post-username"><Link to={`/${post.postBody.postedBy.username}`}>{post.postBody.postedBy.username}</Link></div>
      </div>
      <img className="post-photo" src={post.postBody.imgUrl} onClick={() => setShowPostModal(prev => !prev)} />
      <div className="post-buttons">
        <div className="post-buttons-left">
          <ul className="posts-ul">
            <li className="posts-li">
              { !liked ?
                <img src={heartEmpty} style={{height: '22px', width: '22px'}} onClick={handleLike} /> :
                <img src={heartRed} style={{height: '22px', width: '22px'}} onClick={handleLike} />
              }
            </li>
            <li className="posts-li"><img src={comment} style={{height: '22px', width: '22px'}} onClick={toggleCommentDiv} /></li>
          </ul>
        </div>
        <div className="post-buttons-right">
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
      <div className="post-add-comment-container" style={{display: 'none'}} ref={addCommentDiv}>
        <textarea
          className="post-add-comment-textarea"
          value={newComment}
          rows="3"
          placeholder="Add a comment..."
          onChange={desc => setNewComment(desc.target.value)}
        />
        <div className="post-add-comment-button" onClick={handleComment}>Post</div>
      </div>
      <div className="post-likes">
        { postLikes.length === 1 &&
        <div className="post-likes">
          <Link to={`/${postLikes[0].username}`}><img src={postLikes[0].profIcon || defaultProfPic} /></Link>
          Liked by<span className="post-like-span"> <Link to={`/${postLikes[0].username}`}>{postLikes[0].username}</Link></span>
        </div>
        }
        { postLikes.length === 2 &&
        <div className="post-likes">
          <Link to={`/${postLikes[0].username}`}><img src={postLikes[0].profIcon || defaultProfPic} /></Link>
          Liked by<span className="post-like-span"> <Link to={`/${postLikes[0].username}`}>{postLikes[0].username} </Link></span>and<span className="post-like-span"> <Link to={`/${postLikes[1].username}`}>{postLikes[1].username}</Link></span>
        </div>
        }
        { postLikes.length > 2 &&
        <div className="post-likes">
          <Link to={`/${postLikes[0].username}`}><img src={postLikes[0].profIcon || defaultProfPic} /></Link>
          Liked by <span className="post-like-span"><Link to={`/${postLikes[0].username}`}> {postLikes[0].username}</Link></span> and<span className="post-like-span"> {postLikes.length - 1} others</span>
        </div>
        }
      </div>
      <div className="post-date">{getDatePosted()}</div>
      <div className="post-comments-container">
        { comments && comments.map(comment => <Comment comment={comment} key={ Math.random() } />) }
      </div>
      <Modal showModal={showPostModal} setShowModal={setShowPostModal}>
        <DisplayPostLandscape modal />
      </Modal>
    </article>
    }
    </>
  );
};

const Comment = ({comment}) => {
  const { allUsers } = useContext(PhotogramContext);
  let user = allUsers.find(user => user._id === comment.commentBy)

  return (
    <>
    { allUsers && 
      <div className="post-comment">
          <span className="comment-username bold-text"><Link to={`/${user.username}`}>{ user.username }</Link></span> { comment.comment }
      </div>
    }
    </>
  );
};

export default DisplayPostPortrait;