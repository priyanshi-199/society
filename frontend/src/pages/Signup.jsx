import { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { globalEventBus } from '../utils/EventBus';
import apiClient from '../services/ApiClient';
import { Sun, Moon } from 'react-bootstrap-icons';

export default function Signup() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    flatNumber: '',
    gateNumber: '',
    role: 'owner',
  });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      globalEventBus.emit('notify', { type: 'danger', message: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      await apiClient.request('/auth/register', {
        method: 'POST',
        body: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          flatNumber: form.role === 'security' ? form.gateNumber : form.flatNumber,
          gateNumber: form.role === 'security' ? form.gateNumber : undefined,
          role: form.role,
        },
      });
      globalEventBus.emit('notify', { 
        type: 'success', 
        message: 'Registration successful! Please wait for admin approval before logging in.' 
      });
      navigate('/login');
    } catch (error) {
      globalEventBus.emit('notify', { type: 'danger', message: error.message || 'Unable to register' });
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

      <Row className="justify-content-center w-100" style={{ maxWidth: '700px' }}>
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
                Create your account
              </p>
            </div>
            <Card.Body style={{ padding: '32px' }}>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="firstName">
                      <Form.Label style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        First Name
                      </Form.Label>
                      <Form.Control
                        className="form-control-modern"
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="lastName">
                      <Form.Label style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Last Name
                      </Form.Label>
                      <Form.Control
                        className="form-control-modern"
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Email address
                  </Form.Label>
                  <Form.Control
                    className="form-control-modern"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Password
                      </Form.Label>
                      <Form.Control
                        className="form-control-modern"
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Confirm Password
                      </Form.Label>
                      <Form.Control
                        className="form-control-modern"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    className="form-control-modern"
                    type="tel"
                    name="phone"
                    placeholder="+1234567890"
                    value={form.phone}
                    onChange={handleChange}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="role">
                  <Form.Label style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Role
                  </Form.Label>
                  <Form.Select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                    }}
                  >
                    <option value="owner">Owner</option>
                    <option value="tenant">Tenant</option>
                    <option value="security">Security</option>
                  </Form.Select>
                </Form.Group>
                {form.role === 'security' ? (
                  <Form.Group className="mb-3" controlId="gateNumber">
                    <Form.Label style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      Gate Number
                    </Form.Label>
                    <Form.Select
                      name="gateNumber"
                      value={form.gateNumber || ''}
                      onChange={handleChange}
                      required
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                      }}
                    >
                      <option value="">Select Gate</option>
                      <option value="Gate 1">Gate 1</option>
                      <option value="Gate 2">Gate 2</option>
                      <option value="Gate 3">Gate 3</option>
                    </Form.Select>
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-4" controlId="flatNumber">
                    <Form.Label style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      Flat Number
                    </Form.Label>
                    <Form.Control
                      className="form-control-modern"
                      type="text"
                      name="flatNumber"
                      placeholder="A-101"
                      value={form.flatNumber}
                      onChange={handleChange}
                      required
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </Form.Group>
                )}
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
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <small style={{ color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      style={{
                        color: 'var(--primary-color)',
                        fontWeight: 500,
                        textDecoration: 'none',
                      }}
                    >
                      Sign in
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
