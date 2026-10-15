import React, { useEffect, useRef } from 'react';

interface HarmonicCurvesWaveProps {
  className?: string;
  density?: 'compact' | 'normal' | 'rich';
  speed?: number; // Organic fluid speed (default ~0.0035 for slow, elegant movement)
  interactive?: boolean;
  opacity?: number; // Default 0.22 (20-25% opacity range)
}

export const HarmonicCurvesWave: React.FC<HarmonicCurvesWaveProps> = ({
  className = '',
  density = 'normal',
  speed = 0.0035,
  interactive = true,
  opacity = 0.22,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Interactive Mouse Coordinates with smooth inertia
  const mouseRef = useRef({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
  });

  // Scroll Tracking & Dynamics
  const scrollRef = useRef({
    current: 0,
    target: 0,
    velocity: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const strandCount = density === 'compact' ? 24 : density === 'rich' ? 36 : 30;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse Movement Tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / (rect.width || 1);
      const normY = (e.clientY - rect.top) / (rect.height || 1);
      mouseRef.current.targetX = Math.max(0, Math.min(1, normX));
      mouseRef.current.targetY = Math.max(0, Math.min(1, normY));
    };

    // Scroll Movement Tracking
    const handleScroll = () => {
      scrollRef.current.target = window.scrollY || window.pageYOffset || 0;
    };

    // Initial scroll position
    scrollRef.current.current = window.scrollY || 0;
    scrollRef.current.target = window.scrollY || 0;

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mathematical cycle period for zero-glitch, 100% seamless infinite looping:
    // With all harmonic angular frequencies being exact multiples of 0.1 (1.8, 1.2, 2.4, 1.6, 2.2),
    // 20*PI completes an exact integer number of full 2*PI oscillation cycles for every wave!
    const LOOP_CYCLE = Math.PI * 20;
    let time = 0;

    const render = () => {
      if (!canvas || !ctx) return;
      
      // Advance time smoothly and wrap at LOOP_CYCLE for an endless seamless loop
      time = (time + speed) % LOOP_CYCLE;

      // Ultra-smooth cursor inertia tracking
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.03;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.03;

      // Smooth scroll inertia tracking & velocity calculation
      const scrollDelta = scrollRef.current.target - scrollRef.current.current;
      scrollRef.current.current += scrollDelta * 0.05;
      scrollRef.current.velocity = scrollDelta;

      const currentScroll = scrollRef.current.current;
      // Scroll velocity impulse creates realistic fluid inertia when scrolling
      const scrollVelocityImpulse = Math.max(-0.4, Math.min(0.4, scrollRef.current.velocity * 0.003));

      // Scroll Phase drives progressive traveling wave advancement seamlessly
      const scrollWavePhase = currentScroll * 0.0015;

      // Vertical continuous parallax shift without discontinuous jumps
      const scrollParallaxY =
        Math.sin(currentScroll * 0.0012) * (height * 0.12) +
        Math.cos(currentScroll * 0.0008) * (height * 0.08);

      const isDark = document.documentElement.classList.contains('dark');

      ctx.clearRect(0, 0, width, height);

      // -------------------------------------------------------------
      // DUAL-RIBBON HARMONIC COLOR COMBINATION:
      // Ribbon 1: Amber Sunburst -> Sunset Coral Rose (Figma reference)
      // Ribbon 2: Electric Cyan -> Royal Cobalt -> Violet (EMIQEN signature)
      // -------------------------------------------------------------
      const gradWarm = ctx.createLinearGradient(0, height * 0.2, width, height * 0.85);
      const gradCool = ctx.createLinearGradient(0, height * 0.85, width, height * 0.15);

      if (isDark) {
        gradWarm.addColorStop(0.0, 'rgba(251, 191, 36, 0.75)'); // #FBBF24 Amber Gold
        gradWarm.addColorStop(0.35, 'rgba(245, 158, 11, 0.70)'); // #F59E0B Warm Amber
        gradWarm.addColorStop(0.65, 'rgba(251, 113, 133, 0.75)'); // #FB7185 Coral Rose
        gradWarm.addColorStop(1.0, 'rgba(244, 63, 94, 0.80)'); // #F43F5E Sunset Coral

        gradCool.addColorStop(0.0, 'rgba(56, 189, 248, 0.75)'); // #38BDF8 Electric Cyan
        gradCool.addColorStop(0.35, 'rgba(14, 165, 233, 0.70)'); // #0EA5E9 Sky Blue
        gradCool.addColorStop(0.70, 'rgba(99, 102, 241, 0.72)'); // #6366F1 Indigo
        gradCool.addColorStop(1.0, 'rgba(167, 139, 250, 0.80)'); // #A78BFA Violet

        ctx.globalCompositeOperation = 'screen';
      } else {
        gradWarm.addColorStop(0.0, 'rgba(217, 119, 6, 0.75)'); // #D97706 Warm Gold
        gradWarm.addColorStop(0.40, 'rgba(234, 88, 12, 0.70)'); // #EA580C Tangerine
        gradWarm.addColorStop(0.75, 'rgba(225, 29, 72, 0.75)'); // #E11D48 Coral Rose
        gradWarm.addColorStop(1.0, 'rgba(190, 18, 60, 0.80)'); // #BE123C Deep Ruby

        gradCool.addColorStop(0.0, 'rgba(2, 132, 199, 0.75)'); // #0284C7 Cerulean
        gradCool.addColorStop(0.40, 'rgba(37, 99, 235, 0.70)'); // #2563EB Royal Blue
        gradCool.addColorStop(0.75, 'rgba(124, 58, 237, 0.75)'); // #7C3AED Royal Violet
        gradCool.addColorStop(1.0, 'rgba(147, 51, 234, 0.80)'); // #9333EA Purple

        ctx.globalCompositeOperation = 'source-over';
      }

      const mouseInfluenceY = (mouseRef.current.y - 0.5) * 35;
      const mouseInfluenceX = (mouseRef.current.x - 0.5) * 0.3;

      // 140 step segments for silky-smooth curves
      const segments = 140;
      const step = width / segments;

      // Fine wireframe vector line width
      ctx.lineWidth = 1.1;

      // -------------------------------------------------------------
      // Ribbon 1 (Warm Amber & Coral Vector Splines):
      // Organic traveling waves that continuously flow and loop seamlessly
      // -------------------------------------------------------------
      ctx.strokeStyle = gradWarm;

      for (let s = 0; s < strandCount; s++) {
        const strandNorm = s / (strandCount - 1);
        const strandSpread = (strandNorm - 0.5) * 70;
        
        // Elastic time-lag across strands gives realistic 3D ribbon flex
        const strandPhase = strandNorm * 0.36 + mouseInfluenceX + scrollWavePhase * (1 + strandNorm * 0.15);
        const strandTime = time - strandNorm * 0.18;

        ctx.beginPath();

        for (let i = 0; i <= segments; i++) {
          const x = i * step;
          const nx = x / width;

          // Traveling progressive wave + harmonic ripples + scroll impulse (all 20*PI periodic)
          const wave1 = Math.sin(nx * Math.PI * 2.2 - strandTime * 1.8 + strandPhase) * (height * (0.17 + scrollVelocityImpulse * 0.05));
          const wave2 = Math.cos(nx * Math.PI * 1.4 + strandTime * 1.2 + strandPhase * 0.5) * (height * 0.08);
          const waveHarmonic = Math.sin(nx * Math.PI * 4.6 - strandTime * 2.4 + strandPhase * 1.5) * 12;

          const centerFactor = Math.sin(nx * Math.PI);
          const yOffset =
            height * 0.52 +
            strandSpread * (0.7 + centerFactor * 0.6) +
            mouseInfluenceY * centerFactor +
            scrollParallaxY * 0.5;

          const y = yOffset + wave1 + wave2 + waveHarmonic;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      // -------------------------------------------------------------
      // Ribbon 2 (Cool Cyan & Violet Vector Splines):
      // Counter-harmonic intertwining ribbon crossing Ribbon 1
      // -------------------------------------------------------------
      ctx.strokeStyle = gradCool;
      const coolStrands = Math.round(strandCount * 0.9);

      for (let s = 0; s < coolStrands; s++) {
        const strandNorm = s / (coolStrands - 1);
        const strandSpread = (strandNorm - 0.5) * 62;
        
        const strandPhase = strandNorm * 0.42 - mouseInfluenceX + scrollWavePhase * (0.9 + strandNorm * 0.2);
        const strandTime = time - strandNorm * 0.22;

        ctx.beginPath();

        for (let i = 0; i <= segments; i++) {
          const x = i * step;
          const nx = x / width;

          // Counter-phase traveling wave (1.6, 1.2, 2.2 are all exact multiples of 0.1, looping at 20*PI)
          const wave1 = Math.sin(nx * Math.PI * 2.6 + strandTime * 1.6 - strandPhase) * (height * (0.16 - scrollVelocityImpulse * 0.04));
          const wave2 = Math.cos(nx * Math.PI * 1.8 - strandTime * 1.2 - strandPhase * 0.6) * (height * 0.08);
          const waveHarmonic = Math.sin(nx * Math.PI * 5.2 + strandTime * 2.2 - strandPhase * 1.4) * 10;

          const centerFactor = Math.sin(nx * Math.PI);
          const yOffset =
            height * 0.48 +
            strandSpread * (0.8 + centerFactor * 0.5) -
            mouseInfluenceY * centerFactor -
            scrollParallaxY * 0.4;

          const y = yOffset - wave1 + wave2 + waveHarmonic;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [density, speed, interactive]);

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden transition-opacity duration-700 ${className}`}
      style={{ opacity }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
