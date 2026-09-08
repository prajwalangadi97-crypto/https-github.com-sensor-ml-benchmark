import React, { useEffect, useRef, useState } from 'react';
import { Radio, Play, Pause, AlertOctagon, Sliders, Activity, Zap } from 'lucide-react';

export const LiveTelemetryStream: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fftCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isFrozen, setIsFrozen] = useState(false);
  const [faultInjected, setFaultInjected] = useState(false);
  const [timebase, setTimebase] = useState<number>(10); // ms/div
  const [enabledChannels, setEnabledChannels] = useState({
    ch1: true, // S1 Acoustic Vibration (Cyan)
    ch2: true, // S4 Optical Transfer (Emerald/Rose)
    ch3: true, // S2 Stator Electromagnetic Flux (Amber)
    ch4: true, // S3 Mechanical Reaction Load (Purple)
  });

  // Time ticks counter for 60 FPS animation
  const animFrameRef = useRef<number | null>(null);
  const tickRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fftCanvas = fftCanvasRef.current;
    if (!canvas || !fftCanvas) return;

    const ctx = canvas.getContext('2d');
    const fftCtx = fftCanvas.getContext('2d');
    if (!ctx || !fftCtx) return;

    let running = true;

    const render = () => {
      if (!isFrozen) {
        tickRef.current += 1;
      }
      const tick = tickRef.current;

      const width = canvas.width;
      const height = canvas.height;

      // --- CRT Phosphor Persistence (Fade trail effect) ---
      ctx.fillStyle = 'rgba(6, 11, 20, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // --- Grid Lines ---
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const numCols = 10;
      const numRows = 8;
      const colWidth = width / numCols;
      const rowHeight = height / numRows;

      for (let i = 0; i <= numCols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * colWidth, 0);
        ctx.lineTo(i * colWidth, height);
        ctx.stroke();
      }

      for (let j = 0; j <= numRows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * rowHeight);
        ctx.lineTo(width, j * rowHeight);
        ctx.stroke();
      }

      // Center crosshair axis
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      const timeScale = 0.05 / (timebase / 10);

      // --- Channel 1: S1 Acoustic Vibration (Cyan) ---
      if (enabledChannels.ch1) {
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;

        const cy = height * 0.25;
        for (let x = 0; x < width; x++) {
          const t = x * timeScale + tick * 0.05;
          // Harmonic wave + noise + fault spike
          let amp = Math.sin(t) * 20 + Math.sin(t * 2.5) * 8 + (Math.random() - 0.5) * 4;
          if (faultInjected && x > width * 0.6 && x < width * 0.7) {
            amp += (Math.random() - 0.5) * 90; // High amplitude spike
          }
          const y = cy + amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // --- Channel 2: S4 Optical Torque Ratio (Emerald/Rose) ---
      if (enabledChannels.ch2) {
        ctx.beginPath();
        ctx.strokeStyle = faultInjected ? '#f43f5e' : '#10b981';
        ctx.lineWidth = 2;
        ctx.shadowColor = faultInjected ? '#f43f5e' : '#10b981';
        ctx.shadowBlur = 8;

        const cy = height * 0.5;
        for (let x = 0; x < width; x++) {
          const t = x * timeScale * 0.5 + tick * 0.04;
          // Pulse square wave or collapsed line if fault
          let val = 0;
          if (faultInjected) {
            val = Math.random() * 4 - 2; // Collapse to zero
          } else {
            val = (Math.sin(t) > 0 ? 1 : -1) * 25 + Math.sin(t * 8) * 3;
          }
          const y = cy - val;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // --- Channel 3: S2 Stator Electromagnetic Flux (Amber) ---
      if (enabledChannels.ch3) {
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;

        const cy = height * 0.75;
        for (let x = 0; x < width; x++) {
          const t = x * timeScale + tick * 0.03;
          const amp = Math.sin(t * 1.5) * 18 + Math.cos(t * 3) * 6;
          const y = cy + amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // --- Channel 4: S3 Mechanical Reaction Load (Purple) ---
      if (enabledChannels.ch4) {
        ctx.beginPath();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.5;
        const cy = height * 0.88;
        for (let x = 0; x < width; x++) {
          const t = x * timeScale * 0.8 + tick * 0.02;
          const amp = Math.cos(t * 0.8) * 12 + Math.sin(t * 4) * 4;
          const y = cy + amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // --- 16-Band Harmonic FFT Spectrum Analyzer Render ---
      const fftW = fftCanvas.width;
      const fftH = fftCanvas.height;

      fftCtx.fillStyle = '#060b14';
      fftCtx.fillRect(0, 0, fftW, fftH);

      const numBands = 16;
      const barWidth = fftW / numBands - 4;

      for (let b = 0; b < numBands; b++) {
        // Compute dynamic bar height based on tick & harmonics
        let barHeight = (Math.sin(tick * 0.08 + b * 0.4) + 1) * 0.4 * fftH + (Math.random() * 15);
        if (faultInjected && b > 8) {
          barHeight += Math.random() * 45; // Fault harmonics noise
        }
        barHeight = Math.min(Math.max(barHeight, 5), fftH - 10);

        const x = b * (barWidth + 4) + 2;
        const y = fftH - barHeight;

        // Gradient for FFT bars
        const grad = fftCtx.createLinearGradient(0, fftH, 0, 0);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(0.6, '#10b981');
        grad.addColorStop(1, '#f43f5e');

        fftCtx.fillStyle = grad;
        fftCtx.fillRect(x, y, barWidth, barHeight);

        // Peak line
        fftCtx.fillStyle = '#ffffff';
        fftCtx.fillRect(x, Math.max(y - 3, 2), barWidth, 2);
      }

      if (running) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isFrozen, faultInjected, timebase, enabledChannels]);

  return (
    <div className="space-y-6">
      {/* Header & Controls Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Multi-Channel CRT Oscilloscope & Live Signal Stream
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            60 FPS HTML5 Canvas loop with phosphor trail persistence, 4-channel telemetry, and 16-band FFT.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Freeze / Resume */}
          <button
            onClick={() => setIsFrozen(!isFrozen)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
              isFrozen
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isFrozen ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isFrozen ? 'RESUME STREAM' : 'FREEZE STREAM'}</span>
          </button>

          {/* Fault Injection Toggle */}
          <button
            onClick={() => setFaultInjected(!faultInjected)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
              faultInjected
                ? 'bg-rose-500 text-white border border-rose-400 shadow-lg shadow-rose-950/60 animate-pulse'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{faultInjected ? 'CLEAR INJECTED FAULT' : 'INJECT S4 SHEAR FAULT'}</span>
          </button>
        </div>
      </div>

      {/* Main Oscilloscope Screen + FFT Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* CRT Oscilloscope Screen (Span 3) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl relative flex flex-col items-center">
          {/* CRT Screen Frame */}
          <div className="relative w-full h-[380px] rounded-xl overflow-hidden border border-slate-800 bg-[#060b14]">
            <canvas
              ref={canvasRef}
              width={900}
              height={380}
              className="w-full h-full block"
            />
            {/* Phosphor CRT Scanlines Overlay */}
            <div className="absolute inset-0 crt-overlay" />

            {/* Live Indicator Overlay */}
            <div className="absolute top-3 left-4 flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-md border border-slate-800 text-[10px] font-mono">
              <span className={`w-2 h-2 rounded-full ${isFrozen ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`} />
              <span className="text-slate-300 font-bold">{isFrozen ? 'FREEZE' : '60 FPS CRT'}</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400">{timebase} ms/div</span>
            </div>

            {faultInjected && (
              <div className="absolute top-3 right-4 bg-rose-500/20 border border-rose-500/40 text-rose-300 px-3 py-1 rounded-md text-[10px] font-mono font-bold animate-pulse">
                WARNING: S4 OPTICAL BREAKDOWN INJECTED
              </div>
            )}
          </div>

          {/* Oscilloscope Knobs & Channel Switches Toolbar */}
          <div className="w-full mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
            {/* Timebase Control */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase">Timebase</label>
              <select
                value={timebase}
                onChange={(e) => setTimebase(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-cyan-300 rounded px-2 py-1 focus:outline-none"
              >
                <option value={2}>2 ms/div</option>
                <option value={5}>5 ms/div</option>
                <option value={10}>10 ms/div</option>
                <option value={20}>20 ms/div</option>
                <option value={50}>50 ms/div</option>
              </select>
            </div>

            {/* CH1 Toggle */}
            <button
              onClick={() => setEnabledChannels(prev => ({ ...prev, ch1: !prev.ch1 }))}
              className={`p-2 rounded border flex items-center justify-between transition-all ${
                enabledChannels.ch1
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              <span>CH1: S1 Acoustic</span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            </button>

            {/* CH2 Toggle */}
            <button
              onClick={() => setEnabledChannels(prev => ({ ...prev, ch2: !prev.ch2 }))}
              className={`p-2 rounded border flex items-center justify-between transition-all ${
                enabledChannels.ch2
                  ? faultInjected 
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold'
                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              <span>CH2: S4 Optical</span>
              <span className={`w-2.5 h-2.5 rounded-full ${faultInjected ? 'bg-rose-500' : 'bg-emerald-400'}`} />
            </button>

            {/* CH3 Toggle */}
            <button
              onClick={() => setEnabledChannels(prev => ({ ...prev, ch3: !prev.ch3 }))}
              className={`p-2 rounded border flex items-center justify-between transition-all ${
                enabledChannels.ch3
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              <span>CH3: S2 Flux</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            </button>

            {/* CH4 Toggle */}
            <button
              onClick={() => setEnabledChannels(prev => ({ ...prev, ch4: !prev.ch4 }))}
              className={`p-2 rounded border flex items-center justify-between transition-all ${
                enabledChannels.ch4
                  ? 'bg-purple-500/10 border-purple-500/40 text-purple-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              <span>CH4: S3 Load</span>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            </button>
          </div>
        </div>

        {/* 16-Band Harmonic FFT Spectrum Analyzer (Span 1) */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                16-Band FFT Spectrum
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mb-3">
              50 Hz to 12.8 kHz dynamic harmonic frequency response.
            </p>

            <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-800 bg-[#060b14] relative">
              <canvas
                ref={fftCanvasRef}
                width={300}
                height={220}
                className="w-full h-full block"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Sampling: 25.6 kS/s</span>
            <span>Nyquist: 12.8 kHz</span>
          </div>
        </div>
      </div>
    </div>
  );
};
