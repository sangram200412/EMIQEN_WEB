import { PRODUCT_CONFIG } from '../config/product';

export interface HealthCheckResult {
  isConnected: boolean;
  statusText: 'CONNECTED' | 'DEMO MODE' | 'OFFLINE';
  latencyMs: number | null;
  serverInfo?: {
    serviceName?: string;
    version?: string;
    uptime?: number;
  };
}

export interface ChatResponsePayload {
  transcript: string;
  response: string;
  emotionDetected: string;
  confidence: number;
  isBackendGenerated: boolean;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = PRODUCT_CONFIG.backendApiUrl;
  }

  async checkHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Math.round(performance.now() - startTime);

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          isConnected: true,
          statusText: 'CONNECTED',
          latencyMs,
          serverInfo: data,
        };
      } else {
        return {
          isConnected: false,
          statusText: 'DEMO MODE',
          latencyMs: null,
        };
      }
    } catch {
      // Backend not running or blocked by CORS — graceful fallback to demo mode
      return {
        isConnected: false,
        statusText: 'DEMO MODE',
        latencyMs: null,
      };
    }
  }

  async processConversationalQuery(queryText: string): Promise<ChatResponsePayload> {
    // Attempt backend call first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          transcript: queryText,
          response: data.response || 'Acknowledged by backend.',
          emotionDetected: data.emotion || 'Neutral',
          confidence: data.confidence || 0.95,
          isBackendGenerated: true,
        };
      }
    } catch {
      // Fall through to deterministic demo pipeline
    }

    // Deterministic, realistic simulated demo responses
    const lower = queryText.toLowerCase();
    let responseText = "I've analyzed your question through the domain-specific small language model pipeline. The context indicates a general inquiry about our architecture.";
    let emotion = 'Curious';
    let confidence = 0.92;

    if (lower.includes('bro') || lower.includes('simple') || lower.includes('explain')) {
      responseText = "Sure! In simple words: EMIQEN-SLM is a specialized small language model optimized for conversational speech. Instead of carrying huge parameters, it focuses on fast voice understanding and local domain context.";
      emotion = 'Curious';
      confidence = 0.94;
    } else if (lower.includes('yaar') || lower.includes('scene') || lower.includes('error') || lower.includes('problem')) {
      responseText = "Understood. That sounds like a connection or runtime issue. The pipeline is currently running in local demonstration mode, so make sure your backend server is active if you want live endpoint inference.";
      emotion = 'Frustrated';
      confidence = 0.88;
    } else if (lower.includes('latency') || lower.includes('speed') || lower.includes('fast')) {
      responseText = "EMIQEN-SLM targets conversational turn-around times suitable for real-time speech. Since it is a small model, token processing runs with minimal compute overhead.";
      emotion = 'Neutral';
      confidence = 0.95;
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      responseText = "Hello! I am EMIQEN-SLM. I listen, analyze contextual nuances, and generate direct voice responses. Ask me anything about voice architecture, small language models, or try speaking in natural conversational phrasing.";
      emotion = 'Constructive';
      confidence = 0.96;
    } else if (lower.includes('emotion') || lower.includes('feel')) {
      responseText = "Our emotion intelligence layer evaluates acoustic signals like pitch variance and cadence velocity alongside conversational markers to help guide empathetic responses without assuming absolute human states.";
      emotion = 'Constructive';
      confidence = 0.91;
    } else {
      responseText = `Understood: "${queryText}". The EMIQEN reasoning pipeline processed your prompt through the domain context buffer and generated this contextual response.`;
    }

    return {
      transcript: queryText,
      response: responseText,
      emotionDetected: emotion,
      confidence,
      isBackendGenerated: false,
    };
  }
}

export const apiService = new ApiService();
