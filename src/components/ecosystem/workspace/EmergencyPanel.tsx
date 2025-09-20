import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { 
  ShieldExclamationIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export const EmergencyPanel: React.FC = () => {
  const { currentUser } = useEcosystemStore();
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const emergencyTypes = [
    { id: 'chest_pain', name: 'Chest Pain', icon: HeartIcon, color: 'text-red-500' },
    { id: 'difficulty_breathing', name: 'Difficulty Breathing', icon: ExclamationTriangleIcon, color: 'text-red-400' },
    { id: 'severe_bleeding', name: 'Severe Bleeding', icon: ExclamationTriangleIcon, color: 'text-red-600' },
    { id: 'unconscious', name: 'Loss of Consciousness', icon: ExclamationTriangleIcon, color: 'text-red-500' },
    { id: 'severe_pain', name: 'Severe Pain', icon: ExclamationTriangleIcon, color: 'text-orange-500' },
    { id: 'allergic_reaction', name: 'Allergic Reaction', icon: ExclamationTriangleIcon, color: 'text-yellow-500' }
  ];

  const handleEmergencyCall = () => {
    setIsEmergencyActive(true);
    // In a real app, this would trigger actual emergency protocols
    setTimeout(() => {
      setIsEmergencyActive(false);
    }, 5000);
  };

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white flex items-center">
          <ShieldExclamationIcon className="w-5 h-5 mr-2 text-red-400" />
          Emergency Panel
        </h2>
        {isEmergencyActive && (
          <div className="flex items-center space-x-2 text-red-400">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Emergency Active</span>
          </div>
        )}
      </div>

      {/* Emergency Alert */}
      {isEmergencyActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <PhoneIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Emergency Services Contacted</h3>
              <p className="text-red-200 text-sm">Help is on the way. Stay calm and follow instructions.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* User Emergency Info */}
      <div className="mb-6 p-4 bg-dark-700/30 rounded-lg">
        <h3 className="text-sm font-medium text-white mb-3">Emergency Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Name:</span>
            <span className="text-white">{currentUser?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Age:</span>
            <span className="text-white">{currentUser?.age} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Blood Type:</span>
            <span className="text-white">{currentUser?.blood_group || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Medical Conditions:</span>
            <span className="text-white">{currentUser?.medical_conditions || 'None'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Allergies:</span>
            <span className="text-white">{currentUser?.allergies || 'None'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Emergency Contact:</span>
            <span className="text-white">{currentUser?.emergency_contact || 'Not set'}</span>
          </div>
        </div>
      </div>

      {/* Emergency Type Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-white mb-3">Select Emergency Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {emergencyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setEmergencyType(type.id)}
              className={`
                p-3 rounded-lg border transition-all duration-200 text-left
                ${emergencyType === type.id
                  ? 'bg-red-500/20 border-red-500/50 text-white'
                  : 'bg-dark-700/30 border-dark-600/50 text-gray-300 hover:bg-dark-600/50'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <type.icon className={`w-4 h-4 ${type.color}`} />
                <span className="text-sm font-medium">{type.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Actions */}
      <div className="space-y-3">
        <motion.button
          onClick={handleEmergencyCall}
          disabled={isEmergencyActive}
          className="w-full p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PhoneIcon className="w-6 h-6" />
          <span className="font-semibold">
            {isEmergencyActive ? 'Emergency Active...' : 'Call Emergency Services (911)'}
          </span>
        </motion.button>

        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors flex items-center justify-center space-x-2">
            <PhoneIcon className="w-4 h-4" />
            <span className="text-sm">Call Doctor</span>
          </button>
          
          <button className="p-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center space-x-2">
            <MapPinIcon className="w-4 h-4" />
            <span className="text-sm">Share Location</span>
          </button>
        </div>
      </div>

      {/* Quick Instructions */}
      <div className="mt-6 pt-4 border-t border-dark-700/50">
        <h4 className="text-sm font-medium text-white mb-2">Emergency Instructions</h4>
        <div className="space-y-2 text-xs text-gray-400">
          <p>• Stay calm and breathe slowly</p>
          <p>• If conscious, remain in a comfortable position</p>
          <p>• Do not take any medications unless prescribed</p>
          <p>• Keep emergency contact information accessible</p>
          <p>• Follow dispatcher instructions carefully</p>
        </div>
      </div>

      {/* Recent Emergency Logs */}
      <div className="mt-6 pt-4 border-t border-dark-700/50">
        <h4 className="text-sm font-medium text-white mb-2">Recent Activity</h4>
        <div className="text-center py-4">
          <ClockIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-xs text-gray-400">No recent emergency activity</p>
        </div>
      </div>
    </div>
  );
};