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
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const strandCount = isMobile ? 8 : density === 'compact' ? 14 : density === 'rich' ? 22 : 18;
    const segments = isMobile ? 24 : 72;

    let cachedGradWarm: CanvasGradient | null = null;
    let cachedGradCool: CanvasGradient | null = null;
    let cachedIsDark: boolean | null = null;
    let cachedW = 0;
    let cachedH = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      cachedIsDark = null; // force gradient recalculation on resize
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
    const LOOP_CYCLE = Math.PI * 20;
    let time = 0;
    let lastFrameTime = 0;
    let isVisible = true;

    const render = (timestamp: number) => {
      if (!canvas || !ctx || !isVisible) {
        return;
      }
      
      // Pause drawing and math completely if tab is hidden to save 100% CPU
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Smooth frame throttle (~28 FPS on mobile, ~35 FPS on desktop): relieves main-thread TBT without visual degradation
      const minInterval = isMobile ? 35 : 27;
      if (timestamp - lastFrameTime < minInterval) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = timestamp;

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

      // Recreate cached gradients only if dimensions or theme changed
      if (cachedIsDark !== isDark || cachedW !== width || cachedH !== height || !cachedGradWarm || !cachedGradCool) {
        cachedIsDark = isDark;
        cachedW = width;
        cachedH = height;

        cachedGradWarm = ctx.createLinearGradient(0, height * 0.2, width, height * 0.85);
        cachedGradCool = ctx.createLinearGradient(0, height * 0.85, width, height * 0.15);

        if (isDark) {
          cachedGradWarm.addColorStop(0.0, 'rgba(251, 191, 36, 0.75)');
          cachedGradWarm.addColorStop(0.35, 'rgba(245, 158, 11, 0.70)');
          cachedGradWarm.addColorStop(0.65, 'rgba(251, 113, 133, 0.75)');
          cachedGradWarm.addColorStop(1.0, 'rgba(244, 63, 94, 0.80)');

          cachedGradCool.addColorStop(0.0, 'rgba(56, 189, 248, 0.75)');
          cachedGradCool.addColorStop(0.35, 'rgba(14, 165, 233, 0.70)');
          cachedGradCool.addColorStop(0.70, 'rgba(99, 102, 241, 0.72)');
          cachedGradCool.addColorStop(1.0, 'rgba(167, 139, 250, 0.80)');
        } else {
          cachedGradWarm.addColorStop(0.0, 'rgba(217, 119, 6, 0.75)');
          cachedGradWarm.addColorStop(0.40, 'rgba(234, 88, 12, 0.70)');
          cachedGradWarm.addColorStop(0.75, 'rgba(225, 29, 72, 0.75)');
          cachedGradWarm.addColorStop(1.0, 'rgba(190, 18, 60, 0.80)');

          cachedGradCool.addColorStop(0.0, 'rgba(2, 132, 199, 0.75)');
          cachedGradCool.addColorStop(0.40, 'rgba(37, 99, 235, 0.70)');
          cachedGradCool.addColorStop(0.75, 'rgba(124, 58, 237, 0.75)');
          cachedGradCool.addColorStop(1.0, 'rgba(147, 51, 234, 0.80)');
        }
      }

      ctx.globalCompositeOperation = isDark ? 'screen' : 'source-over';

      const mouseInfluenceY = (mouseRef.current.y - 0.5) * 35;
      const mouseInfluenceX = (mouseRef.current.x - 0.5) * 0.3;

      // Dynamic step segments based on device viewport
      const step = width / segments;

      // Fine wireframe vector line width
      ctx.lineWidth = 1.1;

      // -------------------------------------------------------------
      // Ribbon 1 (Warm Amber & Coral Vector Splines):
      // Organic traveling waves that continuously flow and loop seamlessly
      // -------------------------------------------------------------
      ctx.strokeStyle = cachedGradWarm!;

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
      ctx.strokeStyle = cachedGradCool!;
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    return () => {
      observer.disconnect();
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
