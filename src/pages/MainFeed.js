import PostFeedContainer from '../components/PostFeedContainer';
import Sidebar from '../components/Sidebar';
import '../assets/css/feed.css';
import '../assets/css/viewProfile.css'

const MainFeed = () => {

  return (
    <>
      <div className="feed-container">
        <PostFeedContainer />
        <Sidebar />
      </div>
      <br /><br />
      <hr className="profile__hr" />
      <br />
    </>
  );
};

export default MainFeed;
