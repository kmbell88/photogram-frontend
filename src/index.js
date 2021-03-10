import React, { useContext } from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PhotogramProvider from './contexts/PhotogramContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import MainFeed from './pages/MainFeed'
import ViewProfile from './pages/ViewProfile';
import ViewPost from './pages/ViewPost';
import './assets/css/main.css';

const App = () => {
  return (
  <>
    <Router>
      <PhotogramProvider>
        <Navbar />
        <div className="main-container">
          
            <Switch>            
              <Route path='/p/:postId' component={ViewPost} />
              <Route path='/:username' component={ViewProfile} />
              <Route path='/'><MainFeed /></Route>
            </Switch>
          
        </div>
        <Footer />
      </PhotogramProvider>
    </Router>
  </>);
};

ReactDom.render(<App />, document.getElementById('root'));

{/* <Link to={`/p/${postId}`}></Link>
history.pushState('./location'); */}