import { Link } from 'react-router-dom';
import whiteHeart from '../assets/images/white-heart.png';
import whiteComment from '../assets/images/white-comment.png';
import '../assets/css/viewProfile.css'

const PhotoGallery = ({ posts, displayCount }) => {
  return (
    <>
    { posts &&
      <div className="profile__posts">
        { displayCount ?
          posts.slice(0, displayCount).map(post => <PostPreview key={post._id} post={post} />) :
          posts.map(post => <PostPreview key={post._id} post={post} />)
        }
      </div>
    }
    </>
  );
};

const PostPreview = ({ post }) => {

  return (
    <Link to={`/p/${post._id}`}>
      <article className="profile__posts__img-container">
        <img className="post-preview" src={post.postBody.imgUrl} alt={post.postBody.description} />
          <div className="post-preview-overlay">
            <div className="preview-likes-container">
              <img src={whiteHeart} style={{ height: '22px', width: '22px', paddingLeft: '10px', paddingRight: '10px' }} />
              <div>{post.likes.length}</div>
            </div>
            <div className="preview-comments-container">
              <img src={whiteComment} style={{ height: '21px', width: '21px', paddingLeft: '10px', paddingRight: '10px' }} />
              <div>{post.comments.length}</div>
            </div>
          </div>
      </article>
    </Link>
  );
};

export default PhotoGallery;
