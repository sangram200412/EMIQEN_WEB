import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Cpu, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
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
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-grid-pattern">
      {/* Subtle radial ambient illumination */}
      <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-[#48E5F5]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[480px] h-[480px] bg-[#9A83FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Column: Product Messaging */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col text-left space-y-7"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1420] border border-white/10 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-[#48E5F5] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest uppercase font-semibold text-[#A4ADBB]">
              EMIQEN-SLM / VOICE INTELLIGENCE SYSTEM
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#F4F7FB] leading-[1.08]">
            Intelligence That Listens.{' '}
            <span className="bg-gradient-to-r from-[#48E5F5] via-[#A0E9F9] to-[#9A83FF] bg-clip-text text-transparent">
              Understands.
            </span>{' '}
            Responds.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#A4ADBB] max-w-2xl leading-relaxed font-normal">
            An intelligent voice AI system designed to process conversations, interpret emotional signals, understand context, and generate natural responses through a coordinated small language model pipeline.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExperienceLive}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#48E5F5] to-[#38C6D5] text-[#080B10] font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(72,229,245,0.4)] active:scale-[0.98] cursor-pointer"
            >
              <Mic className="w-4 h-4 text-[#080B10] transition-transform group-hover:scale-110" />
              <span>Experience Live AI</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExploreArchitecture}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0D1420]/80 hover:bg-[#121B2C] text-[#F4F7FB] font-medium text-sm border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-[#9A83FF]" />
              <span>Explore the Architecture</span>
            </button>
          </div>

          {/* Three Understated Product Capabilities */}
          <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#48E5F5]/10 border border-[#48E5F5]/20 mt-0.5">
                <Mic className="w-3.5 h-3.5 text-[#48E5F5]" />
              </div>
              <div>
                <p className="text-xs font-mono font-semibold tracking-wider text-[#F4F7FB]">
                  VOICE PERCEPTION
                </p>
                <p className="text-[11px] text-[#A4ADBB] mt-0.5 leading-snug">
                  Acoustic ingestion & tokenization
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#9A83FF]/10 border border-[#9A83FF]/20 mt-0.5">
                <Activity className="w-3.5 h-3.5 text-[#9A83FF]" />
              </div>
              <div>
                <p className="text-xs font-mono font-semibold tracking-wider text-[#F4F7FB]">
                  EMOTION INTELLIGENCE
                </p>
                <p className="text-[11px] text-[#A4ADBB] mt-0.5 leading-snug">
                  Prosodic & cadence profiling
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F4F7FB]" />
              </div>
              <div>
                <p className="text-xs font-mono font-semibold tracking-wider text-[#F4F7FB]">
                  CONTEXTUAL REASONING
                </p>
                <p className="text-[11px] text-[#A4ADBB] mt-0.5 leading-snug">
                  Domain SLM inference layer
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Original AI Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative flex items-center justify-center"
        >
          <div className="w-full relative glass-panel rounded-2xl p-2 sm:p-4 border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute top-3 left-4 flex items-center gap-1.5 z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-mono tracking-widest text-[#A4ADBB] uppercase">
                NEURAL ORBITAL CORE
              </span>
            </div>

            <NeuralCoreCanvas state={systemState} />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
