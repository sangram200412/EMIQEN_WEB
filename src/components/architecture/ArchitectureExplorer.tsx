import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Server, ArrowDown } from 'lucide-react';
import { ARCHITECTURE_COMPONENTS } from '../../config/product';
import type { ArchitectureComponent } from '../../types';

interface ArchitectureExplorerProps {
  backendConnected: boolean;
}

export const ArchitectureExplorer: React.FC<ArchitectureExplorerProps> = ({
  backendConnected,
}) => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureComponent | null>(
    ARCHITECTURE_COMPONENTS[0]
  );

  return (
    <section id="architecture" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#080B10]">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1420] border border-white/10 text-xs font-mono text-[#48E5F5]">
            <Network className="w-3.5 h-3.5" />
            <span>LOGICAL DATAFLOW ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB]">
            System <span className="text-[#48E5F5]">Architecture</span> Explorer.
          </h2>
          <p className="text-base sm:text-lg text-[#A4ADBB]">
            Inspect the complete end-to-end processing topology. Click any component node to examine its responsibility, schema formats, and verified integration status.
          </p>
        </div>

        {/* Integration Status Notice */}
        <div className="mb-10 p-3.5 rounded-xl bg-[#0D1420] border border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-[#A4ADBB] gap-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-4 h-4 text-[#48E5F5]" />
            <span>
              Live Backend Verification: {backendConnected ? (
                <strong className="text-emerald-400">ONLINE (PORT 8000)</strong>
              ) : (
                <strong className="text-amber-400">STANDALONE / DEMO MODE (CLIENT FALLBACK)</strong>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> AVAILABLE
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> DEMO MODE
            </span>
          </div>
        </div>

        {/* Interactive Architecture Flow Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: The Pipeline Nodes (2 Columns on mobile, 4 on desktop) */}
          <div className="lg:col-span-7 space-y-3">
            
            {/* User Node (Starting Point) */}
            <div className="p-3.5 rounded-xl bg-[#0D1420]/80 border border-white/10 text-center font-mono text-xs text-[#F4F7FB] flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#48E5F5]" />
              <strong>HUMAN CONVERSATIONAL USER (ACOUSTIC SPEECH)</strong>
            </div>

            <div className="flex justify-center my-1 text-[#48E5F5]">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* Pipeline Stage Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ARCHITECTURE_COMPONENTS.map((node, index) => {
                const isSelected = selectedNode?.id === node.id;
                const status = node.status === 'CONNECTED' && !backendConnected ? 'DEMO MODE' : node.status;

                let statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (status === 'DEMO MODE') statusBadge = 'bg-amber-400/10 text-amber-400 border-amber-400/20';
                if (status === 'NOT CONFIGURED') statusBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                return (
                  <motion.div
                    key={node.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-xl text-left border cursor-pointer transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-[#0D1420] border-[#48E5F5] shadow-[0_0_20px_rgba(72,229,245,0.2)]'
                        : 'bg-[#0D1420]/60 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-[10px] text-[#A4ADBB]">0{index + 1} / {node.layer}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded border font-semibold ${statusBadge}`}>
                        {status}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-[#F4F7FB]">
                      {node.name}
                    </h4>
                    <p className="text-[11px] text-[#A4ADBB] mt-1 line-clamp-1">
                      {node.responsibility}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex justify-center my-1 text-[#48E5F5]">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* Audio Output Node (Destination) */}
            <div className="p-3.5 rounded-xl bg-[#0D1420]/80 border border-[#48E5F5]/30 text-center font-mono text-xs text-[#48E5F5] flex items-center justify-center gap-2 shadow-lg shadow-[#48E5F5]/5">
              <span className="w-2 h-2 rounded-full bg-[#48E5F5] animate-pulse" />
              <strong>AUTHENTIC AUDIO OUTPUT (STREAMED TO CLIENT SPEAKERS)</strong>
            </div>

          </div>

          {/* Right: Selected Component Detailed Specification */}
          <div className="lg:col-span-5 sticky top-28">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/10 text-left space-y-5"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#48E5F5]">
                        Component Inspector
                      </span>
                      <h3 className="text-xl font-bold text-[#F4F7FB] mt-0.5">
                        {selectedNode.name}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#080B10] border border-white/10 text-xs font-mono text-[#A4ADBB]">
                      Layer: {selectedNode.layer}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A4ADBB] block">
                      Core Responsibility
                    </span>
                    <p className="text-xs sm:text-sm text-[#F4F7FB] mt-1 leading-relaxed">
                      {selectedNode.responsibility}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A4ADBB] block">
                      Configured Technology / Model
                    </span>
                    <p className="text-xs font-mono text-[#48E5F5] mt-1 bg-[#080B10] p-2.5 rounded-lg border border-white/5">
                      {selectedNode.configuredTechnology}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-lg bg-[#080B10] border border-white/5">
                      <span className="text-[10px] font-mono text-[#A4ADBB] block">Input Schema</span>
                      <span className="text-xs font-mono text-[#F4F7FB] mt-1 block">
                        {selectedNode.inputFormat}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#080B10] border border-white/5">
                      <span className="text-[10px] font-mono text-[#A4ADBB] block">Output Schema</span>
                      <span className="text-xs font-mono text-[#F4F7FB] mt-1 block">
                        {selectedNode.outputFormat}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A4ADBB] block">
                      Implementation Details
                    </span>
                    <p className="text-xs text-[#A4ADBB] mt-1 leading-relaxed">
                      {selectedNode.details}
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
