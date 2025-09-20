import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { 
  SignalIcon,
  HeartIcon,
  ScaleIcon,
  ClockIcon,
  WifiIcon
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

  useEffect(() => {
    if (isSimulationMode && currentUser) {
      setIsConnected(true);
      
      const interval = setInterval(() => {
        const dataTypes = ['heart_rate', 'steps', 'blood_pressure', 'mood', 'medication'] as const;
        const randomType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
        
        let value = '';
        switch (randomType) {
          case 'heart_rate':
            value = `${65 + Math.floor(Math.random() * 25)} BPM`;
            break;
          case 'steps':
            value = `${Math.floor(Math.random() * 1000)} steps`;
            break;
          case 'blood_pressure':
            value = `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`;
            break;
          case 'mood':
            const moods = ['Great', 'Good', 'Okay', 'Tired', 'Stressed'];
            value = moods[Math.floor(Math.random() * moods.length)];
            break;
          case 'medication':
            value = 'Metformin taken';
            break;
        }

        const newDataPoint: DataPoint = {
          id: Date.now().toString(),
          type: randomType,
          value,
          timestamp: new Date(),
          user_id: currentUser.user_id
        };

        setDataStream(prev => [newDataPoint, ...prev.slice(0, 19)]); // Keep last 20 items
      }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds

      return () => clearInterval(interval);
    } else {
      setIsConnected(false);
      setDataStream([]);
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
    <div className="h-24 border-t border-dark-700/50 bg-dark-900/80 backdrop-blur-sm">
      <div className="h-full px-6 flex items-center">
        {/* Connection Status */}
        <div className="flex items-center space-x-3 mr-6">
          <div className="flex items-center space-x-2">
            <WifiIcon className={`w-5 h-5 ${isConnected ? 'text-success' : 'text-gray-400'}`} />
            <span className="text-sm font-medium text-white">Real-Time Data Stream</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-xs text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Data Stream */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center space-x-3 animate-scroll">
            {dataStream.map((dataPoint, index) => (
              <motion.div
                key={dataPoint.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg border flex-shrink-0
                  ${getDataColor(dataPoint.type)}
                `}
              >
                {getDataIcon(dataPoint.type)}
                <div>
                  <p className="text-xs font-medium text-white">{dataPoint.value}</p>
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
        <div className="flex items-center space-x-4 ml-6 text-xs text-gray-400">
          <div className="text-center">
            <p className="text-white font-medium">{dataStream.length}</p>
            <p>Data Points</p>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">
              {currentUser?.name.split(' ')[0]}
            </p>
            <p>Active User</p>
          </div>
          <div className="text-center">
            <p className="text-success font-medium">Live</p>
            <p>Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};