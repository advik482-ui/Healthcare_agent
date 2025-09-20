'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAuth } from '@/lib/auth';
import { metricsAPI, symptomAPI, medicationAPI } from '@/lib/api';
import { 
  ChartBarIcon, 
  HeartIcon, 
  ExclamationTriangleIcon,
  BeakerIcon 
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HealthPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('metrics');
  const [metrics, setMetrics] = useState<any[]>([]);
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'metrics', name: 'Health Metrics', icon: ChartBarIcon },
    { id: 'symptoms', name: 'Symptoms', icon: ExclamationTriangleIcon },
    { id: 'medications', name: 'Medications', icon: BeakerIcon },
  ];

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        metricsAPI.getAll(user.id, undefined, 30),
        symptomAPI.getAll(user.id, 20),
        medicationAPI.getAll(user.id)
      ])
      .then(([metricsRes, symptomsRes, medicationsRes]) => {
        setMetrics(metricsRes.data);
        setSymptoms(symptomsRes.data);
        setMedications(medicationsRes.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching health data:', error);
        setLoading(false);
      });
    }
  }, [user?.id]);

  const chartData = {
    labels: metrics.slice(-7).map(m => new Date(m.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Heart Rate',
        data: metrics.slice(-7).map(m => m.heart_rate || 0),
        borderColor: '#F87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Steps (÷100)',
        data: metrics.slice(-7).map(m => (m.steps || 0) / 100),
        borderColor: '#00F5D4',
        backgroundColor: 'rgba(0, 245, 212, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Sleep Hours',
        data: metrics.slice(-7).map(m => m.sleep_hours || 0),
        borderColor: '#8A2BE2',
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#f0f0f0',
        },
      },
      title: {
        display: true,
        text: 'Health Metrics Trend (Last 7 Days)',
        color: '#f0f0f0',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: '#374151',
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: '#374151',
        },
      },
    },
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'mild':
        return 'text-green-400 bg-green-500/20';
      case 'moderate':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'severe':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            My Health
          </h1>
          <p className="text-gray-400">
            Comprehensive view of your health data and trends
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-dark-800/50 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }
              `}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Chart */}
              <GlassCard className="p-6">
                {loading ? (
                  <LoadingSkeleton className="h-64" />
                ) : metrics.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="text-center py-12">
                    <ChartBarIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No health metrics data available</p>
                  </div>
                )}
              </GlassCard>

              {/* Recent Metrics */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-display font-semibold text-white mb-4">
                  Recent Metrics
                </h2>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <LoadingSkeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : metrics.length > 0 ? (
                  <div className="space-y-4">
                    {metrics.slice(0, 5).map((metric, index) => (
                      <div
                        key={metric.metric_id}
                        className="flex items-center justify-between p-4 bg-dark-700/30 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {new Date(metric.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-400">
                            {metric.mood && `Mood: ${metric.mood}`}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          {metric.heart_rate && (
                            <div className="text-sm">
                              <span className="text-gray-400">HR:</span>
                              <span className="text-red-400 ml-1">{metric.heart_rate} BPM</span>
                            </div>
                          )}
                          {metric.steps && (
                            <div className="text-sm">
                              <span className="text-gray-400">Steps:</span>
                              <span className="text-primary-400 ml-1">{metric.steps.toLocaleString()}</span>
                            </div>
                          )}
                          {metric.sleep_hours && (
                            <div className="text-sm">
                              <span className="text-gray-400">Sleep:</span>
                              <span className="text-secondary-400 ml-1">{metric.sleep_hours}h</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HeartIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No metrics recorded yet</p>
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {activeTab === 'symptoms' && (
            <GlassCard className="p-6">
              <h2 className="text-lg font-display font-semibold text-white mb-4">
                Symptom History
              </h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <LoadingSkeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : symptoms.length > 0 ? (
                <div className="space-y-4">
                  {symptoms.map((symptom) => (
                    <div
                      key={symptom.symptom_id}
                      className="p-4 bg-dark-700/30 rounded-lg border border-dark-600/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-white capitalize">
                          {symptom.symptom}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {symptom.severity && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                              {symptom.severity}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(symptom.log_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {symptom.duration && (
                        <p className="text-sm text-gray-400 mb-1">
                          Duration: {symptom.duration}
                        </p>
                      )}
                      {symptom.notes && (
                        <p className="text-sm text-gray-300">
                          {symptom.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No symptoms recorded</p>
                </div>
              )}
            </GlassCard>
          )}

          {activeTab === 'medications' && (
            <GlassCard className="p-6">
              <h2 className="text-lg font-display font-semibold text-white mb-4">
                Current Medications
              </h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <LoadingSkeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : medications.length > 0 ? (
                <div className="space-y-4">
                  {medications.map((medication) => (
                    <div
                      key={medication.user_med_id}
                      className="p-4 bg-dark-700/30 rounded-lg border border-dark-600/50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-white">
                            {medication.medication_name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {medication.dosage} • {medication.frequency}
                          </p>
                          {medication.description && (
                            <p className="text-sm text-gray-300 mt-1">
                              {medication.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-400">
                          <p>Started: {new Date(medication.start_date).toLocaleDateString()}</p>
                          {medication.end_date && (
                            <p>Ends: {new Date(medication.end_date).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BeakerIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No medications recorded</p>
                </div>
              )}
            </GlassCard>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}