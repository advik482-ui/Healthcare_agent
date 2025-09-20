import { create } from 'zustand';
import { User, HealthMetric, Symptom, Medication, Notification, Alert, ChatMessage, HealthScenario } from '@/types/ecosystem';

interface EcosystemState {
  // Current User & Data
  currentUser: User | null;
  users: User[];
  healthMetrics: HealthMetric[];
  symptoms: Symptom[];
  medications: Medication[];
  notifications: Notification[];
  alerts: Alert[];
  chatHistory: ChatMessage[];
  
  // Control Panel State
  isControlPanelOpen: boolean;
  selectedScenario: HealthScenario | null;
  isSimulationMode: boolean;
  timelinePosition: number; // 0-100 percentage
  
  // AI Showcase State
  showPersonalizationPanel: boolean;
  showContextPanel: boolean;
  aiResponseAnalytics: any;
  
  // Demo Mode
  isDemoMode: boolean;
  demoStep: number;
  
  // Actions
  setCurrentUser: (user: User) => void;
  updateUserData: (updates: Partial<User>) => void;
  addHealthMetric: (metric: Omit<HealthMetric, 'metric_id'>) => void;
  updateHealthMetric: (id: number, updates: Partial<HealthMetric>) => void;
  addSymptom: (symptom: Omit<Symptom, 'symptom_id'>) => void;
  removeSymptom: (id: number) => void;
  addMedication: (medication: Omit<Medication, 'user_med_id'>) => void;
  updateMedication: (id: number, updates: Partial<Medication>) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id'>) => void;
  clearChatHistory: () => void;
  
  // Control Panel Actions
  toggleControlPanel: () => void;
  setSelectedScenario: (scenario: HealthScenario | null) => void;
  toggleSimulationMode: () => void;
  setTimelinePosition: (position: number) => void;
  
  // AI Showcase Actions
  togglePersonalizationPanel: () => void;
  toggleContextPanel: () => void;
  setAIResponseAnalytics: (analytics: any) => void;
  
  // Demo Actions
  startDemo: () => void;
  nextDemoStep: () => void;
  exitDemo: () => void;
  
  // Scenario Actions
  applyScenario: (scenario: HealthScenario) => void;
  resetToBaseline: () => void;
}

export const useEcosystemStore = create<EcosystemState>((set, get) => ({
  // Initial State
  currentUser: null,
  users: [],
  healthMetrics: [],
  symptoms: [],
  medications: [],
  notifications: [],
  alerts: [],
  chatHistory: [],
  
  isControlPanelOpen: false,
  selectedScenario: null,
  isSimulationMode: false,
  timelinePosition: 100,
  
  showPersonalizationPanel: false,
  showContextPanel: false,
  aiResponseAnalytics: null,
  
  isDemoMode: false,
  demoStep: 0,
  
  // User Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  
  updateUserData: (updates) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
    users: state.users.map(u => 
      u.user_id === state.currentUser?.user_id ? { ...u, ...updates } : u
    )
  })),
  
  addHealthMetric: (metric) => set((state) => ({
    healthMetrics: [...state.healthMetrics, { 
      ...metric, 
      metric_id: Date.now() 
    }]
  })),
  
  updateHealthMetric: (id, updates) => set((state) => ({
    healthMetrics: state.healthMetrics.map(m => 
      m.metric_id === id ? { ...m, ...updates } : m
    )
  })),
  
  addSymptom: (symptom) => set((state) => ({
    symptoms: [...state.symptoms, { 
      ...symptom, 
      symptom_id: Date.now() 
    }]
  })),
  
  removeSymptom: (id) => set((state) => ({
    symptoms: state.symptoms.filter(s => s.symptom_id !== id)
  })),
  
  addMedication: (medication) => set((state) => ({
    medications: [...state.medications, { 
      ...medication, 
      user_med_id: Date.now() 
    }]
  })),
  
  updateMedication: (id, updates) => set((state) => ({
    medications: state.medications.map(m => 
      m.user_med_id === id ? { ...m, ...updates } : m
    )
  })),
  
  addChatMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, { 
      ...message, 
      id: Date.now().toString() 
    }]
  })),
  
  clearChatHistory: () => set({ chatHistory: [] }),
  
  // Control Panel Actions
  toggleControlPanel: () => set((state) => ({ 
    isControlPanelOpen: !state.isControlPanelOpen 
  })),
  
  setSelectedScenario: (scenario) => set({ selectedScenario: scenario }),
  
  toggleSimulationMode: () => set((state) => ({ 
    isSimulationMode: !state.isSimulationMode 
  })),
  
  setTimelinePosition: (position) => set({ timelinePosition: position }),
  
  // AI Showcase Actions
  togglePersonalizationPanel: () => set((state) => ({ 
    showPersonalizationPanel: !state.showPersonalizationPanel 
  })),
  
  toggleContextPanel: () => set((state) => ({ 
    showContextPanel: !state.showContextPanel 
  })),
  
  setAIResponseAnalytics: (analytics) => set({ aiResponseAnalytics: analytics }),
  
  // Demo Actions
  startDemo: () => set({ isDemoMode: true, demoStep: 0 }),
  
  nextDemoStep: () => set((state) => ({ 
    demoStep: Math.min(state.demoStep + 1, 6) // Max 7 steps (0-6)
  })),
  
  exitDemo: () => set({ isDemoMode: false, demoStep: 0 }),
  
  // Scenario Actions
  applyScenario: (scenario) => {
    const state = get();
    const { data_changes } = scenario;
    
    // Add notification about scenario application
    const scenarioNotification = {
      notification_id: Date.now(),
      user_id: state.currentUser?.user_id || 1,
      title: `Scenario Applied: ${scenario.name}`,
      message: `Testing scenario: ${scenario.description}`,
      notification_type: 'scenario',
      is_read: false,
      created_at: new Date().toISOString()
    };
    
    set({
      selectedScenario: scenario,
      notifications: [scenarioNotification, ...state.notifications],
      symptoms: data_changes.symptoms ? 
        [...state.symptoms, ...data_changes.symptoms.map(s => ({ 
          ...s, 
          symptom_id: Date.now() + Math.random(),
          user_id: state.currentUser?.user_id || 1,
          log_date: new Date().toISOString()
        } as Symptom))] : state.symptoms,
      
      healthMetrics: data_changes.metrics ? 
        [...state.healthMetrics, ...data_changes.metrics.map(m => ({ 
          ...m, 
          metric_id: Date.now() + Math.random(),
          user_id: state.currentUser?.user_id || 1,
          date: new Date().toISOString().split('T')[0]
        } as HealthMetric))] : state.healthMetrics,
      
      currentUser: data_changes.profile_updates && state.currentUser ? 
        { ...state.currentUser, ...data_changes.profile_updates } : state.currentUser
    });
  },
  
  resetToBaseline: () => set({
    selectedScenario: null,
    symptoms: [],
    // Keep some data for continuity
    timelinePosition: 100,
    // Clear AI analytics
    aiResponseAnalytics: null
  })
}));