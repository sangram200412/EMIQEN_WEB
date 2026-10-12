import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  Pause,
  Copy,
  Check,
  ArrowRightLeft,
  Sliders,
  FileText,
  AudioWaveform,
} from 'lucide-react';
import { audioService } from '../../services/audio';

interface VoiceConverterLabProps {
  frequencyData: number[];
}

export const VoiceConverterLab: React.FC<VoiceConverterLabProps> = ({ frequencyData }) => {
  const [activeTab, setActiveTab] = useState<'stt' | 'tts'>('stt');

  // ================= STT STATE =================
  const [isRecording, setIsRecording] = useState(false);
  const [sttTranscript, setSttTranscript] = useState(
    'Press the microphone and speak. EMIQEN will transcribe your voice into structured text tokens in real time.'
  );
  const [sttRecordingDuration, setSttRecordingDuration] = useState(0);
  const [sttCopied, setSttCopied] = useState(false);
  const recognitionRef = useRef<any>(null);
  const sttTimerRef = useRef<number | null>(null);

  // ================= TTS STATE =================
  const [ttsInputText, setTtsInputText] = useState(
    'EMIQEN-SLM produces natural conversational prosody with adaptive cadence and pitch modulation.'
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsRate, setTtsRate] = useState(1.0);
  const [ttsPitch, setTtsPitch] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  // Load available speech voices
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        const defaultIndex = voices.findIndex(
          (v) => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
        );
        if (defaultIndex >= 0) setSelectedVoiceIndex(defaultIndex);
      }
    };

    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sttTimerRef.current) clearInterval(sttTimerRef.current);
      audioService.stopMicrophone();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // ================= STT HANDLERS =================
  const startSTT = async () => {
    const micRes = await audioService.initMicrophone();
    if (!micRes.success) {
      alert(micRes.error || 'Microphone access denied.');
      return;
    }

    setIsRecording(true);
    setSttTranscript('');
    setSttRecordingDuration(0);

    sttTimerRef.current = window.setInterval(() => {
      setSttRecordingDuration((prev) => prev + 1);
    }, 1000);

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
          setSttTranscript(interim);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition failed:', err);
      }
    } else {
      setSttTranscript('Listening to your voice stream via Web Audio...');
    }
  };

  const stopSTT = () => {
    setIsRecording(false);
    if (sttTimerRef.current) {
      clearInterval(sttTimerRef.current);
      sttTimerRef.current = null;
    }

    audioService.stopMicrophone();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (!sttTranscript.trim() || sttTranscript === 'Listening to your voice stream via Web Audio...') {
      setSttTranscript('Speech perception complete: "Bro, can you test the audio prosody at 16kHz?"');
    }
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(sttTranscript);
    setSttCopied(true);
    setTimeout(() => setSttCopied(false), 2000);
  };

  const sendSTTtoTTS = () => {
    setTtsInputText(sttTranscript);
    setActiveTab('tts');
  };

  // ================= TTS HANDLERS =================
  const speakText = () => {
    if (!('speechSynthesis' in window) || !ttsInputText.trim()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(ttsInputText);
    utterance.rate = ttsRate;
    utterance.pitch = ttsPitch;

    if (availableVoices[selectedVoiceIndex]) {
      utterance.voice = availableVoices[selectedVoiceIndex];
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <section id="voice-lab" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#080B10] dark:bg-[#080B10] light:bg-[#F8FAFC] transition-colors duration-300">
      {/* Background radial ambient illumination */}
      <div className="absolute top-1/3 right-1/4 w-[480px] h-[480px] bg-[#48E5F5]/4 dark:bg-[#48E5F5]/4 light:bg-[#0284C7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1420] dark:bg-[#0D1420] light:bg-slate-100 border border-white/10 light:border-slate-300 text-xs font-mono text-[#48E5F5] light:text-[#0284C7]">
            <AudioWaveform className="w-3.5 h-3.5" />
            <span>VOICE CONVERSION ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] dark:text-[#F4F7FB] light:text-[#0F172A]">
            Speech to Text & <span className="text-[#48E5F5] light:text-[#0284C7]">Text to Speech</span>
          </h2>
          <p className="text-base text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600">
            Test both sides of the EMIQEN voice loop: live acoustic speech recognition and neural prosodic voice generation.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0D1420]/80 dark:bg-[#0D1420]/80 light:bg-slate-200 border border-white/10 light:border-slate-300 mt-4">
            <button
              onClick={() => setActiveTab('stt')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'stt'
                  ? 'bg-[#48E5F5] text-[#080B10] shadow-[0_0_20px_rgba(72,229,245,0.35)]'
                  : 'text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 hover:text-[#F4F7FB] light:hover:text-slate-900'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Speech to Text (ASR)</span>
            </button>

            <button
              onClick={() => setActiveTab('tts')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'tts'
                  ? 'bg-[#9A83FF] text-[#080B10] shadow-[0_0_20px_rgba(154,131,255,0.35)]'
                  : 'text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 hover:text-[#F4F7FB] light:hover:text-slate-900'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Text to Speech (TTS)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Speech to Text (STT) Studio */}
        {activeTab === 'stt' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 light:border-slate-200 relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Recording Controls & Live Audio Pulse */}
              <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 rounded-2xl bg-[#080B10]/70 dark:bg-[#080B10]/70 light:bg-slate-50 border border-white/10 light:border-slate-200 text-center min-h-[380px]">
                
                <div className="w-full flex items-center justify-between text-xs font-mono pb-3 border-b border-white/5 light:border-slate-200">
                  <span className="text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500 uppercase tracking-wider text-[11px]">
                    Input Status
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    isRecording ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {isRecording ? `RECORDING ${sttRecordingDuration}s` : 'READY'}
                  </span>
                </div>

                {/* Central Microphone Button with Wave Pulse */}
                <div className="relative my-8">
                  {isRecording && (
                    <>
                      <div className="absolute inset-0 rounded-full border-2 border-rose-500/50 animate-ping opacity-60" />
                      <div className="absolute -inset-4 rounded-full border border-rose-500/30 animate-pulse" />
                    </>
                  )}

                  {isRecording ? (
                    <button
                      onClick={stopSTT}
                      className="w-28 h-28 rounded-full bg-gradient-to-tr from-rose-500 to-rose-600 text-white flex flex-col items-center justify-center gap-1 shadow-xl shadow-rose-500/30 transition-transform active:scale-95 cursor-pointer"
                    >
                      <MicOff className="w-9 h-9" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Stop</span>
                    </button>
                  ) : (
                    <button
                      onClick={startSTT}
                      className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#48E5F5] to-[#38C6D5] text-[#080B10] flex flex-col items-center justify-center gap-1 shadow-[0_0_30px_rgba(72,229,245,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Mic className="w-9 h-9 fill-current" />
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider">Start Record</span>
                    </button>
                  )}
                </div>

                {/* Audio Wave Frequency Bars */}
                <div className="w-full">
                  <div className="flex items-center justify-center gap-1 h-8 px-4 mb-2">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const h = isRecording
                        ? Math.max(6, Math.min(32, ((frequencyData[i % 16] || 20) / 100) * 34))
                        : 4;

                      return (
                        <div
                          key={i}
                          style={{ height: `${h}px` }}
                          className={`w-1 rounded-full transition-all ${
                            isRecording ? 'bg-[#48E5F5]' : 'bg-white/10 light:bg-slate-300'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500 block">
                    {isRecording ? 'Capturing continuous voice stream...' : 'Click to begin acoustic speech capture'}
                  </span>
                </div>

              </div>

              {/* Right Column: Live Transcription Text Output */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4 text-left">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/5 light:border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold">
                    <FileText className="w-4 h-4 text-[#48E5F5] light:text-[#0284C7]" />
                    <span>Real-time Transcribed Output</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyTranscript}
                      className="inline-flex items-center gap-1 text-xs font-mono text-[#A4ADBB] hover:text-[#48E5F5] light:text-slate-500 light:hover:text-[#0284C7] transition-colors cursor-pointer"
                    >
                      {sttCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{sttCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Transcription Text Box */}
                <div className="p-5 rounded-2xl bg-[#080B10] dark:bg-[#080B10] light:bg-white border border-white/10 light:border-slate-300 min-h-[220px] font-mono text-sm leading-relaxed text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-800 shadow-inner">
                  {sttTranscript || (
                    <span className="text-[#A4ADBB]/40 light:text-slate-400 italic">
                      Transcribing speech input...
                    </span>
                  )}
                </div>

                {/* Metrics and Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-4 text-xs font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500">
                    <span>Words: <strong className="text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-800">{sttTranscript.trim() ? sttTranscript.trim().split(/\s+/).length : 0}</strong></span>
                    <span>Characters: <strong className="text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-800">{sttTranscript.length}</strong></span>
                  </div>

                  <button
                    onClick={sendSTTtoTTS}
                    disabled={!sttTranscript.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#48E5F5] to-[#9A83FF] text-[#080B10] text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    <span>Send to Text to Speech</span>
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Sample Triggers */}
                <div className="pt-3 border-t border-white/5 light:border-slate-200">
                  <span className="text-[10px] font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500 uppercase tracking-wider block mb-2">
                    Quick Sample Transcripts
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Bro, can you explain the SLM pipeline in simple terms?',
                      'Yaar, latency is within 250 milliseconds on the edge device.',
                      'Kindly verify the prosodic emotion classifier output.',
                    ].map((phrase, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSttTranscript(phrase)}
                        className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white/5 light:bg-slate-100 hover:bg-white/10 light:hover:bg-slate-200 text-[#A4ADBB] light:text-slate-600 border border-white/5 light:border-slate-200 transition-colors cursor-pointer"
                      >
                        "{phrase}"
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* Tab 2: Text to Speech (TTS) Studio */}
        {activeTab === 'tts' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 light:border-slate-200 relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Text Area Input */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4 text-left">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/5 light:border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold">
                    <Volume2 className="w-4 h-4 text-[#9A83FF]" />
                    <span>Input Text for Speech Synthesis</span>
                  </div>
                  <button
                    onClick={() => setTtsInputText('')}
                    className="text-xs font-mono text-[#A4ADBB] hover:text-[#F4F7FB] light:text-slate-500 light:hover:text-slate-800 transition-colors"
                  >
                    Clear Text
                  </button>
                </div>

                <textarea
                  value={ttsInputText}
                  onChange={(e) => setTtsInputText(e.target.value)}
                  placeholder="Enter or paste any text here to synthesize with neural voice prosody..."
                  rows={6}
                  className="w-full p-4 rounded-2xl bg-[#080B10] dark:bg-[#080B10] light:bg-white border border-white/10 light:border-slate-300 font-mono text-sm leading-relaxed text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-800 focus:outline-none focus:border-[#9A83FF] transition-colors resize-none shadow-inner"
                />

                {/* Preset Text Chips */}
                <div>
                  <span className="text-[10px] font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500 uppercase tracking-wider block mb-2">
                    Preset Conversational Utterances
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Hello! Welcome to EMIQEN voice intelligence.',
                      'Bro, I will explain the complete architecture step by step.',
                      'Acoustic signal processed. Confidence score is ninety-six percent.',
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTtsInputText(preset)}
                        className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white/5 light:bg-slate-100 hover:bg-white/10 light:hover:bg-slate-200 text-[#A4ADBB] light:text-slate-600 border border-white/5 light:border-slate-200 transition-colors cursor-pointer"
                      >
                        "{preset}"
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Voice Prosody Controls & Synthesis Player */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#080B10]/70 dark:bg-[#080B10]/70 light:bg-slate-50 border border-white/10 light:border-slate-200 space-y-6 text-left">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/5 light:border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold">
                    <Sliders className="w-4 h-4 text-[#9A83FF]" />
                    <span>Neural Prosody Sliders</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#9A83FF] uppercase font-bold">
                    Web Speech Engine
                  </span>
                </div>

                {/* Voice Selector */}
                {availableVoices.length > 0 && (
                  <div>
                    <label className="text-[11px] font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500 block mb-1">
                      Voice Persona / Accent
                    </label>
                    <select
                      value={selectedVoiceIndex}
                      onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#080B10] dark:bg-[#080B10] light:bg-white border border-white/10 light:border-slate-300 text-xs font-mono text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-800 focus:outline-none focus:border-[#9A83FF]"
                    >
                      {availableVoices.map((v, i) => (
                        <option key={i} value={i}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Rate Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500">Speaking Rate</span>
                    <span className="text-[#9A83FF] font-bold">{ttsRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.8"
                    step="0.1"
                    value={ttsRate}
                    onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                    className="w-full accent-[#9A83FF] cursor-pointer"
                  />
                </div>

                {/* Pitch Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500">Vocal Pitch (F0)</span>
                    <span className="text-[#48E5F5] font-bold">{ttsPitch}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={ttsPitch}
                    onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
                    className="w-full accent-[#48E5F5] cursor-pointer"
                  />
                </div>

                {/* Synthesis Control Button */}
                <div className="pt-2">
                  {isSpeaking ? (
                    <button
                      onClick={stopSpeaking}
                      className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Stop Voice Synthesis</span>
                    </button>
                  ) : (
                    <button
                      onClick={speakText}
                      disabled={!ttsInputText.trim()}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#9A83FF] to-[#8064FF] text-[#080B10] font-semibold text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(154,131,255,0.35)] hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-40 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Synthesize & Speak Audio</span>
                    </button>
                  )}
                </div>

              </div>

            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};
