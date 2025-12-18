import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckSquare, 
  Plus, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Home
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/tasks/new', label: 'New Task', icon: Plus },
    ...(user?.role === 'admin' ? [{ path: '/users', label: 'Users', icon: Users }] : [])
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '0 20px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
      }}>
        {/* Logo */}
        <Link 
          to="/dashboard" 
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          <CheckSquare size={28} style={{ marginRight: '8px' }} />
          TaskManager
        </Link>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }} className="desktop-nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                color: isActive(path) ? '#fff' : 'rgba(255,255,255,0.8)',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: isActive(path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (!isActive(path)) {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(path)) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'rgba(255,255,255,0.8)';
                }
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }} className="desktop-nav">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            fontSize: '14px'
          }}>
            <span style={{ fontWeight: '500' }}>{user?.username}</span>
            <span style={{ 
              fontSize: '12px', 
              opacity: 0.8,
              textTransform: 'capitalize'
            }}>
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px'
          }}
          className="mobile-menu-btn"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          padding: '20px'
        }} className="mobile-nav">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive(path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}
            
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.2)',
              paddingTop: '12px',
              marginTop: '12px'
            }}>
              <div style={{
                padding: '12px 16px',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.8)'
              }}>
                Logged in as <strong>{user?.username}</strong> ({user?.role})
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  width: '100%'
                }}
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

