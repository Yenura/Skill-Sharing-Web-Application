import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export const CommunityInvite = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to invite user
      // await api.post(`/communities/${id}/invite`, {
      //   email,
      //   message,
      // });

      toast({
        title: 'Success',
        description: 'Invitation sent successfully!',
      });

      navigate(`/communities/${id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Invite to Community</h1>
        <p className="text-gray-700 mb-6">
          Invite someone to join this community. They will receive an email with
          your invitation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to your invitation..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/communities/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 