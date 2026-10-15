import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { Hero } from './components/hero/Hero';
import { AgentPipeline } from './components/agent-pipeline/AgentPipeline';
import { VoicePlayground } from './components/voice-playground/VoicePlayground';
import { VoiceConverterLab } from './components/voice-lab/VoiceConverterLab';
import { EmotionVisualizer } from './components/emotion-visualizer/EmotionVisualizer';
import { IndiaAwareSection } from './components/india-aware/IndiaAwareSection';
import { ModelExplorer } from './components/model-explorer/ModelExplorer';
import { Capabilities } from './components/capabilities/Capabilities';
import { ArchitectureExplorer } from './components/architecture/ArchitectureExplorer';
import { ContactUs } from './components/contact/ContactUs';
import { FinalCta } from './components/cta/FinalCta';
import { Footer } from './components/footer/Footer';
import { SystemConsole } from './components/system-status/SystemConsole';
import { LoginModal } from './components/auth/LoginModal';
import type { UserProfile } from './components/auth/LoginModal';
import { ChatWorkspace } from './components/chat/ChatWorkspace';
import { AdvancedBackground } from './components/common/AdvancedBackground';
import { useTheme } from './hooks/useTheme';
import { audioService } from './services/audio';
import { apiService } from './services/api';
import type { IntelligenceState } from './types';

export function App() {
  const { theme, setTheme } = useTheme();
  const [systemState, setSystemState] = useState<IntelligenceState>('idle');
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  const handleStateChange = useCallback((st: IntelligenceState) => {
    setSystemState(st);
  }, []);

  // Authentication & Chat Workspace state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('emiqen-user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.name === 'Sangram Sethi') {
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

  // Poll audio frequencies smoothly when active
  useEffect(() => {
    let animId: number;
    let lastUpdate = 0;
    const updateAudioData = (timestamp: number) => {
      // Throttle frequency polling to ~25fps (every 40ms) to ensure butter-smooth rendering
      if (timestamp - lastUpdate >= 40) {
        lastUpdate = timestamp;
        const data = audioService.getFrequencyData();
        setFrequencyData(data);
      }
      animId = requestAnimationFrame(updateAudioData);
    };

    animId = requestAnimationFrame(updateAudioData);
    return () => cancelAnimationFrame(animId);
  }, []);

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
      <ChatWorkspace
        user={currentUser}
        onLogout={handleLogout}
        onBackToWebsite={() => setIsChatWorkspaceOpen(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
        frequencyData={frequencyData}
      />
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
      <main>
        {/* Hero with Interactive 3D Neural Core */}
        <Hero
          systemState={systemState}
          onExploreArchitecture={() => scrollToSection('architecture')}
          onExperienceLive={() => scrollToSection('playground')}
          frequencyData={frequencyData}
        />

        {/* 5-Stage Orchestration Experience */}
        <AgentPipeline />

        {/* Live Voice Playground */}
        <VoicePlayground
          onStateChange={handleStateChange}
          frequencyData={frequencyData}
        />

        {/* Dedicated Speech to Text & Text to Speech Studio */}
        <VoiceConverterLab frequencyData={frequencyData} />

        {/* Emotion Intelligence Visualizer */}
        <EmotionVisualizer />

        {/* India-Aware Conversation Experience */}
        <IndiaAwareSection />

        {/* Small Model Architecture Explorer */}
        <ModelExplorer />

        {/* Engineered Product Capabilities Grid */}
        <Capabilities />

        {/* End-to-End System Architecture Explorer */}
        <ArchitectureExplorer backendConnected={backendConnected} />

        {/* Enterprise & Developer Contact Section */}
        <ContactUs />

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
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default App;
