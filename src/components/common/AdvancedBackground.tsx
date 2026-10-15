import React, { useEffect, useRef } from 'react';
import { HarmonicCurvesWave } from './HarmonicCurvesWave';

export const AdvancedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle drifting background particle dust
    const particleCount = window.innerWidth < 768 ? 24 : 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: 1 + Math.random() * 1.5,
      alpha: 0.15 + Math.random() * 0.35,
      color: Math.random() > 0.4 ? '#48E5F5' : '#9A83FF',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Deep Atmospheric Glowing Mesh Orbs (Dark & Light responsive) */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#38BDF8]/16 to-transparent dark:from-[#38BDF8]/16 light:from-[#38BDF8]/14 blur-[130px] animate-pulse-slow" />
      <div className="absolute top-1/4 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-[#A78BFA]/16 to-transparent dark:from-[#A78BFA]/16 light:from-[#8B5CF6]/12 blur-[140px] animate-pulse-slow delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#0EA5E9]/10 to-transparent dark:from-[#0EA5E9]/10 light:from-[#0EA5E9]/8 blur-[120px]" />
      <div className="absolute -bottom-32 right-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-[#C084FC]/12 to-transparent dark:from-[#C084FC]/12 light:from-[#A855F7]/8 blur-[130px]" />

      {/* 2. Cybernetic Precision Grid Overlay */}
      <div className="absolute inset-0 bg-advanced-cyber-grid opacity-70 dark:opacity-70 light:opacity-45" />

      {/* 3. Subtle Animated Particle Dust Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 dark:opacity-60 light:opacity-30"
      />

      {/* 4. Realistic Fluid Harmonic Curves Wave (Slow fluid loop, 20-25% opacity across all pages) */}
      <HarmonicCurvesWave
        className="absolute inset-0 w-full h-full"
        density="normal"
        speed={0.0035}
        opacity={0.22}
        interactive={true}
      />

      {/* 5. Top Horizon Gradient Light Bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#38BDF8]/50 dark:via-[#38BDF8]/50 light:via-[#0284C7]/30 to-transparent" />
    </div>
  );
};
