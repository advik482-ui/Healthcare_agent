import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { personalizationFactors } from '@/data/mockData';
import { 
  SparklesIcon, 
  ChartBarIcon,
  EyeIcon,
  BeakerIcon,
  BrainIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export const AIShowcasePanel: React.FC = () => {
  const { 
    currentUser, 
    aiResponseAnalytics,
    showPersonalizationPanel,
    showContextPanel,
    togglePersonalizationPanel,
    toggleContextPanel
  } = useEcosystemStore();

  const [activeTab, setActiveTab] = useState<'personalization' | 'context' | 'analytics'>('personalization');

  const tabs = [
    { id: 'personalization', name: 'Personalization', icon: SparklesIcon },
    { id: 'context', name: 'Context', icon: EyeIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
  ];

  const mockContextData = [
    { source: 'Medical History', data: currentUser?.medical_conditions || 'None', weight: 0.9 },
    { source: 'Current Medications', data: 'Metformin, Lisinopril', weight: 0.85 },
    { source: 'Recent Symptoms', data: 'Headache (mild), Fatigue (moderate)', weight: 0.8 },
    { source: 'Vital Signs', data: `HR: ${currentUser?.avg_heart_rate}, BP: ${currentUser?.avg_blood_pressure}`, weight: 0.75 },
    { source: 'Activity Level', data: currentUser?.activity_level || 'Unknown', weight: 0.7 },
    { source: 'Sleep Pattern', data: `${currentUser?.avg_sleep_hours}h average`, weight: 0.65 }
  ];

  const mockAnalytics = {
    responseTime: '1.2s',
    confidence: 0.87,
    dataSourcesUsed: 6,
    personalizationScore: 0.92,
    contextRelevance: 0.89,
    userSatisfaction: 0.94
  };

  return (
    <div className="h-full bg-dark-900/50 backdrop-blur-sm p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white flex items-center">
          <BrainIcon className="w-5 h-5 mr-2" />
          AI Showcase
        </h2>
        <div className="flex items-center space-x-1">
          <button
            onClick={togglePersonalizationPanel}
            className={`p-1 rounded ${showPersonalizationPanel ? 'bg-primary-500 text-white' : 'text-gray-400'}`}
          >
            <SparklesIcon className="w-4 h-4" />
          </button>
          <button
            onClick={toggleContextPanel}
            className={`p-1 rounded ${showContextPanel ? 'bg-secondary-500 text-white' : 'text-gray-400'}`}
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-dark-800/50 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }
            `}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'personalization' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <SparklesIcon className="w-5 h-5 text-primary-400" />
              <h3 className="font-medium text-white">Personalization Factors</h3>
            </div>
            
            <div className="space-y-3">
              {personalizationFactors.map((factor, index) => (
                <motion.div
                  key={factor.factor}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-dark-800/50 rounded-lg border border-dark-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{factor.factor}</h4>
                    <span className="text-xs text-primary-400 font-medium">
                      {(factor.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-dark-700 rounded-full h-2 mb-2">
                    <motion.div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.weight * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-1">{factor.description}</p>
                  <p className="text-xs text-gray-500">Source: {factor.data_source}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <LightBulbIcon className="w-4 h-4 text-primary-400" />
                <h4 className="text-sm font-medium text-primary-300">AI Insight</h4>
              </div>
              <p className="text-xs text-gray-300">
                The AI is using {personalizationFactors.length} personalization factors to tailor responses 
                specifically for {currentUser?.name}. High-weight factors like medical history and current 
                medications have the strongest influence on response generation.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'context' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <EyeIcon className="w-5 h-5 text-secondary-400" />
              <h3 className="font-medium text-white">Context Awareness</h3>
            </div>
            
            <div className="space-y-3">
              {mockContextData.map((context, index) => (
                <motion.div
                  key={context.source}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-dark-800/50 rounded-lg border border-dark-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{context.source}</h4>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        context.weight > 0.8 ? 'bg-success' : 
                        context.weight > 0.6 ? 'bg-warning' : 'bg-error'
                      }`} />
                      <span className="text-xs text-gray-400">
                        {(context.weight * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300">{context.data}</p>
                  
                  <div className="mt-2 w-full bg-dark-700 rounded-full h-1">
                    <motion.div 
                      className={`h-1 rounded-full ${
                        context.weight > 0.8 ? 'bg-success' : 
                        context.weight > 0.6 ? 'bg-warning' : 'bg-error'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${context.weight * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-secondary-500/10 border border-secondary-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BeakerIcon className="w-4 h-4 text-secondary-400" />
                <h4 className="text-sm font-medium text-secondary-300">Context Analysis</h4>
              </div>
              <p className="text-xs text-gray-300">
                The AI maintains awareness of {mockContextData.length} different data sources to provide 
                contextually relevant responses. Real-time data integration ensures responses are based 
                on the most current health information.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <ChartBarIcon className="w-5 h-5 text-warning" />
              <h3 className="font-medium text-white">Response Analytics</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-dark-800/50 rounded-lg text-center">
                <p className="text-lg font-semibold text-white">{mockAnalytics.responseTime}</p>
                <p className="text-xs text-gray-400">Response Time</p>
              </div>
              
              <div className="p-3 bg-dark-800/50 rounded-lg text-center">
                <p className="text-lg font-semibold text-success">
                  {(mockAnalytics.confidence * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-400">Confidence</p>
              </div>
              
              <div className="p-3 bg-dark-800/50 rounded-lg text-center">
                <p className="text-lg font-semibold text-primary-400">{mockAnalytics.dataSourcesUsed}</p>
                <p className="text-xs text-gray-400">Data Sources</p>
              </div>
              
              <div className="p-3 bg-dark-800/50 rounded-lg text-center">
                <p className="text-lg font-semibold text-secondary-400">
                  {(mockAnalytics.personalizationScore * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-400">Personalization</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-dark-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Context Relevance</span>
                  <span className="text-sm text-white">
                    {(mockAnalytics.contextRelevance * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${mockAnalytics.contextRelevance * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              <div className="p-3 bg-dark-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">User Satisfaction</span>
                  <span className="text-sm text-white">
                    {(mockAnalytics.userSatisfaction * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <motion.div 
                    className="bg-success h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${mockAnalytics.userSatisfaction * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>

            {aiResponseAnalytics && (
              <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                <h4 className="text-sm font-medium text-warning mb-2">Latest Response Analysis</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response Type:</span>
                    <span className="text-white capitalize">{aiResponseAnalytics.response_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confidence:</span>
                    <span className="text-white">{(aiResponseAnalytics.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Factors Used:</span>
                    <span className="text-white">{aiResponseAnalytics.personalization_factors.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};