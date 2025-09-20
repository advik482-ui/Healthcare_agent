import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { healthScenarios } from '@/data/mockData';
import { HealthScenario } from '@/types/ecosystem';
import { 
  BeakerIcon, 
  PlayIcon, 
  StopIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  UserIcon,
  FireIcon
} from '@heroicons/react/24/outline';

export const ControlPanel: React.FC = () => {
  const { 
    selectedScenario,
    timelinePosition,
    isSimulationMode,
    setSelectedScenario,
    setTimelinePosition,
    applyScenario,
    resetToBaseline
  } = useEcosystemStore();

  const [activeTab, setActiveTab] = useState<'scenarios' | 'timeline' | 'data'>('scenarios');

  const getScenarioIcon = (category: string) => {
    switch (category) {
      case 'crisis': return ExclamationTriangleIcon;
      case 'chronic': return HeartIcon;
      case 'lifestyle': return UserIcon;
      case 'medication': return BeakerIcon;
      case 'emergency': return FireIcon;
      default: return BeakerIcon;
    }
  };

  const getScenarioColor = (category: string) => {
    switch (category) {
      case 'crisis': return 'text-error bg-error/20 border-error/30';
      case 'chronic': return 'text-warning bg-warning/20 border-warning/30';
      case 'lifestyle': return 'text-success bg-success/20 border-success/30';
      case 'medication': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'emergency': return 'text-red-500 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const tabs = [
    { id: 'scenarios', name: 'Scenarios', icon: BeakerIcon },
    { id: 'timeline', name: 'Timeline', icon: ClockIcon },
    { id: 'data', name: 'Live Data', icon: HeartIcon }
  ];

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white">
          Control Panel
        </h2>
        <div className="flex items-center space-x-2">
          {isSimulationMode ? (
            <div className="flex items-center space-x-2 text-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm">Live</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="text-sm">Paused</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-dark-700/50 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-600'
              }
            `}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'scenarios' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Health Scenarios</h3>
              <button
                onClick={resetToBaseline}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Reset All
              </button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {healthScenarios.map((scenario) => {
                const Icon = getScenarioIcon(scenario.category);
                const isSelected = selectedScenario?.id === scenario.id;
                
                return (
                  <motion.div
                    key={scenario.id}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'bg-primary-500/20 border-primary-500/50' 
                        : 'bg-dark-700/30 border-dark-600/50 hover:bg-dark-600/50'
                      }
                    `}
                    onClick={() => setSelectedScenario(scenario)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded ${getScenarioColor(scenario.category)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {scenario.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {scenario.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {selectedScenario && (
              <motion.div
                className="p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-primary-300">
                    {selectedScenario.name}
                  </h4>
                  <button
                    onClick={() => applyScenario(selectedScenario)}
                    className="px-3 py-1 bg-primary-500 text-white text-xs rounded-md hover:bg-primary-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-300">
                  {selectedScenario.description}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Health Timeline</h3>
              <span className="text-xs text-gray-400">
                {timelinePosition}% of history
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={timelinePosition}
                  onChange={(e) => setTimelinePosition(Number(e.target.value))}
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>6 months ago</span>
                  <span>3 months ago</span>
                  <span>Today</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setTimelinePosition(25)}
                  className="p-2 bg-dark-700 text-gray-300 rounded hover:bg-dark-600 transition-colors"
                >
                  6M Ago
                </button>
                <button
                  onClick={() => setTimelinePosition(50)}
                  className="p-2 bg-dark-700 text-gray-300 rounded hover:bg-dark-600 transition-colors"
                >
                  3M Ago
                </button>
                <button
                  onClick={() => setTimelinePosition(100)}
                  className="p-2 bg-dark-700 text-gray-300 rounded hover:bg-dark-600 transition-colors"
                >
                  Today
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Live Data Controls</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Heart Rate</label>
                <input
                  type="range"
                  min="50"
                  max="120"
                  defaultValue="72"
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>50</span>
                  <span>72 BPM</span>
                  <span>120</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Blood Pressure</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Systolic"
                    className="px-2 py-1 bg-dark-700 border border-dark-600 rounded text-white text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Diastolic"
                    className="px-2 py-1 bg-dark-700 border border-dark-600 rounded text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Mood</label>
                <select className="w-full px-2 py-1 bg-dark-700 border border-dark-600 rounded text-white text-xs">
                  <option>Great</option>
                  <option>Good</option>
                  <option>Okay</option>
                  <option>Poor</option>
                  <option>Terrible</option>
                </select>
              </div>

              <button className="w-full px-3 py-2 bg-success text-white text-xs rounded-md hover:bg-success/80 transition-colors">
                Update Live Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};