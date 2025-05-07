import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import { useAuth } from '../../config/AuthContext.jsx';

const CommunityMembers = ({ communityId, isCreator, isModerator }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchCommunityMembers();
  }, [communityId]);

  const fetchCommunityMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/communities/${communityId}/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching community members:', error);
      setError('Failed to load members. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModerator = async (userId) => {
    try {
      await axios.post(`${API_URL}/api/communities/${communityId}/moderators/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update the member in the local state
      setMembers(members.map(member => {
        if (member.id === userId) {
          return {
            ...member,
            isModerator: true
          };
        }
        return member;
      }));
    } catch (error) {
      console.error('Error adding moderator:', error);
      setError('Failed to add moderator. Please try again later.');
    }
  };

  const handleRemoveModerator = async (userId) => {
    try {
      await axios.delete(`${API_URL}/api/communities/${communityId}/moderators/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update the member in the local state
      setMembers(members.map(member => {
        if (member.id === userId) {
          return {
            ...member,
            isModerator: false
          };
        }
        return member;
      }));
    } catch (error) {
      console.error('Error removing moderator:', error);
      setError('Failed to remove moderator. Please try again later.');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member from the community?')) {
      try {
        await axios.delete(`${API_URL}/api/communities/${communityId}/members/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Remove the member from the local state
        setMembers(members.filter(member => member.id !== userId));
      } catch (error) {
        console.error('Error removing member:', error);
        setError('Failed to remove member. Please try again later.');
      }
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/communities/${communityId}/invite`, { email: inviteEmail }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setInviteEmail('');
      setShowInviteModal(false);
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Error inviting member:', error);
      setError('Failed to send invitation. Please try again later.');
    }
  };

  if (loading && members.length === 0) {
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
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Community Members ({members.length})</h5>
        {(isCreator || isModerator) && (
          <Button variant="outline-primary" size="sm" onClick={() => setShowInviteModal(true)}>
            Invite Members
          </Button>
        )}
      </div>
      
      <Card>
        <ListGroup variant="flush">
          {members.map(member => (
            <ListGroup.Item key={member.id} className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img 
                  src={member.profilePicture || 'https://via.placeholder.com/40'} 
                  alt={member.fullName} 
                  className="rounded-circle me-3"
                  width="40"
                  height="40"
                />
                <div>
                  <div className="fw-bold">{member.fullName}</div>
                  <small className="text-muted">@{member.username}</small>
                </div>
                <div className="ms-3">
                  {member.isCreator && <Badge bg="dark" className="ms-1">Creator</Badge>}
                  {member.isModerator && <Badge bg="primary" className="ms-1">Moderator</Badge>}
                  {member.id === currentUser?.id && <Badge bg="secondary" className="ms-1">You</Badge>}
                </div>
              </div>
              
              {isCreator && !member.isCreator && (
                <div>
                  {!member.isModerator ? (
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleAddModerator(member.id)}
                    >
                      Make Moderator
                    </Button>
                  ) : (
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleRemoveModerator(member.id)}
                    >
                      Remove as Moderator
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
      
      {/* Invite Member Modal */}
      <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invite to Community</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleInviteMember}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
              <Form.Text className="text-muted">
                An invitation will be sent to this email address.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send Invitation
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CommunityMembers;
