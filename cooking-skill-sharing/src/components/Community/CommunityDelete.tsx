import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const CommunityDelete = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // TODO: Implement API call to delete community
      // await api.delete(`/communities/${id}`);

      toast({
        title: 'Success',
        description: 'Community deleted successfully.',
      });

      navigate('/communities');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete community. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Delete Community
        </h1>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this community? This action cannot be
          undone. All posts, comments, and community data will be permanently
          removed.
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
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Community'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 