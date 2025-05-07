import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import { API_BASE_URL } from '../../config/apiConfig';
import DefaultAvatar from '../../assets/avatar.png';
import Navbar from '../common/Navbar';
import { useToast } from '../common/Toast';

const Messaging = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Add search state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  // Add click outside handler for search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search users function
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching users:', error);
      addToast('Failed to search users', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchUsers(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Start a new conversation from search
  const startConversation = (user) => {
    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => conv.userId === user.id);
      
      if (existingConversation) {
        setActiveConversation(existingConversation);
      } else {
        // Create a new conversation directly from search result data
        // instead of fetching again
        const newConversation = {
          userId: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          latestMessage: null,
          unreadCount: 0
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversation(newConversation);
      }
      
      navigate(`/messages/${user.id}`);
      setSearchTerm('');
      setShowSearchResults(false);
    } catch (error) {
      console.error('Error starting conversation:', error);
      addToast('Failed to start conversation', 'error');
    }
  };

  // Fetch the current user's profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        addToast('Failed to load user profile', 'error');
      }
    };

    fetchUserProfile();
  }, [navigate, addToast]);

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }

        const data = await response.json();
        setConversations(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        addToast('Failed to load conversations', 'error');
        setIsLoading(false);
      }
    };

    fetchConversations();
    // Polling for new messages
    const intervalId = setInterval(fetchConversations, 10000);
    
    return () => clearInterval(intervalId);
  }, [user, addToast]);

  // Set active conversation when userId param changes
  useEffect(() => {
    if (userId && conversations.length > 0) {
      const conversation = conversations.find(conv => conv.userId === userId);
      if (conversation) {
        setActiveConversation(conversation);
      } else {
        // If we have a userId but no existing conversation, fetch the user details
        fetchUserById(userId);
      }
    }
  }, [userId, conversations]);

  // Fetch conversation messages when activeConversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.userId);
    }
  }, [activeConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchUserById = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      // Use the direct endpoint to get user by ID instead of searching
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Failed to fetch user');
      }

      // The response is now a single user object, not an array
      const userData = await response.json();
      
      const newConversation = {
        userId: userData.id,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePicture: userData.profilePicture,
        latestMessage: null,
        unreadCount: 0
      };
      
      // Add this conversation to the list if it doesn't already exist
      setConversations(prev => {
        // Check if conversation already exists to avoid duplicates
        const exists = prev.some(conv => conv.userId === userData.id);
        return exists ? prev : [newConversation, ...prev];
      });
      
      setActiveConversation(newConversation);
    } catch (error) {
      console.error('Error fetching user:', error);
      addToast(`Failed to load user profile: ${error.message}`, 'error');
    }
  };

  const fetchMessages = async (partnerId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversation/${partnerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      addToast('Failed to load messages', 'error');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    setIsSending(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/messages/send/${activeConversation.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Add the new message to the conversation
      const sentMessage = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      
      // Update the latest message in this conversation
      setConversations(prev => 
        prev.map(conv => 
          conv.userId === activeConversation.userId 
            ? { ...conv, latestMessage: sentMessage } 
            : conv
        )
      );
      
      // Clear the input
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      addToast('Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    navigate(`/messages/${conversation.userId}`);
  };

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDisplayName = (conversation) => {
    if (conversation.firstName && conversation.lastName) {
      return `${conversation.firstName} ${conversation.lastName}`;
    } else if (conversation.firstName) {
      return conversation.firstName;
    } else if (conversation.lastName) {
      return conversation.lastName;
    } else {
      return conversation.username;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-DarkColor"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto mt-6 h-[calc(100vh-130px)]">
        <div className="bg-white shadow-md rounded-lg overflow-hidden h-full flex">
          {/* Conversations Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-ExtraDarkColor mb-2">Messages</h2>
              
              {/* Search Bar */}
              <div className="relative" ref={searchRef}>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-gray-100 px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-DarkColor focus:bg-white transition-colors"
                    placeholder="Search for users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute right-3 top-2.5">
                    {isSearching ? (
                      <div className="animate-spin h-5 w-5 border-2 border-DarkColor border-t-transparent rounded-full"></div>
                    ) : (
                      <i className='bx bx-search text-gray-500'></i>
                    )}
                  </div>
                </div>
                
                {/* Search Results */}
                {showSearchResults && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <ul>
                        {searchResults.map((result) => (
                          <li 
                            key={result.id} 
                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                            onClick={() => startConversation(result)}
                          >
                            <div className="flex items-center p-3">
                              <img 
                                src={result.profilePicture || DefaultAvatar} 
                                alt={result.username}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div className="ml-3">
                                <p className="font-medium text-gray-800">
                                  {result.firstName && result.lastName 
                                    ? `${result.firstName} ${result.lastName}`
                                    : result.firstName || result.lastName || result.username}
                                </p>
                                <p className="text-xs text-gray-500">@{result.username}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No users found matching "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {/* Existing conversations */}
              {conversations.length > 0 ? (
                conversations.map(conversation => (
                  <div 
                    key={conversation.userId}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeConversation?.userId === conversation.userId ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <img 
                          src={conversation.profilePicture || DefaultAvatar} 
                          alt={conversation.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-800">{getDisplayName(conversation)}</h3>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.latestMessage ? conversation.latestMessage.content : 'No messages yet'}
                        </p>
                      </div>
                      {conversation.latestMessage && (
                        <span className="text-xs text-gray-400">
                          {formatTime(conversation.latestMessage.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations yet</p>
                  <p className="mt-2 text-sm">Search above to find users to message</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Message Content */}
          <div className="w-2/3 flex flex-col">
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <img 
                    src={activeConversation.profilePicture || DefaultAvatar} 
                    alt={activeConversation.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">{getDisplayName(activeConversation)}</h3>
                    <p className="text-xs text-gray-500">@{activeConversation.username}</p>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <div 
                        key={message.id || index}
                        className={`mb-4 flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${
                            message.senderId === user.id 
                              ? 'bg-DarkColor text-white' 
                              : 'bg-white text-gray-800'
                          }`}
                        >
                          <p>{message.content}</p>
                          <div 
                            className={`text-xs mt-1 ${
                              message.senderId === user.id ? 'text-gray-200' : 'text-gray-500'
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p>No messages yet</p>
                        <p className="mt-2 text-sm">Send a message to start the conversation</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-transparent"
                      placeholder="Type a message..."
                      disabled={isSending}
                    />
                    <button
                      type="submit"
                      className="bg-DarkColor text-white px-4 py-2 rounded-r-lg hover:bg-ExtraDarkColor transition-colors"
                      disabled={!newMessage.trim() || isSending}
                    >
                      {isSending ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <i className='bx bx-send'></i>
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <i className='bx bx-message-detail text-6xl mb-4'></i>
                  <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
                  <p>Select a conversation or search for a user to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
