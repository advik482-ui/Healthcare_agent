'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAuth } from '@/lib/auth';
import { notificationAPI, Notification } from '@/lib/api';
import { 
  BellIcon, 
  CheckIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  HeartIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id, filter]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    try {
      const response = await notificationAPI.getAll(
        user.id, 
        filter === 'unread', 
        50
      );
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    if (!user?.id) return;

    try {
      await notificationAPI.markAsRead(user.id, notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.notification_id === notificationId 
            ? { ...n, is_read: true }
            : n
        )
      );
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await notificationAPI.markAllAsRead(user.id);
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId: number) => {
    if (!user?.id) return;

    try {
      await notificationAPI.delete(user.id, notificationId);
      setNotifications(prev => 
        prev.filter(n => n.notification_id !== notificationId)
      );
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'medication':
        return <BeakerIcon className="w-5 h-5 text-blue-400" />;
      case 'checkup':
        return <HeartIcon className="w-5 h-5 text-red-400" />;
      case 'alert':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-primary-400" />;
    }
  };

  const getNotificationColor = (type?: string) => {
    switch (type) {
      case 'medication':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'checkup':
        return 'border-red-500/30 bg-red-500/10';
      case 'alert':
        return 'border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'border-primary-500/30 bg-primary-500/10';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                Notifications
              </h1>
              <p className="text-gray-400">
                Stay updated with your health alerts and reminders
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-dark-800/50 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`
              flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${filter === 'all'
                ? 'bg-primary-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }
            `}
          >
            <BellIcon className="w-5 h-5 mr-2" />
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`
              flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${filter === 'unread'
                ? 'bg-primary-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }
            `}
          >
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <GlassCard key={i} className="p-6">
                <LoadingSkeleton lines={3} />
              </GlassCard>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <BellIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-400">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."
              }
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.notification_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard 
                  className={`
                    p-6 transition-all duration-200
                    ${!notification.is_read 
                      ? `${getNotificationColor(notification.notification_type)} border-l-4` 
                      : 'opacity-75'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-white">
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-gray-300 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>
                            {new Date(notification.created_at).toLocaleDateString()} at{' '}
                            {new Date(notification.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {notification.notification_type && (
                            <span className="capitalize">
                              {notification.notification_type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.notification_id)}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.notification_id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete notification"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}