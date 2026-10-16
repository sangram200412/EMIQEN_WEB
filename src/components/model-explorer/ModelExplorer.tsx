import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Play, CheckCircle2, Binary, Database } from 'lucide-react';
import { PRODUCT_CONFIG } from '../../config/product';

interface FlowStep {
  step: number;
  name: string;
  short: string;
  detail: string;
  technical: string;
  visualTokens: string[];
}

const MODEL_STEPS: FlowStep[] = [
  {
    step: 1,
    name: 'Sentence Tokenization',
    short: 'Byte-Pair / SentencePiece',
    detail: 'Deconstructs the raw speech transcription into sub-word tokens with position indices.',
    technical: 'Vocabulary mapped with specialized colloquial tokens and colloquial contractions.',
    visualTokens: ['[BOS]', 'Bro', 'Ġcan', 'Ġyou', 'Ġexplain', 'Ġthis', '[EOS]'],
  },
  {
    step: 2,
    name: 'Token Embeddings',
    short: 'Vector Representation',
    detail: 'Projects discrete token IDs into dense vector space, joined with positional embeddings.',
    technical: 'd_model embedding dimension with learned token and dialogue-turn encodings.',
    visualTokens: ['vec(0.42)', 'vec(-0.19)', 'vec(0.88)', 'vec(0.05)', 'vec(-0.61)'],
  },
  {
    step: 3,
    name: 'Transformer Attention',
    short: 'Multi-Head Self-Attention',
    detail: 'Computes attention matrices across conversational tokens and injected emotion weights.',
    technical: 'Rotary Position Embeddings (RoPE) and causal masked self-attention blocks.',
    visualTokens: ['Head_1 (Intent)', 'Head_2 (Tone)', 'Head_3 (Context)', 'Head_4 (Grammar)'],
  },
  {
    step: 4,
    name: 'Domain Knowledge Adapter',
    short: 'Specialized Weights',
    detail: 'Applies domain-focused feed-forward parameters tuned for voice queries and concise outputs.',
    technical: 'Low-rank adapted parameters keeping compute footprint minimal on edge hardware.',
    visualTokens: ['MLP_Domain_A', 'SwiGLU_Gate', 'FFN_Projection'],
  },
  {
    step: 5,
    name: 'Next-Token Generation',
    short: 'Autoregressive Decoding',
    detail: 'Calculates probability distribution over the vocabulary to sample the next conversational token.',
    technical: 'Top-k / Top-p sampling with repetition penalty tuned for voice naturalness.',
    visualTokens: ['"Sure"', '"."', '"I\'ll"', '"explain"', '"step"', '"by"', '"step"'],
  },
];

export const ModelExplorer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<FlowStep>(MODEL_STEPS[0]);
  const [isAnimatingFlow, setIsAnimatingFlow] = useState<boolean>(false);
  const [currentFlowIndex, setCurrentFlowIndex] = useState<number>(0);

  const handleStartFlow = () => {
    if (isAnimatingFlow) return;
    setIsAnimatingFlow(true);
    setCurrentFlowIndex(0);
    setActiveStep(MODEL_STEPS[0]);

    MODEL_STEPS.forEach((_, idx) => {
      setTimeout(() => {
        setCurrentFlowIndex(idx);
        setActiveStep(MODEL_STEPS[idx]);
      }, idx * 1100);
    });

    setTimeout(() => {
      setIsAnimatingFlow(false);
    }, MODEL_STEPS.length * 1100 + 400);
  };

  return (
    <section id="model-intelligence" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#080B10]">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#9A83FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-3xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1420] border border-white/10 text-xs font-mono text-[#9A83FF]">
              <Cpu className="w-3.5 h-3.5" />
              <span>DOMAIN-SPECIFIC SLM ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB]">
              Small Model. <span className="text-[#9A83FF]">Purposeful Intelligence</span>.
            </h2>
            <p className="text-base sm:text-lg text-[#A4ADBB]">
              Instead of monolithic models with hundreds of billions of generalist weights, EMIQEN-SLM focuses compute on conversation comprehension, low-latency voice delivery, and domain relevance.
            </p>
          </div>

          <button
            onClick={handleStartFlow}
            disabled={isAnimatingFlow}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-mono font-semibold transition-all duration-300 cursor-pointer ${
              isAnimatingFlow
                ? 'bg-[#0D1420] text-[#A4ADBB] border border-white/10 opacity-70 cursor-wait'
                : 'bg-[#9A83FF] hover:bg-[#8B72FF] text-[#080B10] shadow-[0_0_25px_rgba(154,131,255,0.35)] active:scale-95'
            }`}
          >
            {isAnimatingFlow ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#080B10] border-t-transparent rounded-full animate-spin" />
                <span>Simulating Token Flow...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Explore Model Flow</span>
              </>
            )}
          </button>
        </div>

        {/* Model Specs Note */}
        <div className="mb-10 p-4 rounded-xl bg-[#0D1420] border border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-[#A4ADBB] gap-4">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-[#9A83FF]" />
            <span>Architecture: <strong className="text-[#F4F7FB]">{PRODUCT_CONFIG.modelInfo.architecture}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Deployment Target: {PRODUCT_CONFIG.modelInfo.deploymentTarget}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#A4ADBB]">
            {PRODUCT_CONFIG.modelInfo.status}
          </span>
        </div>

        {/* 5-Step Model Flow Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 lg:gap-4 mb-10">
          {MODEL_STEPS.map((step, idx) => {
            const isSelected = activeStep.step === step.step;
            const isCurrentlyActive = currentFlowIndex === idx && isAnimatingFlow;

            return (
              <motion.div
                key={step.step}
                whileHover={{ y: -3 }}
                onClick={() => setActiveStep(step)}
                className={`p-4 rounded-xl text-left border cursor-pointer transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-[#0D1420] border-[#9A83FF] shadow-[0_0_20px_rgba(154,131,255,0.2)]'
                    : isCurrentlyActive
                    ? 'bg-[#0D1420] border-[#48E5F5] shadow-[0_0_20px_rgba(72,229,245,0.2)]'
                    : 'bg-[#0D1420]/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isSelected ? 'bg-[#9A83FF]/20 text-[#C4B5FD]' : 'bg-white/5 text-[#A4ADBB]'
                  }`}>
                    0{step.step}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#9A83FF]" />}
                </div>

                <h3 className="text-xs font-semibold text-[#F4F7FB] leading-snug">
                  {step.name}
                </h3>
                <p className="text-[10px] font-mono text-[#A4ADBB] mt-1 truncate">
                  {step.short}
                </p>

                {/* Bottom line */}
                <div className={`mt-3 h-0.5 w-full rounded-full transition-colors ${
                  isSelected ? 'bg-[#9A83FF]' : isCurrentlyActive ? 'bg-[#48E5F5]' : 'bg-white/5'
                }`} />
              </motion.div>
            );
          })}
        </div>

        {/* Active Stage Detailed Inspector */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 text-left"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-[#9A83FF]/10 text-[#9A83FF] text-xs font-mono font-semibold">
                    TRANSFORMER PHASE 0{activeStep.step}
                  </span>
                  <span className="text-xs font-mono text-[#A4ADBB]">
                    {activeStep.short}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#F4F7FB]">
                  {activeStep.name}
                </h3>

                <p className="text-sm sm:text-base text-[#A4ADBB] leading-relaxed">
                  {activeStep.detail}
                </p>

                <div className="pt-2">
                  <span className="text-xs font-mono text-[#9A83FF] uppercase tracking-wider block">
                    Computational Mechanism:
                  </span>
                  <p className="text-xs sm:text-sm font-mono text-[#F4F7FB] mt-1 bg-[#080B10] p-3 rounded-lg border border-white/5">
                    {activeStep.technical}
                  </p>
                </div>
              </div>

              {/* Visual Tensor / Token Representation */}
              <div className="lg:col-span-5 p-5 rounded-xl bg-[#080B10] border border-white/10 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs text-[#A4ADBB] pb-2 border-b border-white/5">
                  <span className="flex items-center gap-1.5 text-[#48E5F5]">
                    <Binary className="w-3.5 h-3.5" />
                    Tensor Vector Stream
                  </span>
                  <span className="text-[10px]">REPRESENTATION</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {activeStep.visualTokens.map((tok, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-[#0D1420] border border-[#9A83FF]/30 text-xs text-[#F4F7FB] shadow-sm hover:border-[#48E5F5] transition-colors"
                    >
                      {tok}
                    </span>
                  ))}
                </div>

                <p className="text-[10px] text-[#A4ADBB] pt-3 border-t border-white/5 leading-relaxed">
                  Interactive representation for phase 0{activeStep.step}. Tokens flow directly into downstream multi-head layers.
                </p>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
