import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Send,
  AlertCircle,
  Radio,
  Play,
  Pause,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { audioService } from '../../services/audio';
import { apiService } from '../../services/api';
import type { ConversationMessage, IntelligenceState } from '../../types';

interface VoicePlaygroundProps {
  onStateChange: (state: IntelligenceState) => void;
  frequencyData: number[];
}

export const VoicePlayground: React.FC<VoicePlaygroundProps> = ({
  onStateChange,
  frequencyData,
}) => {
  const [playgroundState, setPlaygroundState] = useState<
    'READY' | 'LISTENING' | 'PROCESSING' | 'RESPONDING' | 'SPEAKING' | 'COMPLETED'
  >('READY');
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [displayedResponse, setDisplayedResponse] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [detectedTone, setDetectedTone] = useState<string | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [history, setHistory] = useState<ConversationMessage[]>([
    {
      id: 'msg-init',
      sender: 'emiqen',
      text: 'EMIQEN-SLM voice perception pipeline is initialized. Press the microphone or type below to test conversational inference.',
      timestamp: 'Just now',
    },
  ]);

  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sync playground state with global intelligence state
  useEffect(() => {
    if (playgroundState === 'READY' || playgroundState === 'COMPLETED') {
      onStateChange('idle');
    } else if (playgroundState === 'LISTENING') {
      onStateChange('listening');
    } else if (playgroundState === 'PROCESSING') {
      onStateChange('analyzing');
    } else if (playgroundState === 'RESPONDING') {
      onStateChange('generating');
    } else if (playgroundState === 'SPEAKING') {
      onStateChange('speaking');
    }
  }, [playgroundState, onStateChange]);

  // Clean up timer and audio on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      audioService.stopMicrophone();
      audioService.stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Text streaming typewriter effect
  useEffect(() => {
    if (playgroundState === 'RESPONDING' && currentResponse) {
      let index = 0;
      setDisplayedResponse('');
      const interval = setInterval(() => {
        index += 2;
        if (index <= currentResponse.length) {
          setDisplayedResponse(currentResponse.slice(0, index));
        } else {
          setDisplayedResponse(currentResponse);
          clearInterval(interval);
          // Transition to speaking
          if (!isAudioMuted) {
            setPlaygroundState('SPEAKING');
            setIsPlayingAudio(true);
            audioService.speak(currentResponse, () => {
              setIsPlayingAudio(false);
              setPlaygroundState('COMPLETED');
            });
          } else {
            setPlaygroundState('COMPLETED');
          }
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [playgroundState, currentResponse, isAudioMuted]);

  // Start microphone recording
  const handleStartRecording = async () => {
    setErrorMessage(null);
    setCurrentTranscript('');
    setCurrentResponse('');
    setDisplayedResponse('');
    setDetectedTone(null);
    setConfidenceScore(null);

    // Initializing microphone
    const micResult = await audioService.initMicrophone();
    if (!micResult.success) {
      setErrorMessage(
        micResult.error || 'Microphone access denied. You can test interactions using the text input below.'
      );
      return;
    }

    setPlaygroundState('LISTENING');
    setRecordingSeconds(0);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    // Initialize Web Speech Recognition if available
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            interim += event.results[i][0].transcript;
          }
          setCurrentTranscript(interim);
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition warning:', e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Speech recognition start failed:', e);
      }
    } else {
      // Browser does not support Web Speech Recognition; will simulate streaming transcript
      setCurrentTranscript('Listening to voice stream...');
    }
  };

  // Stop recording and process query
  const handleStopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    audioService.stopMicrophone();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    const finalQuery =
      currentTranscript.trim() && currentTranscript !== 'Listening to voice stream...'
        ? currentTranscript
        : 'Bro, can you explain this in simple words?';

    setCurrentTranscript(finalQuery);
    processQuery(finalQuery);
  };

  // Process query through API Service
  const processQuery = async (queryText: string) => {
    setPlaygroundState('PROCESSING');

    // Add user turn to history
    const userMsg: ConversationMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHistory((prev) => [...prev, userMsg]);

    // Send query to API
    const result = await apiService.processConversationalQuery(queryText);

    setDetectedTone(result.emotionDetected);
    setConfidenceScore(result.confidence);
    setCurrentResponse(result.response);
    setPlaygroundState('RESPONDING');

    // Add assistant turn to history
    const aiMsg: ConversationMessage = {
      id: `ai-${Date.now()}`,
      sender: 'emiqen',
      text: result.response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotionDetected: result.emotionDetected,
      confidence: result.confidence,
    };
    setHistory((prev) => [...prev, aiMsg]);
  };

  // Handle text input submission
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || playgroundState === 'LISTENING' || playgroundState === 'PROCESSING') return;

    const query = textInput.trim();
    setTextInput('');
    setCurrentTranscript(query);
    processQuery(query);
  };

  // Reset conversation
  const handleResetConversation = () => {
    audioService.stopSpeaking();
    audioService.stopMicrophone();
    if (timerRef.current) clearInterval(timerRef.current);
    setPlaygroundState('READY');
    setCurrentTranscript('');
    setCurrentResponse('');
    setDisplayedResponse('');
    setDetectedTone(null);
    setConfidenceScore(null);
    setRecordingSeconds(0);
    setErrorMessage(null);
    setHistory([
      {
        id: `msg-${Date.now()}`,
        sender: 'emiqen',
        text: 'Session reset. Microphone and context buffers cleared.',
        timestamp: 'Just now',
      },
    ]);
  };

  // Toggle playback
  const handleTogglePlayback = () => {
    if (isPlayingAudio) {
      audioService.stopSpeaking();
      setIsPlayingAudio(false);
      setPlaygroundState('COMPLETED');
    } else if (currentResponse) {
      setIsPlayingAudio(true);
      setPlaygroundState('SPEAKING');
      audioService.speak(currentResponse, () => {
        setIsPlayingAudio(false);
        setPlaygroundState('COMPLETED');
      });
    }
  };

  return (
    <section id="playground" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0D1420]/40">
      {/* Background ambient ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#48E5F5]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080B10] border border-white/10 text-xs font-mono text-[#48E5F5]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>INTERACTIVE AI STUDIO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB]">
            Talk to <span className="text-[#48E5F5]">EMIQEN</span>.
          </h2>
          <p className="text-base text-[#A4ADBB]">
            Dedicated voice interaction studio with live speech ingestion, prosodic tone extraction, and natural voice response.
          </p>
        </div>

        {/* Error Alert if mic permission fails */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-sm">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-amber-300">Microphone Notice</p>
              <p className="text-xs text-amber-200/90 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Studio Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left Column: Voice Interaction Core (Mic & Real-time State) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-between border border-white/10 relative overflow-hidden min-h-[500px]">
            
            {/* Top Bar inside Card */}
            <div className="w-full flex items-center justify-between text-xs font-mono pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#48E5F5]" />
                <span className="text-[#A4ADBB] uppercase tracking-wider">
                  STUDIO STATE: <strong className="text-[#F4F7FB]">{playgroundState}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {playgroundState === 'LISTENING' && (
                  <span className="text-rose-400 font-mono flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    REC {recordingSeconds}s
                  </span>
                )}
                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A4ADBB] transition-colors"
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-[#48E5F5]" />}
                </button>
              </div>
            </div>

            {/* Central Animated Microphone & Audio Wave Ring */}
            <div className="relative my-8 flex items-center justify-center">
              
              {/* Outer Pulsing Wave Rings */}
              {playgroundState === 'LISTENING' && (
                <>
                  <div className="absolute w-44 h-44 rounded-full border border-[#48E5F5]/40 animate-ping opacity-60 pointer-events-none" />
                  <div className="absolute w-56 h-56 rounded-full border border-[#48E5F5]/20 animate-pulse pointer-events-none" />
                </>
              )}

              {playgroundState === 'SPEAKING' && (
                <div className="absolute w-48 h-48 rounded-full border border-[#9A83FF]/40 animate-pulse-ring pointer-events-none" />
              )}

              {/* Dynamic Radial Frequency Ring */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full flex items-center justify-center p-2 bg-[#080B10] border border-white/10 shadow-2xl">
                {playgroundState === 'LISTENING' ? (
                  <button
                    onClick={handleStopRecording}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-rose-500 to-rose-600 text-white flex flex-col items-center justify-center gap-1 shadow-lg shadow-rose-500/30 transition-transform active:scale-95 cursor-pointer"
                  >
                    <MicOff className="w-8 h-8" />
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                      Stop
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartRecording}
                    disabled={playgroundState === 'PROCESSING'}
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
                      playgroundState === 'PROCESSING'
                        ? 'bg-[#0D1420] text-[#A4ADBB] cursor-wait'
                        : 'bg-gradient-to-tr from-[#48E5F5] to-[#36BFD1] text-[#080B10] shadow-[0_0_30px_rgba(72,229,245,0.4)] hover:scale-105 active:scale-95'
                    }`}
                  >
                    <Mic className="w-8 h-8 fill-current" />
                    <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">
                      {playgroundState === 'PROCESSING' ? 'Thinking' : 'Tap to Speak'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Audio Wave Bars Visualizer */}
            <div className="w-full flex items-center justify-center gap-1.5 h-10 px-4">
              {Array.from({ length: 24 }).map((_, i) => {
                const isActive = playgroundState === 'LISTENING' || playgroundState === 'SPEAKING';
                const heightVal = isActive
                  ? Math.max(8, Math.min(38, ((frequencyData[i % 16] || 20) / 100) * 40))
                  : 4;

                return (
                  <motion.div
                    key={i}
                    animate={{ height: heightVal }}
                    transition={{ duration: 0.1 }}
                    className={`w-1 rounded-full ${
                      playgroundState === 'LISTENING'
                        ? 'bg-[#48E5F5]'
                        : playgroundState === 'SPEAKING'
                        ? 'bg-[#9A83FF]'
                        : 'bg-white/10'
                    }`}
                  />
                );
              })}
            </div>

            {/* Live Transcript & Response Stream Box */}
            <div className="w-full mt-6 space-y-3 text-left">
              {/* User Live Transcript */}
              <div className="p-3.5 rounded-xl bg-[#080B10]/70 border border-white/5 text-xs font-mono">
                <span className="text-[10px] text-[#A4ADBB] block uppercase tracking-wider mb-1">
                  Transcribed Speech Input
                </span>
                <p className="text-[#F4F7FB] min-h-[20px]">
                  {currentTranscript || (
                    <span className="text-[#A4ADBB]/40 italic">
                      "Speak to generate live transcription..."
                    </span>
                  )}
                </p>
              </div>

              {/* EMIQEN Generated Response with Typewriter */}
              <div className="p-4 rounded-xl bg-[#080B10] border border-[#48E5F5]/30 text-xs sm:text-sm font-sans shadow-lg shadow-[#48E5F5]/5">
                <div className="flex items-center justify-between text-xs font-mono text-[#A4ADBB] pb-2 border-b border-white/5 mb-2">
                  <span className="flex items-center gap-1.5 text-[#48E5F5] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    EMIQEN-SLM Response
                  </span>
                  {detectedTone && (
                    <span className="px-2 py-0.5 rounded bg-[#9A83FF]/15 text-[#9A83FF] text-[10px]">
                      Tone: {detectedTone} ({Math.round((confidenceScore || 0.9) * 100)}%)
                    </span>
                  )}
                </div>

                <p className="text-[#F4F7FB] leading-relaxed min-h-[48px]">
                  {displayedResponse || currentResponse || (
                    <span className="text-[#A4ADBB]/50 text-xs italic font-mono">
                      Awaiting input. Responses adapt dynamically to speech cadence and conversational intent.
                    </span>
                  )}
                </p>

                {currentResponse && playgroundState === 'COMPLETED' && (
                  <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={handleTogglePlayback}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#48E5F5] hover:underline"
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlayingAudio ? 'Pause Speech' : 'Replay Voice Output'}</span>
                    </button>
                    <span className="text-[10px] font-mono text-[#A4ADBB]">Demo Synthesis</span>
                  </div>
                )}
              </div>
            </div>

            {/* Text Input Fallback Bar */}
            <form onSubmit={handleTextSubmit} className="w-full mt-4 flex items-center gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or type a question (e.g. 'Bro, can you explain this in simple words?')..."
                className="flex-1 bg-[#080B10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4F7FB] placeholder:text-[#A4ADBB]/50 focus:outline-none focus:border-[#48E5F5] transition-colors"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || playgroundState === 'PROCESSING'}
                className="px-4 py-2.5 rounded-xl bg-[#48E5F5]/10 hover:bg-[#48E5F5]/20 text-[#48E5F5] border border-[#48E5F5]/30 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

          </div>

          {/* Right Column: Conversation History & Session State */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/10">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#9A83FF]" />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#F4F7FB]">
                    Dialogue Stream
                  </span>
                </div>
                <button
                  onClick={handleResetConversation}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#A4ADBB] hover:text-[#F4F7FB] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Session</span>
                </button>
              </div>

              {/* Scrollable message turns */}
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-2 text-left">
                {history.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#48E5F5]/10 border border-[#48E5F5]/20 ml-6'
                        : 'bg-[#080B10] border border-white/5 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#A4ADBB] mb-1">
                      <span className={msg.sender === 'user' ? 'text-[#48E5F5] font-semibold' : 'text-[#9A83FF] font-semibold'}>
                        {msg.sender === 'user' ? 'YOU (VOICE / TEXT)' : 'EMIQEN-SLM'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-[#F4F7FB] leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Prompt Ideas for Testing */}
            <div className="pt-4 border-t border-white/5 mt-4 text-left">
              <span className="text-[10px] font-mono text-[#A4ADBB] uppercase tracking-wider block mb-2">
                Quick Test Prompts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Bro, explain in simple words',
                  'Yaar, kya scene hai with latency?',
                  'How does the SLM handle emotions?',
                  'Show me active pipeline stages',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTextInput(prompt);
                      processQuery(prompt);
                    }}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#A4ADBB] hover:text-[#48E5F5] border border-white/5 transition-colors cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
