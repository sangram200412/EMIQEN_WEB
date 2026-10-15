import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Cpu, ShieldCheck, ArrowRight, Activity, Sparkles, Orbit } from 'lucide-react';
import { NeuralCoreCanvas } from '../intelligence-core/NeuralCoreCanvas';
import type { IntelligenceState } from '../../types';

interface HeroProps {
  systemState: IntelligenceState;
  onExploreArchitecture: () => void;
  onExperienceLive: () => void;
  frequencyData?: number[];
}

export const Hero: React.FC<HeroProps> = ({
  systemState,
  onExploreArchitecture,
  onExperienceLive,
  frequencyData = [],
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7] dark:bg-[#38BDF8] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-semibold text-slate-600 dark:text-[#94A3B8]">
              EMIQEN-SLM / VOICE INTELLIGENCE SYSTEM
            </span>
          </div>

          {/* Main Headline (Always 100% visible in both Light and Dark mode) */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-[1.1] break-words">
            <span className="text-[#0F172A] dark:text-[#F8FAFC]">Intelligence That Listens. </span>
            <span className="bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#8B5CF6] dark:from-[#38BDF8] dark:via-[#48E5F5] dark:to-[#A78BFA] bg-clip-text text-transparent inline-block">
              Understands.
            </span>{' '}
            <span className="text-[#0F172A] dark:text-[#F8FAFC]">Responds.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-[#94A3B8] max-w-2xl leading-relaxed font-normal">
            An intelligent voice AI system designed to process conversations, interpret emotional signals, understand context, and generate natural responses through a coordinated small language model pipeline.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-1">
            <button
              onClick={onExperienceLive}
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] dark:from-[#38BDF8] dark:to-[#38C6D5] text-white dark:text-[#0F172A] font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] active:scale-[0.98] cursor-pointer"
            >
              <Mic className="w-4 h-4 text-white dark:text-[#0F172A] transition-transform group-hover:scale-110" />
              <span>Experience Live AI</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExploreArchitecture}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-[#1E293B] dark:hover:bg-[#283548] text-slate-800 dark:text-[#F8FAFC] font-medium text-sm border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 transition-all duration-300 cursor-pointer shadow-sm"
            >
              <Cpu className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
              <span>Explore the Architecture</span>
            </button>
          </div>

          {/* Three Understated Product Capabilities */}
          <div className="pt-6 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-transparent">
              <div className="p-1.5 rounded-lg bg-[#0284C7]/10 dark:bg-[#38BDF8]/15 border border-[#0284C7]/20 dark:border-[#38BDF8]/30 mt-0.5 shrink-0">
                <Mic className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" />
              </div>
              <div>
                <p className="text-xs font-mono font-semibold tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
                  VOICE PERCEPTION
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                  Acoustic ingestion & tokenization
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-transparent">
              <div className="p-1.5 rounded-lg bg-[#7C3AED]/10 dark:bg-[#A78BFA]/15 border border-[#7C3AED]/20 dark:border-[#A78BFA]/30 mt-0.5 shrink-0">
                <Activity className="w-3.5 h-3.5 text-[#7C3AED] dark:text-[#A78BFA]" />
              </div>
              <div>
                <p className="text-xs font-mono font-semibold tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
                  EMOTION INTELLIGENCE
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                  Prosodic & cadence profiling
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-transparent">
              <div className="p-1.5 rounded-lg bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/15 mt-0.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700 dark:text-[#F8FAFC]" />
              </div>
              <div>
                <p className="text-xs font-mono font-semibold tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
                  CONTEXTUAL REASONING
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                  Domain SLM inference layer
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Always-Active 3D Visualization + Descriptive Explainer */}
        <div className="lg:col-span-5 flex flex-col space-y-4 w-full">
          {/* Main 3D Canvas Card */}
          <div className="w-full relative glass-panel rounded-2xl sm:rounded-3xl p-2 sm:p-4 border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute top-3 left-4 flex items-center gap-1.5 z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              <span className="text-[10px] font-mono tracking-widest text-slate-600 dark:text-[#94A3B8] uppercase font-semibold">
                NEURAL ORBITAL CORE
              </span>
            </div>

            <NeuralCoreCanvas state={systemState} frequencyData={frequencyData} />
          </div>

          {/* Description Card Below the 3D Image (Direct User Request) */}
          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-200/60 dark:border-white/5">
              <span className="flex items-center gap-1.5 text-[#0284C7] dark:text-[#38BDF8] font-semibold">
                <Orbit className="w-3.5 h-3.5" />
                About the 3D Neural Orbital Core
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                Autonomous 3D Live
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed font-sans">
              This autonomous 3D simulation illustrates the real-time inference loop of EMIQEN-SLM. The pulsing radiant nucleus represents the compact autoregressive transformer engine. Concentric 3D orbital rings visualize continuous acoustic phoneme streams and frequency variance, while the outer satellite nodes represent active routing between Voice Perception, Emotion Intelligence, and Context Memory.
            </p>

            {/* Interaction Tips & Telemetry Specs */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#7C3AED] dark:text-[#A78BFA]" />
                Continuous 3D Spin • Drag / Touch to tilt
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[#0284C7] dark:text-[#38BDF8]">
                  &lt;250ms Turnaround
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[#7C3AED] dark:text-[#A78BFA]">
                  Edge Quantized
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
