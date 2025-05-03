import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, UserPlus, LogIn, Server } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center page-transition">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary-500 rounded-full mb-4">
            <Server className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Server Control System</h1>
          <p className="text-gray-600">Manage your local server and connection status</p>
        </div>
        
        <div className="space-y-4 card form-transition">
          <Link to="/login" className="btn btn-primary w-full flex items-center justify-center">
            <LogIn className="h-5 w-5 mr-2" />
            Login
          </Link>
          
          <Link to="/signup" className="btn btn-secondary w-full flex items-center justify-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Sign Up
          </Link>
          
          <div className="flex items-center justify-center pt-4">
            <Monitor className="h-5 w-5 text-primary-500 mr-2" />
            <span className="text-sm text-gray-600">Control your local server remotely</span>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Server Control System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;