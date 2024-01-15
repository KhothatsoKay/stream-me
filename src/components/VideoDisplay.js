import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import './VideoDisplay.css';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';

const VideoDisplay = ({ videoUrl }) => {
  const [wrapperHeight, setWrapperHeight] = useState(0);

  useEffect(() => {
    const setHeight = () => {
      setWrapperHeight(window.innerHeight);
    };
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, []);

  return (
    <div className='player-wrapper' style={{ height: wrapperHeight }}>
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
