import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VideoUpload from './components/VideoUpload';
import VideoList from './components/VideoList';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/upload" element={<VideoUpload/>} />
        <Route path="/" element={<VideoList />} />
      </Routes>
    </div>
  );
};

export default App;
