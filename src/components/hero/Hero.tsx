import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Cpu, ShieldCheck, ArrowRight, Activity, Sparkles, Orbit } from 'lucide-react';
import { NeuralCoreCanvas } from '../intelligence-core/NeuralCoreCanvas';
import type { IntelligenceState } from '../../types';

interface HeroProps {
  systemState: IntelligenceState;
  onExploreArchitecture: () => void;
  onExperienceLive: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  systemState,
  onExploreArchitecture,
  onExperienceLive,
}) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-20 sm:pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background ambient lighting orbs */}
      <div className="absolute top-1/4 left-1/4 w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] bg-[#48E5F5]/6 dark:bg-[#48E5F5]/6 light:bg-[#0284C7]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-[#9A83FF]/6 dark:bg-[#9A83FF]/6 light:bg-[#8B5CF6]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
        
        {/* Left Column: Product Messaging */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col text-left space-y-6 sm:space-y-7"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1420]/80 dark:bg-[#0D1420]/80 light:bg-slate-100 border border-white/10 light:border-slate-300 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-[#48E5F5] light:bg-[#0284C7] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-semibold text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600">
              EMIQEN-SLM / VOICE INTELLIGENCE SYSTEM
            </span>
          </div>

          {/* Main Headline (Perfect scaling from mobile 320px to 4K laptops) */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#F4F7FB] dark:text-[#F4F7FB] light:text-[#0F172A] leading-[1.1] break-words">
            Intelligence That Listens.{' '}
            <span className="bg-gradient-to-r from-[#48E5F5] via-[#38BDF8] to-[#9A83FF] bg-clip-text text-transparent">
              Understands.
            </span>{' '}
            Responds.
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base md:text-lg text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 max-w-2xl leading-relaxed font-normal">
            An intelligent voice AI system designed to process conversations, interpret emotional signals, understand context, and generate natural responses through a coordinated small language model pipeline.
          </p>

          {/* Action CTAs (Clean responsive wrapping) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-1">
            <button
              onClick={onExperienceLive}
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#48E5F5] to-[#38C6D5] text-[#080B10] font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(72,229,245,0.4)] active:scale-[0.98] cursor-pointer"
            >
              <Mic className="w-4 h-4 text-[#080B10] transition-transform group-hover:scale-110" />
              <span>Experience Live AI</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExploreArchitecture}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0D1420]/80 dark:bg-[#0D1420]/80 light:bg-white hover:bg-[#121B2C] light:hover:bg-slate-100 text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-800 font-medium text-sm border border-white/10 light:border-slate-300 hover:border-white/20 transition-all duration-300 cursor-pointer shadow-sm"
            >
              <Cpu className="w-4 h-4 text-[#9A83FF]" />
              <span>Explore the Architecture</span>
            </button>
          </div>

          {/* Three Understated Product Capabilities */}
          <div className="pt-6 border-t border-white/[0.08] light:border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.02] dark:bg-white/[0.02] light:bg-slate-50 border border-transparent light:border-slate-200/60">
              <div className="p-1.5 rounded-lg bg-[#48E5F5]/10 border border-[#48E5F5]/20 mt-0.5 shrink-0">
                <Mic className="w-3.5 h-3.5 text-[#48E5F5] light:text-[#0284C7]" />
              </div>
              <div>
                <p className="text-xs font-mono font-semibold tracking-wider text-[#F4F7FB] dark:text-[#F4F7FB] light:text-[#0F172A]">
                  VOICE PERCEPTION
                </p>
                <p className="text-[11px] text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500 mt-0.5 leading-snug">
                  Acoustic ingestion & tokenization
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.02] dark:bg-white/[0.02] light:bg-slate-50 border border-transparent light:border-slate-200/60">
              <div className="p-1.5 rounded-lg bg-[#9A83FF]/10 border border-[#9A83FF]/20 mt-0.5 shrink-0">
                <Activity className="w-3.5 h-3.5 text-[#9A83FF]" />
              </div>
              <div>
                <p className="text-xs font-mono font-semibold tracking-wider text-[#F4F7FB] dark:text-[#F4F7FB] light:text-[#0F172A]">
                  EMOTION INTELLIGENCE
                </p>
                <p className="text-[11px] text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500 mt-0.5 leading-snug">
                  Prosodic & cadence profiling
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.02] dark:bg-white/[0.02] light:bg-slate-50 border border-transparent light:border-slate-200/60">
              <div className="p-1.5 rounded-lg bg-white/5 light:bg-slate-200 border border-white/10 light:border-slate-300 mt-0.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-700" />
              </div>
              <div>
                <p className="text-xs font-mono font-semibold tracking-wider text-[#F4F7FB] dark:text-[#F4F7FB] light:text-[#0F172A]">
                  CONTEXTUAL REASONING
                </p>
                <p className="text-[11px] text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500 mt-0.5 leading-snug">
                  Domain SLM inference layer
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Visualization + Descriptive Explainer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col space-y-4 w-full"
        >
          {/* Main 3D Canvas Card */}
          <div className="w-full relative glass-panel rounded-2xl sm:rounded-3xl p-2 sm:p-4 border border-white/10 light:border-slate-300 shadow-2xl overflow-hidden">
            <div className="absolute top-3 left-4 flex items-center gap-1.5 z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-mono tracking-widest text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 uppercase font-semibold">
                NEURAL ORBITAL CORE
              </span>
            </div>

            <NeuralCoreCanvas state={systemState} />
          </div>

          {/* Description Card Below the 3D Image (Direct User Request) */}
          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 light:border-slate-200 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/5 light:border-slate-200">
              <span className="flex items-center gap-1.5 text-[#48E5F5] light:text-[#0284C7] font-semibold">
                <Orbit className="w-3.5 h-3.5" />
                About the 3D Neural Orbital Core
              </span>
              <span className="text-[10px] text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500 uppercase tracking-wider">
                Live Architecture
              </span>
            </div>

            <p className="text-xs text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 leading-relaxed font-sans">
              This interactive 3D simulation illustrates the real-time inference loop of EMIQEN-SLM. The pulsing radiant nucleus represents the compact autoregressive transformer engine. Concentric orbital rings visualize continuous acoustic phoneme streams and frequency variance, while the outer nodes represent active routing between Voice Perception, Emotion Intelligence, and Context Memory.
            </p>

            {/* Interaction Tips & Telemetry Specs */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#9A83FF]" />
                Touch / cursor moves magnetic field
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/5 light:bg-slate-100 border border-white/5 light:border-slate-200 text-[#48E5F5] light:text-[#0284C7]">
                  &lt;250ms Turnaround
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 light:bg-slate-100 border border-white/5 light:border-slate-200 text-[#9A83FF]">
                  Edge Quantized
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
