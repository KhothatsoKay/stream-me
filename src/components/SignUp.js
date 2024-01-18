import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSignUp = async () => {
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert("user created");
      console.log('User created:', user);
      navigate("/login");


    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form>
        <div className='mb-3'>
        <label for='email' className='form-label'>Email:</label>
        <input type="email" className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='mb-3'>
        <label for='password' className='form-label'>Password:</label>
        <input type="password" className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='mb-3'>
        <button type="button" onClick={handleSignUp}>Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
