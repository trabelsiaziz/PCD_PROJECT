import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const success = signup(username, email, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Email already in use');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center page-transition">
      <div className="max-w-md w-full px-4">
        <Link to="/" className="inline-flex items-center text-primary-500 mb-6 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="card form-transition">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-gray-600 text-sm mt-1">Sign up to get started</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="form-error">{error}</div>}
            
            <div>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="johndoe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Create a password"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Confirm your password"
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full flex items-center justify-center mt-6">
              <UserPlus className="h-5 w-5 mr-2" />
              Sign Up
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;