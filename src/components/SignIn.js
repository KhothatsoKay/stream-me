import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom'; 
import './SignUp.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const navigateToSignUp = () => {
    navigate('/signup'); 
  };

  return (
    <div className='container register-container'>
      <h2 className='text-center'>Sign In</h2>
     
      <form>
      <div className='mb-3'>
        <label for='email' className='form-label'>Email</label>
        <input type="email" className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='mb-3'>
        <label for='password' className='form label'>Password</label>
        <input type="password" className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='mb-3'>
        <button className='btn btn-success' type="button" onClick={handleSignIn}>Sign In</button>
        </div>
       
        <span className="btn-redirect" type="button" onClick={navigateToSignUp}>Don't have an account?<span className='signup-redirect'>Sign Up</span></span>
        
      </form>
    </div>
  );
};

export default SignIn;
