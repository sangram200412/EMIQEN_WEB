import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Plus,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Bot,
  Copy,
  Check,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { ThemeSelector } from '../common/ThemeSelector';
import type { ThemeMode } from '../../hooks/useTheme';
import type { UserProfile } from '../auth/LoginModal';
import { apiService } from '../../services/api';
import { audioService } from '../../services/audio';

interface ChatWorkspaceProps {
  user: UserProfile;
  onLogout: () => void;
  onBackToWebsite: () => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  frequencyData: number[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  tone?: string;
  confidence?: number;
  tokensCount?: number;
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  user,
  onLogout,
  onBackToWebsite,
  currentTheme,
  onThemeChange,
  frequencyData,
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 'sess-1', title: 'Indian English & Hinglish Dialogue', date: 'Today' },
    { id: 'sess-2', title: 'Local SLM Latency & FastAPI Test', date: 'Yesterday' },
    { id: 'sess-3', title: 'Prosodic Pitch Tone Mapping', date: '3 days ago' },
  ]);
  const [activeSessionId, setActiveSessionId] = useState('sess-1');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${user.name}! Welcome to your dedicated EMIQEN-SLM Voice Chat Workspace. I am tuned for low-latency conversational queries, voice prosody understanding, and natural context adaptation. How can I assist you today?`,
      timestamp: '12:00 PM',
      tone: 'Constructive',
      confidence: 0.98,
      tokensCount: 42,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('EMIQEN-SLM-0.9b (Domain Optimized)');
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      audioService.stopSpeaking();
      audioService.stopMicrophone();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    const result = await apiService.processConversationalQuery(textToSend);

    const assistantMessage: ChatMessage = {
      id: `asst-${Date.now()}`,
      sender: 'assistant',
      text: result.response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tone: result.emotionDetected,
      confidence: result.confidence,
      tokensCount: Math.round(result.response.split(' ').length * 1.3),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsProcessing(false);

    if (autoSpeak) {
      setIsSpeakingAudio(true);
      audioService.speak(result.response, () => {
        setIsSpeakingAudio(false);
      });
    }
  };

  const handleStartVoice = async () => {
    const micRes = await audioService.initMicrophone();
    if (!micRes.success) {
      alert(micRes.error || 'Microphone access denied. You can type your message.');
      return;
    }

    setIsRecording(true);
    setInputText('');

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
          setInputText(interim);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition failed to start', e);
      }
    } else {
      setInputText('Listening to voice stream...');
    }
  };

  const handleStopVoice = () => {
    setIsRecording(false);
    audioService.stopMicrophone();

    if (recognitionRef.current) {
      const rec = recognitionRef.current;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      try {
        rec.abort();
      } catch {}
      try {
        rec.stop();
      } catch {}
      recognitionRef.current = null;
    }

    const finalQuery =
      inputText.trim() && inputText !== 'Listening to voice stream...'
        ? inputText
        : 'Bro, can you explain the SLM architecture in simple terms?';

    handleSendMessage(finalQuery);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSpeakMessage = (text: string) => {
    setIsSpeakingAudio(true);
    audioService.speak(text, () => {
      setIsSpeakingAudio(false);
    });
  };

  const handleNewSession = () => {
    const newSess: ChatSession = {
      id: `sess-${Date.now()}`,
      title: `New Exploration #${sessions.length + 1}`,
      date: 'Just now',
    };
    setSessions([newSess, ...sessions]);
    setActiveSessionId(newSess.id);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'New session initialized. Voice perception buffer and context cache are clean.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tone: 'Neutral',
      },
    ]);
  };

  const toggleModel = () => {
    if (selectedModel.includes('0.9b')) {
      setSelectedModel('EMIQEN-Voice-Pro (1.4b Hybrid)');
    } else {
      setSelectedModel('EMIQEN-SLM-0.9b (Domain Optimized)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080B10] dark:bg-[#080B10] light:bg-[#F8FAFC] text-[#F4F7FB] dark:text-[#F4F7FB] light:text-[#0F172A] font-sans overflow-hidden">
      
      {/* Top Header Navigation */}
      <header className="h-16 border-b border-white/10 light:border-slate-300 bg-[#0D1420]/90 light:bg-white/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        
        {/* Brand Logo & Back to Website */}
        <div className="flex items-center gap-4">
          <BrandLogo size="md" />

          <button
            onClick={onBackToWebsite}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 light:bg-slate-100 hover:bg-white/10 text-xs font-mono text-[#A4ADBB] hover:text-[#F4F7FB] light:text-slate-600 light:hover:text-slate-900 border border-white/10 light:border-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Website Overview</span>
          </button>
        </div>

        {/* Model Selector Pill (Interactive Toggle) */}
        <button
          onClick={toggleModel}
          title="Click to switch model configuration"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080B10] light:bg-slate-100 border border-white/10 light:border-slate-200 text-xs font-mono hover:border-[#48E5F5]/40 transition-colors cursor-pointer"
        >
          <Bot className="w-4 h-4 text-[#48E5F5]" />
          <span className="text-[#F4F7FB] light:text-slate-800 font-semibold">{selectedModel}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        {/* Right Action: Theme Selector & User Profile */}
        <div className="flex items-center gap-3">
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
            variant="compact"
          />

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10 light:border-slate-200">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#48E5F5] to-[#9A83FF] text-[#080B10] flex items-center justify-center font-bold text-xs">
              {user.avatar}
            </span>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold leading-tight">{user.name}</span>
              <span className="text-[10px] text-[#A4ADBB]">{user.role}</span>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-white/5 light:bg-slate-100 hover:bg-rose-500/20 text-[#A4ADBB] hover:text-rose-400 transition-colors cursor-pointer ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Sessions & Settings) */}
        <aside className="w-64 sm:w-72 border-r border-white/10 light:border-slate-200 bg-[#0D1420]/50 light:bg-slate-50 flex flex-col justify-between shrink-0 hidden md:flex p-4">
          
          <div className="space-y-4">
            {/* New Session Button */}
            <button
              onClick={handleNewSession}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#48E5F5] to-[#38C6D5] text-[#080B10] font-semibold text-xs transition-all shadow-[0_0_15px_rgba(72,229,245,0.25)] hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>

            {/* Conversation History List */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A4ADBB] block px-2 mb-2">
                Recent Dialogues
              </span>
              <div className="space-y-1">
                {sessions.map((sess) => {
                  const isActive = activeSessionId === sess.id;
                  return (
                    <button
                      key={sess.id}
                      onClick={() => setActiveSessionId(sess.id)}
                      className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#48E5F5]/10 text-[#48E5F5] border border-[#48E5F5]/30 font-semibold'
                          : 'text-[#A4ADBB] hover:text-[#F4F7FB] light:text-slate-600 light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-200'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="truncate flex-1">{sess.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Bottom Controls: Voice Toggle & Theme */}
          <div className="pt-4 border-t border-white/10 light:border-slate-200 space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#080B10] light:bg-white border border-white/5 light:border-slate-200">
              <div className="flex items-center gap-2 text-xs">
                {autoSpeak ? (
                  <Volume2 className="w-4 h-4 text-[#48E5F5]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#A4ADBB]" />
                )}
                <span className="text-[11px] font-mono">Spoken Voice</span>
              </div>
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  autoSpeak ? 'bg-[#48E5F5]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-[#080B10] transition-transform ${
                    autoSpeak ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-[#080B10] light:bg-white border border-white/5 light:border-slate-200 text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A4ADBB] block mb-1.5">
                Display Theme
              </span>
              <ThemeSelector
                currentTheme={currentTheme}
                onThemeChange={onThemeChange}
                variant="pill"
              />
            </div>
          </div>

        </aside>

        {/* Center Chat Interaction Canvas */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden relative">
          
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-3xl ${
                    isAssistant ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'
                  }`}
                >
                  {/* Sender Avatar */}
                  <div className="shrink-0 mt-0.5">
                    {isAssistant ? (
                      <div className="w-8 h-8 rounded-xl bg-transparent flex items-center justify-center">
                        <img src="/logo-emblem.png" alt="EMIQEN" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#48E5F5] to-[#9A83FF] text-[#080B10] flex items-center justify-center font-bold text-xs shadow-md">
                        {user.avatar}
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-1.5 max-w-[85%] sm:max-w-[75%]">
                    
                    {/* Metadata header */}
                    <div className={`flex items-center gap-2 text-[10px] font-mono text-[#A4ADBB] ${
                      isAssistant ? 'justify-start' : 'justify-end'
                    }`}>
                      <span className="font-semibold">{isAssistant ? 'EMIQEN-SLM' : user.name}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                      {msg.tone && (
                        <span className="px-2 py-0.5 rounded bg-[#9A83FF]/15 text-[#9A83FF]">
                          Tone: {msg.tone}
                        </span>
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-[#0D1420] light:bg-white border border-white/10 light:border-slate-200 text-[#F4F7FB] light:text-slate-800 shadow-md'
                          : 'bg-gradient-to-r from-[#48E5F5]/20 to-[#9A83FF]/20 border border-[#48E5F5]/30 text-[#F4F7FB] light:text-slate-900 shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {/* Action buttons for Assistant message */}
                    {isAssistant && (
                      <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#A4ADBB]">
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="hover:text-[#48E5F5] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <span>·</span>
                        <button
                          onClick={() => handleSpeakMessage(msg.text)}
                          className="hover:text-[#48E5F5] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Speak</span>
                        </button>
                        {isSpeakingAudio && (
                          <span className="text-[#48E5F5] text-[10px] animate-pulse">
                            (Playing audio...)
                          </span>
                        )}
                      </div>
                    )}

                  </div>
                </motion.div>
              );
            })}

            {isProcessing && (
              <div className="flex items-center gap-3 text-xs font-mono text-[#48E5F5] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#48E5F5]" />
                <span>EMIQEN-SLM is reasoning across domain context...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Prompt Bar & Mic Input */}
          <div className="p-4 sm:p-6 border-t border-white/10 light:border-slate-200 bg-[#0D1420]/80 light:bg-white/80 backdrop-blur-md shrink-0">
            
            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none">
              {[
                'Bro, can you explain this in simple words?',
                'Yaar, kya scene hai with low network response?',
                'What is the token footprint of EMIQEN-SLM?',
                'Inspect prosodic tone feature vectors',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="px-3 py-1 rounded-lg bg-white/5 light:bg-slate-100 hover:bg-white/10 border border-white/5 light:border-slate-200 text-[11px] font-mono text-[#A4ADBB] hover:text-[#48E5F5] whitespace-nowrap transition-colors cursor-pointer"
                >
                  "{chip}"
                </button>
              ))}
            </div>

            {/* Audio Wave Frequency Bar (Active during mic or speaking) */}
            {(isRecording || isSpeakingAudio) && (
              <div className="flex items-center justify-center gap-1 h-5 mb-2">
                {Array.from({ length: 16 }).map((_, i) => {
                  const h = Math.max(4, Math.min(20, ((frequencyData[i] || 20) / 100) * 22));
                  return (
                    <div
                      key={i}
                      style={{ height: `${h}px` }}
                      className={`w-1 rounded-full transition-all ${
                        isRecording ? 'bg-rose-400' : 'bg-[#48E5F5]'
                      }`}
                    />
                  );
                })}
              </div>
            )}

            {/* Main Interactive Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="relative flex items-center gap-2"
            >
              {/* Mic Button */}
              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopVoice}
                  className="p-3 rounded-xl bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30 cursor-pointer"
                  title="Stop recording"
                >
                  <MicOff className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartVoice}
                  className="p-3 rounded-xl bg-[#48E5F5]/10 hover:bg-[#48E5F5]/20 text-[#48E5F5] border border-[#48E5F5]/30 hover:shadow-[0_0_15px_rgba(72,229,245,0.3)] transition-all cursor-pointer"
                  title="Speak with microphone"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRecording ? 'Listening to voice stream...' : 'Ask EMIQEN-SLM or tap the mic to speak...'}
                className="flex-1 bg-white dark:bg-[#080B10] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A4ADBB]/50 focus:outline-none focus:border-[#0284C7] dark:focus:border-[#48E5F5] transition-colors"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="p-3 rounded-xl bg-gradient-to-r from-[#48E5F5] to-[#38C6D5] text-[#080B10] font-semibold transition-all disabled:opacity-40 hover:shadow-[0_0_20px_rgba(72,229,245,0.4)] cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
};
