import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

const TaskList = ({ tasks, currentPage, totalPages, onPageChange }) => {
  const { deleteTask, updateTask } = useTask();
  const { user } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (taskId) => {
    setLoading(true);
    try {
      await deleteTask(taskId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Error updating task: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  const getUsersFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch {
      return [];
    }
  };

  const getUserById = (userId) => {
    const users = getUsersFromStorage();
    return users.find(u => u.id === userId);
  };

  if (tasks.length === 0) {
    return null; // Empty state is handled by parent component
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Tasks ({tasks.length})</h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e9ecef' }}>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#495057'
              }}>
                Task
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#495057'
              }}>
                Status
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#495057'
              }}>
                Priority
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#495057'
              }}>
                Due Date
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#495057'
              }}>
                Assigned To
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'center', 
                fontWeight: '600',
                color: '#495057'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const assignedUser = getUserById(task.assignedTo);
              const overdue = isOverdue(task.dueDate, task.status);
              
              return (
                <tr 
                  key={task.id} 
                  style={{ 
                    borderBottom: '1px solid #e9ecef',
                    backgroundColor: overdue ? '#fff5f5' : 'transparent'
                  }}
                >
                  <td style={{ padding: '16px' }}>
                    <div>
                      <h4 style={{ 
                        margin: '0 0 4px 0', 
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#2c3e50'
                      }}>
                        {overdue && (
                          <AlertTriangle 
                            size={16} 
                            color="#dc3545" 
                            style={{ marginRight: '6px' }}
                          />
                        )}
                        {task.title}
                      </h4>
                      {task.description && (
                        <p style={{ 
                          margin: 0, 
                          color: '#666',
                          fontSize: '13px',
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="form-select"
                      style={{ 
                        fontSize: '12px',
                        padding: '4px 8px',
                        minWidth: '120px'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      color: overdue ? '#dc3545' : '#666'
                    }}>
                      <Calendar size={14} />
                      <span style={{ fontSize: '13px' }}>
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      color: '#666'
                    }}>
                      <User size={14} />
                      <span style={{ fontSize: '13px' }}>
                        {assignedUser?.username || 'Unassigned'}
                      </span>
                    </div>
                  </td>
                  
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Link
                        to={`/tasks/${task.id}`}
                        className="btn btn-sm btn-outline"
                        style={{ padding: '6px 8px' }}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </Link>
                      
                      {(task.createdBy === user?.id || user?.role === 'admin') && (
                        <Link
                          to={`/tasks/edit/${task.id}`}
                          className="btn btn-sm btn-primary"
                          style={{ padding: '6px 8px' }}
                          title="Edit Task"
                        >
                          <Edit size={14} />
                        </Link>
                      )}
                      
                      {(task.createdBy === user?.id || user?.role === 'admin') && (
                        <button
                          onClick={() => setDeleteConfirm(task.id)}
                          className="btn btn-sm btn-danger"
                          style={{ padding: '6px 8px' }}
                          title="Delete Task"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          padding: '20px',
          borderTop: '1px solid #e9ecef'
        }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm btn-outline"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <span style={{ color: '#666', fontSize: '14px' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-outline"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

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
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;

