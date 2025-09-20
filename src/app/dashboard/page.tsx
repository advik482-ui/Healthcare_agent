'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { MedicationSchedule } from '@/components/dashboard/MedicationSchedule';
import { SymptomLogger } from '@/components/dashboard/SymptomLogger';
import { MetricCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAuth } from '@/lib/auth';
import { userAPI, metricsAPI, alertAPI } from '@/lib/api';
import { 
  HeartIcon, 
  FireIcon, 
  MoonIcon, 
  ScaleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [upcomingAlerts, setUpcomingAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        userAPI.getProfile(user.id),
        metricsAPI.getAll(user.id, undefined, 1),
        alertAPI.getUpcoming(user.id, 24)
      ])
      .then(([profileRes, metricsRes, alertsRes]) => {
        setUserProfile(profileRes.data);
        setMetrics(metricsRes.data[0] || {});
        setUpcomingAlerts(alertsRes.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
    }
  }, [user?.id]);

  const metricCards = [
    {
      title: 'Heart Rate',
      value: metrics?.heart_rate || userProfile?.avg_heart_rate || '--',
      unit: 'BPM',
      icon: <HeartIcon className="w-5 h-5" />,
      color: 'error' as const,
      trend: { value: 2.5, isPositive: true }
    },
    {
      title: 'Steps Today',
      value: metrics?.steps || userProfile?.steps_per_day || '--',
      unit: 'steps',
      icon: <FireIcon className="w-5 h-5" />,
      color: 'primary' as const,
      trend: { value: 12.3, isPositive: true }
    },
    {
      title: 'Sleep',
      value: metrics?.sleep_hours || userProfile?.avg_sleep_hours || '--',
      unit: 'hours',
      icon: <MoonIcon className="w-5 h-5" />,
      color: 'secondary' as const,
      trend: { value: 5.2, isPositive: false }
    },
    {
      title: 'Weight',
      value: userProfile?.weight_kg || '--',
      unit: 'kg',
      icon: <ScaleIcon className="w-5 h-5" />,
      color: 'success' as const,
      trend: { value: 1.8, isPositive: false }
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <WelcomeHeader userName={userProfile?.name || user?.name || 'User'} />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))
          ) : (
            metricCards.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MetricCard {...metric} />
              </motion.div>
            ))
          )}
        </div>

        {/* Alerts Section */}
        {upcomingAlerts.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-warning mr-2" />
                <h3 className="font-medium text-warning">Upcoming Alerts</h3>
              </div>
              <div className="space-y-2">
                {upcomingAlerts.slice(0, 3).map(alert => (
                  <div key={alert.alert_id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{alert.title}</span>
                    <div className="flex items-center text-gray-400">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {new Date(alert.alert_time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medication Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <MedicationSchedule />
          </motion.div>

          {/* Symptom Logger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SymptomLogger />
          </motion.div>

          {/* Health Summary */}
          <motion.div
            className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-lg font-display font-semibold text-white mb-4">
              Health Summary
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">BMI</span>
                <span className="text-white font-medium">
                  {userProfile?.bmi ? userProfile.bmi.toFixed(1) : '--'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Blood Pressure</span>
                <span className="text-white font-medium">
                  {userProfile?.avg_blood_pressure || '--'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Activity Level</span>
                <span className="text-white font-medium capitalize">
                  {userProfile?.activity_level || '--'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Checkup</span>
                <span className="text-white font-medium">
                  {userProfile?.last_checkup 
                    ? new Date(userProfile.last_checkup).toLocaleDateString()
                    : '--'
                  }
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}