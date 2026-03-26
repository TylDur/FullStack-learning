import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>  {/* ToastProvider must be OUTSIDE ExpenseProvider */}
          <ExpenseProvider>  {/* ExpenseProvider needs Toast inside */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Login />} />
            </Routes>
          </ExpenseProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;