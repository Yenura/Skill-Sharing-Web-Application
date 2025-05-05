import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const CommunityJoin = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await fetch(`/api/communities/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Failed to join community');
        }
      });
      // await api.post(`/communities/${id}/join`);

      toast({
        title: 'Success',
        description: 'You have joined the community!',
      });

      navigate(`/communities/${id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join community. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Join Community</h1>
        <p className="text-gray-700 mb-6">
          Are you sure you want to join this community? You will be able to view
          and participate in community discussions.
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/communities/${id}`)}
          >
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={isJoining}>
            {isJoining ? 'Joining...' : 'Join Community'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 