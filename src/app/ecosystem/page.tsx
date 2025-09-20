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
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,245,212,0.15),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(138,43,226,0.1),transparent_50%)] pointer-events-none" />
      
      {/* Animated Grid Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>
      
      {/* Demo Guide Overlay */}
      {isDemoMode && <DemoGuide />}
      
      {/* Main Layout */}
      <div className="relative z-10">
        {/* Header */}
        <EcosystemHeader />
        
        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Sidebar - User & Controls */}
          <motion.div 
            className="w-80 border-r border-dark-700/50 bg-dark-900/60 backdrop-blur-md"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="p-6 space-y-6">
              <UserSelector />
              {isControlPanelOpen && <ControlPanel />}
            </div>
          </motion.div>
          
          {/* Main Workspace */}
          <div className="flex-1 flex">
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <MainWorkspace />
            </motion.div>
            
            {/* Right Sidebar - AI Showcase */}
            {(showPersonalizationPanel || showContextPanel) && (
              <motion.div
                className="w-96 border-l border-dark-700/50 bg-dark-900/60 backdrop-blur-md"
                initial={{ x: 384 }}
                animate={{ x: 0 }}
                exit={{ x: 384 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
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