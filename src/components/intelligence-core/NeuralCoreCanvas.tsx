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
  
  // Interactive inertia coordinates
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isInteracting: false,
    lastInteractionTime: 0,
  });

  const freqDataRef = useRef(frequencyData);
  useEffect(() => {
    freqDataRef.current = frequencyData;
  }, [frequencyData]);

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
      const parentH = canvas.parentElement?.clientHeight || 440;

      // Ensure dimensions are always valid and non-zero
      const measuredW = rect.width > 20 ? rect.width : (parentW > 20 ? parentW : 380);
      const measuredH = rect.height > 20 ? rect.height : (parentH > 20 ? parentH : 440);

      displayW = Math.max(280, Math.floor(measuredW));
      displayH = Math.max(280, Math.floor(measuredH));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.floor(displayW * dpr) || canvas.height !== Math.floor(displayH * dpr)) {
        canvas.width = Math.floor(displayW * dpr);
        canvas.height = Math.floor(displayH * dpr);
      }
    };

    updateSize();

    // ResizeObserver ensures instant adaptation on resize or orientation flip
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', updateSize);
    }

    // Interactive pointer handling (adds interactive magnetic torque)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx)) * 40;
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny)) * 40;
      mouseRef.current.isInteracting = true;
      mouseRef.current.lastInteractionTime = performance.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const nx = (touch.clientX - rect.left) / rect.width - 0.5;
        const ny = (touch.clientY - rect.top) / rect.height - 0.5;
        mouseRef.current.targetX = Math.max(-1, Math.min(1, nx)) * 40;
        mouseRef.current.targetY = Math.max(-1, Math.min(1, ny)) * 40;
        mouseRef.current.isInteracting = true;
        mouseRef.current.lastInteractionTime = performance.now();
      }
    };

    const handleInteractionEnd = () => {
      mouseRef.current.isInteracting = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchstart', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleInteractionEnd, { passive: true });

    // -------------------------------------------------------------
    // TRUE 3D PARTICLES & GYROSCOPE RING CONFIGURATIONS (SMOOTH & CINEMATIC SPEEDS)
    // -------------------------------------------------------------
    const particleCount = 80;
    const particles = Array.from({ length: particleCount }, () => {
      // Uniform spherical 3D distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const radius = 50 + Math.random() * 110;
      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        baseRadius: radius,
        speed: (0.0022 + Math.random() * 0.0035) * (Math.random() > 0.5 ? 1 : -1),
        orbitAngle: Math.random() * Math.PI * 2,
        size: 1.2 + Math.random() * 2.2,
        alpha: 0.45 + Math.random() * 0.55,
        colorType: Math.random() > 0.4 ? 'cyan' : 'violet',
      };
    });

    // 4 Distinct 3D Gyroscope Rings with smooth, gentle rotation
    const gyroRings = [
      { radius: 68, tiltX: 0.55, tiltZ: 0.2, speed: 0.004, pulsePhase: 0, color: 'cyan', dash: [4, 6] },
      { radius: 104, tiltX: -0.65, tiltZ: -0.45, speed: -0.003, pulsePhase: 1.5, color: 'violet', dash: [6, 8] },
      { radius: 142, tiltX: 0.35, tiltZ: 0.8, speed: 0.002, pulsePhase: 3.1, color: 'azure', dash: [5, 7] },
      { radius: 86, tiltX: -0.2, tiltZ: 0.6, speed: -0.005, pulsePhase: 4.5, color: 'cyan', dash: [] }, // continuous wave ring
    ];

    // 6 Intelligence Agent Satellites in 3D Space (Peaceful orbital velocities)
    const agentNodes3D = [
      { label: 'VOICE IN', radius: 135, inclination: 0.3, speed: 0.0025, phase: 0 },
      { label: 'EMOTION', radius: 125, inclination: -0.4, speed: -0.0028, phase: (Math.PI * 2) / 6 },
      { label: 'INDIA SLM', radius: 145, inclination: 0.7, speed: 0.0022, phase: ((Math.PI * 2) / 6) * 2 },
      { label: 'REASONING', radius: 120, inclination: -0.6, speed: -0.0032, phase: ((Math.PI * 2) / 6) * 3 },
      { label: 'DECODER', radius: 140, inclination: 0.2, speed: 0.0026, phase: ((Math.PI * 2) / 6) * 4 },
      { label: 'TTS VOICE', radius: 130, inclination: -0.3, speed: -0.0024, phase: ((Math.PI * 2) / 6) * 5 },
    ];

    let time = 0;
    const camDistance = 420;

    // -------------------------------------------------------------
    // RENDER LOOP
    // -------------------------------------------------------------
    const render = () => {
      // Gentle, serene time increment (slowed down from 0.02)
      time += 0.0065;

      // Re-validate non-zero canvas dimensions in case layout shifted
      if (canvas.width === 0 || canvas.height === 0 || displayW < 200) {
        updateSize();
      }

      // Check current theme (dark vs light) dynamically
      const isLightMode = document.documentElement.classList.contains('light');

      // Continuous autonomous 3D tumbling rotation at a calm, majestic planetary speed
      const autoRotY = time * 0.22;
      const autoRotX = Math.sin(time * 0.16) * 0.22;
      const autoRotZ = Math.cos(time * 0.12) * 0.14;

      // When touched or pointer moved, smoothly blend in user magnetic torque
      if (!mouseRef.current.isInteracting) {
        // Natural organic oscillation return (calm, subtle drift)
        mouseRef.current.targetX = Math.sin(time * 0.25) * 5;
        mouseRef.current.targetY = Math.cos(time * 0.2) * 4;
      }
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      const userTiltX = (mouseRef.current.y / 40) * 0.4;
      const userTiltY = (mouseRef.current.x / 40) * 0.5;

      // Combined 3D rotation angles
      const rotX = autoRotX + userTiltX;
      const rotY = autoRotY + userTiltY;
      const rotZ = autoRotZ;

      // Precompute trigonometric matrices for 3D rotation
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

      // 3D Point Projection Helper
      // Rotates around X, then Y, then Z, and applies camera perspective
      const project3D = (x: number, y: number, z: number, scaleFactor: number, cx: number, cy: number) => {
        // Rotate X
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;
        // Rotate Y
        const x2 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;
        // Rotate Z
        const x3 = x2 * cosZ - y1 * sinZ;
        const y3 = x2 * sinZ + y1 * cosZ;
        const z3 = z2;

        // Perspective factor
        const k = camDistance / (camDistance + z3);
        return {
          px: cx + x3 * k * scaleFactor,
          py: cy + y3 * k * scaleFactor,
          depth: z3,
          scale: k,
        };
      };

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayW, displayH);

      // Responsive scale factor (ensures full fit on 320px mobile up to 4K displays)
      const scale = Math.min(1.15, Math.max(0.72, displayW / 440));
      const centerX = displayW / 2;
      const centerY = displayH / 2;

      // State dynamic multipliers
      let energy = 1.0;
      let waveAmplifier = 1.0;
      if (state === 'listening') {
        energy = 1.35;
        waveAmplifier = 2.4;
      } else if (state === 'analyzing') {
        energy = 1.6;
      } else if (state === 'generating') {
        energy = 1.8;
      } else if (state === 'speaking') {
        energy = 1.45;
        waveAmplifier = 2.8;
      }

      // Dynamic color tokens based on active theme
      const colorCyan = isLightMode ? '#0284C7' : '#48E5F5';
      const colorViolet = isLightMode ? '#7C3AED' : '#9A83FF';
      const colorGlow = isLightMode ? 'rgba(2, 132, 199, ' : 'rgba(72, 229, 245, ';
      const colorVioletGlow = isLightMode ? 'rgba(124, 58, 237, ' : 'rgba(154, 131, 255, ';

      // -------------------------------------------------------------
      // 1. VOLUMETRIC AMBIENT AURA (ALWAYS BRIGHT AND VISIBLE)
      // -------------------------------------------------------------
      const auraRadius = 185 * scale;
      const auraGrad = ctx.createRadialGradient(centerX, centerY, 15 * scale, centerX, centerY, auraRadius);
      auraGrad.addColorStop(0, colorGlow + (isLightMode ? '0.28)' : '0.22)'));
      auraGrad.addColorStop(0.45, colorVioletGlow + (isLightMode ? '0.14)' : '0.10)'));
      auraGrad.addColorStop(0.8, colorGlow + (isLightMode ? '0.04)' : '0.03)'));
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // -------------------------------------------------------------
      // 2. 3D QUANTUM PARTICLES (Depth-Sorted Rendering)
      // -------------------------------------------------------------
      particles.forEach((p) => {
        p.orbitAngle += p.speed * (0.8 + energy * 0.3);
        const orbitR = p.baseRadius * (1 + Math.sin(time * 1.5 + p.baseRadius) * 0.04);
        const currX = Math.cos(p.orbitAngle) * orbitR;
        const currY = Math.sin(p.orbitAngle) * (orbitR * 0.75);
        const currZ = p.z + Math.sin(time * 2 + p.orbitAngle) * 12;

        const proj = project3D(currX, currY, currZ, scale, centerX, centerY);

        // Perspective-based brightness: particles closer to screen are larger and more brilliant
        const depthAlpha = Math.max(0.18, Math.min(1.0, (1 - proj.depth / (camDistance * 0.8)) * p.alpha));
        const pSize = Math.max(1, p.size * proj.scale * scale);

        ctx.beginPath();
        ctx.arc(proj.px, proj.py, pSize, 0, Math.PI * 2);
        ctx.fillStyle = p.colorType === 'cyan' ? colorCyan : colorViolet;
        ctx.globalAlpha = depthAlpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Interactive neural filaments connecting close particles in 3D
        if (proj.depth > -80 && proj.depth < 80 && Math.abs(proj.px - centerX) < 90 * scale) {
          ctx.beginPath();
          ctx.moveTo(proj.px, proj.py);
          ctx.lineTo(centerX + (Math.sin(time + p.orbitAngle) * 14 * scale), centerY);
          ctx.strokeStyle = p.colorType === 'cyan' ? colorGlow + '0.12)' : colorVioletGlow + '0.10)';
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      });

      // -------------------------------------------------------------
      // 3. 4 NESTED 3D GYROSCOPE RINGS (Full 3D Elliptical Geometry)
      // -------------------------------------------------------------
      gyroRings.forEach((ring, ringIdx) => {
        const ringSegments = 54;
        const currentRadius = ring.radius * scale;
        const ringPoints: { px: number; py: number; depth: number; scale: number }[] = [];

        // Sample 3D points along the ring perimeter with its intrinsic 3D tilt
        for (let i = 0; i <= ringSegments; i++) {
          const theta = (i / ringSegments) * Math.PI * 2;
          
          // Intrinsic ring tilt rotation
          let rx = Math.cos(theta) * currentRadius;
          let ry = Math.sin(theta) * currentRadius * Math.sin(ring.tiltX);
          let rz = Math.sin(theta) * currentRadius * Math.cos(ring.tiltX) * Math.sin(ring.tiltZ);

          // If equatorial wave ring, add audio frequency modulation
          if (ring.dash.length === 0) {
            const currentFreqs = freqDataRef.current || [];
            const freqVal = (currentFreqs[i % 16] || (Math.sin(time * 3 + i) * 25 + 35)) / 100;
            const waveOffset = freqVal * 16 * scale * waveAmplifier;
            rx += Math.cos(theta) * waveOffset;
            ry += Math.sin(theta) * waveOffset;
          }

          const proj = project3D(rx, ry, rz, 1.0, centerX, centerY);
          ringPoints.push(proj);
        }

        // Draw ring segments with depth gradient: segments in FRONT are bright and thick; segments in BACK are subtle
        for (let i = 0; i < ringSegments; i++) {
          const p1 = ringPoints[i];
          const p2 = ringPoints[i + 1];
          const avgDepth = (p1.depth + p2.depth) / 2;

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);

          // Segments in front (closer to camera) have lower depth and higher illumination
          const isFront = avgDepth < 0;
          const strokeAlpha = isFront ? 0.85 : 0.28;
          const strokeWidth = isFront ? (isLightMode ? 2.2 : 1.8) : 1.0;

          if (ring.color === 'cyan') {
            ctx.strokeStyle = colorGlow + strokeAlpha + ')';
          } else if (ring.color === 'violet') {
            ctx.strokeStyle = colorVioletGlow + strokeAlpha + ')';
          } else {
            ctx.strokeStyle = isLightMode ? `rgba(14, 165, 233, ${strokeAlpha})` : `rgba(56, 189, 248, ${strokeAlpha})`;
          }

          ctx.lineWidth = strokeWidth;
          if (ring.dash.length > 0 && !isFront) {
            ctx.setLineDash(ring.dash);
          } else {
            ctx.setLineDash([]);
          }
          ctx.stroke();
        }
        ctx.setLineDash([]);

        // Luminous photon light packet travelling gently along the 3D ring
        const packetPhase = (time * (ring.speed > 0 ? 0.45 : -0.45) + ring.pulsePhase) % (Math.PI * 2);
        const packetTheta = packetPhase < 0 ? packetPhase + Math.PI * 2 : packetPhase;
        const packetX = Math.cos(packetTheta) * currentRadius;
        const packetY = Math.sin(packetTheta) * currentRadius * Math.sin(ring.tiltX);
        const packetZ = Math.sin(packetTheta) * currentRadius * Math.cos(ring.tiltX) * Math.sin(ring.tiltZ);
        const packetProj = project3D(packetX, packetY, packetZ, 1.0, centerX, centerY);

        ctx.beginPath();
        ctx.arc(packetProj.px, packetProj.py, (ringIdx === 3 ? 3.5 : 2.8) * packetProj.scale * scale, 0, Math.PI * 2);
        ctx.fillStyle = ring.color === 'violet' ? colorViolet : '#FFFFFF';
        ctx.shadowColor = ring.color === 'violet' ? colorViolet : colorCyan;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // -------------------------------------------------------------
      // 4. CENTRAL 3D HOLOGRAM SPHERE & RADIANT FUSION CORE (CALM BREATHING)
      // -------------------------------------------------------------
      const corePulse = (32 + Math.sin(time * 1.1) * 3 * energy) * scale;

      // 3D Wireframe Hologram Latitude and Longitude Lines
      const sphereR = corePulse * 1.35;
      const sphereLatitudeCount = 4;
      for (let lat = 1; lat <= sphereLatitudeCount; lat++) {
        const phi = (lat / (sphereLatitudeCount + 1)) * Math.PI - Math.PI / 2;
        const latR = Math.cos(phi) * sphereR;
        const latY = Math.sin(phi) * sphereR;
        const latPts = 24;

        ctx.beginPath();
        for (let i = 0; i <= latPts; i++) {
          const theta = (i / latPts) * Math.PI * 2;
          const sx = Math.cos(theta) * latR;
          const sz = Math.sin(theta) * latR;
          const proj = project3D(sx, latY, sz, 1.0, centerX, centerY);
          if (i === 0) ctx.moveTo(proj.px, proj.py);
          else ctx.lineTo(proj.px, proj.py);
        }
        ctx.strokeStyle = colorGlow + '0.22)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Radiant Multi-Layer Glowing Nucleus (Clean chromatic fade without muddy dark edges)
      const nucleusGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        3 * scale,
        centerX,
        centerY,
        corePulse * 1.7
      );
      nucleusGrad.addColorStop(0, '#FFFFFF');
      nucleusGrad.addColorStop(0.3, colorCyan);
      nucleusGrad.addColorStop(0.7, colorViolet);
      nucleusGrad.addColorStop(1, colorGlow + '0)');

      ctx.fillStyle = nucleusGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, corePulse * 1.7, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Rotating 3D Hexagonal Star Geometry (Radiant Incandescent White Fusion Core)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.22);
      ctx.shadowColor = colorCyan;
      ctx.shadowBlur = 8;
      for (let s = 0; s < 6; s++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(corePulse * 0.85, 0);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(corePulse * 0.85, 0, 2.2 * scale, 0, Math.PI * 2);
        ctx.fillStyle = colorCyan;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.restore();

      // -------------------------------------------------------------
      // 5. 6 INTELLIGENCE SATELLITE NODES IN 3D ORBIT
      // -------------------------------------------------------------
      agentNodes3D.forEach((node, idx) => {
        const orbitAngle = node.phase + time * node.speed * (1 + energy * 0.2);
        const nodeDist = (node.radius + 15) * scale;

        // Position on 3D inclined orbit
        const nx = Math.cos(orbitAngle) * nodeDist;
        const ny = Math.sin(orbitAngle) * nodeDist * Math.sin(node.inclination);
        const nz = Math.sin(orbitAngle) * nodeDist * Math.cos(node.inclination);

        const proj = project3D(nx, ny, nz, 1.0, centerX, centerY);

        const isFront = proj.depth < 0;
        const nodeAlpha = Math.max(0.35, Math.min(1.0, isFront ? 1.0 : 0.45));
        const nodeSize = (isFront ? 4.5 : 3.0) * proj.scale * scale;

        // 3D Laser tether beam connecting to central core
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(proj.px, proj.py);
        ctx.strokeStyle = idx % 2 === 0 ? colorGlow + (isFront ? '0.22)' : '0.06)') : colorVioletGlow + (isFront ? '0.18)' : '0.05)');
        ctx.lineWidth = isFront ? 1.0 : 0.5;
        ctx.stroke();

        // Node Outer Pulsing Halo
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, nodeSize * 1.8, 0, Math.PI * 2);
        ctx.strokeStyle = idx % 2 === 0 ? colorCyan : colorViolet;
        ctx.globalAlpha = nodeAlpha * 0.6;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node Solid Sphere
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0 ? colorCyan : colorViolet;
        ctx.globalAlpha = nodeAlpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Text Tag: Only display for front-facing nodes to avoid center visual clutter
        if (displayW > 320 && isFront) {
          ctx.font = `600 ${Math.max(9, Math.floor(10 * scale))}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = isLightMode ? '#0F172A' : '#F8FAFC';
          ctx.globalAlpha = 0.9;
          ctx.fillText(node.label, proj.px + 8 * scale, proj.py + 3 * scale);
          ctx.globalAlpha = 1.0;
        }
      });

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
  }, [state]);

  // Status mapping
  const statusLabels: Record<IntelligenceState, { label: string; color: string; border: string }> = {
    idle: { label: 'AUTONOMOUS 3D CORE ACTIVE', color: 'text-[#0284C7] dark:text-[#38BDF8]', border: 'border-[#38BDF8]/30' },
    listening: { label: 'INGESTING PHONEMES', color: 'text-[#0284C7] dark:text-[#38BDF8]', border: 'border-[#38BDF8]/60' },
    analyzing: { label: 'COMPUTING CONTEXT', color: 'text-[#7C3AED] dark:text-[#A78BFA]', border: 'border-[#A78BFA]/60' },
    generating: { label: 'SYNTHESIZING SLM INTENT', color: 'text-[#7C3AED] dark:text-[#A78BFA]', border: 'border-[#A78BFA]/80' },
    speaking: { label: 'STREAMING ACOUSTIC RESPONSE', color: 'text-[#0284C7] dark:text-[#38BDF8]', border: 'border-[#38BDF8]/70' },
  };

  const currentStatus = statusLabels[state];

  return (
    <div className={`relative flex flex-col items-center justify-center w-full ${className}`}>
      {/* 3D Neural Canvas (Fully responsive and always active on phone, tablet, and laptop) */}
      <canvas
        ref={canvasRef}
        className="w-full h-[320px] xs:h-[360px] sm:h-[420px] md:h-[470px] lg:h-[510px] cursor-grab active:cursor-grabbing touch-pan-y block"
        aria-label="Always-Active 3D Neural Intelligence Core Visualization"
      />

      {/* Floating Status Pill */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#1E293B]/90 backdrop-blur-md border border-slate-200 dark:border-white/15 shadow-xl whitespace-nowrap">
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${
              state === 'idle' ? 'bg-[#0284C7] dark:bg-[#38BDF8]' : state === 'generating' ? 'bg-[#7C3AED] dark:bg-[#A78BFA]' : 'bg-[#0284C7] dark:bg-[#38BDF8]'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              state === 'idle' ? 'bg-[#0284C7] dark:bg-[#38BDF8]' : state === 'generating' ? 'bg-[#7C3AED] dark:bg-[#A78BFA]' : 'bg-[#0284C7] dark:bg-[#38BDF8]'
            }`}
          />
        </span>
        <span className="text-[10px] sm:text-[11px] font-mono tracking-wider font-semibold text-slate-700 dark:text-[#94A3B8]">
          CORE: <span className={currentStatus.color}>{currentStatus.label}</span>
        </span>
      </div>
    </div>
  );
};
