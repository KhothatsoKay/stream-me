import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import pubbleBubbles from './purple-bubbles.png'
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [value, setValue] = useState('');

  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate("/");
      console.log('User signed in:', user);
    } catch (error) {
      console.error('Error signing in:', error.message);
      alert("Check your network!");
    }
  };

  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        setValue(data.user.email);
        localStorage.setItem("email", data.user.email);
        navigate("/");
      })
      .catch((error) => {
        console.error('Error signing in with Google:', error.message);
        alert("Error signing in with Google. Please try again.");
      });
  };

  useEffect(() => {
    setValue(localStorage.getItem("email"));
  }, []);

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='left-section col'>
          <h1 className='text-center'>Welcome back!</h1>
          <p className='text-center sign-text'>Sign In to <span>continue access</span></p>
          <div className='sign-up-actions'>
            <span className='text-center'>Don't have an account?</span>
            <button className='btn signUp-btn' onClick={navigateToSignUp}>Sign Up</button>
          </div>

        </div>
        <div className='right-section col'>
          <form>
            <h2 className='text-center'>Sign In</h2>
            <div className='social-bar row'>
              <div className='col'>
                <FacebookIcon className='facebook-icon' color='primary' />
              </div>
              <div className='col'>
                <GoogleIcon className='google-icon' color='warning' onClick={handleClick} />
              </div>
            </div>
            <span className='alternative-action'>or use your email account:</span>
            <div className='mb-3'>
              <EmailIcon className='email-icon' color='action' />
              <input type="email" className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='  Email' />
            </div>
            <div className='mb-3'>
              <LockIcon className='password-icon' color='action' />
              <input type="password" className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='  Password' />
            </div>
            <div className='mb-3'>
              <button className='btn btn-login' type="button" onClick={handleSignIn}>Sign In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
