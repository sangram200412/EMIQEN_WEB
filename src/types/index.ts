export type IntelligenceState = 'idle' | 'listening' | 'analyzing' | 'generating' | 'speaking';

export interface PipelineStage {
  id: string;
  number: string;
  title: string;
  category: string;
  shortDescription: string;
  fullPurpose: string;
  inputExample: string;
  outputExample: string;
  configuredTech: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'emiqen';
  text: string;
  timestamp: string;
  emotionDetected?: string;
  confidence?: number;
  audioDuration?: number;
}

export interface EmotionScenario {
  id: string;
  title: string;
  phrase: string;
  detectedEmotion: 'Frustrated' | 'Curious' | 'Urgent' | 'Neutral' | 'Constructive';
  confidence: number;
  acousticIndicators: {
    pitchVariance: string;
    cadenceSpeed: string;
    stressMarkers: string;
    energyDecibels: string;
  };
  contextualResponse: string;
  slmStrategy: string;
}

export interface IndiaConversationExample {
  id: string;
  tag: string;
  inputPhrase: string;
  literalInterpretation: string;
  emiqenContextualResponse: string;
  linguisticMarkers: string[];
  tokensBreakdown: { token: string; type: 'colloquial' | 'intent' | 'modifier' | 'domain' }[];
  contextExplanation: string;
}

export interface ModelTokenFlow {
  step: number;
  label: string;
  sublabel: string;
  description: string;
  technicalDetails: string;
  activeNodes: number;
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  layer: 'Capture' | 'Analysis' | 'Reasoning' | 'Synthesis';
  responsibility: string;
  configuredTechnology: string;
  inputFormat: string;
  outputFormat: string;
  status: 'CONNECTED' | 'AVAILABLE' | 'DEMO MODE' | 'NOT CONFIGURED';
  details: string;
}

export interface SystemStatusData {
  backendConnected: boolean;
  endpointUrl: string;
  speechProcessing: 'AVAILABLE' | 'DEMO MODE' | 'OFFLINE';
  slmInference: 'AVAILABLE' | 'DEMO MODE' | 'OFFLINE';
  emotionAnalysis: 'AVAILABLE' | 'DEMO MODE' | 'OFFLINE';
  voiceGeneration: 'AVAILABLE' | 'DEMO MODE' | 'OFFLINE';
  lastPingMs: number | null;
  activeState: IntelligenceState;
  modelParams: string;
}
