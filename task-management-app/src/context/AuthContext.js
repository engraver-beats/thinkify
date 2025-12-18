import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to create demo tasks
const createDemoTasks = (userId) => {
  const demoTasks = [
    {
      id: 'demo-task-1',
      title: 'Welcome to TaskManager!',
      description: 'This is a sample high-priority task. You can edit, delete, or change its status.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      priority: 'high',
      status: 'pending',
      assignedTo: userId,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-task-2',
      title: 'Explore the Priority Board',
      description: 'Try switching to board view to see tasks organized by priority. You can drag and drop tasks between columns!',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
      priority: 'medium',
      status: 'in-progress',
      assignedTo: userId,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-task-3',
      title: 'Create your first task',
      description: 'Click the "Create New Task" button to add your own task to the system.',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
      priority: 'low',
      status: 'pending',
      assignedTo: userId,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-task-4',
      title: 'Completed Sample Task',
      description: 'This task shows how completed tasks appear in the system.',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
      priority: 'medium',
      status: 'completed',
      assignedTo: userId,
      createdBy: userId,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('tasks', JSON.stringify(demoTasks));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Get users from localStorage
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Create demo admin user if it doesn't exist and demo credentials are used
      if (email === 'admin@demo.com' && password === 'admin123') {
        const demoUser = users.find(u => u.email === 'admin@demo.com');
        if (!demoUser) {
          const newDemoUser = {
            id: 'demo-admin-' + Date.now(),
            username: 'admin',
            email: 'admin@demo.com',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString()
          };
          users.push(newDemoUser);
          localStorage.setItem('users', JSON.stringify(users));
          
          // Also create some demo tasks
          createDemoTasks(newDemoUser.id);
        }
      }
      
      // Find user with matching email and password
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Invalid email or password'));
      }
    });
  };

  const register = (userData) => {
    return new Promise((resolve, reject) => {
      const { username, email, password } = userData;
      
      // Validation
      if (!username || !email || !password) {
        reject(new Error('All fields are required'));
        return;
      }
      
      if (password.length < 6) {
        reject(new Error('Password must be at least 6 characters'));
        return;
      }
      
      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        reject(new Error('User with this email already exists'));
        return;
      }
      
      if (users.find(u => u.username === username)) {
        reject(new Error('Username already taken'));
        return;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        role: users.length === 0 ? 'admin' : 'user', // First user is admin
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log in the new user
      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      resolve(userWithoutPassword);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users array as well
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
