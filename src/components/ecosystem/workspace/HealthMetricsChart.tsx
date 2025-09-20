import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
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
import { ChartBarIcon, HeartIcon, ScaleIcon, MoonIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HealthMetricsChartProps {
  expanded?: boolean;
}

export const HealthMetricsChart: React.FC<HealthMetricsChartProps> = ({ expanded = false }) => {
  const { currentUser, healthMetrics, isSimulationMode } = useEcosystemStore();
  const [selectedMetric, setSelectedMetric] = useState<'heart_rate' | 'steps' | 'sleep' | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Generate mock data for demonstration
  const generateMockData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const heartRateData = Array.from({ length: days }, () => 
      65 + Math.random() * 20 + (Math.random() > 0.8 ? 15 : 0)
    );
    
    const stepsData = Array.from({ length: days }, () => 
      5000 + Math.random() * 8000
    );
    
    const sleepData = Array.from({ length: days }, () => 
      6 + Math.random() * 3
    );

    return { dates, heartRateData, stepsData, sleepData };
  };

  const { dates, heartRateData, stepsData, sleepData } = generateMockData();

  const chartData = {
    labels: dates,
    datasets: [
      ...(selectedMetric === 'heart_rate' || selectedMetric === 'all' ? [{
        label: 'Heart Rate (BPM)',
        data: heartRateData,
        borderColor: '#F87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      }] : []),
      ...(selectedMetric === 'steps' || selectedMetric === 'all' ? [{
        label: 'Steps (÷100)',
        data: stepsData.map(s => s / 100),
        borderColor: '#00F5D4',
        backgroundColor: 'rgba(0, 245, 212, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      }] : []),
      ...(selectedMetric === 'sleep' || selectedMetric === 'all' ? [{
        label: 'Sleep Hours',
        data: sleepData,
        borderColor: '#8A2BE2',
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        tension: 0.4,
        yAxisID: 'y2',
      }] : []),
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#f0f0f0',
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#f0f0f0',
        bodyColor: '#f0f0f0',
        borderColor: '#475569',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151' },
      },
      y: {
        type: 'linear' as const,
        display: selectedMetric === 'heart_rate' || selectedMetric === 'all',
        position: 'left' as const,
        ticks: { color: '#F87171' },
        grid: { color: '#374151' },
      },
      y1: {
        type: 'linear' as const,
        display: selectedMetric === 'steps' || selectedMetric === 'all',
        position: 'right' as const,
        ticks: { color: '#00F5D4' },
        grid: { drawOnChartArea: false },
      },
      y2: {
        type: 'linear' as const,
        display: selectedMetric === 'sleep' || selectedMetric === 'all',
        position: 'right' as const,
        ticks: { color: '#8A2BE2' },
        grid: { drawOnChartArea: false },
      },
    },
  };

  const metrics = [
    { id: 'all', name: 'All Metrics', icon: ChartBarIcon, color: 'text-white' },
    { id: 'heart_rate', name: 'Heart Rate', icon: HeartIcon, color: 'text-red-400' },
    { id: 'steps', name: 'Steps', icon: ScaleIcon, color: 'text-primary-400' },
    { id: 'sleep', name: 'Sleep', icon: MoonIcon, color: 'text-secondary-400' },
  ];

  const timeRanges = [
    { id: '7d', name: '7 Days' },
    { id: '30d', name: '30 Days' },
    { id: '90d', name: '90 Days' },
  ];

  return (
    <div className={`bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6 ${expanded ? 'col-span-2' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2" />
          Health Metrics
        </h2>
        <div className="flex items-center space-x-2">
          {isSimulationMode && (
            <div className="flex items-center space-x-2 text-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs">Live</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        {/* Metric Selector */}
        <div className="flex space-x-1 bg-dark-700/50 p-1 rounded-lg">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id as any)}
              className={`
                flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${selectedMetric === metric.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-600'
                }
              `}
            >
              <metric.icon className="w-4 h-4 mr-2" />
              {expanded ? metric.name : ''}
            </button>
          ))}
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-1 bg-dark-700/50 p-1 rounded-lg">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id as any)}
              className={`
                px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${timeRange === range.id
                  ? 'bg-secondary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-600'
                }
              `}
            >
              {range.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className={`${expanded ? 'h-96' : 'h-64'}`}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Current Values */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-dark-700/30 rounded-lg">
          <HeartIcon className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <p className="text-lg font-semibold text-white">
            {currentUser?.avg_heart_rate || '--'}
          </p>
          <p className="text-xs text-gray-400">BPM</p>
        </div>
        
        <div className="text-center p-3 bg-dark-700/30 rounded-lg">
          <ScaleIcon className="w-5 h-5 text-primary-400 mx-auto mb-1" />
          <p className="text-lg font-semibold text-white">
            {currentUser?.steps_per_day?.toLocaleString() || '--'}
          </p>
          <p className="text-xs text-gray-400">Steps</p>
        </div>
        
        <div className="text-center p-3 bg-dark-700/30 rounded-lg">
          <MoonIcon className="w-5 h-5 text-secondary-400 mx-auto mb-1" />
          <p className="text-lg font-semibold text-white">
            {currentUser?.avg_sleep_hours || '--'}
          </p>
          <p className="text-xs text-gray-400">Hours</p>
        </div>
      </div>
    </div>
  );
};