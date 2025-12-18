import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { Save, ArrowLeft, Calendar, User, Flag, FileText } from 'lucide-react';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createTask, updateTask, getTask } = useTask();
  const { user } = useAuth();
  
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: user?.id || '',
    status: 'pending'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  // Load users for assignment dropdown
  useEffect(() => {
    try {
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(savedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, []);

  // Load task data if editing
  useEffect(() => {
    if (isEditing && id) {
      const task = getTask(id);
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          dueDate: task.dueDate || '',
          priority: task.priority || 'medium',
          assignedTo: task.assignedTo || user?.id || '',
          status: task.status || 'pending'
        });
      } else {
        setError('Task not found');
      }
    }
  }, [id, isEditing, getTask, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Task title is required');
      setLoading(false);
      return;
    }

    if (formData.title.length > 100) {
      setError('Task title must be less than 100 characters');
      setLoading(false);
      return;
    }

    if (formData.description.length > 500) {
      setError('Description must be less than 500 characters');
      setLoading(false);
      return;
    }

    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim()
      };

      if (isEditing) {
        await updateTask(id, taskData);
      } else {
        await createTask(taskData);
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred while saving the task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleCancel}
              className="btn btn-outline btn-sm"
              style={{ padding: '8px' }}
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="card-title">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h1>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              <FileText size={18} style={{ marginRight: '6px' }} />
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              maxLength="100"
              required
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              {formData.title.length}/100 characters
            </small>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description..."
              rows="4"
              maxLength="500"
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              {formData.description.length}/500 characters
            </small>
          </div>

          <div className="row">
            {/* Due Date */}
            <div className="col-2">
              <div className="form-group">
                <label htmlFor="dueDate" className="form-label">
                  <Calendar size={18} style={{ marginRight: '6px' }} />
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Priority */}
            <div className="col-2">
              <div className="form-group">
                <label htmlFor="priority" className="form-label">
                  <Flag size={18} style={{ marginRight: '6px' }} />
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Assigned To */}
            <div className="col-2">
              <div className="form-group">
                <label htmlFor="assignedTo" className="form-label">
                  <User size={18} style={{ marginRight: '6px' }} />
                  Assign To
                </label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  className="form-select"
                  value={formData.assignedTo}
                  onChange={handleChange}
                >
                  <option value="">Select user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status (only show when editing) */}
            {isEditing && (
              <div className="col-2">
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Priority Preview */}
          <div className="form-group">
            <label className="form-label">Priority Preview</label>
            <div 
              className={`priority-${formData.priority}`}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Flag size={16} />
              <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                {formData.priority} Priority Task
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingTop: '20px',
            borderTop: '1px solid #e9ecef'
          }}>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={18} />
              {loading 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Task' : 'Create Task')
              }
            </button>
          </div>
        </form>
      </div>

      {/* Help Card */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Tips</h3>
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
          <li>Use clear, descriptive titles for better task organization</li>
          <li>Set realistic due dates to help with time management</li>
          <li>High priority tasks will be highlighted in red</li>
          <li>You can assign tasks to other users if you're an admin</li>
          <li>Tasks can be moved between priority lists on the board view</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskForm;

