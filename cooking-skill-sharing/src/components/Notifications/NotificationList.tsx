import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../Auth/AuthContext';
import { api } from '@/lib/api';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'join' | 'mention';
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
  actor: {
    id: string;
    name: string;
    avatar: string;
  };
}

export default function NotificationList() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await api.get<Notification[]>('/notifications');
      
      if (error) {
        throw new Error(`Failed to fetch notifications: ${error}`);
      }
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await api.post(`/notifications/${notificationId}/read`);
      
      if (error) {
        throw new Error(`Failed to mark notification as read: ${error}`);
      }
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await api.post('/notifications/read-all');
      
      if (error) {
        throw new Error(`Failed to mark all notifications as read: ${error}`);
      }
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    router.push(notification.link);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
              </div>
              <p className="mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full p-4 hover:bg-gray-50 flex items-start space-x-3 ${
                    !notification.read ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Image
                      src={notification.actor.avatar || '/default-avatar.png'}
                      alt={notification.actor.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No notifications yet
            </div>
          )}
        </div>
      )}
    </div>
  );
} 