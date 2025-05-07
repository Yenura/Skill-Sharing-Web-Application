import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import { useAuth } from '../../config/AuthContext.jsx';

const CommunityPosts = ({ communityId, isMember }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchCommunityPosts();
  }, [communityId]);

  const fetchCommunityPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/posts/community/${communityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching community posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value
    });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...newPost,
        communityId
      };
      
      await axios.post(`${API_URL}/api/posts`, postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Reset form and refresh posts
      setNewPost({
        title: '',
        content: '',
        imageUrl: ''
      });
      fetchCommunityPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again later.');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await axios.post(`${API_URL}/api/posts/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update the post in the local state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes(currentUser.id);
          return {
            ...post,
            likedBy: isLiked 
              ? post.likedBy.filter(id => id !== currentUser.id) 
              : [...post.likedBy, currentUser.id]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {isMember && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">Share a Recipe or Cooking Tip</h5>
            <Form onSubmit={handleSubmitPost}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="content"
                  value={newPost.content}
                  onChange={handleInputChange}
                  placeholder="Share your recipe, cooking tip, or ask a question..."
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="url"
                  name="imageUrl"
                  value={newPost.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Image URL (optional)"
                />
              </Form.Group>
              <div className="d-grid">
                <Button variant="primary" type="submit">
                  Post
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      {posts.length > 0 ? (
        posts.map(post => (
          <Card key={post.id} className="mb-3">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <img 
                  src={post.authorProfilePicture || 'https://via.placeholder.com/40'} 
                  alt={post.authorName} 
                  className="rounded-circle me-2"
                  width="40"
                  height="40"
                />
                <div>
                  <h6 className="mb-0">{post.authorName}</h6>
                  <small className="text-muted">
                    {new Date(post.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
              
              <h5 className="card-title">{post.title}</h5>
              <Card.Text>{post.content}</Card.Text>
              
              {post.imageUrl && (
                <div className="mb-3">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="img-fluid rounded"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                </div>
              )}
              
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Button 
                    variant={post.likedBy.includes(currentUser?.id) ? "primary" : "outline-primary"} 
                    size="sm"
                    onClick={() => handleLikePost(post.id)}
                    className="me-2"
                  >
                    <i className="bi bi-heart-fill me-1"></i>
                    {post.likedBy.length}
                  </Button>
                  <Link to={`/posts/${post.id}`}>
                    <Button variant="outline-secondary" size="sm">
                      <i className="bi bi-chat-text me-1"></i>
                      {post.commentCount || 0} Comments
                    </Button>
                  </Link>
                </div>
                
                {post.authorId === currentUser?.id && (
                  <Link to={`/posts/${post.id}/edit`}>
                    <Button variant="link" size="sm">Edit</Button>
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="text-center my-5">
          <p>No posts yet in this community.</p>
          {isMember ? (
            <p>Be the first to share a recipe or cooking tip!</p>
          ) : (
            <p>Join this community to share recipes and cooking tips!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityPosts;
