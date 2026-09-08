import React from 'react';
import { TelemetryRecord } from '../types';
import { X, ShieldCheck, AlertTriangle, Activity, Zap, CheckCircle2 } from 'lucide-react';

interface RecordInspectorDrawerProps {
  record: TelemetryRecord | null;
  onClose: () => void;
}

export const RecordInspectorDrawer: React.FC<RecordInspectorDrawerProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight font-mono">
                {record.test_id} Telemetry Inspector
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
            {/* Status Badge & Regime */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Operating Regime</span>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">{record.regime}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full font-bold ${
                record.is_anomalous
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {record.is_anomalous ? 'ANOMALY ISOLATED' : 'NOMINAL RECORD'}
              </span>
            </div>

            {/* Attention & Predictions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Attention Score</span>
                <div className="text-xl font-bold text-amber-400 mt-1">
                  {record.attention_score.toFixed(2)} / 100
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Predicted Ref</span>
                <div className="text-xl font-bold text-cyan-400 mt-1">
                  {record.predicted_ref} units
                </div>
              </div>
            </div>

            {/* Complete Vector Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
                Transducer Telemetry Vector
              </h3>
              <div className="space-y-1.5">
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Rotational Speed (RPM):</span>
                  <span className="text-white font-bold">{record.rpm} RPM</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Shaft Torque (Nm):</span>
                  <span className="text-white font-bold">{record.torque} Nm</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Mechanical Load (kN):</span>
                  <span className="text-white font-bold">{record.load} kN</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Stator Temperature (°C):</span>
                  <span className="text-white font-bold">{record.temperature}°C</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">S1 Acoustic Vibration (mm/s):</span>
                  <span className={record.s1_acoustic > 200 ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
                    {record.s1_acoustic} mm/s
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">S2 Electromagnetic Flux (mT):</span>
                  <span className="text-amber-400 font-bold">{record.s2_flux} mT</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">S4 Optical Transfer Ratio:</span>
                  <span className={record.s4_optical < 0.1 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {record.s4_optical}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Measured Transducer Output:</span>
                  <span className={record.measured_output < 0 ? 'text-rose-400 font-bold' : 'text-white font-bold'}>
                    {record.measured_output} kW
                  </span>
                </div>
              </div>
            </div>

            {/* Quarantine Reason */}
            {record.quarantine_reason && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 font-sans text-xs space-y-1">
                <div className="font-bold font-mono text-rose-400 uppercase">Quarantine Audit Reason</div>
                <p>{record.quarantine_reason}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end font-mono text-xs">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
