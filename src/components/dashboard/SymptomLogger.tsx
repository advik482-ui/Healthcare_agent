import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassModal } from '@/components/ui/GlassCard';
import { symptomAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export const SymptomLogger: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    symptom: '',
    severity: '',
    duration: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const severityOptions = [
    { value: 'mild', label: 'Mild', color: 'text-green-400' },
    { value: 'moderate', label: 'Moderate', color: 'text-yellow-400' },
    { value: 'severe', label: 'Severe', color: 'text-red-400' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !formData.symptom) return;

    setLoading(true);
    try {
      await symptomAPI.create(user.id, formData);
      toast.success('Symptom logged successfully');
      setIsModalOpen(false);
      setFormData({ symptom: '', severity: '', duration: '', notes: '' });
    } catch (error) {
      toast.error('Failed to log symptom');
      console.error('Error logging symptom:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlassCard className="p-6" hover onClick={() => setIsModalOpen(true)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-white">Log Symptom</h2>
          <div className="p-2 bg-warning/20 rounded-lg">
            <ExclamationTriangleIcon className="w-5 h-5 text-warning" />
          </div>
        </div>
        
        <div className="flex items-center justify-center py-8 border-2 border-dashed border-dark-600 rounded-lg">
          <div className="text-center">
            <PlusIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">Click to log a new symptom</p>
          </div>
        </div>
      </GlassCard>

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log New Symptom"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Symptom *
            </label>
            <input
              type="text"
              value={formData.symptom}
              onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Headache, Nausea, Fatigue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Severity
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select severity</option>
              {severityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., 2 hours, All day, 30 minutes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Additional details about the symptom..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.symptom}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Logging...' : 'Log Symptom'}
            </button>
          </div>
        </form>
      </GlassModal>
    </>
  );
};