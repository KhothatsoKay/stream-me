
import React from 'react';
import ReactPlayer from 'react-player';
import './VideoDisplay.css';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';

const VideoDisplay = ({ videoUrl }) => {
  return (
    <div className='player-wrapper'>
      <ReactPlayer
        className='react-player'
        url={videoUrl}
        controls={true}
        width='100%'
        height='100%'
      />
    </div>
  );
};

export default VideoDisplay;
