import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import TaskList from '../Tasks/TaskList';
import PriorityBoard from '../Priority/PriorityBoard';
import { 
  Plus, 
  CheckSquare, 
  Clock, 
  CheckCircle,
  BarChart3,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { getTaskStats, getFilteredTasks } = useTask();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'board'
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks(filters);

  // Pagination for task list
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      search: ''
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="card" style={{
      background: bgColor,
      border: `2px solid ${color}`,
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      transition: 'transform 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
    >
      <Icon size={32} color={color} style={{ marginBottom: '12px' }} />
      <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color, margin: '8px 0' }}>
        {value}
      </h3>
      <p style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>
        {title}
      </p>
    </div>
  );

  return (
    <div className="container">
      {/* Welcome Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#2c3e50',
          marginBottom: '8px'
        }}>
          Welcome back, {user?.username}! 👋
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row" style={{ marginBottom: '30px' }}>
        <div className="col-4">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={CheckSquare}
            color="#007bff"
            bgColor="#f0f8ff"
          />
        </div>
        <div className="col-4">
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            color="#ffc107"
            bgColor="#fff8e1"
          />
        </div>
        <div className="col-4">
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            color="#28a745"
            bgColor="#f0f9ff"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/tasks/new" className="btn btn-primary">
            <Plus size={20} />
            Create New Task
          </Link>
          {user?.role === 'admin' && (
            <Link to="/users" className="btn btn-secondary">
              <BarChart3 size={20} />
              Manage Users
            </Link>
          )}
        </div>
      </div>

      {/* View Controls */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>Your Tasks</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
              >
                <List size={16} />
                List
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`btn btn-sm ${viewMode === 'board' ? 'btn-primary' : 'btn-outline'}`}
              >
                <Grid size={16} />
                Board
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-outline'}`}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <div className="row">
              <div className="col-3">
                <div className="form-group">
                  <label className="form-label">Search</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Search tasks..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
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
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={filters.priority}
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label className="form-label" style={{ opacity: 0 }}>Actions</label>
                  <button
                    onClick={clearFilters}
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tasks Display */}
      {viewMode === 'list' ? (
        <TaskList 
          tasks={paginatedTasks}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      ) : (
        <PriorityBoard />
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <CheckSquare size={64} color="#ccc" style={{ marginBottom: '20px' }} />
          <h3 style={{ color: '#666', marginBottom: '12px' }}>
            {filters.search || filters.status || filters.priority 
              ? 'No tasks match your filters' 
              : 'No tasks yet'
            }
          </h3>
          <p style={{ color: '#999', marginBottom: '24px' }}>
            {filters.search || filters.status || filters.priority
              ? 'Try adjusting your filters or create a new task.'
              : 'Get started by creating your first task!'
            }
          </p>
          <Link to="/tasks/new" className="btn btn-primary">
            <Plus size={20} />
            Create Your First Task
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
