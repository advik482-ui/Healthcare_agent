import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEcosystemStore } from '@/store/ecosystemStore';
import { ChatMessage, AIResponse, PersonalizationFactor } from '@/types/ecosystem';
import { personalizationFactors } from '@/data/mockData';
import { 
  PaperAirplaneIcon, 
  SparklesIcon,
  ChartBarIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export const AICompanionChat: React.FC = () => {
  const { 
    currentUser, 
    chatHistory, 
    addChatMessage, 
    clearChatHistory,
    setAIResponseAnalytics,
    showPersonalizationPanel,
    togglePersonalizationPanel
  } = useEcosystemStore();

  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const generateAIResponse = (userMessage: string): AIResponse => {
    // Simulate AI processing with personalization
    const relevantFactors = personalizationFactors.filter(f => f.weight > 0.7);
    
    let response = '';
    let responseType: AIResponse['response_type'] = 'general';
    
    // Analyze message for context
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
      responseType = 'symptom';
      response = `I understand you're experiencing pain, ${currentUser?.name}. Given your medical history of ${currentUser?.medical_conditions}, let's assess this carefully. Can you describe the pain on a scale of 1-10 and tell me where exactly you're feeling it?`;
    } else if (lowerMessage.includes('medication') || lowerMessage.includes('pill')) {
      responseType = 'medication';
      response = `Regarding your medications, ${currentUser?.name}, I see you're currently managing ${currentUser?.medical_conditions}. It's important to maintain consistency with your medication schedule. Are you having any issues with adherence or side effects?`;
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      responseType = 'emergency';
      response = `This sounds urgent, ${currentUser?.name}. Given your medical history, I recommend contacting your healthcare provider immediately. Your emergency contact is ${currentUser?.emergency_contact}. Should I help you with next steps?`;
    } else {
      responseType = 'personalized';
      response = `Hello ${currentUser?.name}! I've been monitoring your health data, and I notice your recent ${currentUser?.activity_level} activity level. Based on your profile showing ${currentUser?.medical_conditions}, I'm here to provide personalized guidance. How are you feeling today?`;
    }

    return {
      message: response,
      personalization_factors: relevantFactors,
      context_used: [
        'User medical history',
        'Current medications',
        'Recent symptoms',
        'Activity patterns',
        'Demographic factors'
      ],
      confidence: 0.85,
      response_type: responseType
    };
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser) return;

    // Add user message
    const userMessage: Omit<ChatMessage, 'id'> = {
      sender: 'user',
      message: message.trim(),
      timestamp: new Date()
    };
    addChatMessage(userMessage);

    // Clear input
    setMessage('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      
      // Add AI message
      const aiMessage: Omit<ChatMessage, 'id'> = {
        sender: 'ai',
        message: aiResponse.message,
        timestamp: new Date(),
        context: {
          data_used: aiResponse.context_used,
          personalization_factors: aiResponse.personalization_factors.map(f => f.factor),
          confidence: aiResponse.confidence
        }
      };
      addChatMessage(aiMessage);
      
      // Update analytics
      setAIResponseAnalytics(aiResponse);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageTypeColor = (message: ChatMessage) => {
    if (message.sender === 'user') return 'bg-primary-500';
    
    const context = message.context;
    if (!context) return 'bg-dark-700';
    
    if (context.confidence > 0.8) return 'bg-success/20 border-success/30';
    if (context.confidence > 0.6) return 'bg-warning/20 border-warning/30';
    return 'bg-error/20 border-error/30';
  };

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-xl h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-dark-700/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Health Companion</h3>
            <p className="text-xs text-gray-400">
              Personalized for {currentUser?.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`p-2 rounded-lg transition-colors ${showAnalytics ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}
            title="Toggle Analytics"
          >
            <ChartBarIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={togglePersonalizationPanel}
            className={`p-2 rounded-lg transition-colors ${showPersonalizationPanel ? 'bg-secondary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}
            title="Toggle Personalization Panel"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={clearChatHistory}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <HeartIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">
              Welcome to your AI Health Companion
            </h4>
            <p className="text-gray-400 text-sm">
              I'm here to provide personalized health guidance based on your complete medical profile.
              Ask me anything about your health, symptoms, medications, or wellness goals.
            </p>
          </div>
        )}

        <AnimatePresence>
          {chatHistory.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`
                    p-3 rounded-lg border
                    ${msg.sender === 'user' 
                      ? 'bg-primary-500 text-white' 
                      : getMessageTypeColor(msg)
                    }
                  `}
                >
                  <p className="text-sm">{msg.message}</p>
                  
                  {/* AI Message Analytics */}
                  {msg.sender === 'ai' && msg.context && showAnalytics && (
                    <div className="mt-3 pt-3 border-t border-dark-600/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">AI Confidence</span>
                        <span className="text-xs text-white">
                          {(msg.context.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-dark-600 rounded-full h-1">
                        <div 
                          className="bg-primary-400 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${msg.context.confidence * 100}%` }}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-1">Data Sources:</p>
                        <div className="flex flex-wrap gap-1">
                          {msg.context.data_used.slice(0, 3).map((source, idx) => (
                            <span key={idx} className="text-xs bg-dark-600 px-2 py-1 rounded">
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-400 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-dark-700 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dark-700/50">
        <div className="flex space-x-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your health, symptoms, medications..."
            className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isTyping}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};