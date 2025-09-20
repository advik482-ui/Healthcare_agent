import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { Notification } from '@/types/ecosystem';
import { 
  BellIcon, 
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  HeartIcon,
  BeakerIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export const NotificationCenter: React.FC = () => {
  const { currentUser, notifications } = useEcosystemStore();
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([
    {
      notification_id: 1,
      user_id: currentUser?.user_id || 1,
      title: 'Personalized Health Insight',
      message: `Good morning ${currentUser?.name}! Based on your recent activity, I recommend increasing your water intake today.`,
      notification_type: 'wellness',
      is_read: false,
      created_at: new Date().toISOString()
    },
    {
      notification_id: 2,
      user_id: currentUser?.user_id || 1,
      title: 'Medication Reminder',
      message: 'Your evening Metformin dose is due in 30 minutes.',
      notification_type: 'medication',
      is_read: false,
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      notification_id: 3,
      user_id: currentUser?.user_id || 1,
      title: 'Health Check-in',
      message: 'How are you feeling today? Your last symptom log was 3 days ago.',
      notification_type: 'general',
      is_read: true,
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ]);

  const markAsRead = (id: number) => {
    setLocalNotifications(prev => 
      prev.map(notif => 
        notif.notification_id === id ? { ...notif, is_read: true } : notif
      )
    );
  };

  const dismissNotification = (id: number) => {
    setLocalNotifications(prev => 
      prev.filter(notif => notif.notification_id !== id)
    );
  };

  const generatePersonalizedNotification = () => {
    const personalizedMessages = [
      `${currentUser?.name}, your heart rate has been stable this week. Keep up the great work!`,
      `Based on your ${currentUser?.medical_conditions}, remember to monitor your blood pressure today.`,
      `Your sleep pattern shows improvement! You've averaged ${currentUser?.avg_sleep_hours} hours recently.`,
      `Time for your weekly health check-in. How are you managing your ${currentUser?.medical_conditions}?`
    ];

    const randomMessage = personalizedMessages[Math.floor(Math.random() * personalizedMessages.length)];
    
    const newNotification: Notification = {
      notification_id: Date.now(),
      user_id: currentUser?.user_id || 1,
      title: 'AI Health Insight',
      message: randomMessage,
      notification_type: 'personalized',
      is_read: false,
      created_at: new Date().toISOString()
    };

    setLocalNotifications(prev => [newNotification, ...prev]);
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'medication': return <BeakerIcon className="w-5 h-5 text-blue-400" />;
      case 'wellness': return <HeartIcon className="w-5 h-5 text-success" />;
      case 'personalized': return <SparklesIcon className="w-5 h-5 text-primary-400" />;
      case 'alert': return <ExclamationTriangleIcon className="w-5 h-5 text-warning" />;
      default: return <BellIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type?: string, isRead?: boolean) => {
    const opacity = isRead ? '10' : '20';
    switch (type) {
      case 'medication': return `bg-blue-500/${opacity} border-blue-500/30`;
      case 'wellness': return `bg-success/${opacity} border-success/30`;
      case 'personalized': return `bg-primary-500/${opacity} border-primary-500/30`;
      case 'alert': return `bg-warning/${opacity} border-warning/30`;
      default: return `bg-gray-500/${opacity} border-gray-500/30`;
    }
  };

  const unreadCount = localNotifications.filter(n => !n.is_read).length;

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white flex items-center">
          <BellIcon className="w-5 h-5 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>
        <button
          onClick={generatePersonalizedNotification}
          className="p-2 text-gray-400 hover:text-primary-400 hover:bg-primary-500/20 rounded-lg transition-colors"
          title="Generate AI Notification"
        >
          <SparklesIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {localNotifications.length === 0 ? (
          <div className="text-center py-8">
            <BellIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No notifications</p>
            <p className="text-sm text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <AnimatePresence>
            {localNotifications.map((notification, index) => (
              <motion.div
                key={notification.notification_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  p-4 rounded-lg border transition-all duration-200
                  ${getNotificationColor(notification.notification_type, notification.is_read)}
                  ${!notification.is_read ? 'border-l-4' : ''}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-white text-sm">
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>
                          {new Date(notification.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {notification.notification_type && (
                          <span className="capitalize">
                            • {notification.notification_type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.notification_id)}
                        className="p-1 text-gray-400 hover:text-success hover:bg-success/20 rounded transition-colors"
                        title="Mark as read"
                      >
                        <CheckIcon className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => dismissNotification(notification.notification_id)}
                      className="p-1 text-gray-400 hover:text-error hover:bg-error/20 rounded transition-colors"
                      title="Dismiss"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-dark-700/50">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLocalNotifications(prev => 
              prev.map(n => ({ ...n, is_read: true }))
            )}
            className="p-2 bg-dark-700/50 text-gray-300 rounded-lg hover:bg-dark-600/50 transition-colors text-sm"
          >
            Mark All Read
          </button>
          <button
            onClick={() => setLocalNotifications([])}
            className="p-2 bg-dark-700/50 text-gray-300 rounded-lg hover:bg-dark-600/50 transition-colors text-sm"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};