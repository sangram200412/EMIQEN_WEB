import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Wifi, WifiOff, RefreshCw, X, ChevronUp } from 'lucide-react';
import { apiService } from '../../services/api';
import type { HealthCheckResult } from '../../services/api';
import type { IntelligenceState } from '../../types';
import { PRODUCT_CONFIG } from '../../config/product';

interface SystemConsoleProps {
  activeState: IntelligenceState;
  onRefreshHealth?: () => void;
}

export const SystemConsole: React.FC<SystemConsoleProps> = ({ activeState }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<HealthCheckResult>({
    isConnected: false,
    statusText: 'DEMO MODE',
    latencyMs: null,
  });

  const checkStatus = async () => {
    setIsChecking(true);
    const res = await apiService.checkHealth();
    setHealthData(res);
    setIsChecking(false);
  };

  useEffect(() => {
    checkStatus();
    // Auto-ping every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#0D1420]/90 backdrop-blur-md border border-white/10 hover:border-[#48E5F5]/40 text-xs font-mono shadow-xl transition-all cursor-pointer group"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                healthData.isConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                healthData.isConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </span>
          <span className="text-[#A4ADBB] group-hover:text-[#F4F7FB] transition-colors">
            SYSTEM TELEMETRY
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-[#A4ADBB]" />
        </motion.button>
      )}

      {/* Expanded Console Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-80 sm:w-96 glass-panel rounded-2xl p-5 border border-white/15 shadow-2xl text-left font-mono"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F7FB]">
                <Terminal className="w-4 h-4 text-[#48E5F5]" />
                <span>EMIQEN STATUS CONSOLE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={checkStatus}
                  disabled={isChecking}
                  title="Ping Backend Endpoint"
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-[#A4ADBB] transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-[#48E5F5]' : ''}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-[#A4ADBB] hover:text-[#F4F7FB] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Status Grid */}
            <div className="space-y-2.5 text-xs">
              
              {/* Backend Connectivity */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#080B10]/80 border border-white/5">
                <div className="flex items-center gap-2 text-[#A4ADBB]">
                  {healthData.isConnected ? (
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>Backend Endpoint</span>
                </div>
                <div className="text-right">
                  <span className={`text-[11px] font-semibold ${
                    healthData.isConnected ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {healthData.statusText}
                  </span>
                  {healthData.latencyMs !== null && (
                    <span className="text-[10px] text-[#A4ADBB] block">
                      {healthData.latencyMs}ms ping
                    </span>
                  )}
                </div>
              </div>

              {/* Speech Processing Module */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#080B10]/80 border border-white/5">
                <span className="text-[#A4ADBB]">Speech Processing</span>
                <span className="text-[11px] font-semibold text-emerald-400">
                  AVAILABLE (BROWSER)
                </span>
              </div>

              {/* SLM Inference Layer */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#080B10]/80 border border-white/5">
                <span className="text-[#A4ADBB]">SLM Reasoning</span>
                <span className="text-[11px] font-semibold text-amber-400">
                  {healthData.isConnected ? 'CONNECTED' : 'DEMO MODE'}
                </span>
              </div>

              {/* Emotion Analysis */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#080B10]/80 border border-white/5">
                <span className="text-[#A4ADBB]">Emotion Analysis</span>
                <span className="text-[11px] font-semibold text-emerald-400">
                  AVAILABLE
                </span>
              </div>

              {/* Voice Generation */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#080B10]/80 border border-white/5">
                <span className="text-[#A4ADBB]">Voice Generation</span>
                <span className="text-[11px] font-semibold text-emerald-400">
                  AVAILABLE (TTS)
                </span>
              </div>

              {/* Active Interaction State */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#080B10]/80 border border-white/5">
                <span className="text-[#A4ADBB]">Pipeline State</span>
                <span className="text-[11px] font-semibold text-[#48E5F5] uppercase">
                  {activeState}
                </span>
              </div>

            </div>

            {/* Endpoint Reference */}
            <div className="mt-3 pt-2.5 border-t border-white/5 text-[10px] text-[#A4ADBB]/70 flex items-center justify-between">
              <span className="truncate">URL: {PRODUCT_CONFIG.backendApiUrl}</span>
              <span className="shrink-0 text-emerald-400">v{PRODUCT_CONFIG.version}</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
