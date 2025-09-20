'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { mockUsers } from '@/data/mockData';
import { EcosystemHeader } from '@/components/ecosystem/EcosystemHeader';
import { UserSelector } from '@/components/ecosystem/UserSelector';
import { ControlPanel } from '@/components/ecosystem/ControlPanel';
import { MainWorkspace } from '@/components/ecosystem/MainWorkspace';
import { AIShowcasePanel } from '@/components/ecosystem/AIShowcasePanel';
import { DemoGuide } from '@/components/ecosystem/DemoGuide';
import { RealTimeDataStream } from '@/components/ecosystem/RealTimeDataStream';

export default function EcosystemPage() {
  const { 
    currentUser, 
    users, 
    setCurrentUser, 
    isDemoMode,
    isControlPanelOpen,
    showPersonalizationPanel,
    showContextPanel
  } = useEcosystemStore();

  useEffect(() => {
    // Initialize with mock data
    if (users.length === 0) {
      useEcosystemStore.setState({ users: mockUsers });
    }
    
    // Set default user if none selected
    if (!currentUser && mockUsers.length > 0) {
      setCurrentUser(mockUsers[0]);
    }
  }, [currentUser, setCurrentUser, users.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,212,0.1),transparent_50%)] pointer-events-none" />
      
      {/* Demo Guide Overlay */}
      {isDemoMode && <DemoGuide />}
      
      {/* Main Layout */}
      <div className="relative z-10">
        {/* Header */}
        <EcosystemHeader />
        
        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Sidebar - User & Controls */}
          <div className="w-80 border-r border-dark-700/50 bg-dark-900/50 backdrop-blur-sm">
            <div className="p-6 space-y-6">
              <UserSelector />
              {isControlPanelOpen && <ControlPanel />}
            </div>
          </div>
          
          {/* Main Workspace */}
          <div className="flex-1 flex">
            <div className="flex-1">
              <MainWorkspace />
            </div>
            
            {/* Right Sidebar - AI Showcase */}
            {(showPersonalizationPanel || showContextPanel) && (
              <motion.div
                className="w-96 border-l border-dark-700/50 bg-dark-900/50 backdrop-blur-sm"
                initial={{ x: 384 }}
                animate={{ x: 0 }}
                exit={{ x: 384 }}
                transition={{ duration: 0.3 }}
              >
                <AIShowcasePanel />
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Bottom Data Stream */}
        <RealTimeDataStream />
      </div>
    </div>
  );
}