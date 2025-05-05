import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/Auth/AuthContext'; // Import useAuth
import { useRouter } from 'next/navigation'; // Import useRouter
import { api } from '@/lib/api'; // Import the api utility

// Note: If you encounter errors related to missing modules like 'zod',
// '@hookform/resolvers/zod', or components from '@/components/ui',
// please ensure these dependencies are installed in your project.
// You might need to run:
// npm install zod @hookform/resolvers/zod
// or
// yarn add zod @hookform/resolvers/zod
// Also, verify that your UI component library is correctly set up and imported.

const communitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum([
    'REGIONAL_CUISINE',
    'DIETARY_PREFERENCE',
    'COOKING_TECHNIQUE',
    'INGREDIENT_FOCUS',
    'MEAL_TYPE',
    'SKILL_LEVEL',
    'OTHER',
  ]),
  coverImage: z.string().optional(),
  isPrivate: z.boolean(),
  rules: z.array(z.string()).min(1, 'At least one rule is required'),
});

type CommunityFormData = z.infer<typeof communitySchema>;

export const CommunityCreation = () => {
  const [rules, setRules] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth(); // Get user from AuthContext
  const router = useRouter(); // Get router

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      isPrivate: false,
    },
  });

  const handleAddRule = () => {
    const input = document.getElementById('rule-input') as HTMLInputElement;
    if (input.value.trim()) {
      setRules([...rules, input.value.trim()]);
      input.value = '';
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CommunityFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a community.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const communityData = {
        ...data,
        rules: rules, // Use the state variable for rules
        createdBy: { id: user.id }, // Include creator's ID
        memberIds: [user.id], // Add creator as the first member
      };

      // Use FormData for file upload
      const formData = new FormData();
      formData.append('name', communityData.name);
      formData.append('description', communityData.description);
      formData.append('category', communityData.category);
      formData.append('isPrivate', communityData.isPrivate.toString());
      communityData.rules.forEach((rule: string) => formData.append('rules[]', rule)); // Explicitly type rule
      if (communityData.coverImage) {
        // Assuming coverImage is a File object or similar
        // If it's a string URL, you might need a different approach or adjust the backend
        // The ImageUpload component uploads the file and provides a URL.
        // Append the URL string to the form data.
        formData.append('coverImage', communityData.coverImage);
      }
      formData.append('createdBy.id', communityData.createdBy.id);
      communityData.memberIds.forEach((memberId: string) => formData.append('memberIds[]', memberId)); // Explicitly type memberId


      const response = await api.upload<any>('/api/groups', formData, 'POST');

      if (response.status >= 200 && response.status < 300) {
        const createdCommunity = response.data;
        toast({
          title: 'Success',
          description: 'Community created successfully!',
        });
        router.push(`/communities/${createdCommunity.id}`); // Redirect to community detail page
      } else {
        // Access error message from response.error or status
        toast({
          title: 'Error',
          description: `Failed to create community: ${response.error || `Status: ${response.status}`}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred while creating the community.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Community</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Community Name</label>
              <Input
                {...register('name')}
                placeholder="Enter community name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">Description</label>
              <Textarea
                {...register('description')}
                placeholder="Enter community description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2">Category</label>
              <Select
                {...register('category')}
                options={[
                  { value: 'REGIONAL_CUISINE', label: 'Regional Cuisine' },
                  { value: 'DIETARY_PREFERENCE', label: 'Dietary Preference' },
                  { value: 'COOKING_TECHNIQUE', label: 'Cooking Technique' },
                  { value: 'INGREDIENT_FOCUS', label: 'Ingredient Focus' },
                  { value: 'MEAL_TYPE', label: 'Meal Type' },
                  { value: 'SKILL_LEVEL', label: 'Skill Level' },
                  { value: 'OTHER', label: 'Other' },
                ]}
              />
            </div>

            <div>
              <label className="block mb-2">Cover Image</label>
              <ImageUpload
                maxFiles={1}
                onUpload={(urls) => setValue('coverImage', urls[0])}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isPrivate')}
                className="rounded border-gray-300"
              />
              <label>Make this community private</label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Community Rules</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                id="rule-input"
                placeholder="Enter community rule"
              />
              <Button type="button" onClick={handleAddRule}>
                Add
              </Button>
            </div>

            <ul className="space-y-2">
              {rules.map((rule, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <span>{rule}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRule(index)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Create Community</Button>
        </div>
      </form>
    </div>
  );
};
