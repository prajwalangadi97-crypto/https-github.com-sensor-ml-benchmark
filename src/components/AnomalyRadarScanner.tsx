import React, { useState, useEffect, useRef } from 'react';
import { TelemetryRecord } from '../types';
import { Zap, Crosshair, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

interface AnomalyRadarScannerProps {
  records: TelemetryRecord[];
  onSelectRecord: (record: TelemetryRecord) => void;
}

export const AnomalyRadarScanner: React.FC<AnomalyRadarScannerProps> = ({
  records,
  onSelectRecord,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<TelemetryRecord | null>(null);
  const [filterAnomalousOnly, setFilterAnomalousOnly] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sweepAngleRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);

  const displayedRecords = filterAnomalousOnly 
    ? records.filter(r => r.is_anomalous) 
    : records;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      sweepAngleRef.current = (sweepAngleRef.current + 1.2) % 360;
      const sweepRad = (sweepAngleRef.current * Math.PI) / 180;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2 - 30;

      // Clear Canvas
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, w, h);

      // --- Concentric Radar Circles ---
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      const rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach((rRatio) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * rRatio, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Axis crosshairs
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Degree Tick Labels
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText('0° (NORTH)', cx, cy - radius - 8);
      ctx.fillText('90° (EAST)', cx + radius + 15, cy + 3);
      ctx.fillText('180° (SOUTH)', cx, cy + radius + 15);
      ctx.fillText('270° (WEST)', cx - radius - 15, cy + 3);

      // --- Conical Sweeping Gradient Trail ---
      const trailAngle = (30 * Math.PI) / 180; // 30 deg sweep cone
      const grad = (ctx as any).createConicGradient
        ? (ctx as any).createConicGradient(sweepRad, cx, cy)
        : null;

      // Manual sector fill for conical sweep gradient
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, sweepRad - trailAngle, sweepRad);
      ctx.closePath();
      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      sweepGrad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
      sweepGrad.addColorStop(1, 'rgba(6, 182, 212, 0.35)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Leading edge beam line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepRad) * radius, cy + Math.sin(sweepRad) * radius);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // --- Draw Target Blips ---
      displayedRecords.forEach((r, idx) => {
        // Map cycle ID & index to angle (0 to 360 deg)
        const angleDeg = (idx / records.length) * 360;
        const angleRad = (angleDeg * Math.PI) / 180;
        // Radial distance = anomaly score normalized (0.0 to 1.0)
        const distRatio = Math.min(Math.max(r.attention_score / 100, 0.12), 0.95);
        const ptX = cx + Math.cos(angleRad) * (radius * distRatio);
        const ptY = cy + Math.sin(angleRad) * (radius * distRatio);

        const isSelected = selectedRecord?.test_id === r.test_id;

        if (r.is_anomalous) {
          // Anomalous Blip - Red glowing pulsing target
          ctx.beginPath();
          ctx.arc(ptX, ptY, isSelected ? 8 : 5, 0, Math.PI * 2);
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Expanding pulse ring around target
          ctx.beginPath();
          ctx.arc(ptX, ptY, 8 + Math.sin(sweepAngleRef.current * 0.1) * 4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // Normal Blip - Cyan/Green dot
          ctx.beginPath();
          ctx.arc(ptX, ptY, isSelected ? 6 : 3, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? '#38bdf8' : 'rgba(6, 182, 212, 0.6)';
          ctx.fill();
        }

        // Locked Target Reticle overlay
        if (isSelected) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(ptX - 10, ptY - 10, 20, 20);
          ctx.fillStyle = '#ffffff';
          ctx.font = '9px JetBrains Mono';
          ctx.fillText(r.test_id, ptX + 14, ptY + 3);
        }
      });

      if (running) {
        animRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [displayedRecords, selectedRecord]);

  // Click on Radar Canvas to lock nearest target
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 30;

    let closest: TelemetryRecord | null = null;
    let minDistance = 25; // max click radius tolerance

    displayedRecords.forEach((r, idx) => {
      const angleDeg = (idx / records.length) * 360;
      const angleRad = (angleDeg * Math.PI) / 180;
      const distRatio = Math.min(Math.max(r.attention_score / 100, 0.12), 0.95);
      const ptX = cx + Math.cos(angleRad) * (radius * distRatio);
      const ptY = cy + Math.sin(angleRad) * (radius * distRatio);

      const d = Math.hypot(clickX - ptX, clickY - ptY);
      if (d < minDistance) {
        minDistance = d;
        closest = r;
      }
    });

    if (closest) {
      setSelectedRecord(closest);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              360° Polar Sonar Anomaly Radar Scanner
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Continuous conical sweeping HUD mapping multivariate anomaly scores to radial distance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterAnomalousOnly(!filterAnomalousOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              filterAnomalousOnly
                ? 'bg-rose-500 text-white border border-rose-400 shadow-lg shadow-rose-950/60'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filterAnomalousOnly ? 'SHOW ALL CYCLES' : 'FILTER ANOMALIES ONLY'}</span>
          </button>
        </div>
      </div>

      {/* Radar Visualizer & Selected Vector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Polar Radar Canvas HUD (Span 2) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[520px] aspect-square flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={520}
              height={520}
              onClick={handleCanvasClick}
              className="w-full h-full block cursor-crosshair rounded-full"
            />
          </div>

          <div className="mt-3 flex items-center justify-between w-full text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Sweep Rate: 1.2°/frame</span>
            <span>Radial Center: Nominal (0.0) → Outer Perimeter: Anomaly (1.0)</span>
          </div>
        </div>

        {/* Target Reticle Locked Vector Drawer Inspection (Span 1) */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Target Lock Telemetry Vector
              </h3>
            </div>

            {selectedRecord ? (
              <div className="space-y-3 font-mono text-xs">
                {/* Target Header */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-cyan-400">{selectedRecord.test_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedRecord.is_anomalous ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {selectedRecord.is_anomalous ? 'ANOMALY ISOLATED' : 'NOMINAL CYCLE'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Regime: <span className="text-slate-200">{selectedRecord.regime}</span>
                  </div>
                </div>

                {/* Attention Score */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Attention Score</div>
                  <div className="text-xl font-bold text-amber-400 mt-0.5">
                    {selectedRecord.attention_score.toFixed(2)} / 100.0
                  </div>
                </div>

                {/* Telemetry Vector Metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">RPM:</span> <span className="text-white font-bold">{selectedRecord.rpm}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Torque:</span> <span className="text-white font-bold">{selectedRecord.torque} Nm</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">S1 Acoustic:</span> <span className="text-white font-bold">{selectedRecord.s1_acoustic} mm/s</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">S4 Optical:</span> <span className="text-white font-bold">{selectedRecord.s4_optical}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Measured:</span> <span className="text-white font-bold">{selectedRecord.measured_output} kW</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Predicted Ref:</span> <span className="text-cyan-400 font-bold">{selectedRecord.predicted_ref}</span>
                  </div>
                </div>

                {selectedRecord.quarantine_reason && (
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-[11px]">
                    <span className="font-bold">Fault Reason:</span> {selectedRecord.quarantine_reason}
                  </div>
                )}

                <button
                  onClick={() => onSelectRecord(selectedRecord)}
                  className="w-full py-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 font-bold transition-all text-xs"
                >
                  INSPECT FULL TELEMETRY DRAWER →
                </button>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs font-mono">
                <Crosshair className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
                <span>Click any target blip on the 360° polar radar screen to lock target & display vector telemetry.</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            Click radar target blips to inspect individual cycles.
          </div>
        </div>
      </div>
    </div>
  );
};
