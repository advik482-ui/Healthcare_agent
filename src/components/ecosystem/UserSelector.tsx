import React from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { User } from '@/types/ecosystem';
import { 
  UserCircleIcon, 
  HeartIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

export const UserSelector: React.FC = () => {
  const { users, currentUser, setCurrentUser } = useEcosystemStore();

  const getHealthStatus = (user: User) => {
    if (user.medical_conditions && user.medical_conditions !== 'none') {
      return { status: 'chronic', color: 'text-warning', icon: ExclamationTriangleIcon };
    }
    if (user.age && user.age > 65) {
      return { status: 'senior', color: 'text-blue-400', icon: HeartIcon };
    }
    return { status: 'healthy', color: 'text-success', icon: CheckCircleIcon };
  };

  const getActivityColor = (level?: string) => {
    switch (level) {
      case 'high': return 'bg-success/20 text-success';
      case 'moderate': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-error/20 text-error';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-white">
          Select Patient
        </h2>
        <div className="text-sm text-gray-400">
          {users.length} profiles
        </div>
      </div>

      <div className="space-y-3">
        {users.map((user, index) => {
          const healthStatus = getHealthStatus(user);
          const isSelected = currentUser?.user_id === user.user_id;
          
          return (
            <motion.div
              key={user.user_id}
              className={`
                p-4 rounded-xl border cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'bg-primary-500/20 border-primary-500/50 ring-2 ring-primary-500/30' 
                  : 'bg-dark-800/50 border-dark-700/50 hover:bg-dark-700/50 hover:border-dark-600/50'
                }
              `}
              onClick={() => setCurrentUser(user)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-white">
                    {user.name.charAt(0)}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white truncate">
                      {user.name}
                    </h3>
                    <healthStatus.icon className={`w-4 h-4 ${healthStatus.color}`} />
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-400">
                      {user.age}y • {user.gender}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(user.activity_level)}`}>
                      {user.activity_level}
                    </span>
                  </div>

                  {/* Health Summary */}
                  <div className="space-y-1">
                    {user.medical_conditions && user.medical_conditions !== 'none' && (
                      <p className="text-xs text-gray-300">
                        📋 {user.medical_conditions}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      {user.avg_heart_rate && (
                        <span>❤️ {user.avg_heart_rate} BPM</span>
                      )}
                      {user.avg_blood_pressure && (
                        <span>🩸 {user.avg_blood_pressure}</span>
                      )}
                      {user.bmi && (
                        <span>⚖️ BMI {user.bmi}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  className="mt-3 p-2 bg-primary-500/10 rounded-lg border border-primary-500/30"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <p className="text-xs text-primary-300 text-center">
                    ✓ Active Patient Profile
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add New User Button */}
      <motion.button
        className="w-full p-4 border-2 border-dashed border-dark-600 rounded-xl text-gray-400 hover:text-white hover:border-dark-500 transition-all duration-200 flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <UserCircleIcon className="w-5 h-5" />
        <span>Add New Patient</span>
      </motion.button>
    </div>
  );
};