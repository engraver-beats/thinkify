import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Mail,
  Calendar,
  Search
} from 'lucide-react';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load users from localStorage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(savedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Check if user already exists
    if (users.find(u => u.email === formData.email)) {
      setError('User with this email already exists');
      setLoading(false);
      return;
    }

    if (users.find(u => u.username === formData.username)) {
      setError('Username already taken');
      setLoading(false);
      return;
    }

    try {
      const newUser = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        password: formData.password, // In a real app, this would be hashed
        role: formData.role,
        createdAt: new Date().toISOString()
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      setSuccess(`User "${formData.username}" created successfully`);
      setFormData({ username: '', email: '', password: '', role: 'user' });
      setShowAddForm(false);
    } catch (err) {
      setError('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser?.id) {
      setError('Cannot delete your own account');
      return;
    }

    setLoading(true);
    try {
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setSuccess('User deleted successfully');
      setDeleteConfirm(null);
    } catch (err) {
      setError('Error deleting user');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    if (userId === currentUser?.id && newRole !== 'admin') {
      setError('Cannot change your own admin role');
      return;
    }

    try {
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setSuccess('User role updated successfully');
    } catch (err) {
      setError('Error updating user role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTaskCount = (userId) => {
    try {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      return tasks.filter(task => task.assignedTo === userId || task.createdBy === userId).length;
    } catch {
      return 0;
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="card-title">
                <Users size={24} style={{ marginRight: '8px' }} />
                User Management
              </h1>
              <p style={{ color: '#666', margin: '8px 0 0 0' }}>
                Manage users and their permissions
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              <UserPlus size={18} />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          {success}
        </div>
      )}

      {/* Search */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
          <Search 
            size={18} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666'
            }}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Users ({filteredUsers.length})</h3>
        </div>

        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <Users size={48} color="#ddd" style={{ marginBottom: '16px' }} />
            <p>No users found</p>
          </div>
        ) : (
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
                    User
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Role
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Tasks
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Created
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
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    style={{ 
                      borderBottom: '1px solid #e9ecef',
                      backgroundColor: user.id === currentUser?.id ? '#f8f9fa' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: user.role === 'admin' ? '#007bff' : '#28a745',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 style={{ 
                            margin: '0 0 4px 0', 
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#2c3e50'
                          }}>
                            {user.username}
                            {user.id === currentUser?.id && (
                              <span style={{ 
                                marginLeft: '8px',
                                fontSize: '12px',
                                color: '#007bff',
                                fontWeight: '600'
                              }}>
                                (You)
                              </span>
                            )}
                          </h4>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            color: '#666',
                            fontSize: '13px'
                          }}>
                            <Mail size={12} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td style={{ padding: '16px' }}>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="form-select"
                        style={{ 
                          fontSize: '12px',
                          padding: '4px 8px',
                          minWidth: '100px'
                        }}
                        disabled={user.id === currentUser?.id}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#666'
                      }}>
                        {getTaskCount(user.id)} tasks
                      </span>
                    </td>
                    
                    <td style={{ padding: '16px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        color: '#666',
                        fontSize: '13px'
                      }}>
                        <Calendar size={12} />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="btn btn-sm btn-danger"
                          style={{ padding: '6px 8px' }}
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddForm && (
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
            maxWidth: '500px',
            margin: '20px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div className="card-header">
              <h3 className="card-title">Add New User</h3>
            </div>

            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter password"
                  minLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  id="role"
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end',
                paddingTop: '20px',
                borderTop: '1px solid #e9ecef'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ username: '', email: '', password: '', role: 'user' });
                    setError('');
                  }}
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
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
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
              Are you sure you want to delete this user? This action cannot be undone.
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
                onClick={() => handleDeleteUser(deleteConfirm)}
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
