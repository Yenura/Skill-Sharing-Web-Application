import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  visibility: 'public' | 'members' | 'private';
  customFields: Record<string, any>;
}

export const CommunityPosts = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Post['status']>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<
    'all' | Post['visibility']
  >('all');
  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'popular' | 'comments'
  >('newest');
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    visibility: 'public' as Post['visibility'],
    customFields: {} as Record<string, any>,
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [id]);

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

  const handleCreatePost = async () => {
    try {
      // TODO: Implement API call to create post
      // const response = await api.post(`/communities/${id}/posts`, newPost);
      // setPosts((prev) => [response.data, ...prev]);

      setIsCreatingPost(false);
      setNewPost({
        title: '',
        content: '',
        tags: [],
        visibility: 'public',
        customFields: {},
      });

      toast({
        title: 'Success',
        description: 'Post created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePost = async (
    postId: number,
    updates: Partial<Omit<Post, 'id' | 'author' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      // TODO: Implement API call to update post
      // await api.put(`/communities/${id}/posts/${postId}`, updates);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, ...updates } : post
        )
      );

      toast({
        title: 'Success',
        description: 'Post updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post.',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePosts = async () => {
    try {
      // TODO: Implement API call to delete selected posts
      // await api.delete(`/communities/${id}/posts`, {
      //   postIds: selectedPosts,
      // });

      setPosts((prev) =>
        prev.filter((post) => !selectedPosts.includes(post.id))
      );
      setSelectedPosts([]);

      toast({
        title: 'Success',
        description: 'Selected posts deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete selected posts.',
        variant: 'destructive',
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map((post) => post.id));
    }
  };

  const handleSelectPost = (postId: number) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newPost.tags.includes(newTag.trim())) {
      setNewPost((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesVisibility =
        visibilityFilter === 'all' || post.visibility === visibilityFilter;
      return matchesSearch && matchesStatus && matchesVisibility;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'comments':
          return b.comments - a.comments;
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
        <h1 className="text-2xl font-bold">Community Posts</h1>
        <div className="space-x-4">
          {selectedPosts.length > 0 && (
            <Button variant="destructive" onClick={handleDeletePosts}>
              Delete Selected ({selectedPosts.length})
            </Button>
          )}
          <Button onClick={() => setIsCreatingPost(true)}>Create Post</Button>
        </div>
      </div>

      {isCreatingPost && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Post</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                type="text"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <Textarea
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                />
                <Button onClick={handleAddTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove tag</span>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibility
              </label>
              <select
                value={newPost.visibility}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    visibility: e.target.value as Post['visibility'],
                  })
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="public">Public</option>
                <option value="members">Members Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsCreatingPost(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>Create Post</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-6">
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={visibilityFilter}
          onChange={(e) =>
            setVisibilityFilter(e.target.value as typeof visibilityFilter)
          }
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Visibility</option>
          <option value="public">Public</option>
          <option value="members">Members Only</option>
          <option value="private">Private</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Liked</option>
          <option value="comments">Most Commented</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedPosts.length === filteredPosts.length &&
                    filteredPosts.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visibility
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelectPost(post.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {post.title}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {post.content}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={post.author.avatar}
                      alt={post.author.username}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {post.author.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={post.status}
                    onChange={(e) =>
                      handleUpdatePost(post.id, {
                        status: e.target.value as Post['status'],
                      })
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={post.visibility}
                    onChange={(e) =>
                      handleUpdatePost(post.id, {
                        visibility: e.target.value as Post['visibility'],
                      })
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="public">Public</option>
                    <option value="members">Members Only</option>
                    <option value="private">Private</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>👍 {post.likes}</div>
                  <div>💬 {post.comments}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="destructive"
                    onClick={() => handleSelectPost(post.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 