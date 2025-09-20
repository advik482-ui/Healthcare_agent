import React from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { 
  HeartIcon, 
  Cog6ToothIcon, 
  PlayIcon, 
  PauseIcon,
  EyeIcon,
  ChartBarIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export const EcosystemHeader: React.FC = () => {
  const { 
    currentUser,
    isSimulationMode,
    isDemoMode,
    isControlPanelOpen,
    showPersonalizationPanel,
    showContextPanel,
    toggleControlPanel,
    toggleSimulationMode,
    togglePersonalizationPanel,
    toggleContextPanel,
    startDemo,
    exitDemo
  } = useEcosystemStore();

  return (
    <header className="h-20 border-b border-dark-700/50 bg-dark-900/80 backdrop-blur-md">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <HeartIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">
              Medical Buddy Ecosystem
            </h1>
            <p className="text-sm text-gray-400">
              Interactive Health AI Showcase Platform
            </p>
          </div>
        </div>

        {/* Current User Info */}
        {currentUser && (
          <div className="flex items-center space-x-3 px-4 py-2 bg-dark-800/50 rounded-lg border border-dark-700/50">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {currentUser.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{currentUser.name}</p>
              <p className="text-xs text-gray-400">
                {currentUser.age}y • {currentUser.medical_conditions || 'Healthy'}
              </p>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          {/* Demo Mode Toggle */}
          <motion.button
            onClick={isDemoMode ? exitDemo : startDemo}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
              ${isDemoMode 
                ? 'bg-warning text-dark-900' 
                : 'bg-dark-800 text-gray-300 hover:text-white hover:bg-dark-700'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <EyeIcon className="w-4 h-4" />
            <span>{isDemoMode ? 'Exit Demo' : 'Start Demo'}</span>
          </motion.button>

          {/* Simulation Mode Toggle */}
          <motion.button
            onClick={toggleSimulationMode}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
              ${isSimulationMode 
                ? 'bg-success text-dark-900' 
                : 'bg-dark-800 text-gray-300 hover:text-white hover:bg-dark-700'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSimulationMode ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
            <span>{isSimulationMode ? 'Stop Sim' : 'Start Sim'}</span>
          </motion.button>

          {/* AI Showcase Toggles */}
          <motion.button
            onClick={togglePersonalizationPanel}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${showPersonalizationPanel 
                ? 'bg-primary-500 text-white' 
                : 'bg-dark-800 text-gray-300 hover:text-white hover:bg-dark-700'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle Personalization Panel"
          >
            <ChartBarIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={toggleContextPanel}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${showContextPanel 
                ? 'bg-secondary-500 text-white' 
                : 'bg-dark-800 text-gray-300 hover:text-white hover:bg-dark-700'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle Context Panel"
          >
            <BeakerIcon className="w-5 h-5" />
          </motion.button>

          {/* Control Panel Toggle */}
          <motion.button
            onClick={toggleControlPanel}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${isControlPanelOpen 
                ? 'bg-warning text-dark-900' 
                : 'bg-dark-800 text-gray-300 hover:text-white hover:bg-dark-700'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle Control Panel"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};