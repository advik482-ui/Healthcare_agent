import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { medicationAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface MedicationScheduleItem {
  schedule_id: number;
  medication_name: string;
  dosage: string;
  time: string;
  status: string;
}

export const MedicationSchedule: React.FC = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<MedicationScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const today = new Date().toISOString().split('T')[0];
      medicationAPI.getSchedule(user.id, today)
        .then(response => {
          setSchedule(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching medication schedule:', error);
          setLoading(false);
        });
    }
  }, [user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircleIcon className="w-5 h-5 text-success" />;
      case 'missed':
        return <XCircleIcon className="w-5 h-5 text-error" />;
      default:
        return <ClockIcon className="w-5 h-5 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken':
        return 'text-success';
      case 'missed':
        return 'text-error';
      default:
        return 'text-warning';
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white">Today's Medications</h2>
        <div className="p-2 bg-primary-500/20 rounded-lg">
          <ClockIcon className="w-5 h-5 text-primary-400" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <LoadingSkeleton key={i} className="h-16" />
          ))}
        </div>
      ) : schedule.length === 0 ? (
        <div className="text-center py-8">
          <ClockIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No medications scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.map((item, index) => (
            <motion.div
              key={item.schedule_id}
              className="flex items-center justify-between p-4 bg-dark-700/30 rounded-lg border border-dark-600/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(item.status)}
                <div>
                  <h3 className="font-medium text-white">{item.medication_name}</h3>
                  <p className="text-sm text-gray-400">{item.dosage}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{item.time}</p>
                <p className={`text-xs capitalize ${getStatusColor(item.status)}`}>
                  {item.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};