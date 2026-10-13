import React, { useState } from 'react';
import { FileText, ArrowUp, X, ExternalLink, Code2 } from 'lucide-react';
import { PRODUCT_CONFIG } from '../../config/product';
import { BrandLogo } from '../common/BrandLogo';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection }) => {
  const [docModalOpen, setDocModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#080B10] text-[#A4ADBB] py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/[0.06] text-left">
        
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <BrandLogo size="md" />

          <p className="text-xs text-[#A4ADBB] max-w-sm leading-relaxed">
            {PRODUCT_CONFIG.tagline}
          </p>

          <p className="text-xs text-[#A4ADBB]/70 max-w-sm leading-relaxed">
            {PRODUCT_CONFIG.summary}
          </p>
        </div>

        {/* Product Navigation */}
        <div className="md:col-span-3 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F4F7FB] block">
            Navigation
          </span>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onScrollToSection('pipeline')}
                className="hover:text-[#48E5F5] transition-colors cursor-pointer"
              >
                Orchestration Pipeline
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('playground')}
                className="hover:text-[#48E5F5] transition-colors cursor-pointer"
              >
                Live Voice Playground
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('voice-lab')}
                className="hover:text-[#48E5F5] transition-colors cursor-pointer"
              >
                Speech to Text & Text to Speech Lab
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('emotion-intelligence')}
                className="hover:text-[#48E5F5] transition-colors cursor-pointer"
              >
                Emotion Intelligence Visualizer
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('india-aware')}
                className="hover:text-[#48E5F5] transition-colors cursor-pointer"
              >
                India Context & Multi-Lingual Intent
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('model-intelligence')}
                className="hover:text-[#48E5F5] transition-colors cursor-pointer"
              >
                Small Model Architecture
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('architecture')}
                className="hover:text-[#48E5F5] transition-colors cursor-pointer"
              >
                End-to-End System Architecture
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('contact')}
                className="hover:text-[#48E5F5] transition-colors cursor-pointer"
              >
                Contact & Enterprise Inquiries
              </button>
            </li>
          </ul>
        </div>

        {/* Resources & Repository */}
        <div className="md:col-span-4 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F4F7FB] block">
            Architecture & Specs
          </span>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => setDocModalOpen(true)}
                className="inline-flex items-center gap-1.5 hover:text-[#48E5F5] transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#48E5F5]" />
                <span>Technical Specifications & Whitepaper</span>
              </button>
            </li>
            <li>
              <a
                href={PRODUCT_CONFIG.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#48E5F5] transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-[#9A83FF]" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-[#A4ADBB]/60" />
              </a>
            </li>
            <li className="pt-2 text-[11px] font-mono text-[#A4ADBB]/60">
              Backend Integration Target: FastAPI / Python ASGI
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Legal & Back to Top */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A4ADBB]/60 gap-4">
        <p className="font-mono text-[11px]">
          © {new Date().getFullYear()} {PRODUCT_CONFIG.name}. Built with domain-specific small language models.
        </p>

        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 text-xs hover:text-[#F4F7FB] transition-colors font-mono cursor-pointer"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Technical Documentation Modal */}
      {docModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl p-6 sm:p-8 border border-white/15 text-left font-sans shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#48E5F5]" />
                <h3 className="text-lg font-bold text-[#F4F7FB]">
                  EMIQEN-SLM Technical Specifications
                </h3>
              </div>
              <button
                onClick={() => setDocModalOpen(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#A4ADBB] hover:text-[#F4F7FB] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#A4ADBB] leading-relaxed">
              <section>
                <h4 className="font-mono font-semibold text-[#48E5F5] uppercase text-xs mb-1">
                  1. Model Categorization & Scope
                </h4>
                <p>
                  EMIQEN-SLM is a specialized small language model engineered for interactive voice dialogues. It avoids the parameter bloat of general-purpose LLMs by prioritizing conversational phoneme tokenization, prosodic nuance, and targeted multi-turn dialogue memory.
                </p>
              </section>

              <section>
                <h4 className="font-mono font-semibold text-[#9A83FF] uppercase text-xs mb-1">
                  2. Acoustic & Prosodic Signal Fusion
                </h4>
                <p>
                  The emotion layer calculates pitch variance (F0 fundamental frequency contour), cadence velocity, and conversational stress markers. These signals serve as numerical conditioning weights for the transformer decoding head rather than deterministic psychological assertions.
                </p>
              </section>

              <section>
                <h4 className="font-mono font-semibold text-[#48E5F5] uppercase text-xs mb-1">
                  3. Indian English & Colloquial Handling
                </h4>
                <p>
                  Token dictionaries include colloquial tags, discourse markers, and everyday expressions (e.g. "Bro", "Yaar", "kya scene hai", "revert back"). Colloquial embeddings map directly into semantic intent vectors without requiring formal rephrasing.
                </p>
              </section>

              <section>
                <h4 className="font-mono font-semibold text-emerald-400 uppercase text-xs mb-1">
                  4. Fast Local Inference & Deployment
                </h4>
                <p>
                  Built to operate seamlessly on edge nodes, client browsers (via WebAssembly/WebGPU pipelines), or lightweight FastAPI backends with sub-250ms target latencies.
                </p>
              </section>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setDocModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#48E5F5] text-[#080B10] font-semibold text-xs"
              >
                Close Specifications
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
