import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { Medication } from '@/types/ecosystem';
import { 
  BeakerIcon, 
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface MedicationManagerProps {
  expanded?: boolean;
}

interface MedicationSchedule {
  id: string;
  medication: Medication;
  time: string;
  status: 'pending' | 'taken' | 'missed' | 'skipped';
  date: string;
}

export const MedicationManager: React.FC<MedicationManagerProps> = ({ expanded = false }) => {
  const { currentUser, medications, addMedication } = useEcosystemStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMedication, setNewMedication] = useState({
    medication_name: '',
    dosage: '',
    frequency: 'daily',
    start_date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Mock schedule data
  const [schedule, setSchedule] = useState<MedicationSchedule[]>([
    {
      id: '1',
      medication: {
        user_med_id: 1,
        user_id: currentUser?.user_id || 1,
        medication_id: 1,
        medication_name: 'Metformin',
        dosage: '500mg',
        frequency: 'twice daily',
        start_date: '2024-01-01',
        description: 'For diabetes management'
      },
      time: '08:00',
      status: 'taken',
      date: selectedDate
    },
    {
      id: '2',
      medication: {
        user_med_id: 2,
        user_id: currentUser?.user_id || 1,
        medication_id: 2,
        medication_name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'daily',
        start_date: '2024-01-01',
        description: 'For blood pressure'
      },
      time: '20:00',
      status: 'pending',
      date: selectedDate
    }
  ]);

  const handleAddMedication = () => {
    if (!newMedication.medication_name.trim() || !currentUser) return;

    addMedication({
      user_id: currentUser.user_id,
      medication_id: Date.now(),
      medication_name: newMedication.medication_name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      start_date: newMedication.start_date,
      description: newMedication.description
    });

    setNewMedication({
      medication_name: '',
      dosage: '',
      frequency: 'daily',
      start_date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setShowAddForm(false);
  };

  const updateScheduleStatus = (id: string, status: MedicationSchedule['status']) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken': return <CheckCircleIcon className="w-5 h-5 text-success" />;
      case 'missed': return <XCircleIcon className="w-5 h-5 text-error" />;
      case 'skipped': return <ExclamationCircleIcon className="w-5 h-5 text-warning" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken': return 'bg-success/20 border-success/30';
      case 'missed': return 'bg-error/20 border-error/30';
      case 'skipped': return 'bg-warning/20 border-warning/30';
      default: return 'bg-dark-700/30 border-dark-600/50';
    }
  };

  const todaySchedule = schedule.filter(item => item.date === selectedDate);
  const userMedications = medications.filter(m => m.user_id === currentUser?.user_id);

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white flex items-center">
          <BeakerIcon className="w-5 h-5 mr-2" />
          Medication Manager
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {userMedications.length} active
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Add Medication Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-dark-700/30 rounded-lg border border-dark-600/50"
          >
            <h3 className="text-sm font-medium text-white mb-3">Add New Medication</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newMedication.medication_name}
                onChange={(e) => setNewMedication({...newMedication, medication_name: e.target.value})}
                placeholder="Medication name"
                className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  placeholder="Dosage (e.g., 500mg)"
                  className="bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                
                <select
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                  className="bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="daily">Daily</option>
                  <option value="twice daily">Twice Daily</option>
                  <option value="three times daily">Three Times Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="as needed">As Needed</option>
                </select>
              </div>
              
              <input
                type="date"
                value={newMedication.start_date}
                onChange={(e) => setNewMedication({...newMedication, start_date: e.target.value})}
                className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              
              <textarea
                value={newMedication.description}
                onChange={(e) => setNewMedication({...newMedication, description: e.target.value})}
                placeholder="Description or notes (optional)"
                rows={2}
                className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              
              <div className="flex space-x-2">
                <button
                  onClick={handleAddMedication}
                  disabled={!newMedication.medication_name.trim()}
                  className="flex-1 px-3 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Add Medication
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

      {/* Today's Schedule */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-300">
          Schedule for {new Date(selectedDate).toLocaleDateString()}
        </h3>
        
        {todaySchedule.length === 0 ? (
          <div className="text-center py-8">
            <BeakerIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No medications scheduled</p>
            <p className="text-sm text-gray-500">Add medications to track your schedule</p>
          </div>
        ) : (
          todaySchedule.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <h4 className="font-medium text-white">
                      {item.medication.medication_name}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {item.medication.dosage} • {item.time}
                    </p>
                    {item.medication.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.medication.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {item.status === 'pending' && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => updateScheduleStatus(item.id, 'taken')}
                      className="p-1 text-gray-400 hover:text-success hover:bg-success/20 rounded transition-colors"
                      title="Mark as taken"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateScheduleStatus(item.id, 'skipped')}
                      className="p-1 text-gray-400 hover:text-warning hover:bg-warning/20 rounded transition-colors"
                      title="Skip dose"
                    >
                      <ExclamationCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Adherence Summary */}
      {todaySchedule.length > 0 && (
        <div className="mt-6 pt-4 border-t border-dark-700/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Today's Adherence</span>
            <span className="text-white">
              {todaySchedule.filter(item => item.status === 'taken').length} / {todaySchedule.length}
            </span>
          </div>
          <div className="mt-2 w-full bg-dark-700 rounded-full h-2">
            <div 
              className="bg-success h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(todaySchedule.filter(item => item.status === 'taken').length / todaySchedule.length) * 100}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};