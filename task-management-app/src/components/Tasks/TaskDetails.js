import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Flag, 
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTask, deleteTask, updateTask } = useTask();
  const { user } = useAuth();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [users, setUsers] = useState([]);

  // Load users for display
  useEffect(() => {
    try {
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(savedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, []);

  // Load task data
  useEffect(() => {
    const taskData = getTask(id);
    if (taskData) {
      setTask(taskData);
    } else {
      navigate('/dashboard');
    }
  }, [id, getTask, navigate]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTask(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTask = await updateTask(id, { status: newStatus });
      setTask(updatedTask);
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Error updating task: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  const getUserById = (userId) => {
    return users.find(u => u.id === userId);
  };

  const canEdit = () => {
    return task && (task.createdBy === user?.id || user?.role === 'admin');
  };

  const canDelete = () => {
    return task && (task.createdBy === user?.id || user?.role === 'admin');
  };

  if (!task) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  const assignedUser = getUserById(task.assignedTo);
  const createdByUser = getUserById(task.createdBy);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline btn-sm"
                style={{ padding: '8px' }}
              >
                <ArrowLeft size={18} />
              </button>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.8rem',
                color: '#2c3e50',
                wordBreak: 'break-word'
              }}>
                {overdue && (
                  <AlertTriangle 
                    size={24} 
                    color="#dc3545" 
                    style={{ marginRight: '8px' }}
                  />
                )}
                {task.title}
              </h1>
            </div>
            
            {/* Status and Priority Badges */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <span className={`status-badge ${task.status}`}>
                {task.status === 'in-progress' ? 'In Progress' : task.status}
              </span>
              <span className={`priority-badge ${task.priority}`}>
                {task.priority} Priority
              </span>
              {overdue && (
                <span className="status-badge" style={{ backgroundColor: '#dc3545' }}>
                  Overdue
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {canEdit() && (
              <Link
                to={`/tasks/edit/${task.id}`}
                className="btn btn-primary btn-sm"
              >
                <Edit size={16} />
                Edit
              </Link>
            )}
            {canDelete() && (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task Details */}
      <div className="row">
        <div className="col-2">
          {/* Main Content */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Description</h3>
            </div>
            {task.description ? (
              <div style={{ 
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                color: '#555'
              }}>
                {task.description}
              </div>
            ) : (
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                No description provided.
              </p>
            )}
          </div>

          {/* Quick Status Update */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Update Status</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleStatusChange('pending')}
                className={`btn btn-sm ${task.status === 'pending' ? 'btn-secondary' : 'btn-outline'}`}
                disabled={task.status === 'pending'}
              >
                <Clock size={16} />
                Pending
              </button>
              <button
                onClick={() => handleStatusChange('in-progress')}
                className={`btn btn-sm ${task.status === 'in-progress' ? 'btn-primary' : 'btn-outline'}`}
                disabled={task.status === 'in-progress'}
              >
                <Flag size={16} />
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                className={`btn btn-sm ${task.status === 'completed' ? 'btn-success' : 'btn-outline'}`}
                disabled={task.status === 'completed'}
              >
                <CheckCircle size={16} />
                Completed
              </button>
            </div>
          </div>
        </div>

        <div className="col-2">
          {/* Task Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Task Information</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Due Date */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <Calendar size={16} color="#666" />
                  <span style={{ fontWeight: '500', color: '#333' }}>Due Date</span>
                </div>
                <p style={{ 
                  margin: 0, 
                  color: overdue ? '#dc3545' : '#666',
                  fontWeight: overdue ? '500' : 'normal'
                }}>
                  {formatDate(task.dueDate)}
                </p>
              </div>

              {/* Assigned To */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <User size={16} color="#666" />
                  <span style={{ fontWeight: '500', color: '#333' }}>Assigned To</span>
                </div>
                <p style={{ margin: 0, color: '#666' }}>
                  {assignedUser ? (
                    <>
                      {assignedUser.username}
                      <br />
                      <small style={{ color: '#999' }}>{assignedUser.email}</small>
                    </>
                  ) : (
                    'Unassigned'
                  )}
                </p>
              </div>

              {/* Created By */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <User size={16} color="#666" />
                  <span style={{ fontWeight: '500', color: '#333' }}>Created By</span>
                </div>
                <p style={{ margin: 0, color: '#666' }}>
                  {createdByUser ? (
                    <>
                      {createdByUser.username}
                      <br />
                      <small style={{ color: '#999' }}>{createdByUser.email}</small>
                    </>
                  ) : (
                    'Unknown'
                  )}
                </p>
              </div>

              {/* Timestamps */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <Clock size={16} color="#666" />
                  <span style={{ fontWeight: '500', color: '#333' }}>Created</span>
                </div>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  {formatDateTime(task.createdAt)}
                </p>
              </div>

              {task.updatedAt && task.updatedAt !== task.createdAt && (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <Clock size={16} color="#666" />
                    <span style={{ fontWeight: '500', color: '#333' }}>Last Updated</span>
                  </div>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    {formatDateTime(task.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ 
            width: '100%', 
            maxWidth: '400px',
            margin: '20px'
          }}>
            <div className="card-header">
              <h3 className="card-title">Confirm Delete</h3>
            </div>
            <p style={{ marginBottom: '24px' }}>
              Are you sure you want to delete "<strong>{task.title}</strong>"? 
              This action cannot be undone.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;

