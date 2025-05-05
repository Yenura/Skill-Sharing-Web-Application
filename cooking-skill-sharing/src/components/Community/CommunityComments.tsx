"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies: number;
  status: 'approved' | 'pending' | 'rejected';
  postId: number;
}

export const CommunityComments = () => {
  const params = useParams();
  const id = params?.id as string;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'replies'>('date');
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [newComment, setNewComment] = useState({
    content: '',
    postId: 0,
  });

  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    try {
      // TODO: Implement API call to fetch community comments
      // const response = await api.get(`/communities/${id}/comments`);
      // setComments(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load community comments.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateComment = async () => {
    try {
      // TODO: Implement API call to create comment
      // const response = await api.post(`/communities/${id}/comments`, newComment);
      // setComments((prev) => [response.data, ...prev]);

      setIsCreatingComment(false);
      setNewComment({
        content: '',
        postId: 0,
      });

      toast({
        title: 'Success',
        description: 'Comment created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create comment.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCommentStatus = async (commentId: number, newStatus: Comment['status']) => {
    try {
      // TODO: Implement API call to update comment status
      // await api.put(`/communities/${id}/comments/${commentId}/status`, {
      //   status: newStatus,
      // });

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, status: newStatus } : comment
        )
      );

      toast({
        title: 'Success',
        description: 'Comment status updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update comment status.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      // TODO: Implement API call to delete comment
      // await api.delete(`/communities/${id}/comments/${commentId}`);

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));

      toast({
        title: 'Success',
        description: 'Comment deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete comment.',
        variant: 'destructive',
      });
    }
  };

  const filteredComments = comments
    .filter((comment) => {
      const matchesSearch = comment.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || comment.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'likes':
          return b.likes - a.likes;
        case 'replies':
          return b.replies - a.replies;
        default:
          return 0;
      }
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Community Comments</h1>
        <Button onClick={() => setIsCreatingComment(true)}>Create Comment</Button>
      </div>

      {isCreatingComment && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Comment</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post ID
              </label>
              <Input
                type="number"
                value={newComment.postId}
                onChange={(e) =>
                  setNewComment({ ...newComment, postId: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <Textarea
                value={newComment.content}
                onChange={(e) =>
                  setNewComment({ ...newComment, content: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreatingComment(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateComment}>Create</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-6">
        <Input
          type="text"
          placeholder="Search comments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="date">Date</option>
          <option value="likes">Likes</option>
          <option value="replies">Replies</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.username}
                  className="h-8 w-8 rounded-full mr-3"
                />
                <div>
                  <div className="font-medium">{comment.author.username}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={comment.status}
                  onChange={(e) =>
                    handleUpdateCommentStatus(
                      comment.id,
                      e.target.value as Comment['status']
                    )
                  }
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{comment.content}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{comment.likes} likes</span>
              <span>{comment.replies} replies</span>
              <span>Post ID: {comment.postId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 