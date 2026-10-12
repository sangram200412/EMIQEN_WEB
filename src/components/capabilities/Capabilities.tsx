import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MessageSquareCode, Activity, Cpu, GitFork, Boxes, ArrowUpRight } from 'lucide-react';

export const Capabilities: React.FC = () => {
  return (
    <section id="capabilities" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0D1420]/30">
      {/* Ambient background light */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-[#48E5F5]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080B10] border border-white/10 text-xs font-mono text-[#48E5F5]">
            <Boxes className="w-3.5 h-3.5" />
            <span>CORE SYSTEM COMPETENCIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB]">
            Engineered for <span className="text-[#48E5F5]">Intelligent Conversations</span>.
          </h2>
          <p className="text-base sm:text-lg text-[#A4ADBB]">
            Purpose-built components designed to operate cohesively or modularly across voice capture, tone extraction, and edge inference.
          </p>
        </div>

        {/* Varied Editorial Layout (Asymmetric Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 01: Voice Interaction (Large Hero Card - 7 cols) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-7 glass-panel rounded-2xl p-7 sm:p-8 border border-white/10 text-left flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#48E5F5]/5 rounded-full blur-2xl pointer-events-none transition-all group-hover:bg-[#48E5F5]/10" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#48E5F5]/10 text-[#48E5F5] border border-[#48E5F5]/20">
                  01 / VOICE INTERACTION
                </span>
                <Mic className="w-5 h-5 text-[#48E5F5]" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#F4F7FB] mb-3">
                Continuous Speech Ingestion & Natural Voice Synthesis
              </h3>
              <p className="text-sm text-[#A4ADBB] leading-relaxed max-w-lg">
                Speech input and audio responses through supported speech-processing components. Low-latency client ingestion hooks with adaptive acoustic noise gating.
              </p>
            </div>

            {/* Interactive Visual Element */}
            <div className="mt-8 p-4 rounded-xl bg-[#080B10]/70 border border-white/5 flex items-center justify-between font-mono text-xs text-[#A4ADBB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#48E5F5]" />
                <span>Web Audio Analyser + Stream Buffer</span>
              </div>
              <span className="text-[#48E5F5]">Full-Duplex Ready</span>
            </div>
          </motion.div>

          {/* Card 02: Contextual Responses (5 cols) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-5 glass-panel rounded-2xl p-7 sm:p-8 border border-white/10 text-left flex flex-col justify-between relative overflow-hidden group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white/5 text-[#A4ADBB]">
                  02 / CONTEXTUAL RESPONSES
                </span>
                <MessageSquareCode className="w-5 h-5 text-[#9A83FF]" />
              </div>

              <h3 className="text-xl font-bold text-[#F4F7FB] mb-3">
                Session-Aware Multi-Turn Retention
              </h3>
              <p className="text-sm text-[#A4ADBB] leading-relaxed">
                Response generation informed by conversational memory, resolving pronoun ambiguities and historical dialogue context.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#9A83FF]">
              <span>Sliding Dialogue Buffer</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 03: Emotion-Aware Processing (5 cols) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-5 glass-panel rounded-2xl p-7 sm:p-8 border border-white/10 text-left flex flex-col justify-between relative overflow-hidden group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#9A83FF]/10 text-[#9A83FF] border border-[#9A83FF]/20">
                  03 / EMOTION-AWARE
                </span>
                <Activity className="w-5 h-5 text-[#9A83FF]" />
              </div>

              <h3 className="text-xl font-bold text-[#F4F7FB] mb-3">
                Prosodic & Acoustic Tone Guidance
              </h3>
              <p className="text-sm text-[#A4ADBB] leading-relaxed">
                Evaluation of pitch variance, vocal cadence, and conversational stress markers to guide model empathy and succinctness.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#A4ADBB]">
              <span>Dynamic Tone Weights</span>
              <span className="text-[#9A83FF]">Adaptive</span>
            </div>
          </motion.div>

          {/* Card 04: Domain-Specific Intelligence (7 cols) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-7 glass-panel rounded-2xl p-7 sm:p-8 border border-white/10 text-left flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#9A83FF]/5 rounded-full blur-2xl pointer-events-none transition-all group-hover:bg-[#9A83FF]/10" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white/5 text-[#A4ADBB]">
                  04 / DOMAIN SLM
                </span>
                <Cpu className="w-5 h-5 text-[#48E5F5]" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#F4F7FB] mb-3">
                Specialized Small Language Model Inference
              </h3>
              <p className="text-sm text-[#A4ADBB] leading-relaxed max-w-lg">
                Engineered for the conversational domain: high inference throughput, low RAM footprints, and localized execution without dependency on heavy cloud API charges.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-[#080B10]/70 border border-white/5 flex items-center justify-between font-mono text-xs text-[#A4ADBB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9A83FF]" />
                <span>Transformer Architecture</span>
              </div>
              <span className="text-[#F4F7FB]">Edge & Cloud Hybrid</span>
            </div>
          </motion.div>

          {/* Card 05: Interactive AI Pipeline (6 cols) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-6 glass-panel rounded-2xl p-7 sm:p-8 border border-white/10 text-left flex flex-col justify-between relative overflow-hidden group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#48E5F5]/10 text-[#48E5F5]">
                  05 / INTERACTIVE PIPELINE
                </span>
                <GitFork className="w-5 h-5 text-[#48E5F5]" />
              </div>

              <h3 className="text-xl font-bold text-[#F4F7FB] mb-3">
                Transparent Sequential Processing
              </h3>
              <p className="text-sm text-[#A4ADBB] leading-relaxed">
                Full end-to-end visibility into every stage from raw phonemes to validated generated output tokens. No hidden black-box execution.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#48E5F5]">
              <span>5 Inspection Stages</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 06: Modular Architecture (6 cols) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-6 glass-panel rounded-2xl p-7 sm:p-8 border border-white/10 text-left flex flex-col justify-between relative overflow-hidden group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white/5 text-[#A4ADBB]">
                  06 / MODULAR ARCHITECTURE
                </span>
                <Boxes className="w-5 h-5 text-[#F4F7FB]" />
              </div>

              <h3 className="text-xl font-bold text-[#F4F7FB] mb-3">
                Decoupled Frontend & Backend Structure
              </h3>
              <p className="text-sm text-[#A4ADBB] leading-relaxed">
                ASR, SLM inference, emotion extractors, and TTS synthesize independently. Swap local FastAPIs for cloud endpoints without rewriting UI components.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#A4ADBB]">
              <span>FastAPI / REST / WebSocket Ready</span>
              <span className="text-emerald-400">Zero Lock-In</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
