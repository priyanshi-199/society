import { useState, useRef, useEffect } from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { ChatDots, X, Send, Robot } from 'react-bootstrap-icons';
import apiClient from '../services/ApiClient';
import { globalEventBus } from '../utils/EventBus';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Hello! How can I help you?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data } = await apiClient.request('/chatbot/chat', {
        method: 'POST',
        body: { message: inputMessage },
      });

      const botMessage = {
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      globalEventBus.emit('notify', { type: 'danger', message: error.message || 'Failed to get response' });
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        className="chatbot-toggle-btn"
        onClick={toggleChat}
        variant="primary"
        size="lg"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {isOpen ? <X size={24} /> : <ChatDots size={24} />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card
          className="chatbot-window modern-card"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '380px',
            maxWidth: 'calc(100vw - 40px)',
            height: '500px',
            maxHeight: 'calc(100vh - 120px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-xl)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <Card.Header
            style={{
              background: 'var(--gradient-primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              border: 'none',
            }}
          >
            <Robot size={20} />
            <strong>AI Assistant</strong>
          </Card.Header>

          <Card.Body
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: msg.sender === 'user' ? 'var(--gradient-primary)' : 'var(--bg-card)',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  }}
                >
                  {msg.text}
                </div>
                <small
                  style={{
                    fontSize: '10px',
                    color: '#666',
                    marginTop: '4px',
                    display: 'block',
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
            ))}
            {isLoading && (
              <div className="bot-message" style={{ alignSelf: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <Spinner size="sm" animation="border" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </Card.Body>

          <Card.Footer style={{ padding: '12px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
            <Form onSubmit={handleSend}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Form.Control
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                  className="form-control-modern"
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                  }}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading || !inputMessage.trim()}
                  className="btn-modern-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: 'none',
                  }}
                >
                  <Send size={16} />
                </Button>
              </div>
            </Form>
          </Card.Footer>
        </Card>
      )}
    </>
  );
}

