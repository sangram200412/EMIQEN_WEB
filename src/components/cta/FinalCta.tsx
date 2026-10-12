import React, { useEffect, useRef } from 'react';
import { Mic, ArrowRight, Cpu, Sparkles } from 'lucide-react';

interface FinalCtaProps {
  onTryLive: () => void;
  onExploreTech: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onTryLive, onExploreTech }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Converging particle simulation
    const particleCount = 80;
    const particles = Array.from({ length: particleCount }, () => ({
      dist: 50 + Math.random() * 250,
      angle: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.8,
      size: 1 + Math.random() * 2,
      color: Math.random() > 0.4 ? '#48E5F5' : '#9A83FF',
      alpha: 0.2 + Math.random() * 0.7,
    }));

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Subtle converging glow in center
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140);
      grad.addColorStop(0, 'rgba(72, 229, 245, 0.15)');
      grad.addColorStop(0.5, 'rgba(154, 131, 255, 0.08)');
      grad.addColorStop(1, 'rgba(8, 11, 16, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 150, 0, Math.PI * 2);
      ctx.fill();

      // Render converging particles
      particles.forEach((p) => {
        p.dist -= p.speed;
        p.angle += 0.005;

        // Reset if reached nucleus
        if (p.dist < 15) {
          p.dist = 220 + Math.random() * 80;
        }

        const px = cx + Math.cos(p.angle) * p.dist;
        const py = cy + Math.sin(p.angle) * (p.dist * 0.48);

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * Math.min(1, p.dist / 40);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Central core dot
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#48E5F5';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative bg-[#080B10] overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-8 sm:p-14 border border-white/10 relative overflow-hidden text-center shadow-2xl">
        
        {/* Converging particle canvas behind content */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1420] border border-white/10 text-xs font-mono text-[#48E5F5]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTELLIGENCE IN MOTION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] leading-tight">
            Give Conversations a{' '}
            <span className="bg-gradient-to-r from-[#48E5F5] to-[#9A83FF] bg-clip-text text-transparent">
              New Kind of Intelligence
            </span>.
          </h2>

          <p className="text-base sm:text-lg text-[#A4ADBB] leading-relaxed">
            Explore how voice, context, and small language models can work together to create a more natural AI experience.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onTryLive}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#48E5F5] to-[#38C6D5] text-[#080B10] font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(72,229,245,0.4)] active:scale-95 cursor-pointer"
            >
              <Mic className="w-4 h-4 fill-current" />
              <span>Try EMIQEN Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreTech}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0D1420] hover:bg-[#121B2C] text-[#F4F7FB] font-medium text-sm border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-[#9A83FF]" />
              <span>Explore the Technology</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
