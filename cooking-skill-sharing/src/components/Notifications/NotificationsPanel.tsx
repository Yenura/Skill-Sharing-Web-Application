import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Check, X } from 'lucide-react'
import { BellIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'community'
  content: string
  createdAt: string
  read: boolean
  data: {
    userId?: string
    username?: string
    profilePicture?: string
    postId?: string
    postTitle?: string
    communityId?: string
    communityName?: string
  }
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const { data, error } = await api.get<Notification[]>('/notifications')
      
      if (error) {
        throw new Error(`Failed to fetch notifications: ${error}`)
      }
      
      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.read).length)
      } else {
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await api.post(`/notifications/${notificationId}/read`)
      
      if (error) {
        throw new Error(`Failed to mark notification as read: ${error}`)
      }
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { error } = await api.post('/notifications/read-all')
      
      if (error) {
        throw new Error(`Failed to mark all notifications as read: ${error}`)
      }
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return (
          <>
            <Link href={`/profile/${notification.data.userId}`}>
              <span className="font-medium hover:text-orange-500">
                {notification.data.username}
              </span>
            </Link>
            {' liked your recipe '}
            <Link href={`/recipe/${notification.data.postId}`}>
              <span className="font-medium hover:text-orange-500">
                {notification.data.postTitle}
              </span>
            </Link>
          </>
        )
      case 'comment':
        return (
          <>
            <Link href={`/profile/${notification.data.userId}`}>
              <span className="font-medium hover:text-orange-500">
                {notification.data.username}
              </span>
            </Link>
            {' commented on your recipe '}
            <Link href={`/recipe/${notification.data.postId}`}>
              <span className="font-medium hover:text-orange-500">
                {notification.data.postTitle}
              </span>
            </Link>
          </>
        )
      case 'follow':
        return (
          <>
            <Link href={`/profile/${notification.data.userId}`}>
              <span className="font-medium hover:text-orange-500">
                {notification.data.username}
              </span>
            </Link>
            {' started following you'}
          </>
        )
      case 'mention':
        return (
          <>
            <Link href={`/profile/${notification.data.userId}`}>
              <span className="font-medium hover:text-orange-500">
                {notification.data.username}
              </span>
            </Link>
            {' mentioned you in a post'}
          </>
        )
      case 'community':
        return (
          <>
            <Link href={`/community/${notification.data.communityId}`}>
              <span className="font-medium hover:text-orange-500">
                {notification.data.communityName}
              </span>
            </Link>
            {' updated'}
          </>
        )
      default:
        return <></>
    }
  }

  const getNotificationTitle = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'New Like'
      case 'comment':
        return 'New Comment'
      case 'follow':
        return 'New Follower'
      case 'mention':
        return 'New Mention'
      case 'community':
        return 'Community Update'
      default:
        return 'Notification'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️'
      case 'comment':
        return '💬'
      case 'follow':
        return '👋'
      case 'mention':
        return '🔔'
      case 'community':
        return '👥'
      default:
        return '📢'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 rounded-lg bg-white p-4 shadow-lg z-50"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="max-h-96 space-y-4 overflow-y-auto">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-3 rounded-lg p-3 ${
                      notification.read ? 'bg-white' : 'bg-blue-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex-shrink-0">
                      <div className="relative h-10 w-10">
                        <Image
                          src={notification.data.profilePicture || '/default-avatar.png'}
                          alt={notification.data.username || 'User'}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <p className="font-medium">{getNotificationTitle(notification)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {getNotificationContent(notification)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No notifications yet</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}