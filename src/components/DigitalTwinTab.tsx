import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Play, Pause, Flame, Zap, RefreshCw, Gauge } from 'lucide-react';

export const DigitalTwinTab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [rpm, setRpm] = useState<number>(2450);
  const [thermalGlow, setThermalGlow] = useState<boolean>(true);
  const [magneticParticles, setMagneticParticles] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const animRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);
  const particlesRef = useRef<{ x: number; y: number; z: number; speed: number }[]>([]);

  // Initialize magnetic flux particles
  useEffect(() => {
    const pts = [];
    for (let i = 0; i < 80; i++) {
      pts.push({
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 150,
        z: (Math.random() - 0.5) * 200,
        speed: 1 + Math.random() * 2,
      });
    }
    particlesRef.current = pts;
  }, []);

  // 3D Canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (isRotating) {
        // Angle increments proportionally to RPM
        angleRef.current += (rpm / 60) * (Math.PI / 180) * 0.5;
      }
      const angle = angleRef.current;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Dark background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, w, h);

      // --- Perspective Grid Floor ---
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 30, cy + 80);
        ctx.lineTo(cx + i * 60, h);
        ctx.stroke();
      }
      for (let j = 1; j <= 6; j++) {
        ctx.beginPath();
        ctx.moveTo(0, cy + 80 + j * 20);
        ctx.lineTo(w, cy + 80 + j * 20);
        ctx.stroke();
      }

      // --- Stator Coil Housing Thermal Heat Glow ---
      if (thermalGlow) {
        const glowRad = 160 + Math.sin(angle * 0.5) * 10;
        const heatGrad = ctx.createRadialGradient(cx, cy - 20, 40, cx, cy - 20, glowRad);
        heatGrad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
        heatGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.15)');
        heatGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = heatGrad;
        ctx.beginPath();
        ctx.arc(cx, cy - 20, glowRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Outer Electromagnetic Stator Rings (3D Perspective) ---
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(cx, cy - 20, 140, 70, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy - 20, 110, 55, 0, 0, Math.PI * 2);
      ctx.stroke();

      // --- Rotating Center Driveshaft & Rotor Coupling ---
      ctx.save();
      ctx.translate(cx, cy - 20);

      // Shaft Cylinder Body
      const shaftWidth = 24;
      const shaftHeight = 180;
      const shaftGrad = ctx.createLinearGradient(-shaftWidth / 2, 0, shaftWidth / 2, 0);
      shaftGrad.addColorStop(0, '#1e293b');
      shaftGrad.addColorStop(0.5, '#94a3b8');
      shaftGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = shaftGrad;
      ctx.fillRect(-shaftWidth / 2, -shaftHeight / 2, shaftWidth, shaftHeight);

      // Rotating Mechanical Fins / Blades (3D Rotation)
      const numBlades = 6;
      for (let b = 0; b < numBlades; b++) {
        const bladeAngle = angle + (b * (Math.PI * 2)) / numBlades;
        const bladeX = Math.cos(bladeAngle) * 75;
        const bladeY = Math.sin(bladeAngle) * 35;
        const bladeZ = Math.sin(bladeAngle);

        if (bladeZ > 0) {
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(bladeX, bladeY, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(bladeX, bladeY);
          ctx.stroke();
        }
      }

      ctx.restore();

      // --- Magnetic Flux Particle Field Lines ---
      if (magneticParticles) {
        particlesRef.current.forEach((p) => {
          if (isRotating) {
            p.x += Math.sin(angle + p.y) * p.speed;
            p.y -= p.speed * 0.5;
            if (p.y < -120) p.y = 120;
          }

          ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
          ctx.beginPath();
          ctx.arc(cx + p.x * 0.8, cy - 20 + p.y * 0.6, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // --- Optical Laser Emitter Lines (S4 Channel) ---
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - 180, cy - 20);
      ctx.lineTo(cx + 180, cy - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      // Laser emitters dots
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(cx - 180, cy - 20, 5, 0, Math.PI * 2);
      ctx.arc(cx + 180, cy - 20, 5, 0, Math.PI * 2);
      ctx.fill();

      // --- Live Vibration Harmonic Ripples ---
      const rippleR = 30 + (Math.sin(angle * 3) + 1) * 25;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy + 70, rippleR, 0, Math.PI * 2);
      ctx.stroke();

      if (running) {
        animRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [rpm, thermalGlow, magneticParticles, isRotating]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Interactive 3D Spatial Digital Twin Rig
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time mechanical transducer driveshaft, electromagnetic flux field, and optical coupler simulation.
          </p>
        </div>

        {/* Speed Synchronizer Control */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800 font-mono text-xs">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">RPM SPEED:</span>
          <span className="text-cyan-400 font-bold w-16">{rpm} RPM</span>
          <input
            type="range"
            min={0}
            max={4000}
            step={50}
            value={rpm}
            onChange={(e) => setRpm(Number(e.target.value))}
            className="w-32 accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>

      {/* 3D Rig Viewport & Control Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Canvas Viewport (Span 3) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl relative flex flex-col items-center">
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-slate-800/80 bg-[#060a12]">
            <canvas
              ref={canvasRef}
              width={900}
              height={400}
              className="w-full h-full block"
            />

            {/* HUD Status Overlay */}
            <div className="absolute top-4 left-4 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 space-y-0.5">
              <div>DRIVESHAFT SPEED: <span className="text-cyan-400 font-bold">{rpm} RPM</span></div>
              <div>STATOR GLOW: <span className={thermalGlow ? 'text-amber-400' : 'text-slate-500'}>{thermalGlow ? 'ACTIVE' : 'OFF'}</span></div>
              <div>FLUX PARTICLES: <span className={magneticParticles ? 'text-emerald-400' : 'text-slate-500'}>{magneticParticles ? 'EMITTING' : 'OFF'}</span></div>
            </div>
          </div>
        </div>

        {/* Digital Twin Controls (Span 1) */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-white tracking-tight border-b border-slate-800 pb-2">
            Digital Twin Rig Controls
          </h3>

          <div className="space-y-3">
            {/* Rotation Toggle */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all"
            >
              <div className="flex items-center gap-2">
                {isRotating ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                <span>Driveshaft Rotation</span>
              </div>
              <span className={isRotating ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                {isRotating ? 'RUNNING' : 'PAUSED'}
              </span>
            </button>

            {/* Thermal Glow Toggle */}
            <button
              onClick={() => setThermalGlow(!thermalGlow)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all"
            >
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${thermalGlow ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Stator Thermal Glow</span>
              </div>
              <span className={thermalGlow ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                {thermalGlow ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Magnetic Particles Toggle */}
            <button
              onClick={() => setMagneticParticles(!magneticParticles)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all"
            >
              <div className="flex items-center gap-2">
                <Zap className={`w-4 h-4 ${magneticParticles ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>Flux Particle Lines</span>
              </div>
              <span className={magneticParticles ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {magneticParticles ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Preset Speeds */}
            <div className="pt-2">
              <label className="text-[10px] text-slate-400 uppercase">Preset RPM Speeds</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[1200, 2450, 3600].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRpm(s)}
                    className={`py-1.5 rounded bg-slate-950 border border-slate-800 text-[11px] hover:border-cyan-500/40 transition-all ${
                      rpm === s ? 'text-cyan-400 border-cyan-500/50 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {s} RPM
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
