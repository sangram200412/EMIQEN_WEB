import type { 
  PipelineStage, 
  EmotionScenario, 
  IndiaConversationExample, 
  ArchitectureComponent 
} from '../types';

export const PRODUCT_CONFIG = {
  name: 'EMIQEN-SLM',
  category: 'Domain-Specific Small Language Model & Voice AI Assistant',
  tagline: 'Intelligence That Listens. Understands. Responds.',
  eyebrow: 'EMIQEN-SLM / VOICE INTELLIGENCE SYSTEM',
  summary:
    'An intelligent voice AI system designed to process conversations, interpret emotional signals, understand context, and generate natural responses through a coordinated small language model pipeline.',
  version: '0.9.4-alpha',
  repoUrl: 'https://github.com/emiqen/emiqen-slm',
  backendApiUrl: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000',
  isDemoModeDefault: true,
  modelInfo: {
    architecture: 'Transformer-based Small Language Model (SLM)',
    purpose: 'Low-latency conversational inference and domain context adaptation',
    deploymentTarget: 'Edge & Hybrid Server',
    status: 'Demo Pipeline & Prototyping Mode',
  },
};

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'stage-1',
    number: '01',
    title: 'Voice Perception',
    category: 'Acoustic Processing',
    shortDescription: 'Captures raw audio streams and transcribes speech into structured textual tokens.',
    fullPurpose:
      'Continuous capture of conversational audio through browser or client microphones, performing noise reduction, spectral gating, and phoneme-to-text conversion.',
    inputExample: 'Raw PCM 16kHz audio buffer ("Bro, how does the caching layer work here?")',
    outputExample: 'Normalized token stream: { transcript: "Bro, how does the caching layer work here?", confidence: 0.96 }',
    configuredTech: 'Client Web Audio API / Whisper-Compatible ASR Pipeline',
    metrics: [
      { label: 'Sampling Rate', value: '16 kHz PCM' },
      { label: 'Ingestion Mode', value: 'Streaming Chunks' },
    ],
  },
  {
    id: 'stage-2',
    number: '02',
    title: 'Emotion Intelligence',
    category: 'Prosodic & Sentiment Signal',
    shortDescription: 'Extracts prosodic, acoustic, and textual cues to assess emotional inclination.',
    fullPurpose:
      'Evaluates pitch variability, cadence velocity, and conversational tone to provide context weights for the reasoning engine without treating inferences as definitive facts.',
    inputExample: 'Acoustic pitch flux + lexical markers ("Arre wait, it is failing again")',
    outputExample: 'Tone signal: { detected: "Urgent/Frustrated", confidence: 0.82, guidance: "De-escalate & prioritize solution" }',
    configuredTech: 'Acoustic Feature Extractor & Lexical Sentiment Classifier',
    metrics: [
      { label: 'Feature Extraction', value: 'Pitch, Cadence, Energy' },
      { label: 'Classification', value: 'Multi-indicator distribution' },
    ],
  },
  {
    id: 'stage-3',
    number: '03',
    title: 'Context Intelligence',
    category: 'Session & Memory State',
    shortDescription: 'Resolves conversation state, colloquial idioms, and dialogue references.',
    fullPurpose:
      'Maintains short-term dialogue buffers, parses contextual pronouns, and maps colloquial conversational phrases (such as Indian English and everyday expressions) to canonical query vectors.',
    inputExample: 'Previous turn: "API returned 504" | Current turn: "Kya scene hai?"',
    outputExample: 'Resolved query context: { intent: "TROUBLESHOOT_TIMEOUT", reference: "gateway_timeout_504" }',
    configuredTech: 'Contextual Vector Buffer & Dialogue State Tracker',
    metrics: [
      { label: 'Context Window', value: 'Multi-turn sliding buffer' },
      { label: 'Idiom Mapping', value: 'Colloquial phrase resolution' },
    ],
  },
  {
    id: 'stage-4',
    number: '04',
    title: 'EMIQEN Reasoning Engine',
    category: 'Domain-Specific SLM',
    shortDescription: 'Executes lightweight transformer inference tailored for swift, focused responses.',
    fullPurpose:
      'Directs the enriched context and intent into the domain-tuned small language model to synthesize succinct, accurate, and empathetic responses without excessive parameter overhead.',
    inputExample: 'Enriched Prompt: Context + Tone Guideline + Knowledge Domain Tokens',
    outputExample: 'Generated text: "The 504 means the upstream gateway timed out. Check your proxy keepalive settings first."',
    configuredTech: 'EMIQEN-SLM Domain Specialized Transformer Core',
    metrics: [
      { label: 'Architecture', value: 'Compact Autoregressive Transformer' },
      { label: 'Optimization', value: 'Low Latency Token Stream' },
    ],
  },
  {
    id: 'stage-5',
    number: '05',
    title: 'Voice Generation',
    category: 'Neural Text-to-Speech',
    shortDescription: 'Converts synthesized text into natural speech with appropriate prosody.',
    fullPurpose:
      'Renders the generated answer into an expressive audio stream matching the contextual pace and cadence of the dialogue, delivered back to the user.',
    inputExample: 'Text: "The 504 means the upstream gateway timed out."',
    outputExample: 'Synthesized audio wave buffer: 24kHz stream / Web Speech prosodic render',
    configuredTech: 'Web Speech Synthesis / Neural TTS Pipeline Endpoint',
    metrics: [
      { label: 'Audio Output', value: 'Realtime Audio Stream' },
      { label: 'Prosody Shaping', value: 'Dynamic Rate & Pitch' },
    ],
  },
];

export const EMOTION_SCENARIOS: EmotionScenario[] = [
  {
    id: 'scenario-urgent',
    title: 'Urgent / Blocked',
    phrase: 'Wait, the server is rejecting my audio packet! Why is this failing right now?',
    detectedEmotion: 'Urgent',
    confidence: 0.89,
    acousticIndicators: {
      pitchVariance: 'High (+38Hz)',
      cadenceSpeed: 'Rapid (185 wpm)',
      stressMarkers: 'Sharp syllable peaks',
      energyDecibels: '-14 dB RMS',
    },
    contextualResponse:
      'Checking your packet payload immediately. It looks like the buffer exceeded 10MB or header authorization expired. Let’s re-verify the auth token first.',
    slmStrategy: 'Direct resolution mode: Strip conversational padding; deliver immediate step-one diagnostics.',
  },
  {
    id: 'scenario-curious',
    title: 'Curious / Exploratory',
    phrase: 'Could you explain how the small language model handles domain tokens differently?',
    detectedEmotion: 'Curious',
    confidence: 0.94,
    acousticIndicators: {
      pitchVariance: 'Moderate (balanced inflections)',
      cadenceSpeed: 'Deliberate (130 wpm)',
      stressMarkers: 'Terminal rising question contour',
      energyDecibels: '-22 dB RMS',
    },
    contextualResponse:
      'Unlike massive generalist models, EMIQEN-SLM focuses its parameter budget on specialized domain vocabularies and task flows, giving you faster edge inference with minimal hallucination.',
    slmStrategy: 'Educational depth mode: Provide structured architectural insight with technical clarity.',
  },
  {
    id: 'scenario-frustrated',
    title: 'Frustrated / Disrupted',
    phrase: 'I have tried running the pipeline three times and nothing seems to update.',
    detectedEmotion: 'Frustrated',
    confidence: 0.84,
    acousticIndicators: {
      pitchVariance: 'Compressed lower pitch baseline',
      cadenceSpeed: 'Staccato bursts',
      stressMarkers: 'Heavy downbeats on negation',
      energyDecibels: '-18 dB RMS',
    },
    contextualResponse:
      'I understand this is frustrating. Let’s isolate this cleanly: are your background worker tasks running, or is the connection dropping at the handshake?',
    slmStrategy: 'Empathetic de-escalation: Acknowledge impediment; ask one targeted diagnostic question.',
  },
  {
    id: 'scenario-neutral',
    title: 'Neutral / Systematic',
    phrase: 'List the active components in the current orchestration layer.',
    detectedEmotion: 'Neutral',
    confidence: 0.97,
    acousticIndicators: {
      pitchVariance: 'Flat variance (<8Hz)',
      cadenceSpeed: 'Steady (142 wpm)',
      stressMarkers: 'Standard cadence pauses',
      energyDecibels: '-24 dB RMS',
    },
    contextualResponse:
      'Currently active: Voice Perception, Context Buffer, SLM Inference Engine, and the Audio Output Synthesizer.',
    slmStrategy: 'Concise retrieval mode: Output clean structured factual items.',
  },
];

export const INDIA_CONVERSATION_EXAMPLES: IndiaConversationExample[] = [
  {
    id: 'ex-1',
    tag: 'Casual Tech Query',
    inputPhrase: 'Bro, can you explain this in simple words?',
    literalInterpretation: 'Generic models might respond rigidly or ask for formal clarification of the term "bro".',
    emiqenContextualResponse:
      'Sure. I’ll explain it step by step using a simple example without the heavy jargon.',
    linguisticMarkers: ['"Bro" (colloquial familiarity)', 'Informal syntax', 'Request for pragmatic clarity'],
    tokensBreakdown: [
      { token: 'Bro,', type: 'colloquial' },
      { token: 'can you explain', type: 'intent' },
      { token: 'this', type: 'modifier' },
      { token: 'in simple words?', type: 'domain' },
    ],
    contextExplanation:
      'EMIQEN detects the informal conversational register instantly, skips artificial robotic formality, and adapts the response complexity down to fundamental conceptual steps.',
  },
  {
    id: 'ex-2',
    tag: 'Bilingual Hinglish Diagnostic',
    inputPhrase: 'Yaar, EMIQEN is not connecting to my local endpoint, kya scene hai?',
    literalInterpretation: 'Literal translation fails on "kya scene hai" (what is the scene) and misses the diagnostic urgency.',
    emiqenContextualResponse:
      'Looks like the local FastAPI service on port 8000 might not be running or CORS is blocking the origin. Let’s check if your server script is active.',
    linguisticMarkers: ['"Yaar" (friendly frustration)', '"kya scene hai" (idiomatic "what is going on?")'],
    tokensBreakdown: [
      { token: 'Yaar,', type: 'colloquial' },
      { token: 'EMIQEN is not connecting', type: 'intent' },
      { token: 'to my local endpoint,', type: 'domain' },
      { token: 'kya scene hai?', type: 'colloquial' },
    ],
    contextExplanation:
      'Understands code-switched Hindi-English ("Hinglish") expressions seamlessly, disambiguating the colloquial troubleshooting intent to diagnose port and CORS status.',
  },
  {
    id: 'ex-3',
    tag: 'Workplace Indian English',
    inputPhrase: 'Kindly revert back with the pipeline metrics by EOD please.',
    literalInterpretation: 'Strict Western NLP flags "revert back" as redundant and may misinterpret the conversational urgency.',
    emiqenContextualResponse:
      'Certainly. I will compile the end-of-day summary of pipeline latency, transcription confidence, and emotion distribution for you.',
    linguisticMarkers: ['"Kindly revert back" (standard South Asian business English)', '"EOD" (business deadline)'],
    tokensBreakdown: [
      { token: 'Kindly revert back', type: 'colloquial' },
      { token: 'with pipeline metrics', type: 'intent' },
      { token: 'by EOD please', type: 'modifier' },
    ],
    contextExplanation:
      'Recognizes regional enterprise vernacular naturally without syntactic friction, correctly treating "revert back" as "reply with structured data".',
  },
  {
    id: 'ex-4',
    tag: 'Everyday Practical Constraint',
    inputPhrase: 'Arre, keep the answer short na, I am on low network.',
    literalInterpretation: 'Monolithic models often generate lengthy paragraphs regardless of bandwidth signals.',
    emiqenContextualResponse:
      'Understood. Concise mode active: system running, latency minimal, audio streaming paused to save data.',
    linguisticMarkers: ['"Arre" (conversational attention grabber)', '"...na" (emphatic tag)', 'Explicit bandwidth constraint'],
    tokensBreakdown: [
      { token: 'Arre,', type: 'colloquial' },
      { token: 'keep answer short na,', type: 'intent' },
      { token: 'I am on low network.', type: 'modifier' },
    ],
    contextExplanation:
      'Adapts both linguistic length and payload transmission parameters when real-world edge constraints are signaled.',
  },
];

export const ARCHITECTURE_COMPONENTS: ArchitectureComponent[] = [
  {
    id: 'arch-1',
    name: 'Voice Capture',
    layer: 'Capture',
    responsibility: 'Collects microphone audio via MediaRecorder & Web Audio Analyser.',
    configuredTechnology: 'Browser MediaDevices API / Web Audio Context',
    inputFormat: 'Acoustic Analog Sound Waves',
    outputFormat: 'Float32Array / 16kHz PCM Stream',
    status: 'AVAILABLE',
    details: 'Requests permission dynamically on user click; handles device changes, muting, and volume metering.',
  },
  {
    id: 'arch-2',
    name: 'Speech Recognition',
    layer: 'Capture',
    responsibility: 'Transcribes continuous audio frames into synchronized text tokens.',
    configuredTechnology: 'Web Speech Recognition API with Whisper Fallback Adapter',
    inputFormat: '16kHz Audio Stream / PCM',
    outputFormat: 'Text Transcript with Confidence Metadata',
    status: 'AVAILABLE',
    details: 'Streaming interim transcriptions update the UI in real time before final punctuation resolution.',
  },
  {
    id: 'arch-3',
    name: 'Emotion Analysis',
    layer: 'Analysis',
    responsibility: 'Computes pitch variance, cadence velocity, and emotional vectors.',
    configuredTechnology: 'Acoustic Feature Extractor & Multi-Label Tone Classifier',
    inputFormat: 'Acoustic Pitch Buffers + Transcribed Text',
    outputFormat: 'Categorical Tone Vector & Emotion Guidance Weights',
    status: 'AVAILABLE',
    details: 'Demonstrates multi-modal prosody integration to modulate model response tone and brevity.',
  },
  {
    id: 'arch-4',
    name: 'Context Processing',
    layer: 'Analysis',
    responsibility: 'Maintains session memory buffer, resolves pronouns, maps idioms.',
    configuredTechnology: 'Dialogue State Engine & Colloquial Token Normalizer',
    inputFormat: 'Raw Text + Dialogue History + Emotion Weights',
    outputFormat: 'Enriched Context Graph & Intent Payload',
    status: 'AVAILABLE',
    details: 'Enables nuanced understanding of Indian English and Hinglish phrases alongside multi-turn recall.',
  },
  {
    id: 'arch-5',
    name: 'EMIQEN-SLM Inference',
    layer: 'Reasoning',
    responsibility: 'Domain-specific small language model generating coherent tokens.',
    configuredTechnology: 'EMIQEN Domain-Tuned Small Language Model Pipeline',
    inputFormat: 'Tokenized Context & Intent Embeddings',
    outputFormat: 'Autoregressive Response Tokens',
    status: 'DEMO MODE',
    details: 'Designed for high token throughput and edge deployment efficiency with minimal parameter footprint.',
  },
  {
    id: 'arch-6',
    name: 'Response Validation',
    layer: 'Reasoning',
    responsibility: 'Verifies safety, factual coherence, and bounds response length.',
    configuredTechnology: 'Output Guardrail Evaluator',
    inputFormat: 'Raw Generated Token Sequence',
    outputFormat: 'Verified Cleaned String',
    status: 'AVAILABLE',
    details: 'Ensures tone guidance was followed and prevents unsupported hallucinations.',
  },
  {
    id: 'arch-7',
    name: 'Text Response Layer',
    layer: 'Synthesis',
    responsibility: 'Streams finalized message to the client visual interface.',
    configuredTechnology: 'WebSocket / SSE Response Streamer',
    inputFormat: 'Verified Response String',
    outputFormat: 'Formatted Stream with Metadata',
    status: 'AVAILABLE',
    details: 'Drives smooth typographic streaming animation in the Live Playground.',
  },
  {
    id: 'arch-8',
    name: 'Text-to-Speech Engine',
    layer: 'Synthesis',
    responsibility: 'Synthesizes conversational audio with tailored pitch and cadence.',
    configuredTechnology: 'Web Speech Synthesis API with Server TTS Bridge',
    inputFormat: 'Validated Response Text + Prosody Parameters',
    outputFormat: 'Spoken Audio Stream via Device Speakers',
    status: 'AVAILABLE',
    details: 'Audio-reactive waveforms synchronize with spoken output duration.',
  },
];
