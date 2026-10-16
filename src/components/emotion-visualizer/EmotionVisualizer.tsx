import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, Cpu, Check, Sliders, Waves } from 'lucide-react';
import { EMOTION_SCENARIOS } from '../../config/product';
import type { EmotionScenario } from '../../types';

export const EmotionVisualizer: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<EmotionScenario>(EMOTION_SCENARIOS[0]);

  return (
    <section id="emotion-intelligence" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#080B10]">
      {/* Decorative background grid and glow */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#9A83FF]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1420] border border-white/10 text-xs font-mono text-[#9A83FF]">
            <Activity className="w-3.5 h-3.5" />
            <span>THE EMOTION INTELLIGENCE VISUALIZER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB]">
            Beyond Words. <span className="text-[#9A83FF]">Into Context</span>.
          </h2>
          <p className="text-base sm:text-lg text-[#A4ADBB]">
            Speech carries prosody, stress markers, and conversational cadence. EMIQEN-SLM assesses these acoustic cues to inform dialogue relevance without claiming absolute psychological certainty.
          </p>
        </div>

        {/* Research Disclaimer Badge */}
        <div className="mb-8 p-3 rounded-xl bg-[#0D1420] border border-white/10 flex items-center justify-between text-xs font-mono text-[#A4ADBB]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Inferred emotion markers serve as conversational guidance weights. All values reflect model-predicted features or demonstration datasets.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 font-semibold text-[10px] hidden sm:inline">
            DEMO DATASET ACTIVE
          </span>
        </div>

        {/* Interactive Scenario Switcher Pills */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {EMOTION_SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#9A83FF] text-[#080B10] font-bold shadow-[0_0_20px_rgba(154,131,255,0.3)]'
                    : 'bg-[#0D1420] text-[#A4ADBB] hover:text-[#F4F7FB] border border-white/10 hover:border-white/20'
                }`}
              >
                <span>{sc.title}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>

        {/* Research-Grade Multi-Panel Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Signal Waveform & Acoustic Feature Extraction */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-[#48E5F5]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#F4F7FB] font-semibold">
                  Signal Ingestion & Feature Tensor
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#48E5F5]">
                SPECTRAL EXTRACTOR v2
              </span>
            </div>

            {/* Input Conversational Phrase Box */}
            <div className="p-4 rounded-xl bg-[#080B10] border border-white/10 font-mono text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#A4ADBB] block mb-1">
                Evaluated Audio Utterance
              </span>
              <p className="text-sm font-semibold text-[#F4F7FB]">
                "{selectedScenario.phrase}"
              </p>
            </div>

            {/* Synthetic Pitch & Cadence Waveform */}
            <div className="p-4 rounded-xl bg-[#080B10] border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#A4ADBB] mb-3">
                <span>PITCH VARIANCE / CONTOUR (F0)</span>
                <span className="text-[#9A83FF] font-semibold">{selectedScenario.acousticIndicators.pitchVariance}</span>
              </div>

              {/* SVG Pitch curve */}
              <div className="h-28 w-full flex items-center justify-center relative">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
                  <path
                    d={
                      selectedScenario.detectedEmotion === 'Urgent'
                        ? 'M 0 50 Q 80 10, 160 85 T 300 20 T 420 75 L 500 30'
                        : selectedScenario.detectedEmotion === 'Curious'
                        ? 'M 0 60 Q 120 70, 240 45 T 380 20 L 500 15'
                        : selectedScenario.detectedEmotion === 'Frustrated'
                        ? 'M 0 40 Q 100 80, 200 70 T 360 85 L 500 90'
                        : 'M 0 50 Q 120 48, 250 52 T 400 49 L 500 50'
                    }
                    fill="none"
                    stroke="#9A83FF"
                    strokeWidth="2.5"
                  />
                  {/* Scatter markers */}
                  <circle cx="160" cy="50" r="3" fill="#48E5F5" />
                  <circle cx="300" cy="30" r="3" fill="#48E5F5" />
                  <circle cx="420" cy="60" r="3" fill="#48E5F5" />
                </svg>

                {/* Subtle horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-b border-dashed border-white" />
                  <div className="border-b border-dashed border-white" />
                  <div className="border-b border-dashed border-white" />
                </div>
              </div>
            </div>

            {/* Acoustic Indicators Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-[#080B10] border border-white/5">
                <span className="text-[10px] font-mono text-[#A4ADBB] block">Cadence</span>
                <span className="text-xs font-semibold text-[#F4F7FB] mt-0.5 block">
                  {selectedScenario.acousticIndicators.cadenceSpeed}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#080B10] border border-white/5">
                <span className="text-[10px] font-mono text-[#A4ADBB] block">Stress Markers</span>
                <span className="text-xs font-semibold text-[#F4F7FB] mt-0.5 block">
                  {selectedScenario.acousticIndicators.stressMarkers}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#080B10] border border-white/5">
                <span className="text-[10px] font-mono text-[#A4ADBB] block">Energy</span>
                <span className="text-xs font-semibold text-[#F4F7FB] mt-0.5 block">
                  {selectedScenario.acousticIndicators.energyDecibels}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#080B10] border border-white/5">
                <span className="text-[10px] font-mono text-[#A4ADBB] block">Pitch Flux</span>
                <span className="text-xs font-semibold text-[#48E5F5] mt-0.5 block">
                  {selectedScenario.acousticIndicators.pitchVariance}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: SLM Tone Strategy & Adaptive Output */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#9A83FF]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#F4F7FB] font-semibold">
                  SLM Adaptation Layer
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#A4ADBB]">
                INFERENCE STRATEGY
              </span>
            </div>

            {/* Classification Card */}
            <div className="p-4 rounded-xl bg-[#080B10] border border-[#9A83FF]/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#A4ADBB]">Predicted Tone Guidance</span>
                <span className="text-xs font-bold text-[#9A83FF]">
                  {Math.round(selectedScenario.confidence * 100)}% Confidence
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#F4F7FB]">
                  {selectedScenario.detectedEmotion}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#9A83FF]/20 text-[#C4B5FD] font-semibold">
                  WEIGHTED FEATURE
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedScenario.confidence * 100}%` }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-[#48E5F5] to-[#9A83FF] h-full rounded-full"
                />
              </div>
            </div>

            {/* Model Adaptive Strategy */}
            <div className="p-4 rounded-xl bg-[#080B10] border border-white/10 font-mono text-xs space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#48E5F5] block">
                Model Prompt Adaptation Directive
              </span>
              <p className="text-[#A4ADBB] leading-relaxed">
                {selectedScenario.slmStrategy}
              </p>
            </div>

            {/* Contextual Response Preview */}
            <div className="p-4 rounded-xl bg-[#0D1420] border border-[#48E5F5]/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#48E5F5] font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  Contextual Adapted Output
                </span>
                <span className="text-[10px] text-[#A4ADBB]">SYNTHESIZED</span>
              </div>
              <p className="text-sm text-[#F4F7FB] leading-relaxed font-sans">
                "{selectedScenario.contextualResponse}"
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
