import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, Layers, ArrowRight } from 'lucide-react';
import { PIPELINE_STAGES } from '../../config/product';
import type { PipelineStage } from '../../types';

interface AgentPipelineProps {
  onStageChange?: (stageId: string) => void;
}

export const AgentPipeline: React.FC<AgentPipelineProps> = () => {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(PIPELINE_STAGES[0]);
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [pipelineLog, setPipelineLog] = useState<string>('Ready to execute sequential pipeline.');

  const runSequentialPipeline = () => {
    if (isRunningPipeline) return;
    setIsRunningPipeline(true);
    setActiveStepIndex(0);
    setSelectedStage(PIPELINE_STAGES[0]);
    setPipelineLog('Stage 01: Ingesting speech audio waveform into acoustic feature buffer...');

    const stepIntervals = [
      { step: 0, text: 'Stage 01: Voice audio buffer transcribed into preliminary token stream.', delay: 1100 },
      { step: 1, text: 'Stage 02: Prosodic pitch and tone classified. Tone signal: Curious / Inquisitive.', delay: 2200 },
      { step: 2, text: 'Stage 03: Resolving dialogue turn memory and idiom disambiguation.', delay: 3300 },
      { step: 3, text: 'Stage 04: Domain SLM transformer generating targeted response tokens.', delay: 4500 },
      { step: 4, text: 'Stage 05: Audio synthesis pipeline activated. Speech waveform generated.', delay: 5700 },
    ];

    stepIntervals.forEach(({ step, text, delay }) => {
      setTimeout(() => {
        setActiveStepIndex(step);
        setSelectedStage(PIPELINE_STAGES[step]);
        setPipelineLog(text);
      }, delay);
    });

    setTimeout(() => {
      setIsRunningPipeline(false);
      setPipelineLog('Pipeline execution completed successfully across all 5 stages.');
    }, 6600);
  };

  return (
    <section id="pipeline" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#080B10]">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1420] border border-white/10 text-xs font-mono text-[#48E5F5]">
              <Layers className="w-3.5 h-3.5" />
              <span>THE AGENT ORCHESTRATION EXPERIENCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB]">
              One Conversation.{' '}
              <span className="text-[#48E5F5]">Multiple Layers</span> of Intelligence.
            </h2>
            <p className="text-base sm:text-lg text-[#A4ADBB]">
              From the first spoken word to the final response, explore the stages that power the EMIQEN-SLM experience.
            </p>
          </div>

          {/* Run Pipeline CTA */}
          <button
            onClick={runSequentialPipeline}
            disabled={isRunningPipeline}
            className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
              isRunningPipeline
                ? 'bg-[#0D1420] text-[#A4ADBB] border border-white/10 opacity-80 cursor-wait'
                : 'bg-gradient-to-r from-[#48E5F5] to-[#9A83FF] text-[#080B10] hover:shadow-[0_0_25px_rgba(72,229,245,0.35)] active:scale-95'
            }`}
          >
            {isRunningPipeline ? (
              <>
                <span className="w-4 h-4 border-2 border-[#48E5F5] border-t-transparent rounded-full animate-spin" />
                <span>Processing Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* Pipeline Execution Banner */}
        <div className="mb-10 px-4 py-3 rounded-xl bg-[#0D1420]/70 border border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRunningPipeline ? 'bg-[#48E5F5]' : 'bg-emerald-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isRunningPipeline ? 'bg-[#48E5F5]' : 'bg-emerald-400'}`} />
            </span>
            <span className="text-[#F4F7FB]">{pipelineLog}</span>
          </div>
          <span className="text-[#A4ADBB] hidden sm:inline">
            Status: {isRunningPipeline ? `Stage 0${activeStepIndex + 1} Active` : 'Idle / Interactive'}
          </span>
        </div>

        {/* Horizontal Visual Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 lg:gap-4 mb-10">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isSelected = selectedStage.id === stage.id;
            const isCurrentlyRunning = activeStepIndex === idx;

            return (
              <motion.div
                key={stage.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedStage(stage)}
                className={`group relative p-5 rounded-xl cursor-pointer transition-all duration-300 text-left border ${
                  isSelected
                    ? 'bg-[#0D1420] border-[#48E5F5] shadow-[0_0_20px_rgba(72,229,245,0.15)]'
                    : isCurrentlyRunning
                    ? 'bg-[#0D1420] border-[#9A83FF] shadow-[0_0_20px_rgba(154,131,255,0.2)]'
                    : 'bg-[#0D1420]/50 border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Node connection pip */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-[#48E5F5]/20 text-[#48E5F5]' : 'bg-white/5 text-[#A4ADBB]'
                  }`}>
                    {stage.number}
                  </span>
                  
                  {isCurrentlyRunning ? (
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9A83FF]" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9A83FF]" />
                    </span>
                  ) : isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-[#48E5F5]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-[#48E5F5]/60 transition-colors" />
                  )}
                </div>

                <h3 className={`text-sm font-semibold tracking-wide transition-colors ${
                  isSelected ? 'text-[#F4F7FB]' : 'text-[#A4ADBB] group-hover:text-[#F4F7FB]'
                }`}>
                  {stage.title}
                </h3>
                <p className="text-[11px] font-mono text-[#A4ADBB]/70 mt-1 uppercase">
                  {stage.category}
                </p>

                {/* Progress highlight line at bottom */}
                <div className={`mt-4 h-0.5 w-full rounded-full transition-all duration-300 ${
                  isSelected ? 'bg-[#48E5F5]' : isCurrentlyRunning ? 'bg-[#9A83FF]' : 'bg-white/10 group-hover:bg-white/20'
                }`} />
              </motion.div>
            );
          })}
        </div>

        {/* Selected Stage Expanded Details Drawer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStage.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden"
          >
            {/* Ambient accent inside card */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#48E5F5]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              
              {/* Left Column: Purpose & Technology */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-[#48E5F5]/10 border border-[#48E5F5]/30 text-xs font-mono font-semibold text-[#48E5F5]">
                    STAGE {selectedStage.number}
                  </span>
                  <span className="text-xs font-mono text-[#A4ADBB]">
                    {selectedStage.category}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F7FB]">
                  {selectedStage.title}
                </h3>

                <p className="text-sm sm:text-base text-[#A4ADBB] leading-relaxed">
                  {selectedStage.fullPurpose}
                </p>

                <div className="pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#A4ADBB]">
                    Configured Technology
                  </span>
                  <p className="text-sm font-semibold text-[#48E5F5] mt-1 font-mono">
                    {selectedStage.configuredTech}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  {selectedStage.metrics.map((m, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#080B10]/60 border border-white/5">
                      <span className="text-[11px] font-mono text-[#A4ADBB] block">
                        {m.label}
                      </span>
                      <span className="text-sm font-semibold text-[#F4F7FB] mt-0.5 block">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Example Input & Output Stream */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <div className="p-4 rounded-xl bg-[#080B10]/80 border border-white/10 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#A4ADBB] pb-2 border-b border-white/5 mb-3">
                    <span className="text-[11px] uppercase tracking-wider">Example Stage Input</span>
                    <span className="text-[10px] text-[#48E5F5]">INCOMING STREAM</span>
                  </div>
                  <p className="text-[#F4F7FB] leading-relaxed bg-[#0D1420] p-3 rounded-lg border border-white/5">
                    {selectedStage.inputExample}
                  </p>
                </div>

                <div className="flex justify-center my-1">
                  <ArrowRight className="w-4 h-4 text-[#48E5F5] rotate-90 lg:rotate-0" />
                </div>

                <div className="p-4 rounded-xl bg-[#080B10]/80 border border-[#48E5F5]/30 font-mono text-xs shadow-lg shadow-[#48E5F5]/5">
                  <div className="flex items-center justify-between text-[#A4ADBB] pb-2 border-b border-white/5 mb-3">
                    <span className="text-[11px] uppercase tracking-wider text-[#48E5F5]">Stage Output</span>
                    <span className="text-[10px] text-[#9A83FF]">DOWNSTREAM READY</span>
                  </div>
                  <p className="text-[#48E5F5] leading-relaxed bg-[#0D1420] p-3 rounded-lg border border-[#48E5F5]/20">
                    {selectedStage.outputExample}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
