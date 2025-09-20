import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { Symptom } from '@/types/ecosystem';
import { 
  ExclamationTriangleIcon, 
  PlusIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SymptomTrackerProps {
  expanded?: boolean;
}

export const SymptomTracker: React.FC<SymptomTrackerProps> = ({ expanded = false }) => {
  const { currentUser, symptoms, addSymptom, removeSymptom } = useEcosystemStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSymptom, setNewSymptom] = useState({
    symptom: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe',
    duration: '',
    notes: ''
  });

  const handleAddSymptom = () => {
    if (!newSymptom.symptom.trim() || !currentUser) return;

    addSymptom({
      user_id: currentUser.user_id,
      symptom: newSymptom.symptom,
      severity: newSymptom.severity,
      duration: newSymptom.duration,
      notes: newSymptom.notes,
      log_date: new Date().toISOString()
    });

    setNewSymptom({ symptom: '', severity: 'mild', duration: '', notes: '' });
    setShowAddForm(false);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'mild': return 'text-success bg-success/20 border-success/30';
      case 'moderate': return 'text-warning bg-warning/20 border-warning/30';
      case 'severe': return 'text-error bg-error/20 border-error/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'mild': return '🟢';
      case 'moderate': return '🟡';
      case 'severe': return '🔴';
      default: return '⚪';
    }
  };

  const userSymptoms = symptoms.filter(s => s.user_id === currentUser?.user_id);
  const recentSymptoms = userSymptoms.slice(0, expanded ? 10 : 5);

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
          Symptom Tracker
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {userSymptoms.length} logged
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Symptom Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-dark-700/30 rounded-lg border border-dark-600/50"
          >
            <h3 className="text-sm font-medium text-white mb-3">Log New Symptom</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newSymptom.symptom}
                onChange={(e) => setNewSymptom({...newSymptom, symptom: e.target.value})}
                placeholder="Symptom name (e.g., headache, nausea)"
                className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newSymptom.severity}
                  onChange={(e) => setNewSymptom({...newSymptom, severity: e.target.value as any})}
                  className="bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
                
                <input
                  type="text"
                  value={newSymptom.duration}
                  onChange={(e) => setNewSymptom({...newSymptom, duration: e.target.value})}
                  placeholder="Duration (e.g., 2 hours)"
                  className="bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <textarea
                value={newSymptom.notes}
                onChange={(e) => setNewSymptom({...newSymptom, notes: e.target.value})}
                placeholder="Additional notes (optional)"
                rows={2}
                className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              
              <div className="flex space-x-2">
                <button
                  onClick={handleAddSymptom}
                  disabled={!newSymptom.symptom.trim()}
                  className="flex-1 px-3 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Log Symptom
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
      </AnimatePresence>

      {/* Symptoms List */}
      <div className="space-y-3">
        {recentSymptoms.length === 0 ? (
          <div className="text-center py-8">
            <ExclamationTriangleIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No symptoms logged</p>
            <p className="text-sm text-gray-500">Track symptoms to help your AI companion provide better guidance</p>
          </div>
        ) : (
          recentSymptoms.map((symptom, index) => (
            <motion.div
              key={symptom.symptom_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-dark-700/30 rounded-lg border border-dark-600/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <span className="text-lg">{getSeverityIcon(symptom.severity)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-white capitalize">
                        {symptom.symptom}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(symptom.severity)}`}>
                        {symptom.severity}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>{new Date(symptom.log_date).toLocaleDateString()}</span>
                      </div>
                      {symptom.duration && (
                        <span>Duration: {symptom.duration}</span>
                      )}
                    </div>
                    
                    {symptom.notes && (
                      <p className="text-sm text-gray-300 mt-2">
                        {symptom.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => removeSymptom(symptom.symptom_id)}
                  className="p-1 text-gray-400 hover:text-error hover:bg-error/20 rounded transition-colors"
                  title="Remove symptom"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Add Buttons */}
      {!showAddForm && (
        <div className="mt-6 pt-4 border-t border-dark-700/50">
          <p className="text-xs text-gray-400 mb-3">Quick Add:</p>
          <div className="grid grid-cols-2 gap-2">
            {['Headache', 'Fatigue', 'Nausea', 'Dizziness'].map((symptom) => (
              <button
                key={symptom}
                onClick={() => {
                  if (currentUser) {
                    addSymptom({
                      user_id: currentUser.user_id,
                      symptom: symptom.toLowerCase(),
                      severity: 'mild',
                      duration: '',
                      notes: '',
                      log_date: new Date().toISOString()
                    });
                  }
                }}
                className="p-2 bg-dark-700/50 text-gray-300 rounded-lg hover:bg-dark-600/50 transition-colors text-sm"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};