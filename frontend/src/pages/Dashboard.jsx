import { useEffect, useState } from 'react';
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import { CashStack, ClipboardCheck, People, Megaphone, ExclamationTriangle } from 'react-bootstrap-icons';
import apiClient from '../services/ApiClient';
import { globalEventBus } from '../utils/EventBus';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, hasRole } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const response = await apiClient.request('/dashboard');
        if (isMounted) {
          setData(response.data);
        }
      } catch (error) {
        globalEventBus.emit('notify', { type: 'danger', message: error.message });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" style={{ color: 'var(--primary-color)' }} />
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, gradient, delay = 0 }) => (
    <Col md={4} className="mb-4 fade-in" style={{ animationDelay: `${delay}ms` }}>
      <Card
        className="modern-card h-100"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            background: gradient || 'var(--gradient-primary)',
            padding: '24px',
            color: 'white',
          }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem', fontWeight: 500 }}>
                {title}
              </h6>
              <h2
                className="mt-2 mb-0"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                }}
              >
                {value}
              </h2>
            </div>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Icon size={28} />
            </div>
          </div>
        </div>
        {subtitle && (
          <Card.Body style={{ padding: '16px 24px' }}>
            <small style={{ color: 'var(--text-secondary)' }}>{subtitle}</small>
          </Card.Body>
        )}
      </Card>
    </Col>
  );

  return (
    <div className="d-flex flex-column gap-4">
      <div className="mb-4">
        <h2
          className="fw-bold mb-2"
          style={{
            color: 'var(--text-primary)',
            fontSize: '2rem',
          }}
        >
          Dashboard
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Welcome back! Here's what's happening in your society.
        </p>
      </div>

      {!hasRole('tenant') && data?.bills && (
        <Row>
          <StatCard
            title="Maintenance Due"
            value={
              data.bills.length > 0 && data.bills[0]
                ? `₹${data.bills[0].amount.toLocaleString()}`
                : '₹0'
            }
            subtitle={
              data.bills.length > 0 && data.bills[0]
                ? `Due: ${new Date(data.bills[0].dueDate).toLocaleDateString()}`
                : 'No pending bills'
            }
            icon={CashStack}
            gradient={
              data.bills.length > 0 && data.bills[0]
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            }
            delay={0}
          />
        </Row>
      )}

      <Row>
        <StatCard
          title="Active Polls"
          value={data.activePolls.length}
          subtitle="Make sure to vote before they close"
          icon={ClipboardCheck}
          gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          delay={100}
        />
        <StatCard
          title="Upcoming Visitors"
          value={data.upcomingVisitors.length}
          subtitle="Scheduled to arrive for your flat"
          icon={People}
          gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          delay={200}
        />
      </Row>

      <Row>
        <Col xl={12}>
          <Card
            className="modern-card"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
            }}
          >
            <Card.Body style={{ padding: '24px' }}>
              <div className="d-flex align-items-center mb-3">
                <Megaphone
                  size={24}
                  style={{
                    color: 'var(--primary-color)',
                    marginRight: '12px',
                  }}
                />
                <h5 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  Latest Notices
                </h5>
              </div>
              <div className="d-flex flex-column gap-3">
                {data.notices.slice(0, 3).map((notice) => (
                  <div
                    key={notice._id}
                    className="border-modern p-3"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <h6
                      className="mb-1"
                      style={{
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                      }}
                    >
                      {notice.title}
                    </h6>
                    <small style={{ color: 'var(--text-secondary)' }}>
                      {new Date(notice.createdAt).toLocaleString()}
                    </small>
                    <p
                      className="mb-0 mt-2"
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {notice.content.slice(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card
            className="modern-card h-100"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
            }}
          >
            <Card.Body style={{ padding: '24px' }}>
              <div className="d-flex align-items-center mb-3">
                <ExclamationTriangle
                  size={24}
                  style={{
                    color: 'var(--warning-color)',
                    marginRight: '12px',
                  }}
                />
                <h5 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  Your Recent Complaints
                </h5>
              </div>
              <div className="d-flex flex-column gap-3">
                {data.complaints.slice(0, 3).map((complaint) => (
                  <div
                    key={complaint._id}
                    className="border-modern p-3"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '12px',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6
                        className="mb-0"
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: 600,
                        }}
                      >
                        {complaint.subject}
                      </h6>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            complaint.status === 'resolved'
                              ? 'var(--success-color)'
                              : complaint.status === 'rejected'
                              ? 'var(--danger-color)'
                              : 'var(--warning-color)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        marginBottom: '8px',
                      }}
                    >
                      {complaint.description.slice(0, 120)}...
                    </p>
                    <small style={{ color: 'var(--text-muted)' }}>
                      Updated: {new Date(complaint.updatedAt || complaint.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card
            className="modern-card h-100"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
            }}
          >
            <Card.Body style={{ padding: '24px' }}>
              <div className="d-flex align-items-center mb-3">
                <ClipboardCheck
                  size={24}
                  style={{
                    color: 'var(--info-color)',
                    marginRight: '12px',
                  }}
                />
                <h5 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  Active Polls
                </h5>
              </div>
              <div className="d-flex flex-column gap-3">
                {data.activePolls.map((poll) => (
                  <div
                    key={poll._id}
                    className="border-modern p-3"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '12px',
                    }}
                  >
                    <h6
                      style={{
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        marginBottom: '8px',
                      }}
                    >
                      {poll.question}
                    </h6>
                    <small style={{ color: 'var(--text-secondary)' }}>
                      Closes {poll.closesAt ? new Date(poll.closesAt).toLocaleString() : 'soon'}
                    </small>
                  </div>
                ))}
                {!data.activePolls.length && (
                  <p style={{ color: 'var(--text-muted)', margin: 0, textAlign: 'center', padding: '20px' }}>
                    No active polls at the moment.
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
