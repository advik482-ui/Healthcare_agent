import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  HeartIcon, 
  DocumentTextIcon, 
  CpuChipIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth';
import { notificationAPI } from '@/lib/api';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'My Health', href: '/health', icon: HeartIcon },
  { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
  { name: 'AI Diagnostics', href: '/diagnostics', icon: CpuChipIcon },
  { name: 'Medications', href: '/medications', icon: BeakerIcon },
  { name: 'AI Chatbot', href: '/chatbot', icon: ChatBubbleLeftRightIcon },
  { name: 'Health Library', href: '/library', icon: BookOpenIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (user?.id) {
      notificationAPI.getUnreadCount(user.id)
        .then(response => setUnreadCount(response.data.unread_count))
        .catch(console.error);
    }
  }, [user?.id]);

  return (
    <div className="fixed left-0 top-0 h-full z-40">
      <motion.div
        className="h-full bg-dark-900/95 backdrop-blur-md border-r border-dark-700/50 flex flex-col"
        animate={{ width: isExpanded ? 256 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="p-4 border-b border-dark-700/50">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3"
                >
                  <h1 className="text-lg font-display font-bold text-white">Nightwing</h1>
                  <p className="text-xs text-gray-400">AI Health</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={`
                    flex items-center p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-dark-800/50'
                    }
                  `}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="ml-3 font-medium"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-dark-700/50 space-y-2">
          {/* Notifications */}
          <Link href="/notifications">
            <motion.div
              className="flex items-center p-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800/50 transition-all duration-200 relative"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <BellIcon className="w-6 h-6 flex-shrink-0" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                </div>
              )}
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3 font-medium"
                  >
                    Notifications
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          {/* Profile */}
          <div className="relative">
            <motion.button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center p-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800/50 transition-all duration-200"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserCircleIcon className="w-6 h-6 flex-shrink-0" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3 text-left"
                  >
                    <p className="font-medium text-sm">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 w-48 bg-dark-800/95 backdrop-blur-md border border-dark-700/50 rounded-xl p-2"
                >
                  <Link href="/profile">
                    <div className="flex items-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700/50 transition-colors">
                      <UserCircleIcon className="w-4 h-4 mr-2" />
                      Profile
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center p-2 rounded-lg text-gray-400 hover:text-error hover:bg-dark-700/50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};