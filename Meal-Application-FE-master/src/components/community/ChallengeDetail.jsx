import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Form, Tab, Nav } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import { useAuth } from '../../config/AuthContext.jsx';

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSubmission, setNewSubmission] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallengeDetails();
  }, [challengeId]);

  const fetchChallengeDetails = async () => {
    setLoading(true);
    try {
      const [challengeRes, submissionsRes, participantsRes] = await Promise.all([
        axios.get(`${API_URL}/api/challenges/${challengeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get(`${API_URL}/api/challenges/${challengeId}/submissions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get(`${API_URL}/api/challenges/${challengeId}/participants`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);
      
      setChallenge(challengeRes.data);
      setSubmissions(submissionsRes.data);
      setParticipants(participantsRes.data);
    } catch (error) {
      console.error('Error fetching challenge details:', error);
      setError('Failed to load challenge details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubmission({
      ...newSubmission,
      [name]: value
    });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...newSubmission,
        challengeId
      };
      
      const response = await axios.post(`${API_URL}/api/posts`, postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Add submission to challenge
      await axios.post(`${API_URL}/api/challenges/${challengeId}/submissions/${response.data.id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Reset form and refresh submissions
      setNewSubmission({
        title: '',
        content: '',
        imageUrl: ''
      });
      fetchChallengeDetails();
    } catch (error) {
      console.error('Error creating submission:', error);
      setError('Failed to create submission. Please try again later.');
    }
  };

  const handleJoinChallenge = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/challenges/${challengeId}/join`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setChallenge(response.data);
      fetchChallengeDetails();
    } catch (error) {
      console.error('Error joining challenge:', error);
      setError('Failed to join challenge. Please try again later.');
    }
  };

  const handleLeaveChallenge = async () => {
    try {
      await axios.post(`${API_URL}/api/challenges/${challengeId}/leave`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      fetchChallengeDetails();
    } catch (error) {
      console.error('Error leaving challenge:', error);
      setError('Failed to leave challenge. Please try again later.');
    }
  };

  const handleLikeSubmission = async (postId) => {
    try {
      await axios.post(`${API_URL}/api/posts/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update the submission in the local state
      setSubmissions(submissions.map(submission => {
        if (submission.id === postId) {
          const isLiked = submission.likedBy.includes(currentUser.id);
          return {
            ...submission,
            likedBy: isLiked 
              ? submission.likedBy.filter(id => id !== currentUser.id) 
              : [...submission.likedBy, currentUser.id]
          };
        }
        return submission;
      }));
    } catch (error) {
      console.error('Error liking/unliking submission:', error);
    }
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

  if (!challenge) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Challenge not found</Alert>
      </Container>
    );
  }

  const isModerator = challenge.creatorId === currentUser?.id;
  const canSubmit = challenge.isParticipant && challenge.status === 'active';

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <Link to={`/communities/${challenge.communityId}`} className="text-decoration-none">
                <small className="text-muted">
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to {challenge.communityName}
                </small>
              </Link>
              <h1 className="mt-2">{challenge.title}</h1>
              <Badge bg={
                challenge.status === 'active' ? 'success' : 
                challenge.status === 'upcoming' ? 'warning' : 'secondary'
              } className="me-2">
                {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
              </Badge>
              <small className="text-muted">
                {challenge.participantCount} participants • {challenge.submissionCount} submissions
              </small>
            </div>
            <div>
              {challenge.status !== 'completed' && (
                challenge.isParticipant ? (
                  <Button 
                    variant="outline-secondary"
                    onClick={handleLeaveChallenge}
                  >
                    Leave Challenge
                  </Button>
                ) : (
                  <Button 
                    variant="primary"
                    onClick={handleJoinChallenge}
                  >
                    Join Challenge
                  </Button>
                )
              )}
            </div>
          </div>
          
          <Card className="mb-4">
            <Card.Body>
              <Card.Text>{challenge.description}</Card.Text>
              <div className="d-flex justify-content-between">
                <div>
                  <small className="text-muted">
                    Created by {challenge.creatorName || 'Unknown'}
                    <br />
                    {challenge.status === 'upcoming' ? 'Starts' : 'Started'}: {new Date(challenge.startDate).toLocaleString()}
                    <br />
                    {challenge.status === 'completed' ? 'Ended' : 'Ends'}: {new Date(challenge.endDate).toLocaleString()}
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="submissions">
        <Row>
          <Col>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="submissions">Submissions</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="participants">Participants</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey="submissions">
                {canSubmit && (
                  <Card className="mb-4">
                    <Card.Body>
                      <h5 className="mb-3">Submit Your Entry</h5>
                      <Form onSubmit={handleSubmitPost}>
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="text"
                            name="title"
                            value={newSubmission.title}
                            onChange={handleInputChange}
                            placeholder="Title of your submission"
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="content"
                            value={newSubmission.content}
                            onChange={handleInputChange}
                            placeholder="Share your recipe, process, or results..."
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="url"
                            name="imageUrl"
                            value={newSubmission.imageUrl}
                            onChange={handleInputChange}
                            placeholder="Image URL (highly recommended for cooking challenges)"
                          />
                        </Form.Group>
                        <div className="d-grid">
                          <Button variant="primary" type="submit">
                            Submit Entry
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                )}
                
                {submissions.length > 0 ? (
                  submissions.map(submission => (
                    <Card key={submission.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex align-items-center mb-2">
                          <img 
                            src={submission.authorProfilePicture || 'https://via.placeholder.com/40'} 
                            alt={submission.authorName} 
                            className="rounded-circle me-2"
                            width="40"
                            height="40"
                          />
                          <div>
                            <h6 className="mb-0">{submission.authorName}</h6>
                            <small className="text-muted">
                              {new Date(submission.createdAt).toLocaleString()}
                            </small>
                          </div>
                        </div>
                        
                        <h5 className="card-title">{submission.title}</h5>
                        <Card.Text>{submission.content}</Card.Text>
                        
                        {submission.imageUrl && (
                          <div className="mb-3">
                            <img 
                              src={submission.imageUrl} 
                              alt={submission.title} 
                              className="img-fluid rounded"
                              style={{ maxHeight: '300px', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Button 
                              variant={submission.likedBy.includes(currentUser?.id) ? "primary" : "outline-primary"} 
                              size="sm"
                              onClick={() => handleLikeSubmission(submission.id)}
                              className="me-2"
                            >
                              <i className="bi bi-heart-fill me-1"></i>
                              {submission.likedBy.length}
                            </Button>
                            <Link to={`/posts/${submission.id}`}>
                              <Button variant="outline-secondary" size="sm">
                                <i className="bi bi-chat-text me-1"></i>
                                {submission.commentCount || 0} Comments
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <div className="text-center my-5">
                    <p>No submissions yet for this challenge.</p>
                    {canSubmit ? (
                      <p>Be the first to submit your entry!</p>
                    ) : challenge.isParticipant ? (
                      <p>
                        {challenge.status === 'upcoming' 
                          ? 'You can submit your entry once the challenge starts.' 
                          : 'The challenge has ended and is no longer accepting submissions.'}
                      </p>
                    ) : (
                      <p>Join the challenge to submit your entry!</p>
                    )}
                  </div>
                )}
              </Tab.Pane>
              
              <Tab.Pane eventKey="participants">
                {participants.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {participants.map(participant => (
                      <div key={participant.id} className="col">
                        <Card className="h-100">
                          <Card.Body>
                            <div className="d-flex align-items-center">
                              <img 
                                src={participant.profilePicture || 'https://via.placeholder.com/50'} 
                                alt={participant.fullName} 
                                className="rounded-circle me-3"
                                width="50"
                                height="50"
                              />
                              <div>
                                <h5 className="mb-0">{participant.fullName}</h5>
                                <small className="text-muted">@{participant.username}</small>
                                {participant.id === challenge.creatorId && (
                                  <Badge bg="dark" className="ms-2">Creator</Badge>
                                )}
                              </div>
                            </div>
                          </Card.Body>
                          <Card.Footer className="bg-white">
                            <Link to={`/profile/${participant.id}`}>
                              <Button variant="outline-primary" size="sm" className="w-100">
                                View Profile
                              </Button>
                            </Link>
                          </Card.Footer>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center my-5">
                    <p>No participants have joined this challenge yet.</p>
                    {!challenge.isParticipant && challenge.status !== 'completed' && (
                      <Button variant="primary" onClick={handleJoinChallenge}>
                        Be the First to Join
                      </Button>
                    )}
                  </div>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default ChallengeDetail;
