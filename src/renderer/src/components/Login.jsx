import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    const success = login(email, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
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
            <h1 className="text-2xl font-bold">Log In</h1>
            <p className="text-gray-600 text-sm mt-1">Enter your credentials to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="form-error">{error}</div>}
            
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
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full flex items-center justify-center mt-6">
              <LogIn className="h-5 w-5 mr-2" />
              Log In
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;