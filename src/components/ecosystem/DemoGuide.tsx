import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { 
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const demoSteps = [
  {
    title: "Welcome to Medical Buddy Ecosystem",
    description: "This interactive platform showcases our AI-powered health management system. You can test all features with real-time data manipulation.",
    highlight: "header",
    position: "center"
  },
  {
    title: "Select a Patient Profile",
    description: "Choose from different patient personas to see how the AI personalizes responses based on medical history, conditions, and demographics.",
    highlight: "user-selector",
    position: "left"
  },
  {
    title: "Control Panel",
    description: "Use the control panel to inject health scenarios, manipulate timeline data, and test AI responses in real-time.",
    highlight: "control-panel",
    position: "left"
  },
  {
    title: "AI Companion Chat",
    description: "Interact with the AI health companion. Notice how responses are personalized based on the selected patient's complete health profile.",
    highlight: "ai-chat",
    position: "center"
  },
  {
    title: "Health Data Tracking",
    description: "Monitor symptoms, medications, and health metrics. All data is used by the AI to provide contextual health guidance.",
    highlight: "health-cards",
    position: "center"
  },
  {
    title: "AI Personalization Panel",
    description: "View how the AI makes decisions. See personalization factors, context awareness, and response analytics in real-time.",
    highlight: "ai-showcase",
    position: "right"
  },
  {
    title: "Simulation Mode",
    description: "Enable simulation mode to see live data updates and test how the AI responds to changing health conditions.",
    highlight: "simulation-toggle",
    position: "top"
  }
];

export const DemoGuide: React.FC = () => {
  const { demoStep, nextDemoStep, exitDemo } = useEcosystemStore();

  const currentStep = demoSteps[demoStep];
  const isLastStep = demoStep === demoSteps.length - 1;

  if (!currentStep) {
    return null;
  }

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'left':
        return 'left-8 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'right-8 top-1/2 transform -translate-y-1/2';
      case 'top':
        return 'top-8 left-1/2 transform -translate-x-1/2';
      case 'center':
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      {/* Spotlight Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/60" />
      
      {/* Demo Card */}
      <motion.div
        className={`absolute w-96 bg-dark-800/95 backdrop-blur-md border border-dark-700/50 rounded-2xl p-6 ${getPositionClasses(currentStep.position)}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <EyeIcon className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-primary-400 font-medium">
              Demo Guide ({demoStep + 1}/{demoSteps.length})
            </span>
          </div>
          <button
            onClick={exitDemo}
            className="p-1 text-gray-400 hover:text-white hover:bg-dark-700 rounded transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-lg font-display font-semibold text-white mb-3">
            {currentStep.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(((demoStep + 1) / demoSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((demoStep + 1) / demoSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={exitDemo}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            Skip Demo
          </button>
          
          <div className="flex items-center space-x-2">
            {demoStep > 0 && (
              <button
                onClick={() => useEcosystemStore.setState({ demoStep: demoStep - 1 })}
                className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={isLastStep ? exitDemo : nextDemoStep}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
            >
              <span>{isLastStep ? 'Finish Demo' : 'Next'}</span>
              {!isLastStep && <ArrowRightIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Step Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2">
          {demoSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => useEcosystemStore.setState({ demoStep: index })}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === demoStep 
                  ? 'bg-primary-500 scale-125' 
                  : index < demoStep 
                    ? 'bg-primary-400/50' 
                    : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Highlight Overlay */}
      <AnimatePresence>
        {currentStep.highlight && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* This would highlight specific UI elements based on currentStep.highlight */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};