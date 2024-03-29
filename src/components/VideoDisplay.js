import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc, serverTimestamp} from 'firebase/firestore';
import { firestore, auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './VideoDisplay.css';

const VideoDisplay = ({ videoId, videoUrl, videoTitle }) => {
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const setHeight = () => {
      setWrapperHeight(window.innerHeight);
    };
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
      const videoRef = doc(firestore, 'videos', videoId);
      const videoDoc = await getDoc(videoRef);
  
      if (videoDoc.exists()) {
        const videoData = videoDoc.data();
        console.log('Video Data:', videoData); 
        const likesCount = videoData.likes || 0;
        setLikes(Number(likesCount));
      }
    };
  
    fetchLikes();
  }, [videoId]);
  
  

  useEffect(() => {
    const fetchComments = async () => {
      const commentsCollection = collection(firestore, 'comments');
      const q = query(commentsCollection, where('videoId', '==', videoId));
      const querySnapshot = await getDocs(q);

      const fetchedComments = [];
      querySnapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() });
      });

      setComments(fetchedComments);
    };

    fetchComments();
  }, [videoId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('User:', user);
    });

    return () => unsubscribe(); 
  }, []);

  const handleLike = async (e) => {
    e.stopPropagation();
    const user = auth.currentUser;
  
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    const videoRef = doc(firestore, 'videos', videoId);
    const videoDoc = await getDoc(videoRef);
  
    if (!videoDoc.exists()) {
      console.error('Video not found');
      return;
    }
    const videoData = videoDoc.data();
    const likesCollection = collection(firestore, 'likes');
    const querySnapshot = await getDocs(query(likesCollection, where('videoId', '==', videoId), where('userId', '==', user.uid)));
  
    if (!querySnapshot.empty) {
      console.log('User has already liked this video');
      return;
    }
    await updateDoc(videoRef, { likes: videoData.likes + 1 });
    await addDoc(likesCollection, { videoId, userId: user.uid });
  
    setLikes((prevLikes) => prevLikes + 1);
  };
  
  
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      console.log('Deleting...');
      const videoRef = doc(firestore, 'videos', videoId);

      try {
        await deleteDoc(videoRef);
        console.log('Video deleted successfully');
        navigate('/');
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.stopPropagation();
    if (newComment.trim() === '') {
      alert('Please enter a comment.');
      return;
    }
  
    const user = auth.currentUser; 
    if (!user || !user.displayName) {
      console.error('User not authenticated or email not available');
      return;
    }

  
    const commentsCollection = collection(firestore, 'comments');
    const newCommentDocRef = await addDoc(commentsCollection, {
      videoId,
      text: newComment,
      timestamp: serverTimestamp(),
      userName: user.displayName,
    });
  
    setComments([...comments, { id: newCommentDocRef.id, videoId, text: newComment, timestamp: new Date(), user: { displayName: user.displayName } }]);
    setNewComment('');
  };
  

  return (
    <div className='player-wrapper' style={{ height: wrapperHeight }}>
      <ReactPlayer className='react-player' url={videoUrl} controls={true} width='100%' height='80%' />
      <div className="video-content">
        <span>{videoTitle}</span>

      </div>
      <div className='video-actions'>
        <button onClick={(e) => handleLike(e)} className='btn  like-btn'>
          Like ({likes})
        </button>
        <button onClick={(e) => handleDelete(e)} className='btn  delete-btn'>
          Delete
        </button>
      </div>
      <div className='comments-section'>
        <h4>Comments</h4>
        <ul className='list-group'>
          {comments.map((comment) => (
            <li key={comment.id} className='list-group-item'>
              {console.log('Comment:', comment)}
             <p style={{color: "black"}}> <strong>{comment.userName}</strong>  {comment.text}</p>
            </li>
          ))}
        </ul>
        <div className='comment'>
          <input type='text'  value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder='Comment here...' />
          <button onClick={handleAddComment} className='btn add-comment'>Send</button>
        </div>
      </div>
    </div>
  );
};

export default VideoDisplay;
