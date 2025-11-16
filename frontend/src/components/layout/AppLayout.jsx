import { Container } from 'react-bootstrap';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NotificationCenter } from './NotificationCenter';
import Chatbot from '../Chatbot';
import { useEffect } from 'react';
import './layout.css';

export function AppLayout() {
  const { isAuthenticated, user, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && hasRole('security') && window.location.pathname === '/dashboard') {
      navigate('/visitors', { replace: true });
    }
  }, [isAuthenticated, hasRole, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="sc-content flex-grow-1">
        <Topbar />
        <div className="sc-content-wrapper">
          <Outlet />
        </div>
      </div>
      <NotificationCenter />
      <Chatbot />
    </div>
  );
}
