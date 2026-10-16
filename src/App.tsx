import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { Hero } from './components/hero/Hero';
import { VoicePlayground } from './components/voice-playground/VoicePlayground';
import { FinalCta } from './components/cta/FinalCta';
import { Footer } from './components/footer/Footer';
import { SystemConsole } from './components/system-status/SystemConsole';
import type { UserProfile } from './components/auth/LoginModal';
import { AdvancedBackground } from './components/common/AdvancedBackground';
import { useTheme } from './hooks/useTheme';
import { audioService } from './services/audio';
import { apiService } from './services/api';
import type { IntelligenceState } from './types';

// Lazy-load below-the-fold components and heavy modals for maximum Core Web Vitals & PageSpeed
const VoiceConverterLab = lazy(() =>
  import('./components/voice-lab/VoiceConverterLab').then((m) => ({ default: m.VoiceConverterLab }))
);
const EmotionVisualizer = lazy(() =>
  import('./components/emotion-visualizer/EmotionVisualizer').then((m) => ({ default: m.EmotionVisualizer }))
);
const ModelExplorer = lazy(() =>
  import('./components/model-explorer/ModelExplorer').then((m) => ({ default: m.ModelExplorer }))
);
const AgentPipeline = lazy(() =>
  import('./components/agent-pipeline/AgentPipeline').then((m) => ({ default: m.AgentPipeline }))
);
const ArchitectureExplorer = lazy(() =>
  import('./components/architecture/ArchitectureExplorer').then((m) => ({ default: m.ArchitectureExplorer }))
);
const ContactUs = lazy(() =>
  import('./components/contact/ContactUs').then((m) => ({ default: m.ContactUs }))
);
const LoginModal = lazy(() =>
  import('./components/auth/LoginModal').then((m) => ({ default: m.LoginModal }))
);
const ChatWorkspace = lazy(() =>
  import('./components/chat/ChatWorkspace').then((m) => ({ default: m.ChatWorkspace }))
);

export function App() {
  const { theme, setTheme } = useTheme();
  const [systemState, setSystemState] = useState<IntelligenceState>('idle');
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  const handleStateChange = useCallback((st: IntelligenceState) => {
    setSystemState(st);
  }, []);

  // Authentication & Chat Workspace state (Strict Google/Gmail Account validation)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('emiqen-user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const email = String(parsed?.email || '').trim().toLowerCase();
        const isGoogleAccount = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@(gmail\.com|googlemail\.com)$/.test(email);
        
        if (parsed?.name === 'Sangram Sethi' || !isGoogleAccount) {
          localStorage.removeItem('emiqen-user');
          return null;
        }
        return parsed;
      } catch {}
    }
    return null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChatWorkspaceOpen, setIsChatWorkspaceOpen] = useState(false);

  // Poll audio frequencies smoothly ONLY when system is actively listening/thinking/speaking.
  // When idle, avoids 25fps continuous root re-renders that exhaust the main thread.
  useEffect(() => {
    if (systemState === 'idle') {
      setFrequencyData([]);
      return;
    }

    let animId: number;
    let lastUpdate = 0;
    const updateAudioData = (timestamp: number) => {
      if (timestamp - lastUpdate >= 40) {
        lastUpdate = timestamp;
        const data = audioService.getFrequencyData();
        setFrequencyData(data);
      }
      animId = requestAnimationFrame(updateAudioData);
    };

    animId = requestAnimationFrame(updateAudioData);
    return () => cancelAnimationFrame(animId);
  }, [systemState]);

  // Health check on mount
  useEffect(() => {
    const initCheck = async () => {
      const health = await apiService.checkHealth();
      setBackendConnected(health.isConnected);
    };
    initCheck();
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('emiqen-user', JSON.stringify(user));
    setIsChatWorkspaceOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('emiqen-user');
    setIsChatWorkspaceOpen(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If user is inside the full-screen chat workspace
  if (isChatWorkspaceOpen && currentUser) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-theme-base flex items-center justify-center text-slate-400">Loading Workspace...</div>}>
        <ChatWorkspace
          user={currentUser}
          onLogout={handleLogout}
          onBackToWebsite={() => setIsChatWorkspaceOpen(false)}
          currentTheme={theme}
          onThemeChange={setTheme}
          frequencyData={frequencyData}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-theme-base text-theme-base transition-colors duration-300 font-sans antialiased relative overflow-x-hidden selection:bg-[#38BDF8]/20 selection:text-[#38BDF8]">
      
      {/* Advanced Ambient Cybernetic Background */}
      <AdvancedBackground />

      {/* Navigation Header */}
      <Navbar
        onScrollToSection={scrollToSection}
        backendConnected={backendConnected}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        user={currentUser}
        onOpenChat={() => setIsChatWorkspaceOpen(true)}
        currentTheme={theme}
        onThemeChange={setTheme}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Hero with Interactive 3D Neural Core */}
        <Hero
          systemState={systemState}
          onExploreArchitecture={() => scrollToSection('architecture')}
          onExperienceLive={() => scrollToSection('playground')}
          frequencyData={frequencyData}
        />

        {/* Live Voice Playground (Voice Studio) */}
        <VoicePlayground
          onStateChange={handleStateChange}
          frequencyData={frequencyData}
        />

        {/* Suspense-wrapped below-the-fold modules for lightning-fast initial load */}
        <Suspense fallback={<div className="py-24 text-center text-xs font-mono text-slate-500">Loading module...</div>}>
          {/* Dedicated Text Studio (Speech to Text & Text to Speech) */}
          <VoiceConverterLab frequencyData={frequencyData} />

          {/* Emotion Intelligence Visualizer */}
          <EmotionVisualizer />

          {/* Small Model Architecture Explorer (SLM Core) */}
          <ModelExplorer />

          {/* 5-Stage Orchestration Experience (Pipeline) */}
          <AgentPipeline />

          {/* End-to-End System Architecture Explorer */}
          <ArchitectureExplorer backendConnected={backendConnected} />

          {/* Enterprise & Developer Contact Section */}
          <ContactUs />
        </Suspense>

        {/* Dramatic Closing CTA */}
        <FinalCta
          onTryLive={() => scrollToSection('playground')}
          onExploreTech={() => scrollToSection('model-intelligence')}
        />
      </main>

      {/* Refined Footer */}
      <Footer onScrollToSection={scrollToSection} />

      {/* Floating System Console */}
      <SystemConsole activeState={systemState} />

      {/* Login Authentication Modal */}
      {isLoginModalOpen && (
        <Suspense fallback={null}>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </Suspense>
      )}

    </div>
  );
}

export default App;
