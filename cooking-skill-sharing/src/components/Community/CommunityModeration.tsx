import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import api from '@/utils/api'; // Replace with your actual API client

interface ReportedContent {
  id: number;
  type: 'POST' | 'COMMENT';
  content: string;
  author: {
    id: number;
    username: string;
    avatar: string;
  };
  reportedBy: {
    id: number;
    username: string;
    avatar: string;
  };
  reason: string;
  description: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export const CommunityModeration = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    fetchReportedContent();
  }, [id]);

  const fetchReportedContent = async () => {
    try {
      const response = await api.get(`/communities/${id}/moderation`);
      setReportedContent(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load reported content.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (contentId: number, newStatus: string) => {
    try {
      await api.put(`/communities/${id}/moderation/${contentId}`, {
        status: newStatus,
      });

      setReportedContent((prev) =>
        prev.map((content) =>
          content.id === contentId
            ? { ...content, status: newStatus as ReportedContent['status'] }
            : content
        )
      );

      toast({
        title: 'Success',
        description: 'Content status updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update content status.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    try {
      await api.delete(`/communities/${id}/moderation/${contentId}`);

      setReportedContent((prev) =>
        prev.filter((content) => content.id !== contentId)
      );

      toast({
        title: 'Success',
        description: 'Content deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete content.',
        variant: 'destructive',
      });
    }
  };

  const filteredContent = reportedContent.filter((content) => {
    const matchesSearch =
      content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.author.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || content.status === selectedStatus;
    const matchesType = !selectedType || content.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Moderation</h1>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="POST">Post</option>
            <option value="COMMENT">Comment</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredContent.map((content) => (
          <div
            key={content.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <img
                  src={content.author.avatar}
                  alt={content.author.username}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {content.author.username}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={content.status}
                  onChange={(e) => handleStatusChange(content.id, e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="DISMISSED">Dismissed</option>
                </select>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteContent(content.id)}
                >
                  Delete
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium text-gray-900 mb-1">
                {content.type}
              </div>
              <div className="text-gray-700">{content.content}</div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center mb-2">
                <img
                  src={content.reportedBy.avatar}
                  alt={content.reportedBy.username}
                  className="h-6 w-6 rounded-full"
                />
                <div className="ml-2 text-sm text-gray-500">
                  Reported by {content.reportedBy.username}
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Reason:</div>
                <div className="text-gray-700">{content.reason}</div>
              </div>
              <div className="text-sm mt-2">
                <div className="font-medium text-gray-900">Description:</div>
                <div className="text-gray-700">{content.description}</div>
              </div>
            </div>
          </div>
        ))}

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reported content found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
