import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface Analytics {
  memberCount: number;
  postCount: number;
  commentCount: number;
  activeMembers: number;
  newMembers: number;
  engagementRate: number;
  topPosts: {
    id: number;
    title: string;
    author: string;
    likes: number;
    comments: number;
    views: number;
  }[];
  memberGrowth: {
    date: string;
    count: number;
  }[];
  activityByDay: {
    date: string;
    posts: number;
    comments: number;
  }[];
}

export const CommunityAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [id, timeRange]);

  const fetchAnalytics = async () => {
    try {
      // TODO: Implement API call to fetch community analytics
      // const response = await api.get(`/communities/${id}/analytics`, {
      //   params: { timeRange },
      // });
      // setAnalytics(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load community analytics.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analytics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Community Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Total Members
          </h3>
          <p className="text-2xl font-bold">{analytics.memberCount}</p>
          <p className="text-sm text-green-600">
            +{analytics.newMembers} new members
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Active Members
          </h3>
          <p className="text-2xl font-bold">{analytics.activeMembers}</p>
          <p className="text-sm text-gray-500">
            {((analytics.activeMembers / analytics.memberCount) * 100).toFixed(1)}%
            of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Engagement Rate
          </h3>
          <p className="text-2xl font-bold">
            {analytics.engagementRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">
            Based on posts and comments
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Total Content
          </h3>
          <p className="text-2xl font-bold">
            {analytics.postCount + analytics.commentCount}
          </p>
          <p className="text-sm text-gray-500">
            {analytics.postCount} posts, {analytics.commentCount} comments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Posts</h2>
          <div className="space-y-4">
            {analytics.topPosts.map((post) => (
              <div
                key={post.id}
                className="border-b last:border-b-0 pb-4 last:pb-0"
              >
                <h3 className="font-medium mb-1">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-2">by {post.author}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>👁️ {post.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Member Growth</h2>
          <div className="space-y-4">
            {analytics.memberGrowth.map((growth) => (
              <div
                key={growth.date}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-500">
                  {new Date(growth.date).toLocaleDateString()}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (growth.count / analytics.memberCount) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{growth.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Activity by Day</h2>
          <div className="space-y-4">
            {analytics.activityByDay.map((activity) => (
              <div
                key={activity.date}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-500">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Posts:</span>
                    <span className="text-sm font-medium">
                      {activity.posts}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      Comments:
                    </span>
                    <span className="text-sm font-medium">
                      {activity.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 