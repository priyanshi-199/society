import { Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, List } from 'react-bootstrap-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';

export function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : '?';

  useEffect(() => {
    const sidebar = document.querySelector('.sc-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
      if (sidebarOpen) {
        sidebar.classList.add('mobile-open');
        overlay.classList.add('active');
      } else {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
      }
    }
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sc-topbar">
        <div className="d-flex align-items-center gap-3">
          <button
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <List size={20} />
          </button>
          <div className="welcome-section">
            <h5 className="mb-0">Welcome back, {user?.firstName}!</h5>
            <small className="text-capitalize">{user?.role}</small>
          </div>
        </div>
        <div className="user-section">
          <Button
            variant="link"
            onClick={toggleTheme}
            className="d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-hover)',
              border: 'none',
              transition: 'all 0.2s ease',
            }}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="d-flex align-items-center gap-2 p-0"
              style={{
                textDecoration: 'none',
                color: 'var(--text-primary)',
              }}
            >
              <span
                className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--gradient-primary)',
                  color: 'var(--text-inverse)',
                  fontSize: '14px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {initials}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: 'var(--shadow-lg)',
                marginTop: '8px',
              }}
            >
              <Dropdown.Header
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  padding: '12px',
                }}
              >
                <div className="fw-semibold">{user?.firstName} {user?.lastName}</div>
                <div className="small" style={{ color: 'var(--text-secondary)' }}>
                  {user?.email}
                </div>
              </Dropdown.Header>
              <Dropdown.Divider style={{ borderColor: 'var(--border-color)' }} />
              <Dropdown.Item
                onClick={handleLogout}
                style={{
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div
        className="sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
