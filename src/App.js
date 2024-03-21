import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VideoUpload from './components/VideoUpload';
import VideoList from './components/VideoList';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import Articles from './components/Articles';
import Resources from './components/Resources';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/upload" element={<VideoUpload/>} />
        <Route path="/" element={<VideoList />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/resources" element={<Resources  />} />
      </Routes>
    </div>
  );
};

export default App;
