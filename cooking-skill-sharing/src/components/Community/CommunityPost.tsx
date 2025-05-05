"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface CommunityPostProps {
  communityId: number;
  onPostCreated?: () => void;
}

export const CommunityPost: React.FC<CommunityPostProps> = ({
  communityId,
  onPostCreated,
}) => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some content for your post.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      images.forEach((image) => {
        formData.append('images', image);
      });

      // TODO: Implement API call to create post
      // await api.post(`/communities/${communityId}/posts`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      toast({
        title: 'Success',
        description: 'Post created successfully!',
      });

      setContent('');
      setImages([]);
      onPostCreated?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts with the community..."
        className="min-h-[100px] mb-4"
      />

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          Add Images
        </label>
        {images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-20 h-20 rounded-lg overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/70"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </form>
  );
};

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
    profileImage: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  images: string[];
}

interface PostListProps {
  posts: Post[];
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
}

export const PostList = ({ posts, onLike, onComment }: PostListProps) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar
              src={post.author.profileImage}
              alt={post.author.username}
            />
            <div>
              <p className="font-semibold">{post.author.username}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="mb-4">{post.content}</p>

          {post.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike?.(post.id)}
            >
              Like ({post.likes})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post.id)}
            >
              Comment ({post.comments})
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}; 