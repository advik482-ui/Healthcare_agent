import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeHeaderProps {
  userName: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-display font-bold text-white mb-2">
        {getGreeting()}, {userName}
      </h1>
      <p className="text-gray-400">
        Here's your health overview for {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
    </motion.div>
  );
};