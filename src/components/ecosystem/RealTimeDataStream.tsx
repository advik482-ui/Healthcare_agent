import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { 
  SignalIcon,
  HeartIcon,
  ScaleIcon,
  ClockIcon,
  WifiIcon,
  CpuChipIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

interface DataPoint {
  id: string;
  type: 'heart_rate' | 'steps' | 'blood_pressure' | 'mood' | 'medication';
  value: string;
  timestamp: Date;
  user_id: number;
}

export const RealTimeDataStream: React.FC = () => {
  const { currentUser, isSimulationMode } = useEcosystemStore();
  const [dataStream, setDataStream] = useState<DataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [dataCount, setDataCount] = useState(0);

  useEffect(() => {
    if (isSimulationMode && currentUser) {
      setIsConnected(true);
      
      const interval = setInterval(() => {
        const dataTypes = ['heart_rate', 'steps', 'blood_pressure', 'mood', 'medication'] as const;
        const randomType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
        
        let value = '';
        switch (randomType) {
          case 'heart_rate':
            value = `${Math.floor(65 + Math.random() * 25 + (Math.sin(Date.now() / 10000) * 5))} BPM`;
            break;
          case 'steps':
            value = `+${Math.floor(Math.random() * 500 + 100)} steps`;
            break;
          case 'blood_pressure':
            value = `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)} mmHg`;
            break;
          case 'mood':
            const moods = ['Great 😊', 'Good 👍', 'Okay 😐', 'Tired 😴', 'Energetic ⚡'];
            value = moods[Math.floor(Math.random() * moods.length)];
            break;
          case 'medication':
            const meds = ['Metformin taken ✓', 'Lisinopril due 🔔', 'Vitamin D taken ✓'];
            value = meds[Math.floor(Math.random() * meds.length)];
            break;
        }

        const newDataPoint: DataPoint = {
          id: Date.now().toString(),
          type: randomType,
          value,
          timestamp: new Date(),
          user_id: currentUser.user_id
        };

        setDataStream(prev => [newDataPoint, ...prev.slice(0, 24)]); // Keep last 25 items
        setDataCount(prev => prev + 1);
      }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds

      return () => clearInterval(interval);
    } else {
      setIsConnected(false);
      setDataStream([]);
      setDataCount(0);
    }
  }, [isSimulationMode, currentUser]);

  const getDataIcon = (type: string) => {
    switch (type) {
      case 'heart_rate': return <HeartIcon className="w-4 h-4 text-red-400" />;
      case 'steps': return <ScaleIcon className="w-4 h-4 text-primary-400" />;
      case 'blood_pressure': return <SignalIcon className="w-4 h-4 text-blue-400" />;
      case 'mood': return <span className="text-yellow-400">😊</span>;
      case 'medication': return <span className="text-green-400">💊</span>;
      default: return <ClockIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getDataColor = (type: string) => {
    switch (type) {
      case 'heart_rate': return 'border-red-400/30 bg-red-400/10';
      case 'steps': return 'border-primary-400/30 bg-primary-400/10';
      case 'blood_pressure': return 'border-blue-400/30 bg-blue-400/10';
      case 'mood': return 'border-yellow-400/30 bg-yellow-400/10';
      case 'medication': return 'border-green-400/30 bg-green-400/10';
      default: return 'border-gray-400/30 bg-gray-400/10';
    }
  };

  if (!isSimulationMode) {
    return null;
  }

  return (
    <motion.div 
      className="h-28 border-t border-dark-700/50 bg-dark-900/90 backdrop-blur-md relative overflow-hidden"
      initial={{ y: 112 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,245,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse" />
      
      <div className="h-full px-6 flex items-center">
        {/* Connection Status */}
        <motion.div 
          className="flex items-center space-x-4 mr-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center space-x-2">
            <div className="relative">
              <CpuChipIcon className={`w-6 h-6 ${isConnected ? 'text-success' : 'text-gray-400'}`} />
              {isConnected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-ping" />
              )}
            </div>
            <div>
              <span className="text-sm font-medium text-white">Real-Time Data Stream</span>
              <p className="text-xs text-gray-400">AI Processing Pipeline</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <BoltIcon className="w-4 h-4 text-warning" />
              <span className="text-gray-400">Processing</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-gray-400">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Data Stream */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center space-x-3">
            {dataStream.map((dataPoint, index) => (
              <motion.div
                key={dataPoint.id}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-xl border flex-shrink-0 backdrop-blur-sm shadow-sm
                  ${getDataColor(dataPoint.type)}
                `}
              >
                {getDataIcon(dataPoint.type)}
                <div>
                  <p className="text-xs font-medium text-white whitespace-nowrap">{dataPoint.value}</p>
                  <p className="text-xs text-gray-400">
                    {dataPoint.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stream Stats */}
        <motion.div 
          className="flex items-center space-x-6 ml-8 text-xs"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="text-center">
            <p className="text-lg font-bold text-primary-400">{dataCount}</p>
            <p className="text-gray-400">Total Points</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-secondary-400">{dataStream.length}</p>
            <p className="text-gray-400">In Buffer</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              {currentUser?.name.split(' ')[0]}
            </p>
            <p className="text-gray-400">Active Patient</p>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              <p className="text-success font-bold">LIVE</p>
            </div>
            <p className="text-gray-400">Status</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};