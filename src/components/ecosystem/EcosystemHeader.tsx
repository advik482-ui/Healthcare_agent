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
  BeakerIcon,
  SparklesIcon,
  CpuChipIcon
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
    <motion.header 
      className="h-20 border-b border-dark-700/50 bg-dark-900/90 backdrop-blur-md relative overflow-hidden"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5" />
      
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo & Title */}
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <HeartIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold gradient-text">
              Medical Buddy Ecosystem
            </h1>
            <p className="text-sm text-gray-400 flex items-center">
              <CpuChipIcon className="w-4 h-4 mr-1" />
              Interactive Health AI Showcase Platform
            </p>
          </div>
        </motion.div>

        {/* Current User Info */}
        {currentUser && (
          <motion.div 
            className="flex items-center space-x-3 px-4 py-2 bg-dark-800/60 rounded-xl border border-dark-700/50 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center shadow-md">
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
            {/* Status Indicator */}
            <div className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full ${isSimulationMode ? 'bg-success animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-xs text-gray-500 mt-1">
                {isSimulationMode ? 'Live' : 'Static'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Control Buttons */}
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Demo Mode Toggle */}
          <motion.button
            onClick={isDemoMode ? exitDemo : startDemo}
            className={`
              px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg
              ${isDemoMode 
                ? 'bg-warning text-dark-900 shadow-warning/25' 
                : 'bg-dark-800/60 text-gray-300 hover:text-white hover:bg-dark-700/80 backdrop-blur-sm'
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
              px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg
              ${isSimulationMode 
                ? 'bg-success text-dark-900 shadow-success/25' 
                : 'bg-dark-800/60 text-gray-300 hover:text-white hover:bg-dark-700/80 backdrop-blur-sm'
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
              p-2 rounded-xl transition-all duration-200 shadow-lg
              ${showPersonalizationPanel 
                ? 'bg-primary-500 text-white shadow-primary-500/25' 
                : 'bg-dark-800/60 text-gray-300 hover:text-white hover:bg-dark-700/80 backdrop-blur-sm'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle Personalization Panel"
          >
            <SparklesIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={toggleContextPanel}
            className={`
              p-2 rounded-xl transition-all duration-200 shadow-lg
              ${showContextPanel 
                ? 'bg-secondary-500 text-white shadow-secondary-500/25' 
                : 'bg-dark-800/60 text-gray-300 hover:text-white hover:bg-dark-700/80 backdrop-blur-sm'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle Context Panel"
          >
            <ChartBarIcon className="w-5 h-5" />
          </motion.button>

          {/* Control Panel Toggle */}
          <motion.button
            onClick={toggleControlPanel}
            className={`
              p-2 rounded-xl transition-all duration-200 shadow-lg
              ${isControlPanelOpen 
                ? 'bg-warning text-dark-900 shadow-warning/25' 
                : 'bg-dark-800/60 text-gray-300 hover:text-white hover:bg-dark-700/80 backdrop-blur-sm'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle Control Panel"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
};