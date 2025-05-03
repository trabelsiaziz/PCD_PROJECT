import React, { createContext, useContext, useState } from 'react';

// Mock users data
const mockUsers = [
  { user: "aziz", email: "aziz@gmail.com", password: "123" }
];

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(mockUsers);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    currentUser: null,
    isOnline: false,
    isServerRunning: false,
  });

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setAuthState({
        ...authState,
        isAuthenticated: true,
        currentUser: user,
      });
      return true;
    }
    
    return false;
  };

  const signup = (username, email, password) => {
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      return false;
    }
    
    const newUser = {
      user: username,
      email,
      password,
    };
    
    setUsers([...users, newUser]);
    
    setAuthState({
      ...authState,
      isAuthenticated: true,
      currentUser: newUser,
    });
    
    return true;
  };

  const logout = () => {
    setAuthState({
      ...authState,
      isAuthenticated: false,
      currentUser: null,
      isOnline: false,
      isServerRunning: false,
    });
  };

  const toggleOnlineStatus = () => {
    setAuthState({
      ...authState,
      isOnline: !authState.isOnline,
      isServerRunning: false, // Reset server status when toggling online status
    });
  };

  const setServerRunning = (status) => {
    setAuthState({
      ...authState,
      isServerRunning: status,
    });
  };

  const value = {
    ...authState,
    login,
    signup,
    logout,
    toggleOnlineStatus,
    setServerRunning,
    users,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};