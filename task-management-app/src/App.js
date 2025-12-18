import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import TaskForm from './components/Tasks/TaskForm';
import TaskDetails from './components/Tasks/TaskDetails';
import UserManagement from './components/Users/UserManagement';
import Navbar from './components/Layout/Navbar';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {user && <Navbar />}
      <main className={user ? 'main-content' : 'auth-content'}>
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks/new" 
            element={user ? <TaskForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks/edit/:id" 
            element={user ? <TaskForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks/:id" 
            element={user ? <TaskDetails /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/users" 
            element={user?.role === 'admin' ? <UserManagement /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
