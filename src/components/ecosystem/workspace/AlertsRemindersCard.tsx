import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { 
  BellIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface Alert {
  id: string;
  type: 'medication' | 'appointment' | 'symptom' | 'emergency';
  title: string;
  message: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
}

export const AlertsRemindersCard: React.FC = () => {
  const { currentUser, isSimulationMode } = useEcosystemStore();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'medication',
      title: 'Medication Reminder',
      message: 'Time to take your morning Metformin (500mg)',
      time: '09:00 AM',
      priority: 'high',
      isActive: true
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Doctor Appointment',
      message: 'Cardiology follow-up with Dr. Smith',
      time: 'Tomorrow 2:00 PM',
      priority: 'medium',
      isActive: true
    },
    {
      id: '3',
      type: 'symptom',
      title: 'Symptom Check',
      message: 'Log your blood pressure reading',
      time: '06:00 PM',
      priority: 'low',
      isActive: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'medication': return '💊';
      case 'appointment': return '👨‍⚕️';
      case 'symptom': return '📊';
      case 'emergency': return '🚨';
      default: return '🔔';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-error bg-error/10';
      case 'medium': return 'border-l-warning bg-warning/10';
      case 'low': return 'border-l-primary bg-primary/10';
      default: return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: false } : alert
    ));
  };

  const activeAlerts = alerts.filter(alert => alert.isActive);

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white flex items-center">
          <BellIcon className="w-5 h-5 mr-2" />
          Alerts & Reminders
        </h2>
        <div className="flex items-center space-x-2">
          {isSimulationMode && (
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          )}
          <span className="text-sm text-gray-400">
            {activeAlerts.length} active
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1 text-gray-400 hover:text-white hover:bg-dark-700 rounded transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Alert Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-dark-700/30 rounded-lg border border-dark-600/50"
        >
          <h3 className="text-sm font-medium text-white mb-3">Add New Alert</h3>
          <div className="space-y-3">
            <select className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm">
              <option>Medication Reminder</option>
              <option>Appointment</option>
              <option>Symptom Check</option>
              <option>Health Goal</option>
            </select>
            <input
              type="text"
              placeholder="Alert message"
              className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm placeholder-gray-400"
            />
            <div className="flex space-x-2">
              <input
                type="time"
                className="flex-1 bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm"
              />
              <select className="flex-1 bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm">
                <option>High Priority</option>
                <option>Medium Priority</option>
                <option>Low Priority</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-sm">
                Add Alert
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-3 py-2 bg-dark-600 text-gray-300 rounded hover:bg-dark-500 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircleIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No active alerts</p>
            <p className="text-sm text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          activeAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${getPriorityColor(alert.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getAlertIcon(alert.type)}</span>
                  <div>
                    <h4 className="font-medium text-white text-sm">
                      {alert.title}
                    </h4>
                    <p className="text-gray-300 text-sm mt-1">
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <ClockIcon className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{alert.time}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.priority === 'high' ? 'bg-error/20 text-error' :
                        alert.priority === 'medium' ? 'bg-warning/20 text-warning' :
                        'bg-primary/20 text-primary'
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 text-gray-400 hover:text-success hover:bg-success/20 rounded transition-colors"
                    title="Mark as done"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 text-gray-400 hover:text-error hover:bg-error/20 rounded transition-colors"
                    title="Dismiss"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-dark-700/50">
        <div className="grid grid-cols-2 gap-2">
          <button className="p-2 bg-dark-700/50 text-gray-300 rounded-lg hover:bg-dark-600/50 transition-colors text-sm">
            📱 Test Notification
          </button>
          <button className="p-2 bg-dark-700/50 text-gray-300 rounded-lg hover:bg-dark-600/50 transition-colors text-sm">
            ⚙️ Alert Settings
          </button>
        </div>
      </div>
    </div>
  );
};