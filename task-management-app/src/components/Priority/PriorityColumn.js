import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Eye, 
  Edit, 
  Calendar, 
  User, 
  AlertTriangle,
  Plus
} from 'lucide-react';

const PriorityColumn = ({ 
  priority, 
  title, 
  icon: Icon, 
  color, 
  bgColor, 
  borderColor,
  tasks, 
  onDragStart, 
  onDragEnd, 
  onDrop,
  isDraggedOver 
}) => {
  const { user } = useAuth();
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    onDrop(priority);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '16px',
        minHeight: '400px',
        transition: 'all 0.3s ease',
        transform: dragOver ? 'scale(1.02)' : 'scale(1)',
        boxShadow: dragOver ? `0 8px 25px rgba(0,0,0,0.15)` : '0 2px 8px rgba(0,0,0,0.1)'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: `2px solid ${color}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size={20} color={color} />
          <h3 style={{ 
            margin: 0, 
            color: color,
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            {title}
          </h3>
          <span style={{
            backgroundColor: color,
            color: 'white',
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {tasks.length}
          </span>
        </div>
        
        <Link
          to={`/tasks/new`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            backgroundColor: color,
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
          title={`Add ${priority} priority task`}
        >
          <Plus size={16} />
        </Link>
      </div>

      {/* Tasks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#999',
            fontSize: '14px'
          }}>
            <Icon size={32} color="#ddd" style={{ marginBottom: '12px' }} />
            <p style={{ margin: 0 }}>No {priority} priority tasks</p>
          </div>
        ) : (
          tasks.map((task) => {
            const assignedUser = getUserById(task.assignedTo);
            const overdue = isOverdue(task.dueDate, task.status);
            
            return (
              <div
                key={task.id}
                draggable
                onDragStart={() => onDragStart(task)}
                onDragEnd={onDragEnd}
                style={{
                  backgroundColor: 'white',
                  border: overdue ? '2px solid #dc3545' : '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'grab',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                {/* Task Header */}
                <div style={{ marginBottom: '8px' }}>
                  <h4 style={{
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    lineHeight: '1.3',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px'
                  }}>
                    {overdue && (
                      <AlertTriangle size={14} color="#dc3545" style={{ flexShrink: 0, marginTop: '1px' }} />
                    )}
                    {task.title}
                  </h4>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`status-badge ${task.status}`} style={{ fontSize: '10px' }}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status}
                    </span>
                    {overdue && (
                      <span style={{
                        fontSize: '10px',
                        color: '#dc3545',
                        fontWeight: '600'
                      }}>
                        OVERDUE
                      </span>
                    )}
                  </div>
                </div>

                {/* Task Description */}
                {task.description && (
                  <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '12px',
                    color: '#666',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {task.description}
                  </p>
                )}

                {/* Task Meta */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#666',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    <span style={{ color: overdue ? '#dc3545' : '#666' }}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  
                  {assignedUser && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} />
                      <span>{assignedUser.username}</span>
                    </div>
                  )}
                </div>

                {/* Task Actions */}
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  justifyContent: 'flex-end'
                }}>
                  <Link
                    to={`/tasks/${task.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#f8f9fa',
                      color: '#666',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#007bff';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.color = '#666';
                    }}
                    title="View Details"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye size={12} />
                  </Link>
                  
                  {(task.createdBy === user?.id || user?.role === 'admin') && (
                    <Link
                      to={`/tasks/edit/${task.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#f8f9fa',
                        color: '#666',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#28a745';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa';
                        e.target.style.color = '#666';
                      }}
                      title="Edit Task"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit size={12} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Drop Zone Indicator */}
      {dragOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255,255,255,0.9)',
          border: `2px dashed ${color}`,
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          color: color,
          fontWeight: '600',
          fontSize: '14px',
          pointerEvents: 'none'
        }}>
          Drop task here to change priority to {priority}
        </div>
      )}
    </div>
  );
};

export default PriorityColumn;

