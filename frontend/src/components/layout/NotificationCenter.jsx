import { useCallback, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import { useEventBus } from '../../hooks/useEventBus';

let counter = 0;

export function NotificationCenter() {
  const [messages, setMessages] = useState([]);

  const handleNotification = useCallback((payload) => {
    counter += 1;
    const notification = {
      id: counter,
      type: payload?.type || 'info',
      message: payload?.message || 'Notification',
    };
    setMessages((prev) => [...prev, notification]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== notification.id));
    }, payload?.duration || 4000);
  }, []);

  useEventBus('notify', handleNotification);

  const removeNotification = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  if (!messages.length) {
    return null;
  }

  const getAlertStyle = (type) => {
    const styles = {
      success: {
        backgroundColor: 'var(--success-color)',
        color: 'white',
        border: 'none',
      },
      danger: {
        backgroundColor: 'var(--danger-color)',
        color: 'white',
        border: 'none',
      },
      warning: {
        backgroundColor: 'var(--warning-color)',
        color: 'white',
        border: 'none',
      },
      info: {
        backgroundColor: 'var(--info-color)',
        color: 'white',
        border: 'none',
      },
    };
    return styles[type] || styles.info;
  };

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{
        zIndex: 1050,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        width: '100%',
      }}
    >
      {messages.map((notification) => (
        <Alert
          key={notification.id}
          variant={notification.type}
          className="slide-in modern-card"
          style={{
            ...getAlertStyle(notification.type),
            borderRadius: '12px',
            padding: '16px',
            margin: 0,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <span style={{ flex: 1 }}>{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <X size={14} />
          </button>
        </Alert>
      ))}
    </div>
  );
}
