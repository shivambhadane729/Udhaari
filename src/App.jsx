import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Expenses from './pages/Expenses';
import Groups from './pages/Groups';

import { EcosystemProvider } from './contexts/EcosystemContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <EcosystemProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/expenses" 
              element={
                <PrivateRoute>
                  <Expenses />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/groups" 
              element={
                <PrivateRoute>
                  <Groups />
                </PrivateRoute>
              } 
            />
          </Routes>
        </Router>
      </EcosystemProvider>
    </AuthProvider>
  );
}

export default App;
