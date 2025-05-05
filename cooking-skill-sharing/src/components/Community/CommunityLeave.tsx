import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const CommunityLeave = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await fetch(`/api/communities/${id}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Failed to leave community');
        }
      });
      // await api.post(`/communities/${id}/leave`);

      toast({
        title: 'Success',
        description: 'You have left the community.',
      });

      navigate('/communities');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to leave community. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Leave Community
        </h1>
        <p className="text-gray-700 mb-6">
          Are you sure you want to leave this community? You will no longer have
          access to community content and discussions.
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/communities/${id}`)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLeave}
            disabled={isLeaving}
          >
            {isLeaving ? 'Leaving...' : 'Leave Community'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 