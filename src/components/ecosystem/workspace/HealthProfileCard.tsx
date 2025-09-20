import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { 
  UserIcon, 
  HeartIcon, 
  ScaleIcon,
  ClockIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

export const HealthProfileCard: React.FC = () => {
  const { currentUser, updateUserData } = useEcosystemStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(currentUser || {});

  if (!currentUser) return null;

  const handleSave = () => {
    updateUserData(editData);
    setIsEditing(false);
  };

  const getHealthScore = () => {
    let score = 100;
    if (currentUser.smoker) score -= 20;
    if (currentUser.alcohol) score -= 10;
    if (currentUser.medical_conditions && currentUser.medical_conditions !== 'none') score -= 15;
    if (currentUser.bmi && (currentUser.bmi > 30 || currentUser.bmi < 18.5)) score -= 15;
    if (currentUser.activity_level === 'low') score -= 10;
    return Math.max(score, 0);
  };

  const healthScore = getHealthScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white flex items-center">
          <UserIcon className="w-5 h-5 mr-2" />
          Health Profile
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold text-white">
            {currentUser.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{currentUser.name}</h3>
          <p className="text-gray-400">
            {currentUser.age}y • {currentUser.gender} • {currentUser.blood_group}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${healthScore >= 80 ? 'bg-success' : healthScore >= 60 ? 'bg-warning' : 'bg-error'}`} />
            <span className={`text-sm font-medium ${getScoreColor(healthScore)}`}>
              Health Score: {healthScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-dark-700/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <HeartIcon className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">Heart Rate</span>
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editData.avg_heart_rate || ''}
              onChange={(e) => setEditData({...editData, avg_heart_rate: Number(e.target.value)})}
              className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-white text-sm"
            />
          ) : (
            <p className="text-lg font-semibold text-white">
              {currentUser.avg_heart_rate || '--'} <span className="text-sm text-gray-400">BPM</span>
            </p>
          )}
        </div>

        <div className="p-3 bg-dark-700/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <ScaleIcon className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">BMI</span>
          </div>
          {isEditing ? (
            <input
              type="number"
              step="0.1"
              value={editData.bmi || ''}
              onChange={(e) => setEditData({...editData, bmi: Number(e.target.value)})}
              className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-white text-sm"
            />
          ) : (
            <p className="text-lg font-semibold text-white">
              {currentUser.bmi?.toFixed(1) || '--'}
            </p>
          )}
        </div>
      </div>

      {/* Medical Conditions */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Medical Information</h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Conditions</span>
            {isEditing ? (
              <input
                type="text"
                value={editData.medical_conditions || ''}
                onChange={(e) => setEditData({...editData, medical_conditions: e.target.value})}
                className="bg-dark-600 border border-dark-500 rounded px-2 py-1 text-white text-sm flex-1 ml-2"
                placeholder="Enter conditions"
              />
            ) : (
              <span className="text-sm text-white">
                {currentUser.medical_conditions || 'None'}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Allergies</span>
            {isEditing ? (
              <input
                type="text"
                value={editData.allergies || ''}
                onChange={(e) => setEditData({...editData, allergies: e.target.value})}
                className="bg-dark-600 border border-dark-500 rounded px-2 py-1 text-white text-sm flex-1 ml-2"
                placeholder="Enter allergies"
              />
            ) : (
              <span className="text-sm text-white">
                {currentUser.allergies || 'None'}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Blood Pressure</span>
            {isEditing ? (
              <input
                type="text"
                value={editData.avg_blood_pressure || ''}
                onChange={(e) => setEditData({...editData, avg_blood_pressure: e.target.value})}
                className="bg-dark-600 border border-dark-500 rounded px-2 py-1 text-white text-sm flex-1 ml-2"
                placeholder="120/80"
              />
            ) : (
              <span className="text-sm text-white">
                {currentUser.avg_blood_pressure || '--'}
              </span>
            )}
          </div>
        </div>

        {/* Lifestyle Factors */}
        <div className="pt-3 border-t border-dark-700/50">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Smoker</span>
              <span className={currentUser.smoker ? 'text-error' : 'text-success'}>
                {currentUser.smoker ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Gym Member</span>
              <span className={currentUser.gym_member ? 'text-success' : 'text-gray-400'}>
                {currentUser.gym_member ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Activity</span>
              <span className="text-white capitalize">{currentUser.activity_level}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Sleep</span>
              <span className="text-white">{currentUser.avg_sleep_hours}h</span>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-2 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditData(currentUser);
              }}
              className="flex-1 px-3 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};