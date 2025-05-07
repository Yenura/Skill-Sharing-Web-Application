import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import { useAuth } from '../../config/AuthContext.jsx';
import CommunityPosts from './CommunityPosts';
import CommunityMembers from './CommunityMembers';
import CommunityChallenges from './CommunityChallenges';

const CommunityDetail = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    coverImage: '',
    isPrivate: false
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunityDetails();
  }, [communityId]);

  const fetchCommunityDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/communities/${communityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCommunity(response.data);
      setFormData({
        name: response.data.name,
        description: response.data.description,
        category: response.data.category,
        coverImage: response.data.coverImage,
        isPrivate: response.data.isPrivate
      });
    } catch (error) {
      console.error('Error fetching community details:', error);
      setError('Failed to load community details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/communities/${communityId}/join`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCommunity(response.data);
      setShowJoinModal(false);
    } catch (error) {
      console.error('Error joining community:', error);
      setError('Failed to join community. Please try again later.');
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      await axios.post(`${API_URL}/api/communities/${communityId}/leave`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchCommunityDetails();
      setShowLeaveModal(false);
    } catch (error) {
      console.error('Error leaving community:', error);
      setError('Failed to leave community. Please try again later.');
    }
  };

  const handleUpdateCommunity = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/api/communities/${communityId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCommunity(response.data);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating community:', error);
      setError('Failed to update community. Please try again later.');
    }
  };

  const handleDeleteCommunity = async () => {
    if (window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/api/communities/${communityId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        navigate('/communities');
      } catch (error) {
        console.error('Error deleting community:', error);
        setError('Failed to delete community. Please try again later.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!community) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Community not found</Alert>
      </Container>
    );
  }

  const isCreator = community.creatorId === currentUser?.id;
  const isModerator = community.moderator;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1>{community.name}</h1>
              <Badge bg="info" className="me-2">{community.category}</Badge>
              {community.isPrivate && <Badge bg="secondary">Private</Badge>}
            </div>
            <div>
              {!community.member ? (
                <Button variant="primary" onClick={() => setShowJoinModal(true)}>Join Community</Button>
              ) : (
                <>
                  {isCreator || isModerator ? (
                    <Button variant="outline-primary" onClick={() => setShowEditModal(true)} className="me-2">
                      Edit Community
                    </Button>
                  ) : null}
                  {!isCreator && (
                    <Button variant="outline-danger" onClick={() => setShowLeaveModal(true)}>
                      Leave Community
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          
          <Card className="mb-4">
            {community.coverImage && (
              <Card.Img 
                variant="top" 
                src={community.coverImage} 
                style={{ height: '200px', objectFit: 'cover' }} 
              />
            )}
            <Card.Body>
              <Card.Text>{community.description}</Card.Text>
              <div className="d-flex justify-content-between">
                <div>
                  <small className="text-muted">
                    Created by {community.creatorName || 'Unknown'} • {community.memberCount} members
                  </small>
                </div>
                {isCreator && (
                  <Button variant="danger" size="sm" onClick={handleDeleteCommunity}>
                    Delete Community
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="posts">
        <Row>
          <Col>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="posts">Posts</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="challenges">Challenges</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="members">Members</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey="posts">
                <CommunityPosts communityId={communityId} isMember={community.member} />
              </Tab.Pane>
              <Tab.Pane eventKey="challenges">
                <CommunityChallenges 
                  communityId={communityId} 
                  isMember={community.member} 
                  isModerator={isCreator || isModerator} 
                />
              </Tab.Pane>
              <Tab.Pane eventKey="members">
                <CommunityMembers 
                  communityId={communityId} 
                  isCreator={isCreator} 
                  isModerator={isModerator} 
                />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* Join Community Modal */}
      <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Join Community</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to join "{community.name}"?</p>
          <p>By joining, you'll be able to create posts, participate in challenges, and interact with other members.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowJoinModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleJoinCommunity}>Join</Button>
        </Modal.Footer>
      </Modal>

      {/* Leave Community Modal */}
      <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Leave Community</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to leave "{community.name}"?</p>
          <p>You will no longer be able to create posts or participate in challenges in this community.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLeaveModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleLeaveCommunity}>Leave</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Community Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Community</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateCommunity}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Community Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                <option value="baking">Baking</option>
                <option value="vegan cooking">Vegan Cooking</option>
                <option value="international cuisine">International Cuisine</option>
                <option value="weeknight dinners">Weeknight Dinners</option>
                <option value="desserts">Desserts</option>
                <option value="healthy eating">Healthy Eating</option>
                <option value="meal prep">Meal Prep</option>
                <option value="grilling">Grilling</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cover Image URL</Form.Label>
              <Form.Control
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Private Community"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleInputChange}
              />
              <Form.Text className="text-muted">
                Private communities are only visible to members.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CommunityDetail;
