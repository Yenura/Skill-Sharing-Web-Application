import React, { useState, useEffect } from 'react';
import { Card, Button, Nav, Tab, Row, Col, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import { useAuth } from '../../config/AuthContext.jsx';

const CommunityChallenges = ({ communityId, isMember, isModerator }) => {
  const [challenges, setChallenges] = useState({
    active: [],
    upcoming: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchChallenges();
  }, [communityId]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const [activeRes, upcomingRes, completedRes] = await Promise.all([
        axios.get(`${API_URL}/api/challenges/community/${communityId}/active`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get(`${API_URL}/api/challenges/community/${communityId}/upcoming`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get(`${API_URL}/api/challenges/community/${communityId}/completed`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);
      
      setChallenges({
        active: activeRes.data,
        upcoming: upcomingRes.data,
        completed: completedRes.data
      });
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setError('Failed to load challenges. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      const challengeData = {
        ...formData,
        communityId
      };
      
      await axios.post(`${API_URL}/api/challenges`, challengeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Reset form and refresh challenges
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: ''
      });
      setShowCreateModal(false);
      fetchChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
      setError('Failed to create challenge. Please try again later.');
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      await axios.post(`${API_URL}/api/challenges/${challengeId}/join`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update the challenges in the local state
      const updateChallengeInList = (list) => {
        return list.map(challenge => {
          if (challenge.id === challengeId) {
            return {
              ...challenge,
              isParticipant: true,
              participantCount: challenge.participantCount + 1
            };
          }
          return challenge;
        });
      };
      
      setChallenges({
        active: updateChallengeInList(challenges.active),
        upcoming: updateChallengeInList(challenges.upcoming),
        completed: updateChallengeInList(challenges.completed)
      });
    } catch (error) {
      console.error('Error joining challenge:', error);
      setError('Failed to join challenge. Please try again later.');
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    try {
      await axios.post(`${API_URL}/api/challenges/${challengeId}/leave`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update the challenges in the local state
      const updateChallengeInList = (list) => {
        return list.map(challenge => {
          if (challenge.id === challengeId) {
            return {
              ...challenge,
              isParticipant: false,
              participantCount: challenge.participantCount - 1
            };
          }
          return challenge;
        });
      };
      
      setChallenges({
        active: updateChallengeInList(challenges.active),
        upcoming: updateChallengeInList(challenges.upcoming),
        completed: updateChallengeInList(challenges.completed)
      });
    } catch (error) {
      console.error('Error leaving challenge:', error);
      setError('Failed to leave challenge. Please try again later.');
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (window.confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/api/challenges/${challengeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Remove the challenge from the local state
        const filterChallengeFromList = (list) => {
          return list.filter(challenge => challenge.id !== challengeId);
        };
        
        setChallenges({
          active: filterChallengeFromList(challenges.active),
          upcoming: filterChallengeFromList(challenges.upcoming),
          completed: filterChallengeFromList(challenges.completed)
        });
      } catch (error) {
        console.error('Error deleting challenge:', error);
        setError('Failed to delete challenge. Please try again later.');
      }
    }
  };

  const renderChallengeCard = (challenge) => {
    return (
      <Card key={challenge.id} className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h5 className="card-title">{challenge.title}</h5>
              <div className="mb-2">
                <Badge bg={
                  challenge.status === 'active' ? 'success' : 
                  challenge.status === 'upcoming' ? 'warning' : 'secondary'
                }>
                  {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                </Badge>
                <small className="text-muted ms-2">
                  {challenge.participantCount} participants • {challenge.submissionCount} submissions
                </small>
              </div>
            </div>
            {isModerator && (
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => handleDeleteChallenge(challenge.id)}
              >
                Delete
              </Button>
            )}
          </div>
          
          <Card.Text>{challenge.description}</Card.Text>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <small className="text-muted">
                {challenge.status === 'upcoming' ? 'Starts' : 'Started'}: {new Date(challenge.startDate).toLocaleDateString()}
                <br />
                {challenge.status === 'completed' ? 'Ended' : 'Ends'}: {new Date(challenge.endDate).toLocaleDateString()}
              </small>
            </div>
            
            <div>
              <Link to={`/challenges/${challenge.id}`}>
                <Button variant="outline-primary" size="sm" className="me-2">
                  View Details
                </Button>
              </Link>
              
              {isMember && challenge.status !== 'completed' && (
                challenge.isParticipant ? (
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => handleLeaveChallenge(challenge.id)}
                  >
                    Leave Challenge
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleJoinChallenge(challenge.id)}
                  >
                    Join Challenge
                  </Button>
                )
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  if (loading && Object.values(challenges).every(list => list.length === 0)) {
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
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Cooking Challenges</h5>
        {isModerator && (
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Create Challenge
          </Button>
        )}
      </div>
      
      <Tab.Container defaultActiveKey="active">
        <Nav variant="pills" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="active">
              Active ({challenges.active.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="upcoming">
              Upcoming ({challenges.upcoming.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="completed">
              Completed ({challenges.completed.length})
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="active">
            {challenges.active.length > 0 ? (
              challenges.active.map(challenge => renderChallengeCard(challenge))
            ) : (
              <div className="text-center my-5">
                <p>No active challenges at the moment.</p>
                {isModerator && (
                  <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    Create Challenge
                  </Button>
                )}
              </div>
            )}
          </Tab.Pane>
          
          <Tab.Pane eventKey="upcoming">
            {challenges.upcoming.length > 0 ? (
              challenges.upcoming.map(challenge => renderChallengeCard(challenge))
            ) : (
              <div className="text-center my-5">
                <p>No upcoming challenges.</p>
                {isModerator && (
                  <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    Create Challenge
                  </Button>
                )}
              </div>
            )}
          </Tab.Pane>
          
          <Tab.Pane eventKey="completed">
            {challenges.completed.length > 0 ? (
              challenges.completed.map(challenge => renderChallengeCard(challenge))
            ) : (
              <div className="text-center my-5">
                <p>No completed challenges yet.</p>
              </div>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      
      {/* Create Challenge Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Cooking Challenge</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateChallenge}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Challenge Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="E.g., 'Weekly Vegan Dessert Challenge'"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the challenge, rules, and what participants should do..."
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Challenge
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CommunityChallenges;
