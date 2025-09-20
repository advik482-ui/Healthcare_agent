import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  lines = 1 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="bg-dark-700 rounded-lg mb-2 last:mb-0"
          style={{ height: '1rem' }}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-dark-600 to-transparent animate-shimmer relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 ${className}`}>
    <LoadingSkeleton lines={3} />
  </div>
);

export const MetricCardSkeleton: React.FC = () => (
  <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <LoadingSkeleton className="w-24 h-4" />
      <LoadingSkeleton className="w-8 h-8 rounded-full" />
    </div>
    <LoadingSkeleton className="w-16 h-8 mb-2" />
    <LoadingSkeleton className="w-32 h-3" />
  </div>
);