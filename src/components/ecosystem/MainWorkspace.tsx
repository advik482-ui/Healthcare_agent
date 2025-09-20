import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { HealthProfileCard } from './workspace/HealthProfileCard';
import { AICompanionChat } from './workspace/AICompanionChat';
import { AlertsRemindersCard } from './workspace/AlertsRemindersCard';
import { HealthMetricsChart } from './workspace/HealthMetricsChart';
import { SymptomTracker } from './workspace/SymptomTracker';
import { MedicationManager } from './workspace/MedicationManager';
import { NotificationCenter } from './workspace/NotificationCenter';
import { EmergencyPanel } from './workspace/EmergencyPanel';
import { 
  HeartIcon, 
  ChatBubbleLeftRightIcon, 
  BellIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

export const MainWorkspace: React.FC = () => {
  const { currentUser, isSimulationMode } = useEcosystemStore();
  const [activeView, setActiveView] = useState<'overview' | 'chat' | 'metrics' | 'emergency'>('overview');

  const views = [
    { id: 'overview', name: 'Overview', icon: HeartIcon },
    { id: 'chat', name: 'AI Companion', icon: ChatBubbleLeftRightIcon },
    { id: 'metrics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'emergency', name: 'Emergency', icon: ShieldExclamationIcon }
  ];

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Patient Selected</h3>
          <p className="text-gray-400">Please select a patient from the sidebar to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* View Tabs */}
      <div className="border-b border-dark-700/50 bg-dark-900/30 backdrop-blur-sm">
        <div className="flex items-center px-6 py-4">
          <div className="flex space-x-1 bg-dark-800/50 p-1 rounded-lg">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as any)}
                className={`
                  flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200
                  ${activeView === view.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }
                `}
              >
                <view.icon className="w-5 h-5 mr-2" />
                {view.name}
              </button>
            ))}
          </div>

          {/* Simulation Status */}
          {isSimulationMode && (
            <div className="ml-auto flex items-center space-x-2 px-3 py-1 bg-success/20 text-success rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-medium">Live Simulation</span>
            </div>
          )}
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-1 space-y-6">
                <HealthProfileCard />
                <AlertsRemindersCard />
              </div>

              {/* Middle Column */}
              <div className="lg:col-span-1 space-y-6">
                <SymptomTracker />
                <MedicationManager />
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 space-y-6">
                <NotificationCenter />
                <HealthMetricsChart />
              </div>
            </div>
          )}

          {activeView === 'chat' && (
            <div className="max-w-4xl mx-auto">
              <AICompanionChat />
            </div>
          )}

          {activeView === 'metrics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <HealthMetricsChart expanded />
              </div>
              <SymptomTracker expanded />
              <MedicationManager expanded />
            </div>
          )}

          {activeView === 'emergency' && (
            <div className="max-w-2xl mx-auto">
              <EmergencyPanel />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};