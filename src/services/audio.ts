// Audio service with Web Audio Analyser and Speech Synthesis

export class AudioService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;

  async initMicrophone(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { success: false, error: 'MediaDevices API is not supported in this browser environment.' };
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Microphone permission was denied or failed.';
      return { success: false, error: errorMsg };
    }
  }

  getFrequencyData(): number[] {
    if (!this.analyser || !this.dataArray) {
      // Fallback synthetic wave simulation
      const count = 16;
      const values: number[] = [];
      const time = Date.now() / 150;
      for (let i = 0; i < count; i++) {
        values.push(Math.abs(Math.sin(time + i * 0.4)) * 70 + 20);
      }
      return values;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.analyser as any).getByteFrequencyData(this.dataArray);
    return Array.from(this.dataArray.slice(0, 16));
  }

  stopMicrophone() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.enabled = false;
          track.stop();
        } catch {}
      });
      this.mediaStream = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {}
      this.sourceNode = null;
    }
    if (this.analyser) {
      try {
        this.analyser.disconnect();
      } catch {}
      this.analyser = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close().catch(() => {});
      } catch {}
      this.audioContext = null;
    }
    this.dataArray = null;
  }

  speak(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) setTimeout(onEnd, 2000);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.lang.includes('en') && v.name.includes('Natural')) || v.name.includes('Google') || v.name.includes('Samantha')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioService = new AudioService();
