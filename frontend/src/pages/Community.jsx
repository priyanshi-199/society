import { useEffect, useState } from 'react';
import { Badge, Button, Card, Form, Modal, Image } from 'react-bootstrap';
import { Heart, HeartFill, Chat, Trash, Download, X, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import apiClient from '../services/ApiClient';
import { globalEventBus } from '../utils/EventBus';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(null);
  const [form, setForm] = useState({ content: '', images: [] });
  const [commentText, setCommentText] = useState('');
  const [imageViewer, setImageViewer] = useState({ show: false, images: [], currentIndex: 0 });

  const fetchPosts = async () => {
    try {
      const { data } = await apiClient.request('/community');
      setPosts(data.posts);
    } catch (error) {
      globalEventBus.emit('notify', { type: 'danger', message: error.message });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Validate that images are properly formatted
      const imagesToSend = form.images.filter(img => img && img.url && img.url.trim() !== '');
      
      await apiClient.request('/community', {
        method: 'POST',
        body: {
          content: form.content,
          images: imagesToSend,
        },
      });
      globalEventBus.emit('notify', { type: 'success', message: 'Post created' });
      setShowModal(false);
      setForm({ content: '', images: [] });
      fetchPosts();
    } catch (error) {
      globalEventBus.emit('notify', { 
        type: 'danger', 
        message: error.message || 'Failed to create post. Image may be too large.' 
      });
    }
  };

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    const imageData = [];
    const maxSize = 5 * 1024 * 1024; // 5MB per image
    
    for (const file of files) {
      // Validate file size
      if (file.size > maxSize) {
        globalEventBus.emit('notify', { 
          type: 'warning', 
          message: `${file.name} is too large. Maximum size is 5MB.` 
        });
        continue;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        globalEventBus.emit('notify', { 
          type: 'warning', 
          message: `${file.name} is not a valid image file.` 
        });
        continue;
      }
      
      // Convert to base64 for storage
      const reader = new FileReader();
      const promise = new Promise((resolve) => {
        reader.onload = (e) => {
          resolve({
            fileName: file.name,
            url: e.target.result, // Base64 data URL
          });
        };
        reader.onerror = () => {
          globalEventBus.emit('notify', { 
            type: 'danger', 
            message: `Failed to read ${file.name}` 
          });
          resolve(null);
        };
      });
      reader.readAsDataURL(file);
      const result = await promise;
      if (result) imageData.push(result);
    }
    
    if (imageData.length > 0) {
      setForm(prev => ({ ...prev, images: [...prev.images, ...imageData] }));
    }
  };

  const handleLike = async (postId) => {
    try {
      await apiClient.request(`/community/${postId}/like`, { method: 'POST' });
      fetchPosts();
    } catch (error) {
      globalEventBus.emit('notify', { type: 'danger', message: error.message });
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await apiClient.request(`/community/${postId}/comments`, {
        method: 'POST',
        body: { content: commentText },
      });
      globalEventBus.emit('notify', { type: 'success', message: 'Comment added' });
      setCommentText('');
      setShowCommentModal(null);
      fetchPosts();
    } catch (error) {
      globalEventBus.emit('notify', { type: 'danger', message: error.message });
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await apiClient.request(`/community/${postId}`, { method: 'DELETE' });
      globalEventBus.emit('notify', { type: 'success', message: 'Post deleted' });
      fetchPosts();
    } catch (error) {
      globalEventBus.emit('notify', { type: 'danger', message: error.message });
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await apiClient.request(`/community/${postId}/comments/${commentId}`, { method: 'DELETE' });
      globalEventBus.emit('notify', { type: 'success', message: 'Comment deleted' });
      fetchPosts();
    } catch (error) {
      globalEventBus.emit('notify', { type: 'danger', message: error.message });
    }
  };

  const isLiked = (post) => {
    return post.likes?.some(like => like._id === user?.id || like === user?.id);
  };

  const openImageViewer = (images, index = 0) => {
    setImageViewer({ show: true, images, currentIndex: index });
  };

  const closeImageViewer = () => {
    setImageViewer({ show: false, images: [], currentIndex: 0 });
  };

  const navigateImage = (direction) => {
    const { images, currentIndex } = imageViewer;
    let newIndex = currentIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }
    
    setImageViewer(prev => ({ ...prev, currentIndex: newIndex }));
  };

  const downloadImage = (image) => {
    try {
      const imageUrl = image.url || image;
      const fileName = image.fileName || `image-${Date.now()}.jpg`;
      
      // Handle base64 data URLs
      if (imageUrl.startsWith('data:')) {
        // Convert base64 to blob
        const response = fetch(imageUrl);
        response.then(res => res.blob()).then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          globalEventBus.emit('notify', { type: 'success', message: 'Image downloaded' });
        }).catch(() => {
          // Fallback: try direct download
          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          globalEventBus.emit('notify', { type: 'success', message: 'Image downloaded' });
        });
      } else {
        // Regular URL
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        globalEventBus.emit('notify', { type: 'success', message: 'Image downloaded' });
      }
    } catch (error) {
      globalEventBus.emit('notify', { type: 'danger', message: 'Failed to download image' });
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!imageViewer.show) return;
    
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        closeImageViewer();
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageViewer.show]);

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="mb-0">Community</h3>
          <p className="text-muted mb-0">Share updates, photos, and connect with your neighbors</p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary">
          Create Post
        </Button>
      </div>

      <div className="d-flex flex-column gap-4">
        {posts.map((post) => (
          <Card key={post._id} className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="mb-0">
                    {post.createdBy?.firstName} {post.createdBy?.lastName}
                  </h5>
                  <small className="text-muted">
                    {post.createdBy?.flatNumber} • {format(new Date(post.createdAt), 'MMM d, yyyy HH:mm')}
                  </small>
                </div>
                {(post.createdBy?._id === user?.id || post.createdBy === user?.id) && (
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeletePost(post._id)}>
                    <Trash />
                  </Button>
                )}
              </div>
              <p className="mb-3">{post.content}</p>
              {post.images && post.images.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {post.images.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        maxWidth: '200px',
                        maxHeight: '200px',
                      }}
                      onClick={() => openImageViewer(post.images, idx)}
                    >
                      <Image 
                        src={img.url || img} 
                        alt={img.fileName || `Image ${idx + 1}`} 
                        thumbnail 
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '200px', 
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          color: 'white',
                          fontSize: '12px',
                          pointerEvents: 'none',
                        }}
                      >
                        Click to enlarge
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="d-flex align-items-center gap-3 mb-3">
                <Button
                  variant="link"
                  className="p-0 text-decoration-none"
                  onClick={() => handleLike(post._id)}
                >
                  {isLiked(post) ? (
                    <HeartFill className="text-danger me-1" />
                  ) : (
                    <Heart className="me-1" />
                  )}
                  {post.likes?.length || 0}
                </Button>
                <Button
                  variant="link"
                  className="p-0 text-decoration-none"
                  onClick={() => setShowCommentModal(post._id)}
                >
                  <Chat className="me-1" />
                  {post.comments?.length || 0}
                </Button>
              </div>
              {post.comments && post.comments.length > 0 && (
                <div className="border-top pt-3">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="mb-2 d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{comment.createdBy?.firstName} {comment.createdBy?.lastName}</strong>
                        <p className="mb-0">{comment.content}</p>
                        <small className="text-muted">{format(new Date(comment.createdAt), 'MMM d, HH:mm')}</small>
                      </div>
                      {(comment.createdBy?._id === user?.id || comment.createdBy === user?.id || user?.role === 'admin') && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-danger"
                          onClick={() => handleDeleteComment(post._id, comment._id)}
                        >
                          <Trash size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
        {!posts.length && <p className="text-muted text-center">No posts yet. Be the first to share!</p>}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create Post</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label>What's on your mind?</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Add Images</Form.Label>
              <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} />
              {form.images.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                      <Image 
                        src={img.url} 
                        thumbnail 
                        style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} 
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          padding: '2px 6px',
                          fontSize: '12px',
                        }}
                        onClick={() => {
                          setForm(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx)
                          }));
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Post</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showCommentModal !== null} onHide={() => setShowCommentModal(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCommentModal(null)}>
            Cancel
          </Button>
          <Button onClick={() => handleAddComment(showCommentModal)}>Comment</Button>
        </Modal.Footer>
      </Modal>

      {/* Image Viewer Modal */}
      <Modal 
        show={imageViewer.show} 
        onHide={closeImageViewer}
        size="xl"
        centered
        style={{ zIndex: 1050 }}
      >
        <Modal.Body style={{ padding: 0, position: 'relative', backgroundColor: '#000' }}>
          <Button
            variant="link"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1051,
              color: 'white',
              padding: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
            }}
            onClick={closeImageViewer}
          >
            <X size={24} />
          </Button>

          {imageViewer.images.length > 1 && (
            <>
              <Button
                variant="link"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1051,
                  color: 'white',
                  padding: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%',
                }}
                onClick={() => navigateImage('prev')}
              >
                <ChevronLeft size={24} />
              </Button>
              <Button
                variant="link"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1051,
                  color: 'white',
                  padding: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%',
                }}
                onClick={() => navigateImage('next')}
              >
                <ChevronRight size={24} />
              </Button>
            </>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '70vh',
              padding: '20px',
            }}
          >
            {imageViewer.images[imageViewer.currentIndex] && (
              <Image
                src={imageViewer.images[imageViewer.currentIndex].url || imageViewer.images[imageViewer.currentIndex]}
                alt={imageViewer.images[imageViewer.currentIndex].fileName || `Image ${imageViewer.currentIndex + 1}`}
                fluid
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                }}
              />
            )}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1051,
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            {imageViewer.images.length > 1 && (
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                }}
              >
                {imageViewer.currentIndex + 1} / {imageViewer.images.length}
              </div>
            )}
            <Button
              variant="primary"
              onClick={() => downloadImage(imageViewer.images[imageViewer.currentIndex])}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Download size={18} />
              Download
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

