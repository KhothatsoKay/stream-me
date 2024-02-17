import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });
      alert("user created");
      console.log('User created:', user);
      navigate("/login");
    } catch (error) {
      console.error('Error creating user:', error.message);
      alert("Check your network!");
    }
  };

  const navigateToSignIn = () => {
    navigate("/login");
  }

  return (
    <div className='container register-container'>
      <h2>Sign Up</h2>
      <form>
        <div className='mb-3'>
          <label for='username' className='form-label'>Username</label>
          <input type="username" className='form-control' value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className='mb-3'>
          <label for='email' className='form-label'>Email</label>
          <input type="email" className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='mb-3'>
          <label for='password' className='form-label'>Password</label>
          <input type="password" className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='mb-3'>
          <button className="btn btn-success" type="button" onClick={handleSignUp}>Sign Up</button>
          <span className="btn-redirect-login" type="button" onClick={navigateToSignIn}>  Have an account?<span className='signup-redirect'>Sign In</span></span>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
