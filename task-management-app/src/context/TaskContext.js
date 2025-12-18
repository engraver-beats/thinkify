import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
        setTasks([]);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const createTask = (taskData) => {
    return new Promise((resolve) => {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        status: 'pending',
        createdBy: user.id,
        assignedTo: taskData.assignedTo || user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTasks(prev => [newTask, ...prev]);
      resolve(newTask);
    });
  };

  const updateTask = (taskId, updates) => {
    return new Promise((resolve, reject) => {
      setTasks(prev => {
        const taskIndex = prev.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
          reject(new Error('Task not found'));
          return prev;
        }
        
        const updatedTask = {
          ...prev[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        const newTasks = [...prev];
        newTasks[taskIndex] = updatedTask;
        resolve(updatedTask);
        return newTasks;
      });
    });
  };

  const deleteTask = (taskId) => {
    return new Promise((resolve, reject) => {
      const taskExists = tasks.find(task => task.id === taskId);
      if (!taskExists) {
        reject(new Error('Task not found'));
        return;
      }
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      resolve();
    });
  };

  const getTask = (taskId) => {
    return tasks.find(task => task.id === taskId);
  };

  const getFilteredTasks = (filters = {}) => {
    let filteredTasks = [...tasks];
    
    // Filter by user permissions
    if (user?.role !== 'admin') {
      filteredTasks = filteredTasks.filter(task => 
        task.assignedTo === user.id || task.createdBy === user.id
      );
    }
    
    // Apply filters
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }
    
    if (filters.assignedTo) {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === filters.assignedTo);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by creation date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return filteredTasks;
  };

  const getTasksByPriority = () => {
    const userTasks = getFilteredTasks();
    
    return {
      high: userTasks.filter(task => task.priority === 'high'),
      medium: userTasks.filter(task => task.priority === 'medium'),
      low: userTasks.filter(task => task.priority === 'low')
    };
  };

  const getTaskStats = () => {
    const userTasks = getFilteredTasks();
    
    return {
      total: userTasks.length,
      pending: userTasks.filter(task => task.status === 'pending').length,
      inProgress: userTasks.filter(task => task.status === 'in-progress').length,
      completed: userTasks.filter(task => task.status === 'completed').length,
      overdue: userTasks.filter(task => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate) < new Date() && task.status !== 'completed';
      }).length
    };
  };

  const moveToPriority = (taskId, newPriority) => {
    return updateTask(taskId, { priority: newPriority });
  };

  const value = {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    getTask,
    getFilteredTasks,
    getTasksByPriority,
    getTaskStats,
    moveToPriority
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
