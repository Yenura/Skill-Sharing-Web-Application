import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const reportReasons = [
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'VIOLENCE', label: 'Violence' },
  { value: 'HATE_SPEECH', label: 'Hate Speech' },
  { value: 'OTHER', label: 'Other' },
];

export const CommunityReport = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
  });

  const handleReasonChange = (value: string) => {
    setFormData((prev) => ({ ...prev, reason: value }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason || !formData.description.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to report community
      // await api.post(`/communities/${id}/report`, formData);

      toast({
        title: 'Success',
        description: 'Your report has been submitted.',
      });

      navigate(`/communities/${id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Report Community</h1>
        <p className="text-gray-700 mb-6">
          Please provide details about why you are reporting this community. Your
          report will be reviewed by our moderation team.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Report *
            </label>
            <Select
              value={formData.reason}
              onChange={handleReasonChange}
              options={reportReasons}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details *
            </label>
            <Textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Please provide more information about your report..."
              className="min-h-[150px]"
              required
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
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 