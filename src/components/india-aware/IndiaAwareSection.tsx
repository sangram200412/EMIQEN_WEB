import React, { useState } from 'react';
import { Languages, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { INDIA_CONVERSATION_EXAMPLES } from '../../config/product';
import type { IndiaConversationExample } from '../../types';

export const IndiaAwareSection: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<IndiaConversationExample>(
    INDIA_CONVERSATION_EXAMPLES[0]
  );

  return (
    <section id="india-aware" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0D1420]/50">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#48E5F5]/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080B10] border border-white/10 text-xs font-mono text-[#48E5F5]">
            <Languages className="w-3.5 h-3.5" />
            <span>LOCAL CONTEXT & MULTI-LINGUAL INTENT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB]">
            AI That Understands <span className="text-[#48E5F5]">the Way We Speak</span>.
          </h2>
          <p className="text-base sm:text-lg text-[#A4ADBB]">
            Conversations in real life are rarely textbook English. EMIQEN-SLM adapts to colloquial phrasing, Indian English nuances, and everyday mixed-language context without robotic rigidity.
          </p>
        </div>

        {/* Technical Boundary Disclaimer */}
        <div className="mb-8 p-3 rounded-xl bg-[#080B10] border border-white/10 flex items-center justify-between text-xs font-mono text-[#A4ADBB]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#48E5F5] shrink-0" />
            <span>
              Evaluated on colloquial English, Hinglish expressions, and regional idioms. Does not claim universal support for all 22 scheduled Indian languages.
            </span>
          </div>
          <span className="text-[10px] text-[#A4ADBB] hidden sm:inline">
            Targeted Domain Scope
          </span>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          {INDIA_CONVERSATION_EXAMPLES.map((item) => {
            const isSelected = item.id === selectedExample.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedExample(item)}
                className={`p-3.5 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#080B10] border-[#48E5F5] shadow-[0_0_20px_rgba(72,229,245,0.15)]'
                    : 'bg-[#080B10]/40 border-white/5 hover:border-white/20'
                }`}
              >
                <span className={`text-[10px] font-mono uppercase tracking-wider block font-semibold ${
                  isSelected ? 'text-[#48E5F5]' : 'text-[#A4ADBB]'
                }`}>
                  {item.tag}
                </span>
                <p className="text-xs font-semibold text-[#F4F7FB] mt-1 truncate">
                  "{item.inputPhrase}"
                </p>
              </button>
            );
          })}
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Conversational Token Dissection */}
          <div className="lg:col-span-6 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between text-left space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#F4F7FB] font-semibold">
                  Input Utterance & Token Mapping
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#48E5F5]/10 text-[#48E5F5]">
                  TOKEN ANALYZER
                </span>
              </div>

              {/* Highlighted Token Flow */}
              <div className="p-4 rounded-xl bg-[#080B10] border border-white/10 mb-5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A4ADBB] block mb-2">
                  Interactive Token Decomposition
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedExample.tokensBreakdown.map((t, idx) => {
                    let badgeClass = 'bg-white/5 text-[#F4F7FB] border-white/10';
                    if (t.type === 'colloquial') badgeClass = 'bg-[#48E5F5]/15 text-[#48E5F5] border-[#48E5F5]/30';
                    if (t.type === 'intent') badgeClass = 'bg-[#9A83FF]/15 text-[#9A83FF] border-[#9A83FF]/30';
                    if (t.type === 'domain') badgeClass = 'bg-amber-400/15 text-amber-300 border-amber-400/30';

                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium ${badgeClass}`}
                      >
                        {t.token}
                        <span className="text-[9px] opacity-70 ml-1.5 uppercase">({t.type})</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Detected Linguistic Markers */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#A4ADBB] block">
                  Identified Contextual Markers
                </span>
                <div className="space-y-1.5">
                  {selectedExample.linguisticMarkers.map((marker, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-[#F4F7FB]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#48E5F5]" />
                      <span>{marker}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="p-4 rounded-xl bg-[#080B10]/60 border border-white/5 text-xs text-[#A4ADBB] leading-relaxed">
              <span className="text-[#48E5F5] font-semibold block mb-1">Architecture Insight:</span>
              {selectedExample.contextExplanation}
            </div>
          </div>

          {/* Right Column: Comparative Responses (Conventional vs EMIQEN) */}
          <div className="lg:col-span-6 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between text-left space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#F4F7FB] font-semibold">
                  Inference Contrast
                </span>
                <span className="text-[10px] font-mono text-[#A4ADBB]">
                  SIDE-BY-SIDE
                </span>
              </div>

              {/* Conventional Rigid Model */}
              <div className="p-4 rounded-xl bg-[#080B10] border border-white/5 mb-4 opacity-75">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A4ADBB] mb-2">
                  <span className="text-rose-400 font-semibold">Standard Monolithic LLM</span>
                  <span className="text-[10px]">Literal Syntax Mode</span>
                </div>
                <p className="text-xs text-[#A4ADBB] leading-relaxed font-mono">
                  {selectedExample.literalInterpretation}
                </p>
              </div>

              {/* EMIQEN-SLM Response */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#48E5F5]/40 shadow-lg shadow-[#48E5F5]/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#48E5F5]/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between text-[11px] font-mono text-[#48E5F5] mb-2">
                  <span className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    EMIQEN-SLM Adapted Response
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#48E5F5]/20 text-[#48E5F5] text-[10px]">
                    CONTEXT RESOLVED
                  </span>
                </div>

                <p className="text-sm sm:text-base text-[#F4F7FB] font-medium leading-relaxed mt-2">
                  "{selectedExample.emiqenContextualResponse}"
                </p>
              </div>
            </div>

            {/* Bottom Indicator */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#A4ADBB]">
              <span>Latency Impact: Negligible (&lt;12ms token processing)</span>
              <span className="text-[#48E5F5]">Edge-Deployable</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
