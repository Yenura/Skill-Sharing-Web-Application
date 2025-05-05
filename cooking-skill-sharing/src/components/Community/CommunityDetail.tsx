"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityPost } from './CommunityPost';
import { useToast } from '@/components/ui/use-toast';

interface Community {
  id: number;
  name: string;
  description: string;
  category: string;
  coverImage: string;
  memberCount: number;
  isPrivate: boolean;
  createdAt: string;
  rules: string[];
  moderators: {
    id: number;
    username: string;
    avatar: string;
  }[];
}

interface Post {
  id: number;
  title: string;
  content: string;
  images: string[];
  author: {
    id: number;
    username: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
}

export const CommunityDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const { toast } = useToast();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    fetchCommunityDetails();
    fetchPosts();
  }, [id]);

  const fetchCommunityDetails = async () => {
    try {
      // TODO: Implement API call to fetch community details
      // const response = await api.get(`/communities/${id}`);
      // setCommunity(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load community details.',
        variant: 'destructive',
      });
    }
  };

  const fetchPosts = async () => {
    try {
      // TODO: Implement API call to fetch community posts
      // const response = await api.get(`/communities/${id}/posts`);
      // setPosts(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load community posts.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCommunity = async () => {
    try {
      // TODO: Implement API call to join community
      // await api.post(`/communities/${id}/join`);
      toast({
        title: 'Success',
        description: 'You have joined the community!',
      });
      fetchCommunityDetails();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join community.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading || !community) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="relative h-64 rounded-lg overflow-hidden mb-8">
        <img
          src={community.coverImage}
          alt={community.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{community.name}</h1>
          <p className="text-lg opacity-90">{community.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <div className="mb-8">
                <CommunityPost
                  communityId={parseInt(id!)}
                  onPostCreated={fetchPosts}
                />
              </div>

              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.username}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <Link
                          href={`/profile/${post.author.id}`}
                          className="font-semibold hover:underline"
                        >
                          {post.author.username}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-gray-700 mb-4">{post.content}</p>

                    {post.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {post.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-gray-500">
                      <button className="flex items-center space-x-1">
                        <span>❤️</span>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1">
                        <span>💬</span>
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="about">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-gray-700 mb-6">{community.description}</p>

                <h3 className="text-xl font-semibold mb-3">Community Rules</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {community.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="members">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Moderators</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {community.moderators.map((moderator) => (
                    <div
                      key={moderator.id}
                      className="flex items-center space-x-3"
                    >
                      <img
                        src={moderator.avatar}
                        alt={moderator.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <Link
                          href={`/profile/${moderator.id}`}
                          className="font-semibold hover:underline"
                        >
                          {moderator.username}
                        </Link>
                        <p className="text-sm text-gray-500">Moderator</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-6">
              <p className="text-2xl font-bold mb-1">
                {community.memberCount.toLocaleString()}
              </p>
              <p className="text-gray-500">Members</p>
            </div>

            <Button
              onClick={handleJoinCommunity}
              className="w-full"
            >
              Join Community
            </Button>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Created</h3>
              <p className="text-gray-500">
                {new Date(community.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 