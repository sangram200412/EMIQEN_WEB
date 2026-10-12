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
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = x * 40;
      mouseRef.current.targetY = y * 40;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Particle Swarm and Neural Nodes
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }, () => ({
      orbitRadius: 45 + Math.random() * 115,
      angle: Math.random() * Math.PI * 2,
      speed: (0.004 + Math.random() * 0.008) * (Math.random() > 0.5 ? 1 : -1),
      yOffset: (Math.random() - 0.5) * 50,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      color: Math.random() > 0.3 ? '#48E5F5' : '#9A83FF',
    }));

    // Orbit Ring Configs
    const rings = [
      { radius: 65, tiltX: 0.65, tiltY: 0.25, rotSpeed: 0.005, angle: 0, color: 'rgba(72, 229, 245, 0.45)' },
      { radius: 105, tiltX: -0.45, tiltY: 0.75, rotSpeed: -0.003, angle: 1.2, color: 'rgba(154, 131, 255, 0.35)' },
      { radius: 145, tiltX: 0.3, tiltY: -0.55, rotSpeed: 0.002, angle: 2.5, color: 'rgba(72, 229, 245, 0.25)' },
    ];

    // Constellation / Agent Nodes
    const agentNodes = [
      { baseAngle: 0, dist: 130, label: 'VOICE_IN', active: false },
      { baseAngle: (Math.PI * 2) / 5, dist: 125, label: 'EMOTION', active: false },
      { baseAngle: ((Math.PI * 2) / 5) * 2, dist: 135, label: 'CONTEXT', active: false },
      { baseAngle: ((Math.PI * 2) / 5) * 3, dist: 120, label: 'SLM_CORE', active: false },
      { baseAngle: ((Math.PI * 2) / 5) * 4, dist: 140, label: 'SPEECH_OUT', active: false },
    ];

    let time = 0;
    let scanRing = 0;

    const render = () => {
      time += 0.02;

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.width / dpr;
      const displayH = canvas.height / dpr;

      ctx.clearRect(0, 0, displayW, displayH);

      const centerX = displayW / 2 + mouseRef.current.x;
      const centerY = displayH / 2 + mouseRef.current.y;

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
        scanRing = (scanRing + 2.5) % 170;
      } else if (state === 'generating') {
        stateSpeedMod = 2.2;
        coreEnergy = 1.1;
      } else if (state === 'speaking') {
        stateSpeedMod = 1.5;
        coreEnergy = 0.95;
        waveAmplifier = 2.8;
      }

      // 1. Ambient Volumetric Background Glow
      const ambientGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        15,
        centerX,
        centerY,
        180
      );
      ambientGrad.addColorStop(0, state === 'generating' ? 'rgba(154, 131, 255, 0.22)' : 'rgba(72, 229, 245, 0.16)');
      ambientGrad.addColorStop(0.6, 'rgba(13, 20, 32, 0.08)');
      ambientGrad.addColorStop(1, 'rgba(8, 11, 16, 0)');

      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 190, 0, Math.PI * 2);
      ctx.fill();

      // 2. Orbital Elliptical Rings
      rings.forEach((ring, idx) => {
        ring.angle += ring.rotSpeed * stateSpeedMod;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(ring.angle * 0.3);

        ctx.beginPath();
        const rx = ring.radius * (1 + Math.sin(time * 0.5 + idx) * 0.04);
        const ry = ring.radius * 0.42;

        ctx.ellipse(0, 0, rx, ry, ring.tiltX, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.restore();
      });

      // 3. Audio Responsive Waveform (Active during listening / speaking)
      if (state === 'listening' || state === 'speaking') {
        const waveRadius = 75;
        const wavePoints = 48;
        ctx.beginPath();
        for (let i = 0; i <= wavePoints; i++) {
          const theta = (i / wavePoints) * Math.PI * 2;
          const freqIndex = i % 16;
          const freqVal = (frequencyData[freqIndex] || Math.sin(time * 3 + i) * 20 + 30) / 100;
          const rOffset = freqVal * 18 * waveAmplifier * Math.sin(time * 4 + i);
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
        ctx.strokeStyle = `rgba(72, 229, 245, ${Math.max(0, 1 - scanRing / 170) * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 5. Dynamic Neural Particles and Orbit Trails
      particles.forEach((p) => {
        p.angle += p.speed * stateSpeedMod;
        const currentR = p.orbitRadius * (1 + Math.sin(time * 0.8) * 0.03);
        const px = centerX + Math.cos(p.angle) * currentR;
        const py = centerY + Math.sin(p.angle) * currentR * 0.48 + p.yOffset;

        // Draw particle
        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.8 + coreEnergy * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Neural line towards core or nearby particles
        if (Math.abs(px - centerX) < 70 && Math.abs(py - centerY) < 45 && Math.random() > 0.6) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(centerX + (Math.random() - 0.5) * 20, centerY + (Math.random() - 0.5) * 20);
          ctx.strokeStyle = p.color === '#48E5F5' ? 'rgba(72, 229, 245, 0.18)' : 'rgba(154, 131, 255, 0.15)';
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      });

      // 6. Connected Agent Nodes around perimeter
      agentNodes.forEach((node, i) => {
        const nodeAngle = node.baseAngle + time * 0.08 * (i % 2 === 0 ? 1 : -1);
        const nx = centerX + Math.cos(nodeAngle) * node.dist;
        const ny = centerY + Math.sin(nodeAngle) * (node.dist * 0.5);

        // Node circle
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = state === 'generating' ? '#9A83FF' : '#48E5F5';
        ctx.fill();

        // Node ring
        ctx.beginPath();
        ctx.arc(nx, ny, 7, 0, Math.PI * 2);
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

      // 7. Central Abstract Neural Core (Multi-layered nucleus)
      const corePulse = 26 + Math.sin(time * 2.2) * 3 * coreEnergy;
      
      // Outer nucleus glow
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, corePulse * 1.6);
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
        ctx.arc(corePulse * 0.7, 0, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#48E5F5';
        ctx.fill();
      }
      ctx.restore();

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
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
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 3D Neural Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-[380px] sm:h-[440px] md:h-[480px] lg:h-[520px] cursor-crosshair touch-none"
        aria-label="Interactive 3D Neural Intelligence Core Visualization"
      />

      {/* Floating Status Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D1420]/80 backdrop-blur-md border border-white/10 shadow-lg">
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
        <span className="text-[11px] font-mono tracking-wider font-semibold text-[#A4ADBB]">
          CORE STATUS: <span className={currentStatus.color}>{currentStatus.label}</span>
        </span>
      </div>
    </div>
  );
};
