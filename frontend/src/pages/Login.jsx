import { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { globalEventBus } from '../utils/EventBus';
import { Sun, Moon } from 'react-bootstrap-icons';

export default function Login() {
  const { login, isAuthenticated, hasRole } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    if (hasRole('security')) {
      return <Navigate to="/visitors" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user?.role === 'security') {
        navigate('/visitors');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      globalEventBus.emit('notify', { type: 'danger', message: error.message || 'Unable to login' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        position: 'relative',
      }}
    >
      <Button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </Button>

      <Row className="justify-content-center w-100" style={{ maxWidth: '450px' }}>
        <Col>
          <Card
            className="modern-card fade-in"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div
              style={{
                background: 'var(--gradient-primary)',
                padding: '32px',
                textAlign: 'center',
              }}
            >
              <h2
                className="fw-bold mb-2"
                style={{
                  color: 'var(--text-inverse)',
                  fontSize: '2rem',
                }}
              >
                Society Connect
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                Sign in to manage your society dashboard
              </p>
            </div>
            <Card.Body style={{ padding: '32px' }}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Email address
                  </Form.Label>
                  <Form.Control
                    className="form-control-modern"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Password
                  </Form.Label>
                  <Form.Control
                    className="form-control-modern"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button
                    className="btn-modern btn-modern-primary"
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <small style={{ color: 'var(--text-secondary)' }}>
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      style={{
                        color: 'var(--primary-color)',
                        fontWeight: 500,
                        textDecoration: 'none',
                      }}
                    >
                      Sign up
                    </Link>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
