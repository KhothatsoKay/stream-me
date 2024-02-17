import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc, serverTimestamp} from 'firebase/firestore';
import { firestore, auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import SendIcon from '@mui/icons-material/Send';
import './VideoDisplay.css';

const VideoDisplay = ({ videoId, videoUrl }) => {
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
        setLikes(videoData.likes || 0);
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
    const videoRef = doc(firestore, 'videos', videoId);

    await updateDoc(videoRef, {
      likes: likes + 1,
    });

    setLikes(likes + 1);
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
  
    console.log("user:", user);
  
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
      <div className='video-actions'>
        <button onClick={(e) => handleLike(e)} className='btn btn-outline-primary'>
          Like ({likes})
        </button>
        <button onClick={(e) => handleDelete(e)} className='btn btn-outline-danger'>
          Delete
        </button>
      </div>
      <div className='comments-section'>
        <h4>Comments</h4>
        <ul className='list-group'>
          {comments.map((comment) => (
            <li key={comment.id} className='list-group-item'>
              {console.log('Comment:', comment)}
              <strong>{comment.userName}</strong>  {comment.text}
            </li>
          ))}
        </ul>
        <div className='comment'>
          <input type='text'  value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder='Add a comment...' />
          <SendIcon onClick={handleAddComment} className='md-3 add-comment'/>
        </div>
      </div>
    </div>
  );
};

export default VideoDisplay;
