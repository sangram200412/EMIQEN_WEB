import React, { useEffect, useRef } from 'react';
import type { IntelligenceState } from '../../types';

interface NeuralCoreCanvasProps {
  state: IntelligenceState;
  className?: string;
  frequencyData?: number[];
}

export const NeuralCoreCanvas: React.FC<NeuralCoreCanvasProps> = ({
  state,
  className = '',
  frequencyData = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isInteracting: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let displayW = 380;
    let displayH = 380;

    const updateSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const parentW = canvas.parentElement?.clientWidth || window.innerWidth - 32;
      const parentH = canvas.parentElement?.clientHeight || 420;

      displayW = Math.max(280, Math.floor(rect.width > 0 ? rect.width : (parentW || 380)));
      displayH = Math.max(280, Math.floor(rect.height > 0 ? rect.height : (parentH || 380)));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(displayW * dpr);
      canvas.height = Math.floor(displayH * dpr);
    };

    updateSize();

    // Use ResizeObserver for instant rock-solid responsiveness on mobile & laptop
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', updateSize);
    }

    // Mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, x)) * 32;
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y)) * 32;
      mouseRef.current.isInteracting = true;
    };

    // Touch support for Mobile Devices (smooth interaction without blocking scroll)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        mouseRef.current.targetX = Math.max(-1, Math.min(1, x)) * 32;
        mouseRef.current.targetY = Math.max(-1, Math.min(1, y)) * 32;
        mouseRef.current.isInteracting = true;
      }
    };

    const handleInteractionEnd = () => {
      mouseRef.current.isInteracting = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchstart', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleInteractionEnd, { passive: true });

    // Particle Swarm and Neural Nodes
    const particleCount = 65;
    const particles = Array.from({ length: particleCount }, () => ({
      baseOrbitRadius: 40 + Math.random() * 115,
      angle: Math.random() * Math.PI * 2,
      speed: (0.005 + Math.random() * 0.009) * (Math.random() > 0.5 ? 1 : -1),
      yOffset: (Math.random() - 0.5) * 45,
      size: 1 + Math.random() * 2,
      opacity: 0.35 + Math.random() * 0.65,
      color: Math.random() > 0.35 ? '#48E5F5' : '#9A83FF',
    }));

    // Orbit Ring Configs
    const rings = [
      { baseRadius: 62, tiltX: 0.65, tiltY: 0.25, rotSpeed: 0.005, angle: 0, color: 'rgba(72, 229, 245, 0.45)' },
      { baseRadius: 102, tiltX: -0.45, tiltY: 0.75, rotSpeed: -0.003, angle: 1.2, color: 'rgba(154, 131, 255, 0.35)' },
      { baseRadius: 138, tiltX: 0.3, tiltY: -0.55, rotSpeed: 0.002, angle: 2.5, color: 'rgba(72, 229, 245, 0.25)' },
    ];

    // Constellation / Agent Nodes
    const agentNodes = [
      { baseAngle: 0, baseDist: 125, label: 'VOICE_IN' },
      { baseAngle: (Math.PI * 2) / 5, baseDist: 120, label: 'EMOTION' },
      { baseAngle: ((Math.PI * 2) / 5) * 2, baseDist: 130, label: 'CONTEXT' },
      { baseAngle: ((Math.PI * 2) / 5) * 3, baseDist: 115, label: 'SLM_CORE' },
      { baseAngle: ((Math.PI * 2) / 5) * 4, baseDist: 135, label: 'SPEECH_OUT' },
    ];

    let time = 0;
    let scanRing = 0;

    const render = () => {
      time += 0.02;

      // When not actively touching or moving, introduce gentle organic breathing drift
      if (!mouseRef.current.isInteracting) {
        mouseRef.current.targetX = Math.sin(time * 0.5) * 12;
        mouseRef.current.targetY = Math.cos(time * 0.4) * 8;
      }

      // Smooth mouse / touch follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayW, displayH);

      // Responsive scale factor based on screen size (ensures 100% fit on mobile screens)
      const scale = Math.min(1.05, Math.max(0.68, displayW / 450));

      const centerX = displayW / 2 + mouseRef.current.x * scale;
      const centerY = displayH / 2 + mouseRef.current.y * scale;

      // State modifiers
      let stateSpeedMod = 1;
      let coreEnergy = 0.5;
      let waveAmplifier = 1;

      if (state === 'listening') {
        stateSpeedMod = 1.6;
        coreEnergy = 0.85;
        waveAmplifier = 2.4;
      } else if (state === 'analyzing') {
        stateSpeedMod = 1.3;
        coreEnergy = 1.0;
        scanRing = (scanRing + 2.5) % (165 * scale);
      } else if (state === 'generating') {
        stateSpeedMod = 2.2;
        coreEnergy = 1.1;
      } else if (state === 'speaking') {
        stateSpeedMod = 1.5;
        coreEnergy = 0.95;
        waveAmplifier = 2.8;
      }

      // 1. Ambient Volumetric Background Glow
      const ambientRadius = 180 * scale;
      const ambientGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        12 * scale,
        centerX,
        centerY,
        ambientRadius
      );
      ambientGrad.addColorStop(0, state === 'generating' ? 'rgba(154, 131, 255, 0.22)' : 'rgba(72, 229, 245, 0.16)');
      ambientGrad.addColorStop(0.6, 'rgba(13, 20, 32, 0.06)');
      ambientGrad.addColorStop(1, 'rgba(8, 11, 16, 0)');

      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ambientRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Orbital Elliptical Rings
      rings.forEach((ring, idx) => {
        ring.angle += ring.rotSpeed * stateSpeedMod;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(ring.angle * 0.3);

        ctx.beginPath();
        const rx = ring.baseRadius * scale * (1 + Math.sin(time * 0.5 + idx) * 0.04);
        const ry = ring.baseRadius * scale * 0.42;

        ctx.ellipse(0, 0, rx, ry, ring.tiltX, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.restore();
      });

      // 3. Audio Responsive Waveform (Active during listening / speaking)
      if (state === 'listening' || state === 'speaking') {
        const waveRadius = 70 * scale;
        const wavePoints = 44;
        ctx.beginPath();
        for (let i = 0; i <= wavePoints; i++) {
          const theta = (i / wavePoints) * Math.PI * 2;
          const freqIndex = i % 16;
          const freqVal = (frequencyData[freqIndex] || Math.sin(time * 3 + i) * 20 + 30) / 100;
          const rOffset = freqVal * 16 * scale * waveAmplifier * Math.sin(time * 4 + i);
          const r = waveRadius + rOffset;
          const px = centerX + Math.cos(theta) * r;
          const py = centerY + Math.sin(theta) * r * 0.75;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = state === 'speaking' ? 'rgba(154, 131, 255, 0.65)' : 'rgba(72, 229, 245, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
        ctx.stroke();
      }

      // 4. Scanning Ring (Active during analyzing)
      if (state === 'analyzing') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, scanRing, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(72, 229, 245, ${Math.max(0, 1 - scanRing / (165 * scale)) * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 5. Dynamic Neural Particles and Orbit Trails
      particles.forEach((p) => {
        p.angle += p.speed * stateSpeedMod;
        const currentR = p.baseOrbitRadius * scale * (1 + Math.sin(time * 0.8) * 0.03);
        const px = centerX + Math.cos(p.angle) * currentR;
        const py = centerY + Math.sin(p.angle) * currentR * 0.48 + p.yOffset * scale;

        // Draw particle
        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.8 + coreEnergy * 0.3) * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Neural line towards core or nearby particles
        if (Math.abs(px - centerX) < 65 * scale && Math.abs(py - centerY) < 40 * scale && Math.random() > 0.62) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(centerX + (Math.random() - 0.5) * 16 * scale, centerY + (Math.random() - 0.5) * 16 * scale);
          ctx.strokeStyle = p.color === '#48E5F5' ? 'rgba(72, 229, 245, 0.18)' : 'rgba(154, 131, 255, 0.15)';
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      });

      // 6. Connected Agent Nodes around perimeter
      agentNodes.forEach((node, i) => {
        const nodeAngle = node.baseAngle + time * 0.08 * (i % 2 === 0 ? 1 : -1);
        const dist = node.baseDist * scale;
        const nx = centerX + Math.cos(nodeAngle) * dist;
        const ny = centerY + Math.sin(nodeAngle) * (dist * 0.5);

        // Node circle
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = state === 'generating' ? '#9A83FF' : '#48E5F5';
        ctx.fill();

        // Node ring
        ctx.beginPath();
        ctx.arc(nx, ny, 6.5 * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Line to core
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(centerX, centerY);
        ctx.strokeStyle = 'rgba(72, 229, 245, 0.08)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      // 7. Central Abstract Neural Core
      const corePulse = (24 + Math.sin(time * 2.2) * 3 * coreEnergy) * scale;
      
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 3, centerX, centerY, corePulse * 1.5);
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.35, '#48E5F5');
      coreGrad.addColorStop(0.7, '#9A83FF');
      coreGrad.addColorStop(1, 'rgba(8, 11, 16, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, corePulse * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Sharp central lattice
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.4);
      for (let s = 0; s < 6; s++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(corePulse * 0.7, 0);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(corePulse * 0.7, 0, 1.8 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#48E5F5';
        ctx.fill();
      }
      ctx.restore();

      ctx.restore();
      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchMove);
      canvas.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [state, frequencyData]);

  // Status mapping
  const statusLabels: Record<IntelligenceState, { label: string; color: string; border: string }> = {
    idle: { label: 'SYSTEM READY', color: 'text-[#48E5F5]', border: 'border-[#48E5F5]/30' },
    listening: { label: 'LISTENING', color: 'text-[#48E5F5]', border: 'border-[#48E5F5]/60' },
    analyzing: { label: 'ANALYZING CONTEXT', color: 'text-[#9A83FF]', border: 'border-[#9A83FF]/60' },
    generating: { label: 'GENERATING RESPONSE', color: 'text-[#9A83FF]', border: 'border-[#9A83FF]/80' },
    speaking: { label: 'SPEAKING', color: 'text-[#48E5F5]', border: 'border-[#48E5F5]/70' },
  };

  const currentStatus = statusLabels[state];

  return (
    <div className={`relative flex flex-col items-center justify-center w-full ${className}`}>
      {/* 3D Neural Canvas (Fully responsive on phone, tablet, and laptop) */}
      <canvas
        ref={canvasRef}
        className="w-full h-[300px] xs:h-[340px] sm:h-[400px] md:h-[450px] lg:h-[490px] cursor-crosshair touch-pan-y"
        aria-label="Interactive 3D Neural Intelligence Core Visualization"
      />

      {/* Floating Status Pill */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#0D1420]/85 dark:bg-[#0D1420]/85 light:bg-white/90 backdrop-blur-md border border-white/10 light:border-slate-300 shadow-lg whitespace-nowrap">
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              state === 'idle' ? 'bg-[#48E5F5]' : state === 'generating' ? 'bg-[#9A83FF]' : 'bg-[#48E5F5]'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              state === 'idle' ? 'bg-[#48E5F5]' : state === 'generating' ? 'bg-[#9A83FF]' : 'bg-[#48E5F5]'
            }`}
          />
        </span>
        <span className="text-[10px] sm:text-[11px] font-mono tracking-wider font-semibold text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600">
          CORE: <span className={currentStatus.color}>{currentStatus.label}</span>
        </span>
      </div>
    </div>
  );
};
