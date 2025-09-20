import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  color = 'primary'
}) => {
  const colorClasses = {
    primary: 'text-primary-400 bg-primary-500/20',
    secondary: 'text-secondary-400 bg-secondary-500/20',
    success: 'text-green-400 bg-green-500/20',
    warning: 'text-yellow-400 bg-yellow-500/20',
    error: 'text-red-400 bg-red-500/20',
  };

  return (
    <GlassCard className="p-6" hover>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline space-x-1 mb-2">
        <motion.span
          className="text-2xl font-bold text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {value}
        </motion.span>
        {unit && (
          <span className="text-sm text-gray-400">{unit}</span>
        )}
      </div>

      {trend && (
        <div className="flex items-center space-x-1">
          <svg
            className={`w-4 h-4 ${trend.isPositive ? 'text-success rotate-0' : 'text-error rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
          <span className={`text-sm ${trend.isPositive ? 'text-success' : 'text-error'}`}>
            {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-500">vs last week</span>
        </div>
      )}
    </GlassCard>
  );
};